var suite = new core.testrunner.Suite("Util/TextPacker");

suite.test("utf8", function() 
{
  var testString = "TEST WITH UMLAUTS: ü and ä and ö";
  var packed = core.util.TextCompressor.compress(testString);

  this.isIdentical(core.util.TextCompressor.decompress(packed), testString);
  this.isTrue(packed.length < testString.length);
});

