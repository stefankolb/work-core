module("Pooling", {
  teardown : function() 
  {
    core.Main.clearNamespace("pooled.Simple1");
    core.Main.clearNamespace("pooled.Simple2");
    core.Main.clearNamespace("pooled.Simple3");
    core.Main.clearNamespace("pooled.Simple4");
    core.Main.clearNamespace("pooled.Simple5");
  }
});

test("Create Pooled Class", function() 
{
  core.Class("pooled.Simple1",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  var obj = pooled.Simple1.obtain(1);
  equal(typeof obj, "object");
  equal(obj.a, 1);
  equal(obj.constructor.className, "pooled.Simple1");
  equal(obj instanceof pooled.Simple1, true);

});

test("Reuse Pooled Class", function() 
{
  core.Class("pooled.Simple2",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  var obj1 = pooled.Simple2.obtain(1);
  equal(typeof obj1, "object");
  equal(obj1.a, 1);

  obj1.release();

  var obj2 = pooled.Simple2.obtain(2);
  equal(typeof obj2, "object");
  equal(obj2.a, 2);

});

test("Reuse/Extend Pooled Class", function() 
{
  core.Class("pooled.Simple3",
  {
    pooling : true,

    construct: function(a) {
      this.a = a;
    }
  });

  equal(pooled.Simple3.getPoolSize(), 0);

  var obj1 = pooled.Simple3.obtain(1);
  equal(typeof obj1, "object");
  equal(obj1.a, 1);

  equal(pooled.Simple3.getPoolSize(), 0);

  obj1.release();

  equal(pooled.Simple3.getPoolSize(), 1);

  var obj2 = pooled.Simple3.obtain(2);
  equal(typeof obj2, "object");
  equal(obj2.a, 2);

  equal(pooled.Simple3.getPoolSize(), 0);

  var obj3 = pooled.Simple3.obtain(3);
  equal(typeof obj3, "object");
  equal(obj3.a, 3);

  equal(pooled.Simple3.getPoolSize(), 0);

  obj2.release();
  obj3.release();

  equal(pooled.Simple3.getPoolSize(), 2);

});  


test("Limited Pooled Class", function() 
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
  equal(typeof obj1, "object");

  var obj2 = pooled.Simple4.obtain();
  equal(typeof obj2, "object");

  var obj3 = pooled.Simple4.obtain();
  equal(typeof obj3, "object");

  var obj4 = pooled.Simple4.obtain();
  equal(typeof obj4, "object");

  equal(pooled.Simple4.getPoolSize(), 0);

  obj1.release();
  obj2.release();
  obj3.release();
  obj4.release();

  equal(pooled.Simple4.getPoolSize(), 2);

});

test("Pooled Class Checks", function() 
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
  equal(typeof obj1, "object");
  equal(obj1.isreused, false);

  obj1.release();

  var obj2 = pooled.Simple5.obtain(2);
  equal(typeof obj2, "object");
  equal(obj2.isreused, true);

  var obj3 = pooled.Simple5.obtain(3);
  equal(typeof obj3, "object");
  equal(obj3.isreused, false);

  obj2.release();
  obj3.release();

});  