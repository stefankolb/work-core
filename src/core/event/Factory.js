(function() 
{
  var classes = {};
  var maxCache = 25;
  var slice = Array.prototype.slice;

  /**
   * Event factory for easy recycling of event objects 
   * combining pooling with new data from arguments.
   */
  core.Module("core.event.Factory",
  {
    /**
     * Creates an event object from the given @eventConstruct using
     * the given number of @varargs {var...?}. After usage of the 
     * event object use {#pool} to allow object recylcling.
     */
    create : function(eventConstruct, varargs) 
    {
       var pool = classes[eventConstruct.classname];
       var eventObject = pool.pop() || new classObj;

       if (arguments.length > 1) {
         eventObject.apply(eventObject, slice.call(arguments, 1));  
       }

       return eventObject;
    },


    /**
     * Pools the given @eventObject to later recycling.
     */
    pool : function(eventObject) 
    {
      var eventClass = eventObject.className;
      var pool = classes[eventClass] || (classes[eventClass] = []);
      if (pool.length > maxCache) {
        return;
      }

      pool.push(eventObject);
    }
  });
})();
