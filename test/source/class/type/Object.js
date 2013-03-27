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


