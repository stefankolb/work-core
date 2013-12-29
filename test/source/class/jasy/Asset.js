var suite = new core.testrunner.Suite("Jasy/Asset");

suite.test("Typical Source Data", function()
{
  this.raisesException(function()
  {
    jasy.Asset.resetData();
    jasy.Asset.toUri("my.png");
  });

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "my.png" : {"t":"i","u":"my.png"}
    }
  });
  this.isEqual(jasy.Asset.toUri("my.png"), "asset/my.png");
});


suite.test("Typical Build Data", function()
{
  this.raisesException(function()
  {
    jasy.Asset.resetData();
    jasy.Asset.toUri("my.png");
  });

  jasy.Asset.resetData();
  jasy.Asset.addData(
  {
    "assets" : {
      "my.png" : {"t":"i"}
    }
  });
  this.isEqual(jasy.Asset.toUri("my.png"), "asset/my.png");

});

