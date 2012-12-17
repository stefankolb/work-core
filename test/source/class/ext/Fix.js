var suite = new core.test.Suite("Ext :: Fixes");

suite.test("setTimeout with arguments", function() 
{
  var test = this;

  /** #require(ext.TimeoutArgs) */
  setTimeout(function(arg)
  {
    test.equal(arg, "hello");
    test.done();
  }, 10, "hello");
}, 1000);

suite.test("setImmediate", function() 
{
  var test = this;

  /** #require(ext.Immediate) */
  setImmediate(function() {
    test.ok(true, "always fine");
    test.done();
  });
}, 1000);

suite.test("requestAnimationFrame", function() 
{
  var test = this;

  /** #require(ext.RequestAnimationFrame) */
  requestAnimationFrame(function() {
    test.ok(true, "always fine");
    test.done();
  });
}, 1000);

suite.test("Object.keys", function() 
{
  // Basic first
  var keys = Object.keys({hello:null, foo:1}).sort().join(",");
  this.equal(keys, "foo,hello");

  // toString etc. are special in IE because these are built-in keys
  var keys = Object.keys({toString:null, hello:null, foo:1}).sort().join(",");
  this.equal(keys, "foo,hello,toString");
});
