(function(global) 
{
  var suite = new core.testrunner.Suite("OO/Modules", null, function() {
    delete global.abc;
    delete global.x;
  });

  suite.test("Creating empty module", function() {
    core.Module("abc.Module1", {});
    this.isEqual(core.Module.isModule(abc.Module1), true);
    this.isEqual(abc.Module1.moduleName, "abc.Module1");
    this.isEqual(abc.Module1.toString(), "[module abc.Module1]");
  });

  suite.test("Creating module with short namespace", function() {
    core.Module("x.Module1", {});
    this.isEqual(core.Module.isModule(x.Module1), true);
    this.isEqual(x.Module1.moduleName, "x.Module1");
    this.isEqual(x.Module1.toString(), "[module x.Module1]");
  });

  suite.test("Module false validation", function() {
    this.isTrue(!core.Module.isModule({}));
    this.isTrue(!core.Module.isModule(3));
    this.isTrue(!core.Module.isModule(null));
  });

  suite.test("Creating method module", function() {
    core.Module("abc.Module2", {
      method1 : function() {},
      method2 : function() {},
      method3 : function() {}
    });
    this.isEqual(core.Module.isModule(abc.Module2), true);
    this.isTrue(abc.Module2.method1 instanceof Function);
    this.isTrue(abc.Module2.method2 instanceof Function);
    this.isTrue(abc.Module2.method3 instanceof Function);
    this.isEqual(abc.Module2.method1.displayName, "abc.Module2.method1");
    this.isEqual(abc.Module2.method2.displayName, "abc.Module2.method2");
    this.isEqual(abc.Module2.method3.displayName, "abc.Module2.method3");
  });

  suite.test("Checking module name", function() {
    this.raisesException(function() {
      core.Module("", {});
    });
    this.raisesException(function() {
      Module(true, {});
    });
    this.raisesException(function() {
      core.Module(" SpaceVoodoo ", {});
    });
    this.raisesException(function() {
      core.Module("has space", {});
    });
    this.raisesException(function() {
      core.Module("firstLow", {});
    });
    this.raisesException(function() {
      core.Module("two..Dots", {});
    });
  });
})(core.Main.getGlobal());
