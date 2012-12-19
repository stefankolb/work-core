if (jasy.Env.isSet("runtime", "browser"))
{
  var suite = new core.test.Suite("BOM/Text");

  suite.test("Basics", function() 
  {
    this.identical(typeof core.bom.Text.measure("hello world"), "object");
    this.identical(typeof core.bom.Text.measure("hello world").width, "number");
    this.identical(typeof core.bom.Text.measure("hello world").height, "number");

    this.identical(typeof core.bom.Text.measure("hello world foo bar baz", null, 40), "object");
    this.identical(core.bom.Text.measure("hello world foo bar baz", null, 40).width, 40);
  });
}
  