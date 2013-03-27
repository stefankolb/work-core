var suite = new core.testrunner.Suite("core.Number");

suite.test("pad", function() 
{
  this.isEqual(core.Number.pad(23, 2), "23");
  this.isEqual(core.Number.pad(23, 4), "0023");
  this.isEqual(core.Number.pad(23, 6), "000023");
  this.isEqual(core.Number.pad(0, 6), "000000");
});
