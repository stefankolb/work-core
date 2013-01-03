(function(global) 
{
  var suite = new core.testrunner.Suite("Namespaces", null, function() {
    delete global.foo;
    delete global.abc;
    delete global.a;
  });

  suite.test("Creating global", function() {
    core.Main.declareNamespace("foo", 3);
    this.equal(global.foo, 3);
  });

  suite.test("Creating namespace", function() {
    core.Main.declareNamespace("abc.def", 5);
    this.equal(global.abc.def, 5);
  });
})(core.Main.getGlobal());
