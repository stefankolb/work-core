core.Class("core.mvc.store.Abstract",
{
  include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],

  construct : function(presenter, path, storeDebounce, loadDebounce)
  {
    this.__presenter = presenter;
    this.__path = path;

    if (storeDebounce) {
      this.store = core.util.Function.debounce(this.store, storeDebounce);
    }

    if (loadDebounce) {
      this.load = core.util.Function.debounce(this.load, loadDebounce);
    }
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
    getPath : function() {
      return this.__path;
    },

    getEventParent : function() {
      return this.__presenter;
    },

    isActive : function() {
      return this.__activeCounter > 0;
    },



    /*
    ======================================================
      ABSTRACT METHOD/STUBS
    ======================================================
    */

    /**
     * Requests data with the given @action {String} and the optional
     * @config {Map}.
     */
    _request : function(action, config) {
      throw new Error("_request() is abstract!");
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
      STATE TRACKING
    ======================================================
    */

    __isSaving : false,
    __isLoading : false,
    __isRemoving : false,
    __isCreating : false,

    __activeCounter : 0,

    __increaseActive : function() 
    {
      if (++this.__activeCounter == 1) {
        this.fireEvent("active");
      }
    },

    __decreaseActive : function() 
    {
      if (--this.__activeCounter == 0) {
        this.fireEvent("inactive");
      }
    },




    /*
    ======================================================
      ACTION :: SAVE
    ======================================================
    */

    save : function(data)
    {
      if (this.__isSaving) 
      {
        this.warn("Is already saving!");
        return;
      }

      this.__isSaving = true;
      this.__increaseActive();

      this.fireEvent("saving");
      this._request("save", 
      {
        data : this._encode(data),
        success : this.__onSaveSucceeded, 
        failed : this.__onSaveFailed
      });
    },

    __onSaveSucceeded : function(data) 
    {
      this.__isSaving = false;
      this.__decreaseActive();

      this.fireEvent("saved", this._decode(data, "save"));
    },

    __onSaveFailed : function(msg) 
    {
      this.warn("Unable to save data!", msg);

      this.__isSaving = false;
      this.__decreaseActive();

      this.fireEvent("saved", null);
    },



    /*
    ======================================================
      ACTION :: LOAD
    ======================================================
    */

    load : function()
    {
      if (this.__isLoading) 
      {
        this.warn("Is already loading!");
        return;
      }

      this.__isLoading = true;
      this.__increaseActive();

      this.fireEvent("loading");
      this._request("load", 
      {
        success : this.__onLoadSucceeded,
        failed : this.__onLoadFailed
      });
    },

    __onLoadSucceeded : function(data) 
    {
      this.__isLoading = false;
      this.__decreaseActive();

      this.fireEvent("loaded", this._decode(data, "load"));
    },

    __onLoadFailed : function(msg)
    {
      this.warn("Unable to load data!", msg);
      
      this.__isLoading = false;
      this.__decreaseActive();

      this.fireEvent("loaded", null);
    }
  }
});
