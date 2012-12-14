module("Ext :: Fixes");

asyncTest("setTimeout with arguments", 1, function() 
{
  /** #require(ext.TimeoutArgs) */
  setTimeout(function(arg)
  {
    equal(arg, "hello");
    start();
  }, 10, "hello");
});

asyncTest("setImmediate", 1, function() 
{
  /** #require(ext.Immediate) */
  setImmediate(function() {
    ok(true, "always fine");
    start();
  });
});

asyncTest("requestAnimationFrame", 1, function() 
{
  /** #require(ext.RequestAnimationFrame) */
  requestAnimationFrame(function() {
    ok(true, "always fine");
    start();
  });
});

test("Object.keys", function() 
{
  // Basic first
  var keys = Object.keys({hello:null, foo:1}).sort().join(",");
  equal(keys, "foo,hello");

  // toString etc. are special in IE because these are built-in keys
  var keys = Object.keys({toString:null, hello:null, foo:1}).sort().join(",");
  equal(keys, "foo,hello,toString");
});
