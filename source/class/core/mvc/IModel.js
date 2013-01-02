/**
 * Interface for models for fulfilling needs of typical external users.
 */
core.Interface("core.mvc.IModel",
{
  events :
  {
    /** Fired whenever the model do change */
    change : core.event.Notification
  },

  members : 
  {
    /** 
     * {String} Returns a unique identifier for this model 
     */
    getId : function() {},

    /**
     * {String} Exports all model data into a JSON structure.
     */    
    toJSON : function() {}
  }
});
