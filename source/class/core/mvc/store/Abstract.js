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

  /**
   * @path {String} Path to use for all requests
   * @debounce {Map} Map with activity (e.g. save, remove, ...) as key and milliseconds as value
   */
  construct : function(path, debounce)
  {
    this.__scheduleTracker = {};
    this.__debouncedMethods = {};

    this.__activityTracker = 
    {
      load : 0,
      save : 0,
      remove : 0,
      create : 0
    };

    this.__path = path;
    this.__debounce = debounce;
  },

  events :
  {
    /** Fired when the process of loading something was started. */
    loading : core.mvc.event.Store,

    /** Fired when the process of loading something was completed. */
    loaded : core.mvc.event.Store,

    /** Fired when the process of saving something was started. */
    saving : core.mvc.event.Store,

    /** Fired when the process of saving something was completed. */
    saved : core.mvc.event.Store,

    /** Fired when the process of creating something was started. */
    creating : core.mvc.event.Store,

    /** Fired when the process of creating something was completed. */
    created : core.mvc.event.Store,

    /** Fired when the process of removing something was started. */
    removing : core.mvc.event.Store,

    /** Fired when the process of removing something was completed. */
    removed : core.mvc.event.Store,

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
    hasScheduled : function() {
      return !core.Object.isEmpty(this.__scheduleTracker);
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

    /** {=Map} Debounced helper methods for each action/item combination */
    __debouncedMethods : null,


    /**
     * Schedules the given @activity {String}.
     */ 
    __scheduleActivity : function(activity, exec, item, data)
    {
      // Compute hash based on activity and item ID
      var hash = item == null ? activity : activity + "-" + item;

      // Shorthands
      var tracker = this.__scheduleTracker;
      var debounced = this.__debouncedMethods;

      // Access previously created method
      var method = debounced[hash];

      // Track scheduling and dynamic method creation
      if (!tracker[hash]) 
      {
        tracker[hash] = true;
        this.fireEvent("change");  

        if (method == null) 
        {
          var delay = this.__debounce[activity];
          method = debounced[hash] = delay == null ? this.__scheduleCallback : core.Function.debounce(this.__scheduleCallback, delay);
        }
      }

      // Trigger debounced method
      if (activity == "load" || activity == "remove") {
        method.call(this, hash, exec, item);  
      } else if (activity == "create") {
        method.call(this, hash, exec, data);  
      } else if (activity == "save") {
        method.call(this, hash, exec, data, item);  
      }
    },


    /**
     * Generic callback handler for the scheduling infrastructure.
     */
    __scheduleCallback : function(hash, exec, arg1, arg2)
    {
      var tracker = this.__scheduleTracker;
      if (!tracker[hash]) {
        return;
      }

      delete tracker[hash];
      this.fireEvent("change");
      exec.call(this, arg1, arg2);
    },


    /**
     * Increments the counter for given @activity {String}.
     */ 
    __increaseActivity : function(activity) 
    {
      this.__activityTracker[activity]++;
      this.fireEvent("change");
    },


    /**
     * Decrements the counter for given @activity {String}.
     */ 
    __decreaseActivity : function(activity) 
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

    /**
     * Loads the data (of the optional @item {any}) from e.g. a remote server.
     */
    load : function(item) {
      this.__scheduleActivity("load", this.__loadExecute, item);
    },

    /**
     * Saves the given @data {var} (of the optional @item {any}) to e.g. the remote server.
     */
    save : function(data, item) {
      this.__scheduleActivity("save", this.__saveExecute, item, data);
    },


    /**
     * Creates an item based on the given @data {var} on e.g. the remote server.
     * The item ID not yet known so one typically create a new 
     * entry on the parent object/node.
     */
    create : function(data) {
      this.__scheduleActivity("create", this.__createExecute, null, data);
    },


    /**
     * Removes the given @data {var} (of the optional @item {any}) from e.g. the remote server.
     */
    remove : function(item) {
      this.__scheduleActivity("remove", this.__removeExecute, item);
    },    



    /*
    ======================================================
      ACTIONS - EXECUTERS
    ======================================================
    */

    // Internal real implementation of load()
    __loadExecute : function(item)
    {
      this.__increaseActivity("load");
      this.fireStorageEvent("loading", true, item);

      var success = function(data) 
      {
        this.__decreaseActivity("load");
        this.fireStorageEvent("loaded", true, item, this._decode(data, "load"));
      };      

      var failed = function(msg)
      {
        this.warn("Unable to load data!", msg);
        this.__decreaseActivity("load");
        this.fireStorageEvent("loaded", false, item);
      };

      this._communicate("load", item).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);
    },


    // Internal real implementation of save()
    __saveExecute : function(data, item)
    {
      this.__increaseActivity("save");
      this.fireStorageEvent("saving", true, item);

      var success = function(data) 
      {
        this.__decreaseActivity("save");
        this.fireStorageEvent("saved", true, item, this._decode(data, "save"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to save data!", msg);
        this.__decreaseActivity("save");
        this.fireStorageEvent("saved", false, item);
      };

      this._communicate("save", item, this._encode(data, "save")).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);      
    },


    // Internal real implementation of create()
    __createExecute : function(data)
    {
      this.__increaseActivity("create");
      this.fireStorageEvent("creating", true);

      var success = function(data) 
      {
        this.__decreaseActivity("create");
        this.fireStorageEvent("created", true, null, this._decode(data, "create"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to create data!", msg);
        this.__decreaseActivity("create");
        this.fireStorageEvent("created", false);
      };
 
      this._communicate("create", item, this._encode(data, "create")).
        then(success, failed, this).
        then(null, this.__onImplementationError, this);      
    },


    // Internal real implementation of remove()
    __removeExecute : function(data, item)
    {
      this.__increaseActivity("remove");
      this.fireStorageEvent("removing", true, item);

      var success = function(data) 
      {
        this.__decreaseActivity("remove");
        this.fireStorageEvent("removed", true, item, this._decode(data, "remove"));
      };

      var failed = function(msg) 
      {
        this.warn("Unable to remove data!", msg);
        this.__decreaseActivity("remove");
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

    // Internal promise error handler
    __onImplementationError : function(ex) {
      this.error("Implementation error: " + ex);
    }
  }
});
