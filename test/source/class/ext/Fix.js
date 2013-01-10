var suite = new core.testrunner.Suite("Ext :: Fixes");

suite.test("setTimeout with arguments", function() 
{
  var test = this;

  /** #require(ext.TimeoutArgs) */
  setTimeout(function(arg)
  {
    test.isEqual(arg, "hello");
    test.done();
  }, 10, "hello");
}, 1, 1000);

if (jasy.Env.isSet("runtime", "browser"))
{
  suite.test("requestAnimationFrame", function() 
  {
    var test = this;

    /** #require(ext.RequestAnimationFrame) */
    requestAnimationFrame(function() {
      test.isTrue(true, "always fine");
      test.done();
    });
  }, 1, 1000);
}

suite.test("Object.keys", function() 
{
  // Basic first
  var keys = Object.keys({hello:null, foo:1}).sort().join(",");
  this.isEqual(keys, "foo,hello");

  // toString etc. are special in IE because these are built-in keys
  var keys = Object.keys({toString:null, hello:null, foo:1}).sort().join(",");
  this.isEqual(keys, "foo,hello,toString");
});
