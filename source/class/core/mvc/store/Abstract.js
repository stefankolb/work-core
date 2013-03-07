core.Class("core.mvc.store.Abstract",
{
  include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],

  construct : function(path, config)
  {
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
    loading : core.event.Simple,

    /** Fired when the process of loading something was completed. */
    loaded : core.event.Simple,

    /** Fired when the process of saving something was started. */
    saving : core.event.Simple,

    /** Fired when the process of saving something was completed. */
    saved : core.event.Simple,

    /** Fired when the process of creating something was started. */
    creating : core.event.Simple,

    /** Fired when the process of creating something was completed. */
    created : core.event.Simple,

    /** Fired when the process of deleting something was started. */
    deleting : core.event.Simple,

    /** Fired when the process of deleting something was completed. */
    deleted : core.event.Simple,

    /** Fired whenever the activity state was changed */
    changeActive : core.event.Simple
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


    /**
     * Increments the counter for given @activity {String}.
     */ 
    __increaseActive : function(activity) 
    {
      var wasActive = this.isActive();
      this.__activityTracker[activity]++;
      if (!wasActive) {
        this.fireEvent("changeActive", true);
      }
    },


    /**
     * Decrements the counter for given @activity {String}.
     */ 
    __decreaseActive : function(activity) 
    {
      this.__activityTracker[activity]--;
      if (!this.isActive()) {
        this.fireEvent("changeActive", false);
      }
    },



    /*
    ======================================================
      ACTION :: LOAD
    ======================================================
    */

    /**
     * Loads the data from the store e.g. using a remote server.
     */
    load : function()
    {
      this.__increaseActive("load");
      this.fireEvent("loading");
      this._communicate("load").then(this.__onLoadSucceeded, this.__onLoadFailed, this).then(null, this.__onImplementationError, this);
    },


    // Internal promise handler
    __onLoadSucceeded : function(data) 
    {
      this.__decreaseActive("load");
      this.fireEvent("loaded", this._decode(data, "load"));
    },


    // Internal promise handler
    __onLoadFailed : function(msg)
    {
      this.warn("Unable to load data!", msg);
      this.__decreaseActive("load");
      this.fireEvent("loaded", null);
    },



    /*
    ======================================================
      ACTION :: SAVE
    ======================================================
    */

    /**
     * Saves the given @data {var}.
     */
    save : function(data)
    {
      this.__increaseActive("save");
      this.fireEvent("saving");
      this._communicate("save", null, this._encode(data, "save")).then(this.__onSaveSucceeded, this.__onSaveFailed, this).then(null, this.__onImplementationError, this);      
    },


    // Internal promise handler
    __onSaveSucceeded : function(data) 
    {
      this.__decreaseActive("save");
      this.fireEvent("saved", this._decode(data, "save"));
    },


    // Internal promise handler
    __onSaveFailed : function(msg) 
    {
      this.warn("Unable to save data!", msg);
      this.__decreaseActive("save");
      this.fireEvent("saved", null);
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
