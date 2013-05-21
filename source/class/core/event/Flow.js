/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

(function() {

var identity = function(x) { return x };
var map = function(promiseOrValues, mapFunction, context) {
  var promise;
  context = context || this;

  if (promiseOrValues && promiseOrValues.then && typeof promiseOrValues.then == "function") {
    return promiseOrValues.then(function(value) {
      return map(value, mapFunction, context);
    }, null, context);
  } else if (core.Main.isTypeOf(promiseOrValues, "Array")) {
    promise = core.event.Promise.obtain();

    var resolved = 0;
    var len = promiseOrValues.length;
    var result = [];

    for (var i=0; i<len; i++) {
      map(promiseOrValues[i], mapFunction, context).then(function(value) {
        result.push(value);
        if (result.length == len) {
          promise.fulfill(result);
        }
      }, function(reason) {
      	promise.reject(reason);
      });
    }
  } else {
    return mapFunction.call(context, promiseOrValues);
  }

  return promise;
};

core.Module("core.event.Flow",
{
  /**
   * Initiates a competitive race that allows one winner, returning a promise that will 
   * resolve when any one of the items in array resolves. The returned promise will 
   * only reject if all items in array are rejected. The resolution value of the returned 
   * promise will be the fulfillment value of the winning promise. The rejection value will be 
   * an array of all rejection reasons.
   */
  any : function(promiseOrValues)
  {

  },

  /**
   * {core.event.Promise} Return a promise that will resolve only once all the inputs have resolved.
   * The resolution value of the returned promise will be an array containing the 
   * resolution values of each of the inputs.
   *
   * If any of the input promises is rejected, the returned promise will be 
   * rejected with the reason from the first one that is rejected.
   *
   * Inspired by when.js
   */
  all : function(promiseOrValues)
  {
    return map(promiseOrValues, identity);
  },

  map : map

  
  



});

})();
