var suite = new core.test.Suite("Pooling", null, function() 
{
  core.Main.clearNamespace("pooled.Simple1");
  core.Main.clearNamespace("pooled.Simple2");
  core.Main.clearNamespace("pooled.Simple3");
  core.Main.clearNamespace("pooled.Simple4");
  core.Main.clearNamespace("pooled.Simple5");
});

suite.test("Create Pooled Class", function() 
{
  core.Class("pooled.Simple1",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  var obj = pooled.Simple1.obtain(1);
  this.equal(typeof obj, "object");
  this.equal(obj.a, 1);
  this.equal(obj.constructor.className, "pooled.Simple1");
  this.equal(obj instanceof pooled.Simple1, true);

});

suite.test("Reuse Pooled Class", function() 
{
  core.Class("pooled.Simple2",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  var obj1 = pooled.Simple2.obtain(1);
  this.equal(typeof obj1, "object");
  this.equal(obj1.a, 1);

  obj1.release();

  var obj2 = pooled.Simple2.obtain(2);
  this.equal(typeof obj2, "object");
  this.equal(obj2.a, 2);

});

suite.test("Reuse/Extend Pooled Class", function() 
{
  core.Class("pooled.Simple3",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  this.equal(pooled.Simple3.getPoolSize(), 0);

  var obj1 = pooled.Simple3.obtain(1);
  this.equal(typeof obj1, "object");
  this.equal(obj1.a, 1);

  this.equal(pooled.Simple3.getPoolSize(), 0);

  obj1.release();

  this.equal(pooled.Simple3.getPoolSize(), 1);

  var obj2 = pooled.Simple3.obtain(2);
  this.equal(typeof obj2, "object");
  this.equal(obj2.a, 2);

  this.equal(pooled.Simple3.getPoolSize(), 0);

  var obj3 = pooled.Simple3.obtain(3);
  this.equal(typeof obj3, "object");
  this.equal(obj3.a, 3);

  this.equal(pooled.Simple3.getPoolSize(), 0);

  obj2.release();
  obj3.release();

  this.equal(pooled.Simple3.getPoolSize(), 2);

});  


suite.test("Limited Pooled Class", function() 
{
  core.Class("pooled.Simple4",
  {
    pooling : {
      max : 2
    },

    construct: function() {

    }
  });

  var obj1 = pooled.Simple4.obtain();
  this.equal(typeof obj1, "object");

  var obj2 = pooled.Simple4.obtain();
  this.equal(typeof obj2, "object");

  var obj3 = pooled.Simple4.obtain();
  this.equal(typeof obj3, "object");

  var obj4 = pooled.Simple4.obtain();
  this.equal(typeof obj4, "object");

  this.equal(pooled.Simple4.getPoolSize(), 0);

  obj1.release();
  obj2.release();
  obj3.release();
  obj4.release();

  this.equal(pooled.Simple4.getPoolSize(), 2);

});

suite.test("Pooled Class Checks", function() 
{
  core.Class("pooled.Simple5",
  {
    pooling : {
      max : 2
    },

    construct: function(a) {
      if (!this.isold) {
        this.isreused = false;
        this.isold = true;
      } else {
        this.isreused = true;
      }
    }
  });

  var obj1 = pooled.Simple5.obtain(1);
  this.equal(typeof obj1, "object");
  this.equal(obj1.isreused, false);

  obj1.release();

  var obj2 = pooled.Simple5.obtain(2);
  this.equal(typeof obj2, "object");
  this.equal(obj2.isreused, true);

  var obj3 = pooled.Simple5.obtain(3);
  this.equal(typeof obj3, "object");
  this.equal(obj3.isreused, false);

  obj2.release();
  obj3.release();

});
