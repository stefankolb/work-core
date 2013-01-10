core.Interface("core.mvc.collection.ICollection",
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
     * Adds the given @model {core.mvc.IModel...} to the collection.
     */
    add : function(model) {},

    /** 
     * Removes the given @model {core.mvc.IModel} from the collection.
     */
    remove : function(model) {}

    //get : function() {}
  }
});
