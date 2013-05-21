var suite = new core.testrunner.Suite("Promises");


suite.test("successful promises", function() {

  var promise = core.event.Promise.obtain();
  
  var fulfill = function(value) {
    this.isIdentical(value, "TEST1");
    this.done();
  };
  var reject = function(reason) {
    this.isIdentical(reason, "TEST2");
    this.done();
  };
  
  promise.then(fulfill, reject, this);
  
  promise.fulfill("TEST1");
  
}, 1, 1000);


suite.test("rejected promises", function() {

  var promise = core.event.Promise.obtain();
  
  var fulfill = function(value) {
    this.isIdentical(value, "TEST1");
    this.done();
  };
  var reject = function(reason) {
    this.isIdentical(reason, "TEST2");
    this.done();
  };
  
  promise.then(fulfill, reject, this);
  
  promise.reject("TEST2");
  
}, 1, 1000);


suite.test("flow value mapping (simple)", function() {

  var promise = core.event.Flow.all([0, 1, 9]);
  
  promise.then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
}, 3, 1000);


suite.test("flow value mapping (promises list)", function() {

  var promise0 = core.event.Promise.obtain();
  var promise1 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  var promise = core.event.Flow.all([promise0, promise1, promise9]);
  
  promise.then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
  promise0.fulfill(0);
  promise1.fulfill(1);
  promise9.fulfill(9);
  
}, 3, 1000);


suite.test("flow value mapping (mixed values)", function() {

  var promise0 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  var promise = core.event.Flow.all([promise0, 1, promise9]);
  
  promise.then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
  promise0.fulfill(0);
  promise9.fulfill(9);
  
}, 3, 1000);


suite.test("flow value mapping (promise for array of values)", function() {

  var promise = core.event.Promise.obtain();
  
  core.event.Flow.all(promise).then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
  promise.fulfill([0, 1, 9]);
  
}, 3, 1000);


suite.test("flow value mapping (promise for array of promises)", function() {

  var promise = core.event.Promise.obtain();
  var promise0 = core.event.Promise.obtain();
  var promise1 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.all(promise).then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
  promise.fulfill([promise0, promise1, promise9]);
  
  promise0.fulfill(0);
  promise1.fulfill(1);
  promise9.fulfill(9);
  
}, 3, 1000);


suite.test("flow value mapping (promise for array of mixed values and promises)", function() {

  var promise = core.event.Promise.obtain();
  var promise0 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.all(promise).then(function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, null, this);
  
  promise.fulfill([promise0, 1, promise9]);
  
  promise0.fulfill(0);
  promise9.fulfill(9);
  
}, 3, 1000);


suite.test("flow value mapping (reject one promise)", function() {

  var promise = core.event.Promise.obtain();
  var promise0 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.all(promise).then(null, function(reason) {
    this.isIdentical(reason, "REASON");
    this.done();
  }, this);
  
  promise.fulfill([promise0, 1, promise9]);
  
  promise0.reject("REASON");
  promise9.fulfill(9);
  
}, 1, 1000);


suite.test("flow map", function() {

  var promise = core.event.Promise.obtain();
  var promise0 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.map(promise, function(value) {
    return "X" + value;
  }).then(function(value) {
    
    this.isTrue(core.Array.contains(value, "X0"));
    this.isTrue(core.Array.contains(value, "X1"));
    this.isTrue(core.Array.contains(value, "X9"));
    
    this.done();
  }, null, this);
  
  promise.fulfill([promise0, 1, promise9]);
  
  promise0.fulfill(0);
  promise9.fulfill(9);
  
}, 3, 1000);


suite.test("flow any", function() {

  var promise0 = core.event.Promise.obtain();
  var promise1 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.any([promise0, promise1, promise9]).then(function(value) {
    
    this.isIdentical(value, 9);
    
    this.done();
  }, null, this);
  
  core.Function.immediate(function() {
    promise0.fulfill(0);
    promise1.fulfill(1);
  }, this);
  promise9.fulfill(9);
  
}, 1, 1000);

suite.test("flow any with one failing", function() {

  var promise0 = core.event.Promise.obtain();
  var promise1 = core.event.Promise.obtain();
  
  core.event.Flow.any([promise0, promise1, 9]).then(function(value) {
    
    this.isIdentical(value, 9);
    
    this.done();
  }, null, this);
  
  promise0.fulfill(0);
  promise1.reject(1);
  
}, 1, 1000);


