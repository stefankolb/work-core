/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

/**
 * Wrapper around different GPS APIs. Returns promises for simplified flow handling.
 */
core.Module("core.service.location.GPS",
{
  detect : function()
  {
    var promise = core.event.Promise.obtain();
    
    if (navigator.geolocation) 
    {
      navigator.geolocation.getCurrentPosition(function(result) 
      {
        if (result) {
          promise.fulfill(result.coords);
        } else {
          promise.reject("Empty GPS response");
        }
      });
    }
    else
    {
      promise.reject("No GPS support!");
    }

    return promise;
  }
});
