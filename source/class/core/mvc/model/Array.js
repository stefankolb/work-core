/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function() 
{
  var globalId = 0;
  var modelToJson = function(model) {
    return model.toJSON ? model.toJSON() : model;
  };

  /**
   * Arrays are ordered sets of models. You can bind individual "change" events 
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
    construct: function(data) 
    {
      // Do not directly use given models to have a internal 
      // "protected" copy of the original data and using
      // the real append() method instead.
      this.__models = [];

      // Automatically created client-side ID
      this.__clientId = "collection:" + (globalId++);

      // Inject given data
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
       * Model to use for creating new entries.
       */
      model : 
      {
        type: core.mvc.model.Model,
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
      __clientId : null,

      // Model Interface implementation
      getClientId : function() {
        return this.__clientId;
      },

      // Model Interface implementation
      toJSON : function() {
        return this.__models.map(modelToJson);
      },

      // Model Interface implementation
      parse : function(data) {
        return data;
      },

      // Collection Interface implementation
      find : function(id) 
      {
        var models = this.__models;
        for (var i=0, l=models.length; i<l; i++) 
        {
          var model = models[i];
          if (model.getId() == id || model.getClientId() == id) {
            return model;
          }
        }

        return null;
      },

      // Collection Interface implementation
      getLength : function() {
        return this.__models.length;
      },      

      // Collection Interface implementation
      add : function(model) {
        this.push.apply(this, arguments);
      },

      // Collection Interface Implementation
      remove : function(model) 
      {
        var index = this.__models.indexOf(model);
        if (index == -1) {
          return;
        }

        this.__models.splice(index, 1);
        model.removeListener("change", this.__onModelChange, this);

        var removeEvent = core.mvc.event.Remove.obtain(model);
        this.dispatchEvent(removeEvent);
        removeEvent.release();

        return model;
      },      




      update : function(models)
      {
        // TODO
        // add, remove and merge automatically
      },



      __onModelChange : function(evt) 
      {
        var event = core.mvc.Event.obtain("change", evt.getTarget());
        this.dispatchEvent(event);
        event.release();
      },


      /**
       * Imports an array of @models {core.mvc.model.Model[]} into the collection.
       */
      append : function(models) 
      {
        var addEvent = core.mvc.event.Add.obtain(null);
        
        for (var i=0, l=models.length, model; i<l; i++) 
        {
          model = models[i];

          if (core.Main.isTypeOf(model, "Plain")) {
            model = this.__fromProperties(model);
          }

          this.__models.push(model);

          model.addListener("change", this.__onModelChange, this);

          addEvent.setModel(model);
          this.dispatchEvent(addEvent);
        }

        addEvent.release();

        return this.__models.length;
      },


      /**
       * {Integer} Clears the collection so that all models are removed from it. Returns
       * the new length of the collection afterwards (always zero here).
       */
      clear : function() 
      {
        var db = this.__models;
        var length = db.length;

        if (db.length == 0) {
          return;
        }

        var removeEvent = core.mvc.event.Remove.obtain(null);

        for (var i=length, model; i>0; i--) 
        {
          model = db[i];
          model.removeListener("change", this.__onModelChange, this);

          // Pop out last model
          db.length--;

          // Inform others
          removeEvent.setModel(model);
          this.dispatchEvent(removeEvent);
        }

        removeEvent.release();
        return 0;
      },


      /**
       * {Integer} Combined call to replace all existing data with new 
       * list of @models {core.mvc.model.Model}. Returns the new length
       * of the collection.
       */
      reset : function(models) 
      {
        this.clear();
        return this.append(models);
      },


      /** {core.mvc.model.Model} Returns the model at the given @index {Integer}. */
      at : function(index) {
        return this.__models[index] || null;
      },


      /** {core.mvc.model.Model} Removes and returns the last model of the collection. */
      pop : function() 
      {
        var removedModel = this.__models.pop();
        if (!removedModel) {
          return;
        }
        
        removedModel.removeListener("change", this.__onModelChange, this);

        var removeEvent = core.mvc.event.Remove.obtain(removedModel);
        this.dispatchEvent(removeEvent);
        removeEvent.release();

        return removedModel;
      },


      /**
       * Pushes one or multiple @model {core.mvc.model.Model...} to the end of the collection.
       */
      push : function(model) 
      {
        var addEvent = core.mvc.event.Add.obtain(null);

        for (var i=0, l=arguments.length; i<l; i++) 
        {
          model = arguments[i];

          if (core.Main.isTypeOf(model, "Plain")) {
            model = this.__fromProperties(model);
          }

          this.__models.push(model);

          model.addListener("change", this.__onModelChange, this);
          
          addEvent.setModel(model);
          this.dispatchEvent(addEvent);
        }

        addEvent.release();

        return this.__models.length;
      },


      /** 
       * {core.mvc.model.Model} Removes and returns the first model of the collection. 
       */
      shift : function() 
      {
        var removedModel = this.__models.shift();
        if (!removedModel) {
          return;
        }

        removedModel.removeListener("change", this.__onModelChange, this);

        var removeEvent = core.mvc.event.Remove.obtain(removedModel);
        this.dispatchEvent(removeEvent);
        removeEvent.release();

        return removedModel;
      },


      /**
       * {Integer} Pushes one or multiple @model {core.mvc.model.Model...} to the beginning of the collection.
       * Returns the new length of the collection.
       */
      unshift: function(model) 
      {
        var addEvent = core.mvc.event.Add.obtain(null);

        for (var i=0, l=arguments.length; i<l; i++)
        {
          model = arguments[i];

          if (core.Main.isTypeOf(model, "Plain")) {
            model = this.__fromProperties(model);
          }          

          model.addListener("change", this.__onModelChange, this);

          // Inserting in right order. Using unshift() would reverse the list.
          this.__models.splice(i, 0, model);
          addEvent.setModel(model);
          this.dispatchEvent(addEvent);
        }

        addEvent.release();

        return this.__models.length;
      },


      /**
       * {core.mvc.model.IModel} Returns the first model which 
       * matches all values of the given @properties {Map}.
       */
      findBy : function(properties)
      {
        var db = this.__models;
        for (var i=0, l=db.length; i<l; i++)
        {
          var model = db[i];

          for (var name in properties)
          { 
            // Looking for false matches for faster failures 
            if (model.get(name) !== properties[name]) {
              continue;
            }
          }

          return model;
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
        return this.__models.map(callback, context);
      },


      /**
       * {Array} Pluck a @property {String} from each model in the collection. 
       * Equivalent to calling {#map}, and returning a single property from the iterator.
       */
      pluck : function(property) 
      {
        return this.__models.map(function() {
          return this.get(property);
        });
      },


      /**
       * {core.mvc.model.IModel} Casts @properties {Map} into a model 
       * instance of the Class configured in this instance.
       */
      __fromProperties : function(properties)
      {
        var modelClass = this.getModel();
        if (!modelClass) {
          throw new Error("create() requires a model being assigned to work!");
        }

        // Prefer pooling when available
        var model = modelClass.obtain ? modelClass.obtain(properties) : new modelClass(properties);

        return model;
      }
    }
  });
})();