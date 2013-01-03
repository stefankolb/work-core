(function(global) 
{
  var suite = new core.testrunner.Suite("Modules", null, function() {
    delete global.abc;
    delete global.x;
  });

  suite.test("Creating empty module", function() {
    core.Module("abc.Module1", {});
    this.equal(core.Module.isModule(abc.Module1), true);
    this.equal(abc.Module1.moduleName, "abc.Module1");
    this.equal(abc.Module1.toString(), "[module abc.Module1]");
  });

  suite.test("Creating module with short namespace", function() {
    core.Module("x.Module1", {});
    this.equal(core.Module.isModule(x.Module1), true);
    this.equal(x.Module1.moduleName, "x.Module1");
    this.equal(x.Module1.toString(), "[module x.Module1]");
  });

  suite.test("Module false validation", function() {
    this.ok(!core.Module.isModule({}));
    this.ok(!core.Module.isModule(3));
    this.ok(!core.Module.isModule(null));
  });

  suite.test("Creating method module", function() {
    core.Module("abc.Module2", {
      method1 : function() {},
      method2 : function() {},
      method3 : function() {}
    });
    this.equal(core.Module.isModule(abc.Module2), true);
    this.ok(abc.Module2.method1 instanceof Function);
    this.ok(abc.Module2.method2 instanceof Function);
    this.ok(abc.Module2.method3 instanceof Function);
    this.equal(abc.Module2.method1.displayName, "abc.Module2.method1");
    this.equal(abc.Module2.method2.displayName, "abc.Module2.method2");
    this.equal(abc.Module2.method3.displayName, "abc.Module2.method3");
  });

  suite.test("Checking module name", function() {
    this.raises(function() {
      core.Module("", {});
    });
    this.raises(function() {
      Module(true, {});
    });
    this.raises(function() {
      core.Module(" SpaceVoodoo ", {});
    });
    this.raises(function() {
      core.Module("has space", {});
    });
    this.raises(function() {
      core.Module("firstLow", {});
    });
    this.raises(function() {
      core.Module("two..Dots", {});
    });
  });
})(core.Main.getGlobal());
