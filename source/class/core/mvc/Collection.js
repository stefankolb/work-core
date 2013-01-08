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
   * Collections are ordered sets of models. You can bind individual "change" events 
   * to be notified when any model in the collection has been modified, 
   * listen for "add" and "remove" events, fetch the collection from the 
   * server, etc.
   */
  core.Class("core.mvc.Collection", 
  {
    include: [core.property.MGeneric, core.event.MEvent],
    implement : [core.mvc.IModel],

    /**
     * Prefill the collection with @models {core.mvc.Model[]}.
     */
    construct: function(models) 
    {
      // Do not directly use given models to have a internal 
      // "protected" copy of the original data and using
      // the real append() method instead.
      this.__models = [];

      // Inject given models
      if (models != null) {
        this.append(models);
      }

      this.id = "collection:" + (globalId++);
    },

    events :
    {
      "change" : core.event.Notification
    },

    properties : 
    {
      /**
       * Model to use for creating new entries.
       */
      model : 
      {
        type: core.mvc.Model,
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
      // Interface implementation
      getId : function() {
        return this.id;
      },

      // Interface implementation
      toJSON : function() {
        return this.__models.map(modelToJson);
      },

      // Interface implementation
      sync : function() {
        return core.mvc.Sync.sync(this);
      },

      /**
       * {Integer} Returns the length of the collection.
       */
      getLength : function() {
        return this.__models.length;
      },

      /**
       * Imports an array of @models {core.mvc.Model[]} into the collection.
       */
      append : function(models) 
      {
        var db = this.__models;
        var addEvent = core.mvc.event.AddModel.obtain(null);
        
        for (var i=0, l=models.length, model; i<l; i++) 
        {
          model = models[i];
          db.push(model);

          addEvent.model = model;
          this.dispatchEvent(addEvent);
        }

        core.mvc.event.AddModel.release(addEvent);

        return db.length;
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

        var removeEvent = core.mvc.event.RemoveModel.obtain(null);

        for (var i=length, model; i>0; i--) 
        {
          model = db[i];

          // Pop out last model
          db.length--;

          // Inform others
          removeEvent.model = model;
          this.dispatchEvent(removeEvent);
        }

        core.mvc.event.RemoveModel.release(removeEvent);
        return 0;
      },


      /**
       * {Integer} Combined call to replace all existing data with new 
       * list of @models {core.mvc.Model}. Returns the new length
       * of the collection.
       */
      reset : function(models) 
      {
        this.clear();
        return this.append(models);
      },


      /** {core.mvc.Model} Returns the model at the given @index {Integer}. */
      at : function(index) {
        return this.__models[index] || null;
      },


      /** {core.mvc.Model} Removes and returns the last model of the collection. */
      pop : function() 
      {
        var removedModel = this.__models.pop();
        if (!removedModel) {
          return;
        }
        
        var removeEvent = core.mvc.event.RemoveModel.obtain(removedModel);
        this.dispatchEvent(removeEvent);
        core.mvc.event.RemoveModel.release(removeEvent);

        return removedModel;
      },


      /**
       * Pushes one or multiple @model {core.mvc.Model...} to the end of the collection.
       */
      push : function(model) 
      {
        var addEvent = core.mvc.event.AddModel.obtain(null);

        for (var i=0, l=arguments.length; i<l; i++) 
        {
          model = arguments[i];
          this.__models.push(model);
          addEvent.model = model;
          this.dispatchEvent(addEvent);
        }

        core.mvc.event.AddModel.release(addEvent);

        return this.__models.length;
      },


      /** {core.mvc.Model} Removes and returns the first model of the collection. */
      shift : function() 
      {
        var removedModel = this.__models.shift();
        if (!removedModel) {
          return;
        }

        var removeEvent = core.mvc.event.RemoveModel.obtain(removedModel);
        this.dispatchEvent(removeEvent);
        core.mvc.event.RemoveModel.release(removeEvent);

        return removedModel;
      },


      /**
       * {Integer} Pushes one or multiple @model {core.mvc.Model...} to the beginning of the collection.
       * Returns the new length of the collection.
       */
      unshift: function(model) 
      {
        var addEvent = core.mvc.event.AddModel.obtain(null);

        for (var i=0, l=arguments.length; i<l; i++)
        {
          model = arguments[i];

          // Inserting in right order. Using unshift() would reverse the list.
          this.__models.splice(i, 0, model);
          addEvent.model = model;
          this.dispatchEvent(addEvent);
        }

        core.mvc.event.AddModel.release(addEvent);

        return this.__models.length;
      },


      /** {core.mvc.Model} Removes and returns the given @model {core.mvc.Model} of the collection. */
      remove : function(model) 
      {
        /** #require(ext.sugar.Array) */
        var removedModel = this.__models.remove(model);
        if (!removedModel) {
          return;
        }

        var removeEvent = core.mvc.event.RemoveModel.obtain(removedModel);
        this.dispatchEvent(removeEvent);
        core.mvc.event.RemoveModel.release(removeEvent);

        return removedModel;
      },


      /** 
       * {core.mvc.Collection} Returns a new collection filtered by the given filter @method {Function}.
       */
      filter : function(method) {
        return this.__models.filter(method);
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
       * Pluck a @property {String} from each model in the collection. 
       * Equivalent to calling {#map}, and returning a single property from the iterator.
       */
      pluck : function(property) 
      {
        return this.__models.map(function() {
          return this.get(property);
        });
      },


      /**
       * {core.mvc.Model} Returns the model with the given @id {String}.
       */ 
      get : function(id) 
      {
        var models = this.__models;
        for (var i=0, l=models.length; i<l; i++) 
        {
          if (models[i].getId() == id) {
            return models[i];
          }
        }

        return null;
      },


      /**
       * {Map[]} The method is called by whenever a collection's models are returned 
       * by the server, in `fetch`. The function is passed the raw @response {Object} object, 
       * and should return the array of model attributes to be added to the collection.
       *
       * The default implementation is a no-op, simply passing through the JSON response. 
       * Override this if you need to work with a preexisting API, or better namespace 
       * your responses. Note that afterwards, if your model class already has a parse 
       * function, it will be run against each fetched model.
       */
      parse : function(response) {
        return response;
      },


      /**
       * Fetch the default set of models for this collection from the server, resetting the 
       * collection when they arrive. The options hash takes success and error callbacks which 
       * will be passed (collection, response, options) and (collection, xhr, options) 
       * as arguments, respectively. When the model data returns from the server, 
       * the collection will reset. Delegates to `sync` under the covers for 
       * custom persistence strategies and returns a XHR. The server handler 
       * for fetch requests should return a JSON array of models.
       */
      fetch : function() {
        // TODO
      },


      /**
       * {core.mvc.Model} Creates a new model with the given 
       * @properties {Map?} and appends it to the collection.
       */
      create : function(properties) 
      {
        var modelClass = this.getModel();

        if (!modelClass) {
          throw new Error("create() requires a model being assigned to work!");
        }

        // Prefer pooling when available
        var model = modelClass.obtain ? modelClass.obtain(properties) : new modelClass(properties);
        
        // Auto-append
        this.push(model);

        return model;
      }
    }
  });
})();