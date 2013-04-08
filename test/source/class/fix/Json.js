var suite = new core.testrunner.Suite("Fix/JSON");

suite.test("Parse", function() 
{
  // Primitives
  this.isIdentical(JSON.parse('false'), false);
  this.isIdentical(JSON.parse('0'), 0);

  // Primitives in Objects
  this.isIdentical(JSON.parse('{"d":3.14}').d, 3.14);
  this.isIdentical(JSON.parse('{"d":"hello"}').d, "hello");
  this.isIdentical(JSON.parse('{"d":false}').d, false);

  // Array
  this.isEqual(JSON.parse('{"d":[1,2,3]}').d.toString(), "1,2,3");
  this.isEqual(JSON.parse('{"d":[1,2,3]}').d.length, 3);

  // Object
  this.isIdentical(JSON.parse('{"d":{"x":1}}').d.x, 1);

  // Basic Parse Test
  var serialized = '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
  var value = JSON.parse(serialized);
  this.isIdentical(value.A.length, 5);
  this.isIdentical(value.A[0], 1);

  // Prevent escaped
  this.raisesException(function() {
    JSON.parse('"\t"')
  });

  // Prevent octals
  this.raisesException(function() {
    JSON.parse("01")
  });



});

