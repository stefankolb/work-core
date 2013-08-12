var suite = new core.testrunner.Suite("Util/TextPacker");

suite.test("utf8", function() 
{
  var testString = "TEST WITH UMLAUTS: ü and ä and ö";
  var packed = core.util.TextCompressor.compress(testString);

  this.isIdentical(core.util.TextCompressor.decompress(packed), testString);
  this.isTrue(packed.length < testString.length);
});

suite.test("test compress decompress", function() {
	var testString = "{foo:123}";

	var packed = core.util.TextCompressor.compress(testString);
	var unpacked = core.util.TextCompressor.decompress(packed);

	this.isIdentical(unpacked, testString);
});

suite.test("test compress/decompress base64", function() {
	var testString = "{foo:123}";
	var testStringB64 = core.util.Base64.encode(testString);

	var packed = core.util.TextCompressor.compress64(testStringB64);
	var unpacked = core.util.TextCompressor.decompress64(packed);

	var decoded = core.util.Base64.decode(unpacked);

	this.isIdentical(unpacked, testStringB64.replace("=", ""));
});

suite.test("test compress/decompress base64 part 2", function() {
	var testString = "TEST WITH UMLAUTS: ü and ä and ö";
	var testStringB64 = core.util.Base64.encode(testString);

	var packed = core.util.TextCompressor.compress64(testStringB64);
	var unpacked = core.util.TextCompressor.decompress64(packed);

	var decoded = core.util.Base64.decode(unpacked);

	this.isIdentical(unpacked, testStringB64.replace("=", ""));
});