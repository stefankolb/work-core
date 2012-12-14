(function(global) 
{
  module("Core :: Modules", {
    teardown : function() {
      delete global.abc;
      delete global.x;
    }
  });

  test("Creating empty module", function() {
    core.Module("abc.Module1", {});
    equal(core.Module.isModule(abc.Module1), true);
    equal(abc.Module1.moduleName, "abc.Module1");
    equal(abc.Module1.toString(), "[module abc.Module1]");
  });

  test("Creating module with short namespace", function() {
    core.Module("x.Module1", {});
    equal(core.Module.isModule(x.Module1), true);
    equal(x.Module1.moduleName, "x.Module1");
    equal(x.Module1.toString(), "[module x.Module1]");
  });

  test("Module false validation", function() {
    ok(!core.Module.isModule({}));
    ok(!core.Module.isModule(3));
    ok(!core.Module.isModule(null));
  });

  test("Creating method module", function() {
    core.Module("abc.Module2", {
      method1 : function() {},
      method2 : function() {},
      method3 : function() {}
    });
    equal(core.Module.isModule(abc.Module2), true);
    ok(abc.Module2.method1 instanceof Function);
    ok(abc.Module2.method2 instanceof Function);
    ok(abc.Module2.method3 instanceof Function);
    equal(abc.Module2.method1.displayName, "abc.Module2.method1");
    equal(abc.Module2.method2.displayName, "abc.Module2.method2");
    equal(abc.Module2.method3.displayName, "abc.Module2.method3");
  });

  test("Checking module name", function() {
    raises(function() {
      core.Module("", {});
    });
    raises(function() {
      Module(true, {});
    });
    raises(function() {
      core.Module(" SpaceVoodoo ", {});
    });
    raises(function() {
      core.Module("has space", {});
    });
    raises(function() {
      core.Module("firstLow", {});
    });
    raises(function() {
      core.Module("two..Dots", {});
    });
  });
})(this);