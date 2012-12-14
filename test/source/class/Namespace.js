module("Core :: Namespaces", {
  teardown : function() {
    delete global.foo;
    delete global.abc;
    delete global.a;
  }
});

test("Creating global", function() {
  core.Main.declareNamespace("foo", 3);
  equal(global.foo, 3);
});

test("Creating namespace", function() {
  core.Main.declareNamespace("abc.def", 5);
  equal(global.abc.def, 5);
});