suite.test("flow any with all failing", function() {

  var promise0 = core.event.Promise.obtain();
  var promise1 = core.event.Promise.obtain();
  var promise9 = core.event.Promise.obtain();
  
  core.event.Flow.any([promise0, promise1, promise9]).then(null, function(value) {
    
    this.isTrue(core.Array.contains(value, 0));
    this.isTrue(core.Array.contains(value, 1));
    this.isTrue(core.Array.contains(value, 9));
    
    this.done();
  }, this);
  
  promise0.reject(0);
  promise1.reject(1);
  promise9.reject(9);
  
}, 3, 1000);


suite.test("flow sequence", function() {

  var mutex = null;

  var promise1 = core.event.Promise.obtain();
  
  var func1 = function(arg1, arg2) {
    this.isNull(mutex);
    mutex = "func1";
    
    return promise1.then(function(value) {
      this.isEqual(mutex, "func1");
      mutex = null;
      
      return [arg1, arg2, value];
    }, null, this);
  };
  
  var func2 = function(arg1, arg2) {
    this.isNull(mutex);
    mutex = "func2";
    var promise = core.event.Promise.obtain();
    
    core.Function.timeout(function() {
      this.isEqual(mutex, "func2");
      mutex = null;
      
      promise.fulfill([arg1, arg2, 2]);
    }, this, 200);
    
    return promise;
  };
  var func3 = function(arg1, arg2) {
    return [arg1, arg2, 3];
  };
  
  core.event.Flow.sequence([func1, func2, func3], this, "a", "b").then(function(value) {

    this.isTrue(core.Array.contains(value[0], "a"), "Array 0 contains a");
    this.isTrue(core.Array.contains(value[0], "b"), "Array 0 contains b");
    
    this.isTrue(core.Array.contains(value[1], "a"), "Array 1 contains a");
    this.isTrue(core.Array.contains(value[1], "b"), "Array 1 contains b");
    
    this.isTrue(core.Array.contains(value[2], "a"), "Array 2 contains a");
    this.isTrue(core.Array.contains(value[2], "b"), "Array 2 contains b");
    
    this.isTrue(core.Array.contains(value[0], 1) || core.Array.contains(value[1], 1) || core.Array.contains(value[2], 1), "One array contains 1");
    this.isTrue(core.Array.contains(value[0], 2) || core.Array.contains(value[1], 2) || core.Array.contains(value[2], 2), "One array contains 2");
    this.isTrue(core.Array.contains(value[0], 3) || core.Array.contains(value[1], 3) || core.Array.contains(value[2], 3), "One array contains 3");
    
    
    this.done();
  }, function(reason) {
    throw reason;
  }, this);
  
  promise1.fulfill(1);
  
}, 13, 1000);


suite.test("flow pipe", function() {

  var mutex = null;

  var promise1 = core.event.Promise.obtain();
  
  var func1 = function(arg) {
    this.isIdentical(arg, "a");
    return promise1.then(function(value) {
      return value;
    }, null, this);
  };
  
  var func2 = function(arg) {
    this.isIdentical(arg, 1);
    var promise = core.event.Promise.obtain();
    
    core.Function.timeout(function() {
      promise.fulfill(2);
    }, this, 200);
    
    return promise;
  };
  var func3 = function(arg) {
    this.isIdentical(arg, 2);
    return 3;
  };
  
  core.event.Flow.pipeline([func1, func2, func3], this, "a").then(function(arg) {
    this.isIdentical(arg, 3);
    this.done();
  }, function(reason) {
    throw new Error(reason);
  }, this);
  
  promise1.fulfill(1);
  
}, 4, 1000);


suite.test("flow pipe (rejected)", function() {

  var mutex = null;

  var promise1 = core.event.Promise.obtain();
  
  var func1 = function(arg) {
    this.isIdentical(arg, "a");
    return promise1.then(function(value) {
      return value;
    }, null, this);
  };
  
  var func2 = function(arg) {
    this.isIdentical(arg, 1);
    var promise = core.event.Promise.obtain();
    
    core.Function.timeout(function() {
      promise.reject(2);
    }, this, 200);
    
    return promise;
  };
  var func3 = function(arg) {
    this.isIdentical(arg, 2);
    return 3;
  };
  
  core.event.Flow.pipeline([func1, func2, func3], this, "a").then(function(arg) {
    throw new Error("Should fail, but did not do it");
  }, function(reason) {
    this.isIdentical(reason, 2);
    this.done();
  }, this);
  
  promise1.fulfill(1);
  
}, 3, 1000);
