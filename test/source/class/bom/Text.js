module("Core :: BOM");

test("Text", function() {
  
  strictEqual(typeof core.bom.Text.measure("hello world"), "object");
  strictEqual(typeof core.bom.Text.measure("hello world").width, "number");
  strictEqual(typeof core.bom.Text.measure("hello world").height, "number");

  strictEqual(typeof core.bom.Text.measure("hello world foo bar baz", null, 40), "object");
  strictEqual(core.bom.Text.measure("hello world foo bar baz", null, 40).width, 40);
  
});