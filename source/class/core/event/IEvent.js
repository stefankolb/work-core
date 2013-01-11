core.Interface("core.event.IEvent",
{
  members : 
  {
    /** 
     * {String} Returns the type of the event 
     */
    getType : function() {},

    /**
     * {Object} Returns the target on which the event is fired.
     */
    getTarget : function() {}
  }
});
