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
      addEvent.target = this;
      
      for (var i=0, l=models.length, model; i<l; i++) 
      {
        model = models[i];
        db.push(model);

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
      removeEvent.target = this;

      for (var i=0, l=models.length, model; i<l; i++) 
      {
        model = models[i];
        db.push(model);

        removeEvent.model = model;
        this.dispatchEvent(removeEvent);
      }

      core.mvc.event.RemoveModel.release(removeEvent);

      this.__models.length = 0;
    },

    pop : function() 
    {

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
