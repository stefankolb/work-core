/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

(function(slice) {

var identity = function(x) { return x };
var map = function(promisesOrValues, mapFunction, context) {
  var promise;
  context = context || this;

  if (promisesOrValues && promisesOrValues.then && typeof promisesOrValues.then == "function") {
    return promisesOrValues.then(function(value) {
      return map(value, mapFunction, context);
    }, null, context);
  } else if (core.Main.isTypeOf(promisesOrValues, "Array")) {
    promise = core.event.Promise.obtain();

    var resolved = 0;
    var len = promisesOrValues.length;
    var result = [];

    var valueCallback = function(value) {
      result.push(value);
      if (result.length == len) {
        promise.fulfill(result);
      }
    };

    for (var i=0; i<len; i++) {
      var value = map(promisesOrValues[i], mapFunction, context);
      
      if (value.then) {
        value.then(valueCallback, function(reason) {
          promise.reject(reason);
        });
      } else {
        valueCallback(value);
      }
    }
  } else {
    return mapFunction.call(context, promisesOrValues);
  }

  return promise;
};


var promisify = function(func, context, args) {
  var error;
  
  try {
    var result = func.apply(context, args);
    
    if (!result.then) {
      var promise = core.event.Promise.obtain();
      promise.fulfill(result);
      return promise;
    } else {
      return result;
    }
  } catch (e) {
    var promise = core.event.Promise.obtain();
    promise.reject(e);
    return promise;
  }
};

var promisifyGenerator = function(task, context, args, takeValue) {
  if (takeValue) {
    return function(value) {
      return promisify(task, context, [value]);
    };
  } else {
    return function(value) {
      return promisify(task, context, args);
    };
  }
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
  any : function(promisesOrValues)
  {
    var promise = core.event.Promise.obtain();
    var reasons = [];
    var promises = promisesOrValues.length;
    
    for (var i=0,ii=promises; i<ii; i++) {
      var value = promisesOrValues[i];
      
      if (value && value.then) {
        value.then(function(value) {
          if (promises > 0) {
            promise.fulfill(value);
            promises = -1;
          }
        }, function(reason) {
          if (promises > 0) {
            reasons.push(reason);
            promises --;
            
            if (promises == 0) {
              promise.reject(reasons);
            }
          }
        });
      } else {
        if (promises > 0) {
          promise.fulfill(value);
          promises = -1;
        }
      }
    }
    
    return promise;
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
  all : function(promisesOrValues)
  {
    return map(promisesOrValues, identity);
  },

  map : map,
  
  /**
   * {Promise} Calls all functions of @tasks {Array} in @context {var} with following arguments 
   * @args in sequence. 
   * That means they do not overlap in time. Returns a promise that resolves to an array of the
   * returning values of task. All task can return a promise or a value.
   *
   * If one returning promise is rejected or an error is thrown the returning promise is rejected.
   */
  sequence : function(tasks, context, arg1) {
    var args = slice.call(arguments, 2);
    var promise = core.event.Promise.obtain();
    var result = [];
    
    var prom;
    
    var promisifyGenerator = function(task, context, args) {
      return function() {
        return promisify(task, context, args);
      };
    };
    
    for (var i=0,ii=tasks.length; i<ii; i++) {
      if (!prom) {
        prom = promisify(tasks[i], context, args);
      } else {
        prom = prom.then(function(value) {
          result.push(value);
        }, function(reason) {
          promise.reject(reason);
        }).then(promisifyGenerator(tasks[i], context, args));
      }
    }
    
    prom.then(function(value) {
      result.push(value);
      promise.fulfill(result);
    }, function(reason) {
      promise.reject(reason);
    });
    
    return promise;
  },
  
  /**
   * {Promise} Calls all functions of @tasks {Array} in @context {var}. First function gets 
   * arguments @args. All other functions gets returning value of function as argument. All 
   * functions called in sequence. That means they do not overlap in time. Returns promise 
   * of value of last function. All task can return a promise or a value.
   *
   * If one returning promise is rejected or an error is thrown the returning promise is rejected.
   */
  pipeline : function(tasks, context, arg1) {
    var args = slice.call(arguments, 2);
    var promise = promisify(tasks[0], context, args);
    
    for (var i=1, ii=tasks.length; i<ii; i++) {
      promise = promise.then(promisifyGenerator(tasks[i], context, null, true));
    }
    
    return promise;
  }

  
  



});

})(Array.prototype.slice);
