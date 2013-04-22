var suite = new core.testrunner.Suite("Type/Object");

suite.test("clone", function() 
{
  var orig = {x:1,y:2,z:3,a:true,b:false,toString:123};
  var clone = core.Object.clone(orig);
  this.isNotIdentical(orig, clone);

  this.isEqual(core.Object.getKeys(orig).join(","), core.Object.getKeys(clone).join(","))
  this.isEqual(core.Object.getValues(orig).join(","), core.Object.getValues(clone).join(","))
});

suite.test("forAll", function() 
{
  var test = this;
  var basic = {x:1,y:2,z:3,a:true,b:false,toString:123};
  var keys = [];
  var values = [];

  core.Object.forAll(basic, function(value, key, object) {
    
    this.isIdentical(this, test);
    this.isIdentical(object, basic);

    values.push(value);
    keys.push(key);

  }, this);

  this.isEqual(values.join(","), "1,2,3,true,false,123");
  this.isEqual(keys.join(","), "x,y,z,a,b,toString");
});

suite.test("forAll - extended", function() 
{
  var test = this;

  var construct = Function();
  construct.prototype = {x:1,y:2,z:3,a:true,b:false,toString:123};

  var extended = new construct();
  extended.local1 = 42;
  extended.local2 = "hello";

  var keys = [];
  var values = [];

  core.Object.forAll(extended, function(value, key, object) {
    
    this.isIdentical(this, test);
    this.isIdentical(object, extended);

    values.push(value);
    keys.push(key);

  }, this);

  this.isEqual(values.join(","), "42,hello,1,2,3,true,false,123");
  this.isEqual(keys.join(","), "local1,local2,x,y,z,a,b,toString");  
});  

suite.test("forEach", function() 
{
  var test = this;
  var basic = {x:1,y:2,z:3,a:true,b:false,toString:123};
  var keys = [];
  var values = [];

  core.Object.forEach(basic, function(value, key, object) {
    
    this.isIdentical(this, test);
    this.isIdentical(object, basic);

    values.push(value);
    keys.push(key);

  }, this);

  this.isEqual(values.join(","), "1,2,3,true,false,123");
  this.isEqual(keys.join(","), "x,y,z,a,b,toString");
});

suite.test("forEach - extended", function() 
{
  var test = this;

  var construct = Function();
  construct.prototype = {x:1,y:2,z:3,a:true,b:false,toString:123};

  var extended = new construct();
  extended.local1 = 42;
  extended.local2 = "hello";

  var keys = [];
  var values = [];

  core.Object.forEach(extended, function(value, key, object) {
    
    this.isIdentical(this, test);
    this.isIdentical(object, extended);

    values.push(value);
    keys.push(key);

  }, this);

  this.isEqual(values.join(","), "42,hello");
  this.isEqual(keys.join(","), "local1,local2");  
});  

suite.test("getKeys", function() 
{
  var keys = core.Object.getKeys({x:1, y:2, z:3}).join(",");
  this.isEqual(keys, "x,y,z");

  var keys = core.Object.getKeys({x:1, y:2, z:3, toString:4}).join(",");
  this.isEqual(keys, "x,y,z,toString");  
});

suite.test("getLength", function() 
{
  var plain = {x:1, y:2, z:3};
  this.isEqual(core.Object.getLength(plain), 3);

  var construct = Function();
  construct.prototype = {x:1,y:2,z:3,a:true,b:false,toString:123};
  var extended = new construct();  
  extended.localKey = 42;
  extended.toString = 3;
  this.isEqual(core.Object.getLength(extended), 2);
});

suite.test("getValues", function() 
{
  var values = core.Object.getValues({x:1, y:2, z:3}).sort().join(",");
  this.isEqual(values, "1,2,3");

  var values = core.Object.getValues({x:1, y:2, z:3, toString:4}).join(",");
  this.isEqual(values, "1,2,3,4");
});

suite.test("isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.isTrue(core.Object.isEmpty({}));
  this.isTrue(!core.Object.isEmpty({toString:null}));
  this.isTrue(!core.Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("pick", function() 
{
  var res = core.Object.pick({x:1,y:2,z:3}, "y");
  this.isEqual(core.Object.getLength(res), 1);
  this.isEqual(core.Object.getKeys(res).toString(), "y");
  this.isEqual(core.Object.getValues(res).toString(), "2");

  var res = core.Object.pick({x:1,y:2,z:3}, "y", "z");
  this.isEqual(core.Object.getLength(res), 2);
  this.isEqual(core.Object.getKeys(res).toString(), "y,z");
  this.isEqual(core.Object.getValues(res).toString(), "2,3");
});

suite.test("translate", function() 
{
  var source = {x:1,y:2,z:3};
  var translated = core.Object.translate(source, {
    y:"foo"
  });

  this.isEqual(core.Object.getLength(translated), 3);
  this.isEqual(core.Object.getKeys(translated).toString(), "x,foo,z");
  this.isEqual(core.Object.getValues(translated).toString(), "1,2,3");

  var source = {x:1,y:2,z:3};
  var translated = core.Object.translate(source, {
    x:"y",
    y:"x"
  });

  this.isEqual(core.Object.getLength(translated), 3);
  this.isEqual(core.Object.getKeys(translated).toString(), "y,x,z");
  this.isEqual(core.Object.getValues(translated).toString(), "1,2,3");
});
