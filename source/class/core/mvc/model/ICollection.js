core.Interface("core.mvc.model.ICollection",
{
  events :
  {
    "add" : core.event.Simple,
    "remove" : core.event.Simple,
    "change" : core.event.Simple
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
    getLength : function() {}
  }
});
