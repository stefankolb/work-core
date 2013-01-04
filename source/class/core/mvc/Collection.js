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
    return model.toJSON();
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
      this.__models = [];
      this.__length = 0;

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
          this.length++;

          addEvent.model = model;
          this.dispatchEvent(addEvent);
        }

        core.mvc.event.AddModel.release(addEvent);
      },


      /**
       * Clears the collection so that all models are removed from it.
       */
      clear : function() 
      {
        var db = this.__models;
        var length = db.length;

        if (db.length == 0) {
          return;
        }

        var removeEvent = core.mvc.event.RemoveModel.obtain(null);

        for (var i=length, model; i>=0; i--) 
        {
          model = models[i];

          removeEvent.model = model;
          this.dispatchEvent(removeEvent);

          // Pop out last model
          db.length--;

          // Update internal length, too
          this.length--;
        }

        core.mvc.event.RemoveModel.release(removeEvent);
      },


      /**
       * Combined call to replace all existing data with new list of @models {core.mvc.Model}.
       */
      reset : function(models) 
      {
        this.clear();
        this.append(models);
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
      },


      /**
       * Pushes a new @model {core.mvc.Model} to the end of the collection.
       */
      push : function(model) 
      {
        this.__models.push(model);
        var addEvent = core.mvc.event.AddModel.obtain(model);
        this.dispatchEvent(addEvent);
        core.mvc.event.RemoveModel.release(addEvent);
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
       * Pushes a new @model {core.mvc.Model} to the beginning of the collection.
       */
      unshift: function(model) 
      {
        this.__models.unshift(model);
        var addEvent = core.mvc.event.AddModel.obtain(model);
        this.dispatchEvent(addEvent);
        core.mvc.event.RemoveModel.release(addEvent);
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