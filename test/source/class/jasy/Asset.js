var suite = new core.testrunner.Suite("Jasy/Asset");

suite.test("Adding Source Data", function()
{
  this.raisesException(function()
  {
    jasy.Asset.resetData();
    jasy.Asset.toUri("my.png")
  });

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "my.png" : {"u":"asset/my.png"}
    }
  });
  this.isEqual(jasy.Asset.toUri("my.png"), "asset/my.png");
});


suite.test("Adding Build Data", function()
{
  this.raisesException(function() {
    jasy.Asset.resetData();
    jasy.Asset.toUri("my.png")
  });

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "my.png" : {}
    }
  });
  this.isEqual(jasy.Asset.toUri("my.png"), "asset/my.png");

});

