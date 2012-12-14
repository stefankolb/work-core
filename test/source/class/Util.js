module("Core :: Util");

test("Id", function() {
  
  var myFunc = new Function;
  strictEqual(core.util.Id.get(myFunc), 1);
  strictEqual(core.util.Id.get(myFunc), 1);

  strictEqual(core.util.Id.get(document.body), 2);
  strictEqual(core.util.Id.get(document.body), 2);
  
});