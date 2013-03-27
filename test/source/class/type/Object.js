var suite = new core.testrunner.Suite("Type/Object");

suite.test("isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.isTrue(core.Object.isEmpty({}));
  this.isTrue(!core.Object.isEmpty({toString:null}));
  this.isTrue(!core.Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("values", function() 
{
  var values = core.Object.values({x:1, y:2, z:3}).sort().join(",");
  this.isEqual(values, "1,2,3");
});

suite.test("fromArray", function() 
{
  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"])).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"])).join(","), "true,true,true");

  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "hello,hello,hello");
});

