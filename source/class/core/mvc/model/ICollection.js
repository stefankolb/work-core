core.Interface("core.mvc.model.ICollection",
{
  events :
  {
    "add" : core.event.Notification,
    "remove" : core.event.Notification,
    "change" : core.event.Notification
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
    find : function(id) {}
  }
});
