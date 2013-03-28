var suite = new core.testrunner.Suite("Type/Object");

suite.test("isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.isTrue(core.Object.isEmpty({}));
  this.isTrue(!core.Object.isEmpty({toString:null}));
  this.isTrue(!core.Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("getKeys", function() 
{
  var keys = core.Object.getKeys({x:1, y:2, z:3}).join(",");
  this.isEqual(keys, "x,y,z");

  var keys = core.Object.getKeys({x:1, y:2, z:3, toString:4}).join(",");
  this.isEqual(keys, "x,y,z,toString");  
});

suite.test("getValues", function() 
{
  var values = core.Object.getValues({x:1, y:2, z:3}).sort().join(",");
  this.isEqual(values, "1,2,3");

  var values = core.Object.getValues({x:1, y:2, z:3, toString:4}).join(",");
  this.isEqual(values, "1,2,3,4");
});


