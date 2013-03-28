var suite = new core.testrunner.Suite("Type/Number");

suite.test("pad", function() 
{
  this.isEqual(core.Number.pad(23, 2), "23");
  this.isEqual(core.Number.pad(23, 4), "0023");
  this.isEqual(core.Number.pad(23, 6), "000023");
  this.isEqual(core.Number.pad(0, 6), "000000");
});

suite.test("times", function() 
{
  var test = this;
  var sum = 0;

  core.Number.times(function() {
    this.isIdentical(this, test);
    sum++;
  }, this, 5);

  this.isIdentical(sum, 5);
});

suite.test("toHex", function() 
{
  this.isIdentical(core.Number.toHex(15), "f");
  this.isIdentical(core.Number.toHex(252), "fc");
  this.isIdentical(core.Number.toHex(99), "63");
});

suite.test("toInteger", function() 
{
  this.isEqual(core.Number.toInteger(3.14), "3");
  this.isEqual(core.Number.toInteger(-230923.2323), "-230923");
  this.isEqual(core.Number.toInteger(-0), "0");
  this.isEqual(core.Number.toInteger(1e2), "100");
});
