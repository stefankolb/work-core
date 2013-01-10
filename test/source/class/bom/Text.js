if (jasy.Env.isSet("runtime", "browser"))
{
  var suite = new core.testrunner.Suite("BOM/Text");

  suite.test("Basics", function() 
  {
    this.isIdentical(typeof core.bom.Text.measure("hello world"), "object");
    this.isIdentical(typeof core.bom.Text.measure("hello world").width, "number");
    this.isIdentical(typeof core.bom.Text.measure("hello world").height, "number");

    this.isIdentical(typeof core.bom.Text.measure("hello world foo bar baz", null, 40), "object");
    this.isIdentical(core.bom.Text.measure("hello world foo bar baz", null, 40).width, 40);
  });
}
  