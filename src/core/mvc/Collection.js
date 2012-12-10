/**
 * Collections are ordered sets of models. You can bind individual "change" events 
 * to be notified when any model in the collection has been modified, 
 * listen for "add" and "remove" events, fetch the collection from the 
 * server, etc.
 */
core.Class("core.mvc.Collection", 
{
  include: [core.property.MGeneric, core.event.MEvent],

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
  },

  properties : 
  {
    /**
     * Model to use for creating new entries.
     */
    model : 
    {
      check: core.mvc.Model,
      nullable : true
    }
  },

  members :
  {
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

      var removeEvent = core.mvc.event.RemoveModel.obtain(null);

      for (var i=db.length, model; i>=0; i--) 
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


    at : function(index) {
      return this.__models[index] || null;
    },

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

    push : function() {

    },

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

    unshift: function() {

    },

    filter : function() {

    },

    map : function(func) {
      return this.__models.map(func);
    },


    /**
     * Pluck an attribute from each model in the collection. 
     * Equivalent to calling `map`, and returning a single attribute from the iterator.
     */
    pluck : function(property) 
    {
      return this.__models.map(function() {
        return this.get(property);
      });
    },


    /**
     * {core.mvc.Model} Returns the model with the given ID.
     */ 
    get : function(id) 
    {
      for (var i=0, l=models.length; i<l; i++) 
      {
        if (models[i].getId() == id) {
          return models[i];
        }
      }

      return null;
    },


    /**
     * {String} Returns the JSON representation of the stored data.
     */
    toJSON : function() 
    {
      return "[" + this.__models.map(function(model) {
        return model.toJSON();
      }).join(",") + "]";
    }
  }
});
