var suite = new core.testrunner.Suite("Type/Function");

suite.test("debounce - END", function() 
{
  var test = this;

  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = core.Function.debounce(callback);
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  setTimeout(function() {
    test.isEqual(counter, 1);
    test.done();
  }, 200)
}, 1, 1000);

suite.test("debounce - ASAP", function() 
{
  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = core.Function.debounce(callback, 100, true);
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  this.isEqual(counter, 1);
});

suite.test("timeout", function() 
{
  var ref = core.Function.timeout(function(arg1, arg2) 
  {
    this.isEqual(arg1, "foo");
    this.isEqual(arg2, "bar");
    this.done();
  }, this, 100, "foo", "bar");

}, 2, 1000);

suite.test("interval", function() 
{
  var ref = core.Function.interval(function(arg1, arg2) 
  {
    this.isEqual(arg1, "foo");
    this.isEqual(arg2, "bar");

    // Using global method
    clearInterval(ref);

    this.done();
  }, this, 100, "foo", "bar");

}, 2, 1000);

suite.test("immediate", function() 
{
  core.Function.immediate(function() {
    this.done();
  }, this);

}, 0, 1000);

suite.test("throttle", function() 
{
  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var throttled = core.Function.throttle(callback, 100);

  setTimeout(throttled, 20);
  setTimeout(throttled, 50);
  setTimeout(throttled, 80);
  setTimeout(throttled, 110);
  setTimeout(throttled, 140);
  setTimeout(throttled, 170);
  setTimeout(throttled, 200);
  setTimeout(throttled, 230);
  setTimeout(throttled, 260);
  setTimeout(throttled, 290);
  
  var test = this;
  setTimeout(function() {
    test.isEqual(counter, 3);
    test.done();
  }, 500);
  
}, 1, 1000);

suite.test("bind", function()
{
  var test = this;

  var obj = new (new Function);

  var func1 = function() {
    test.isIdentical(this, obj);
  };
  var bound1 = core.Function.bind(func1, obj);
  var bound2 = core.Function.bind(func1, obj);

  this.isType(bound1, "Function");
  this.isIdentical(bound1, bound2);

  bound1();
  bound2();
});

