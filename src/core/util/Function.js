(function() 
{
  /**
   * Utilities for functions
   */
  core.Module("core.util.Function", 
  {
    /**
     * Binds the given function to the given object and returns 
     * the result function. 
     * 
     * - Only one connection is made to allow proper disconnecting without access to the bound function. 
     * - Uses ES5 bind() to connect functions to objects internally.
     *
     * Inspired by: http://webreflection.blogspot.de/2012/11/my-name-is-bound-method-bound.html
     */
    bind : function(func, object) 
    {
      // Using name which is not common to store these references in their objects
      // Storing it on the object has the benefit that when the object is 
      // garbage collected its bound methods are gone as well.
      var boundName = "bound:" + core.util.Id.get(func);

      return object[boundName] || (
        object[boundName] = func.bind(object)
      );
    }

  });  
})();
