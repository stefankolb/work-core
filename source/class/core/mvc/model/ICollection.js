/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

core.Interface("core.mvc.model.ICollection",
{
  events :
  {
    /** Fires whenever a model or the collection itself has been changed */
    "change" : core.event.Simple,

    /** Fires whenever a model has been added. */
    "add" : core.event.Simple,

    /** Fires whenever a model has been removed. */
    "remove" : core.event.Simple
  },

  properties :
  {
    url : 
    {
      type : "String",
      nullable : true
    }
  },

  members : 
  {
    /** 
     * Adds the given @model {core.mvc.model.IModel...} to the collection.
     */
    add : function(model) {},

    /** 
     * Removes the given @model {core.mvc.model.IModel} from the collection.
     */
    remove : function(model) {},

    /**
     * {core.mvc.model.IModel} Returns the model with the given @id {String|Number}.
     */
    find : function(id) {},

    /**
     * {Integer} Returns the length of the collection.
     */
    getLength : function() {},

    /**
     * {Boolean} Whether the collection is empty.
     */
    isEmpty : function() {}
  }
});
