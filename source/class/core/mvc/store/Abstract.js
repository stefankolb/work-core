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
    loading : core.event.Simple,
    loaded : core.event.Simple,

    saving : core.event.Simple,
    saved : core.event.Simple,

    creating : core.event.Simple,
    created : core.event.Simple,

    deleting : core.event.Simple,
    deleted : core.event.Simple,

    active : core.event.Simple,
    inactive : core.event.Simple
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
     * the given @action {String} and the optional @config {Map}.
     */
    _communicate : function(action, config) {
      throw new Error("_communicate() is abstract!");
    },


    /**
     * Applying correction on outgoing @data {var}, typically the model/collection 
     * for the given @type {String} of transaction.
     */
    _encode : function(data, type) {
      return data;
    },


    /**
     * Applying correction on incoming @data {var} as the result of
     * the given @type {String} of transaction.
     */
    _decode : function(data, type) {
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
      this.log("ACTIVITY TRACK: ", this.__activityTracker);

      if (!wasActive) {
        this.fireEvent("active");
      }
    },


    /**
     * Decrements the counter for given @activity {String}.
     */ 
    __decreaseActive : function(activity) 
    {
      this.__activityTracker[activity]--;
      this.log("ACTIVITY TRACK: ", this.__activityTracker);

      if (!this.isActive()) {
        this.fireEvent("inactive");
      }
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
      this._communicate("save", 
      {
        data : this._encode(data),
        success : this.__onSaveSucceeded, 
        failed : this.__onSaveFailed
      });
    },


    // Internal event handler
    __onSaveSucceeded : function(data) 
    {
      this.__decreaseActive("save");
      this.fireEvent("saved", this._decode(data, "save"));
    },


    // Internal event handler
    __onSaveFailed : function(msg) 
    {
      this.warn("Unable to save data!", msg);
      this.__decreaseActive("save");
      this.fireEvent("saved", null);
    },



    /*
    ======================================================
      ACTION :: LOAD
    ======================================================
    */

    /**
     * Loads the data from e.g. a remote server.
     */
    load : function()
    {
      this.__increaseActive("load");
      this.fireEvent("loading");
      this._communicate("load", 
      {
        success : this.__onLoadSucceeded,
        failed : this.__onLoadFailed
      });
    },


    // Internal event handler
    __onLoadSucceeded : function(data) 
    {
      this.__decreaseActive("load");
      this.fireEvent("loaded", this._decode(data, "load"));
    },


    // Internal event handler
    __onLoadFailed : function(msg)
    {
      this.warn("Unable to load data!", msg);
      this.__decreaseActive("load");
      this.fireEvent("loaded", null);
    }
  }
});
