var suite = new core.testrunner.Suite("Util/Base64");

suite.test("convert byte array", function() 
{
  var input = [ 1, 2, 3, 4, 5 ];

  var encoded = core.util.Base64.encodeFromByteArray(input);
  var decoded = core.util.Base64.decodeToByteArray(encoded);

  this.isIdentical(String(decoded), String(input));

});
