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

suite.test("Stringify", function() 
{
  var undef, value;

  var serialized = '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
  var getClass = Object.prototype.toString;

  // A test function object with a custom `toJSON` method.
  (value = function () {
    return 1;
  }).toJSON = value;  

  // Firefox 3.1b1 and b2 serialize string, number, and boolean
  // primitives as object literals.
  this.isIdentical(JSON.stringify(0), "0");

  // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
  // literals.
  this.isIdentical(JSON.stringify(new Number()), "0");
  this.isEqual(JSON.stringify(new String()), '""');

  // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
  // does not define a canonical JSON representation (this applies to
  // objects with `toJSON` properties as well, *unless* they are nested
  // within an object or array).
  this.isIdentical(JSON.stringify(getClass), undef);

  // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
  // FF 3.1b3 pass this test.
  this.isIdentical(JSON.stringify(undef), undef);

  // Safari < 7? and FF 3.1b3 throw `Error`s and `TypeError`s,
  // respectively, if the value is omitted entirely.
  this.isIdentical(JSON.stringify(), undef);

  // FF 3.1b1, 2 throw an error if the given value is not a number,
  // string, array, object, Boolean, or `null` literal. This applies to
  // objects with custom `toJSON` methods as well, unless they are nested
  // inside object or array literals.
  this.isIdentical(JSON.stringify(value), "1");
  this.isEqual(JSON.stringify([value]), "[1]");

  // FF 3.1b1, 2 halts serialization if an array contains a function:
  // `[1, true, getClass, 1]` serializes as "[1,true,],". These versions
  // of Firefox also allow trailing commas in JSON objects and arrays.
  // FF 3.1b3 elides non-JSON values from objects and arrays, unless they
  // define custom `toJSON` methods.
  this.isEqual(JSON.stringify([undef, getClass, null]), "[null,null,null]");

  // Simple test
  this.isEqual(JSON.stringify({a:1,b:2}), '{"a":1,"b":2}');

  // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
  // where character escape codes are expected (e.g., `\b` => `\u0008`).
  this.isEqual(JSON.stringify({ "A": [value, true, false, null, "\0\b\n\f\r\t"] }), serialized);

  // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
  this.isIdentical(JSON.stringify(null, value), "1");
  this.isEqual(JSON.stringify([1, 2], null, 1), "[\n 1,\n 2\n]");

  // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
  // serialize extended years.
  this.isEqual(JSON.stringify(new Date(-8.64e15)), '"-271821-04-20T00:00:00.000Z"');

  // The milliseconds are optional in ES 5, but required in 5.1.
  this.isEqual(JSON.stringify(new Date(8.64e15)), '"+275760-09-13T00:00:00.000Z"');

  // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
  // four-digit years instead of six-digit years. Credits: @Yaffle.
  this.isEqual(JSON.stringify(new Date(-621987552e5)), '"-000001-01-01T00:00:00.000Z"');

  // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
  // values less than 1000. Credits: @Yaffle.
  this.isEqual(JSON.stringify(new Date(-1)), '"1969-12-31T23:59:59.999Z"');
});
