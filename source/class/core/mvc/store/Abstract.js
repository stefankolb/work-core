/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * A store is pretty much a combination of the adapter pattern (convert data
 * betweeen storage/server and client) and a asynchronous storage API with 
 * activity reporting.
 */
core.Class("core.mvc.store.Abstract",
{
  include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],

  construct : function(path, config)
  {
    this.__scheduleTracker = 
    {
      load : 0,
      save : 0,
      remove : 0,
      create : 0
    };

    this.__activityTracker = 
    {
      load : 0,
      save : 0,
      remove : 0,
      create : 0
    };

    if (!config) {
      config = {};
    }

    this.__path = path;
    
    var saveDebounce = config.saveDebounce || config.debounce || 0;
    this.save = core.util.Function.debounce(this.save, saveDebounce);

    var loadDebounce = config.loadDebounce || config.debounce || 0;
    this.load = core.util.Function.debounce(this.load, loadDebounce);

    var removeDebounce = config.removeDebounce || config.debounce || 0;
    this.remove = core.util.Function.debounce(this.remove, removeDebounce);

    var createDebounce = config.createDebounce || config.debounce || 0;
    this.create = core.util.Function.debounce(this.create, createDebounce);
  },

  events :
  {
    /** Fired when the process of loading something was started. */
    loading : core.mvc.event.Storage,

    /** Fired when the process of loading something was completed. */
    loaded : core.mvc.event.Storage,

    /** Fired when the process of saving something was started. */
    saving : core.mvc.event.Storage,

    /** Fired when the process of saving something was completed. */
    saved : core.mvc.event.Storage,

    /** Fired when the process of creating something was started. */
    creating : core.mvc.event.Storage,

    /** Fired when the process of creating something was completed. */
    created : core.mvc.event.Storage,

    /** Fired when the process of removing something was started. */
    removing : core.mvc.event.Storage,

    /** Fired when the process of removing something was completed. */
    removed : core.mvc.event.Storage,

    /** 
     * Fired whenever the activity state was changed 
     * (Please note that every single change produces a new event - 
     * even if the storage is still active e.g. when the second request is send out.)
     */
    change : core.event.Simple
  },

  members :
  {
    /**
     * {String} Returns the REST communication path.
     */
    getPath : function() {
      return this.__path;
    },


    /**
     * {Boolean} Whether there are currently any requests running.
     */
    isActive : function() 
    {
      var tracker = this.__activityTracker;
      return tracker.load > 0 || tracker.save > 0 || tracker.remove > 0 || tracker.create > 0;
    },


    /**
     * {Boolean} Whether there are any scheduled requests waiting for being processed.
     */
    hasScheduled : function()
    {
      var tracker = this.__scheduleTracker;
      return tracker.load > 0 || tracker.save > 0 || tracker.remove > 0 || tracker.create > 0;
    },


    /**
     * {Boolean} Returns whether the storage has any outstanding tasks to wait for.
     * Useful for figuring out whether the application/section/window can be closed.
     */
    isFinished : function() {
      return !this.isActive() && !this.hasScheduled();
    },


    /**
     * {Boolean} Whether there are currently requests for modifying data on the server.
     */
    isModifying : function() 
    {
      var tracker = this.__activityTracker;
      return tracker.save > 0 || tracker.remove > 0 || tracker.create > 0;
    },    


    /**
     * {Boolean} Whether there are currently requests active for loading data/entries.
     */
    isLoading : function() {
      return this.__activityTracker.load > 0;
    },


    /**
     * {Boolean} Whether there are currently requests active for saving data/entries.
     */
    isSaving : function() {
      return this.__activityTracker.save > 0;
    },


    /**
     * {Boolean} Whether there are currently requests active for removing data/entries.
     */
    isRemoving : function() {
      return this.__activityTracker.remove > 0;
    },


    /**
     * {Boolean} Whether there are currently requests active for creating data/entries.
     */
    isCreating : function() {
      return this.__activityTracker.create > 0;
    },




    /*
    ======================================================
      ABSTRACT METHOD/STUBS
    ======================================================
    */

    /**
     * Communicates data changes to the underlying storage using 
     * the given @action {String} on the given optional @item {var?null}
     * with the given optional @data {var?}.
     */
    _communicate : function(action, item, data) {
      throw new Error("_communicate(action, item, data) is abstract!");
    },


    /**
     * Applying correction on outgoing @data {var}, typically the model/collection 
     * for the given @action {String}.
     */
    _encode : function(data, action) {
      return data;
    },


    /**
     * Applying correction on incoming @data {var} as the result of
     * the given @action {String}.
     */
    _decode : function(data, action) {
      return data;
    },



    /*
    ======================================================
      ACTIVITY TRACKING
    ======================================================
    */

    /** {=Map} Keeping track of individual activities */
    __activityTracker : null,

    /** {=Map} Keeping track of individual scheduled activities */
    __scheduleTracker : null,


    /**
     * Schedules the given @activity {String}.
     */ 
    __schedule : function(activity)
    {
      this.__scheduleTracker[activity]++;
      this.fireEvent("change");
    },


    /**
     * Increments the counter for given @activity {String}.
     */ 
    __increaseActive : function(activity) 
    {
      this.__scheduleTracker[activity]--;
      this.__activityTracker[activity]++;
      this.fireEvent("change");
    },


    /**
     * Decrements the counter for given @activity {String}.
     */ 
    __decreaseActive : function(activity) 
    {
      this.__activityTracker[activity]--;
      this.fireEvent("change");
    },



    /*
    ======================================================
      EVENT HANDLING
    ======================================================
    */

    /**
     * {Boolean} Shorthand for firing automatically pooled instances of {core.mvc.event.Store}
     * with the given @type {String}, @success {Boolean}, @item {var}, @data {var} and @message {String}.
     * The method returns whether any listers were processed.
     */
    fireStorageEvent : function(type, success, item, data, message) 
    {
      var evt = core.mvc.event.Store.obtain(type, success, item, data, message);
      var retval = this.dispatchEvent(evt);
      evt.release();

      return retval;
    },



    /*
    ======================================================
      ACTIONS
    ======================================================
    */


    load____ : function() 
    {
      this.__debouncedLoad();
      this.__schedule("load");
    },


    /**
     * Loads the data (of the optional @item {any}) from e.g. a remote server.
     */
    load : function(item)
    {
      this.__increaseActive("load");
      this.fireStorageEvent("loading", true, item);

      var success = function(data) 
      {
        this.__decreaseActive("load");
        this.fireStorageEvent("loaded", true, item, this._decode(data, "load"));
      };      

      var failed = function(msg)
      {
        this.warn("Unable to load data!", msg);
        this.__decreaseActive("load");
        this.fireStorageEvent("loaded", false, item);
      };

      this._communicate("load", item).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);
    },


    /**
     * Saves the given @data {var} (of the optional @item {any}) to e.g. the remote server.
     */
    save : function(data, item)
    {
      this.__increaseActive("save");
      this.fireStorageEvent("saving", true, item);

      var success = function(data) 
      {
        this.__decreaseActive("save");
        this.fireStorageEvent("saved", true, item, this._decode(data, "save"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to save data!", msg);
        this.__decreaseActive("save");
        this.fireStorageEvent("saved", false, item);
      };

      this._communicate("save", item, this._encode(data, "save")).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);      
    },


    /**
     * Creates an item based on the given @data {var} on e.g. the remote server.
     * The item ID not yet known so one typically create a new 
     * entry on the parent object/node.
     */
    create : function(data)
    {
      this.__increaseActive("create");
      this.fireStorageEvent("creating", true);

      var success = function(data) 
      {
        this.__decreaseActive("create");
        this.fireStorageEvent("created", true, null, this._decode(data, "create"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to create data!", msg);
        this.__decreaseActive("create");
        this.fireStorageEvent("created", false);
      };
 
      this._communicate("create", item, this._encode(data, "create")).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);      
    },


    /**
     * Removes the given @data {var} (of the optional @item {any}) from e.g. the remote server.
     */
    remove : function(data, item)
    {
      this.__increaseActive("remove");
      this.fireStorageEvent("removing", true, item);

      var success = function(data) 
      {
        this.__decreaseActive("remove");
        this.fireStorageEvent("removed", true, item, this._decode(data, "remove"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to remove data!", msg);
        this.__decreaseActive("remove");
        this.fireStorageEvent("removed", false, item);
      };

      this._communicate("remove", item, this._encode(data, "remove")).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);      
    },



    /*
    ======================================================
      EXCEPTION HANDLING
    ======================================================
    */

    // Internal promise handler
    __onImplementationError : function(ex) {
      this.error("Implementation error: " + ex);
    }
  }
});
