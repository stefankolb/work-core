/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function() 
{
  var globalId = 0;

  var itemToJSON = function(model) {
    return model.toJSON ? model.toJSON() : model;
  };

  /**
   * Arrays are ordered sets of items. You can bind individual "change" events 
   * to be notified when any model in the collection has been modified, 
   * listen for "add" and "remove" events, fetch the collection from the 
   * server, etc.
   */
  core.Class("core.mvc.model.Array", 
  {
    include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],
    implement : [core.mvc.model.IModel, core.mvc.model.ICollection],

    /**
     * Prefill the collection with @data {var}.
     */
    construct: function(data, modelOrPresenter) 
    {
      // Do not directly use given items to have a internal 
      // "protected" copy of the original data and using
      // the real append() method instead.
      this.__items = [];

      // Automatically created client-side ID
      this.__clientId = "collection-" + (globalId++);

      // Inject given data
      if (modelOrPresenter)
      {
        // TODO: Can we find a faster alternative here?
        if (core.Interface.assert(modelOrPresenter, core.mvc.model.IModel)) 
        {
          this.__itemModel = modelOrPresenter;
        }
        else
        {
          this.__itemPresenter = modelOrPresenter;
        }
      }

      if (data != null) {
        this.append(this.parse(data));
      }
    },

    events :
    {
      // Collection Interface implementation
      "change" : core.event.Simple,

      // Collection Interface implementation
      "add" : core.event.Simple,

      // Collection Interface implementation
      "remove" : core.event.Simple
    },

    properties : 
    {
      // Model Interface implementation
      id : 
      {
        type : "String",
        nullable : true
      },


      /**
       * Base URL to construct URLs with to load/save data from/to the server.
       */
      url : 
      {
        type: "String",
        nullable : true
      }
    },

    members :
    {
      /*
      ======================================================
        TRANSPARENT MODEL/PRESENTER HANDLING
      ======================================================
      */

      __toItemModel : function(item) {
        return item.__attachedModel || item;
      },

      __toItemPresenter : function(item) 
      {
        if (item.__attachedModel || !this.__useItemPresenter) {
          return item;
        }

        // Dynamically create presenter from model
        var presenterClass = this.getPresenter();
        var presenter = new presenterClass(this, item);
        
        // Establish a double link connection
        item.__attachedPresenter = presenter;
        presenter.__attachedModel = model;

        return presenter;
      },



      /*
      ======================================================
        MODEL INTERFACE
      ======================================================
      */

      __clientId : null,

      // Model Interface implementation
      getClientId : function() {
        return this.__clientId;
      },

      // Model Interface implementation
      toJSON : function() {
        return this.__items.map(itemToJSON);
      },

      // Model Interface implementation
      parse : function(data) {
        return data;
      },



      /*
      ======================================================
        EVENT HANDLING
      ======================================================
      */

      __fireRemove : function(item)
      {
        var removeEvent = core.mvc.event.Remove.obtain(item);
        this.dispatchEvent(removeEvent);
        removeEvent.release();        
      },

      __fireAdd : function(item)
      {
        var addEvent = core.mvc.event.Add.obtain(item);
        this.dispatchEvent(addEvent);
        addEvent.release();        
      },      

      __onModelChange : function(evt) 
      {
        var event = core.mvc.Event.obtain("change", evt.getTarget());
        this.dispatchEvent(event);
        event.release();
      },




      /*
      ======================================================
        COLLECTION INTERFACE
      ======================================================
      */

      // Collection Interface implementation
      find : function(id) 
      {
        if (id != null) 
        {
          var items = this.__items;
          for (var i=0, l=items.length; i<l; i++) 
          {
            var item = items[i];
            if (item.getId() == id || item.getClientId() == id) {
              return item;
            }
          }
        }

        return null;
      },

      // Collection Interface implementation
      getLength : function() {
        return this.__items.length;
      },    

      // Collection Interface implementation
      isEmpty : function() {
        return this.__items.length > 0;
      },

      // Collection Interface implementation
      toArray : function() {
        return this.__items.slice(0);
      },

      // Collection Interface implementation
      add : function(items) {
        this.append(arguments);
      },

      // Collection Interface Implementation
      remove : function(item) 
      {
        var index = this.__items.indexOf(item);
        if (index == -1) {
          return;
        }

        this.__items.splice(index, 1);
        this.__fireRemove(item);

        return item;
      },



      /*
      ======================================================
        UTILITIES
      ======================================================
      */

      __autoCast : function(itemOrProperties)
      {
        // Cast JavaScript Map into desired item type
        if (core.Main.isTypeOf(item, "Plain")) 
        {
          var itemPresenter = this.__itemPresenter;
          if (itemPresenter)
          {
            // TODO: Support models?
            var item = new itemPresenter(this, itemOrProperties);
          }
          else
          {
            var itemModel = this.__itemModel;
            var item = new itemModel(itemOrProperties, this);
          }

          return item;
        }

        return itemOrProperties;
      },




      /*
      ======================================================
        MUTATION FUNCTIONS
      ======================================================
      */

      /**
       * {Integer} Appends an array of @items {Object[]} into the collection.
       * Returns the new length of the collection.
       */
      append : function(items) 
      {
        var db = this.__items;
        for (var i=0, l=items.length, item; i<l; i++) 
        {
          item = this.__autoCast(items[i]);
          db.push(item);
          this.__fireAdd(item);
        }

        return db.length;
      },


      /**
       * {Integer} Prepends an array of @items {Object[]} into the collection.
       * Returns the new length of the collection.
       */
      prepend : function(items)
      {
        var db = this.__items;
        for (var i=0, l=items.length, item; i<l; i++) 
        {
          item = this.__autoCast(items[i]);
          db.push(item);
          this.__fireAdd(item);
        }

        return db.length;        
      },


      /**
       * Pushes one or multiple @items {Object...} to the end of the collection.
       */
      push : function(items) {
        return this.append(arguments);
      },


      /**
       * {Integer} Clears the collection so that all items are removed from it. Returns
       * the new length of the collection afterwards (always zero here).
       */
      clear : function() 
      {
        var db = this.__items;

        var length = db.length;
        if (length == 0) {
          return;
        }

        for (var i=length-1, item; i>=0; i--) 
        {
          item = db[i];
          db.length--;
          this.__fireRemove(item);
        }

        return 0;
      },


      /**
       * {Integer} Combined call to replace all existing data with new 
       * list of @items {Object...}. Returns the new length
       * of the collection.
       */
      reset : function(items) 
      {
        this.clear();
        return this.append(items);
      },


      /** 
       * {Object} Returns the item at the given @index {Integer}. 
       */
      at : function(index) {
        return this.__items[index] || null;
      },


      /** 
       * {Object} Removes and returns the last model of the collection. 
       */
      pop : function() 
      {
        var removedItem = this.__items.pop();
        if (removedItem) {
          this.__fireRemove(removedItem);
        }

        return removedItem;
      },


      /** 
       * {Object} Removes and returns the first model of the collection. 
       */
      shift : function() 
      {
        var removedItem = this.__items.shift();
        if (!removedItem) {
          this.__fireRemove(removedItem);
        }

        return removedItem;
      },


      /**
       * {Integer} Pushes one or multiple @items {Object...} to the beginning of the collection.
       * Returns the new length of the collection.
       */
      unshift: function(items) {
        return this.prepend(arguments);
      },


      /**
       * {Object} Returns the first item which matches all values of the 
       * given @properties {Map}.
       */
      findBy : function(properties)
      {
        var db = this.__items;
        for (var i=0, l=db.length; i<l; i++)
        {
          var item = db[i];
          var matched = true;

          for (var name in properties)
          { 
            // Looking for false matches for faster failures 
            if (item.get(name) !== properties[name]) 
            {
              matched = false;
              break;
            }
          }

          if (matched) {
            return item;
          }
        }

        return null;
      },


      /**
       * {Boolean} Returns whether the collection contains a model
       * where all values of the given @properties {Map} match.
       */
      containsBy : function(properties) {
        !!this.findBy(properties);
      },


      /** 
       * {Array} Creates a new array with the results of calling a provided 
       * @callback {Function} on every model in this collection. It's possible 
       * to define the execution @context {Object?} of every @callback call.
       * The context defaults to the global object. The parameters with which the
       * callback is executed are: `value`, `key`, `array`.
       */
      map : function(callback, context) {
        return this.__items.map(callback, context);
      },


      /**
       * {Array} Pluck a @property {String} from each model in the collection. 
       * Equivalent to calling {#map}, and returning a single property from the iterator.
       */
      pluck : function(property) 
      {
        return this.__items.map(function() {
          return this.get(property);
        });
      }
    }
  });
})();