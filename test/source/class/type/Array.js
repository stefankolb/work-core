var suite = new core.testrunner.Suite("Type/Array");

suite.test("at", function() 
{
  var arr = [1,2,3,4,5];
  this.isEqual(core.Array.at(arr, 0), 1);
  this.isEqual(core.Array.at(arr, -1), 5);
  this.isEqual(core.Array.at(arr, 20));
  this.isEqual(core.Array.at(arr, -20));
});

suite.test("clone", function() 
{
  var orig = [1,2,3];
  var clone = core.Array.clone(orig);
  this.isEqual(orig.length, clone.length);
  this.isEqual(orig.join(","), clone.join(","));

  var orig = [1,2,,,5];
  var clone = core.Array.clone(orig);
  this.isEqual(orig.length, clone.length);
  this.isEqual(orig.join(","), clone.join(","));
});

suite.test("compact", function() 
{
  var sparse = [1,2,3,,5,,,8];
  this.isEqual(core.Array.compact(sparse).length, 5);

  var undef;
  var sparse = [1,2,3,null,5,,undef,8];
  this.isEqual(core.Array.compact(sparse).length, 7);
});

suite.test("contains", function() 
{
  var arr1 = [1,2,3,5,6,7];
  this.isTrue(core.Array.contains(arr1, 3));
  this.isTrue(!core.Array.contains(arr1, 4));
  this.isTrue(core.Array.contains(arr1, 5));
  
  var arr2 = ["true","1",3,false];
  this.isTrue(!core.Array.contains(arr2, true));
  this.isTrue(!core.Array.contains(arr2, 1));
  this.isTrue(!core.Array.contains(arr2, "3"));
  this.isTrue(!core.Array.contains(arr2, "false"));

  this.isTrue(core.Array.contains(arr2, "true"));
  this.isTrue(core.Array.contains(arr2, "1"));
  this.isTrue(core.Array.contains(arr2, 3));
  this.isTrue(core.Array.contains(arr2, false));
});

suite.test("every", function() 
{
  this.isTrue(core.Array.every([], function() {}));

  this.isTrue(core.Array.every([2,4,6,8,10,12,14], function(value) {
    return value % 2 == 0;
  }));

  this.isFalse(core.Array.every([2,4,6,9,10,12,14], function(value) {
    return value % 2 == 0;
  }));
});

suite.test("flatten", function() 
{
  this.isEqual(core.Array.flatten([[1], 2, [3]]).toString(), [1,2,3].toString());
  this.isEqual(core.Array.flatten([["a"],[],"b","c"]).toString(), ["a","b","c"].toString());
});

suite.test("filter", function()
{
  this.isEqual(core.Array.filter([0,1,2,3,4,5,6], function(value) {
    return value%2 == 0;
  }).join(","), "0,2,4,6");

  var input = [0,1,2,3,4,5,6];
  var test = this;
  var output = core.Array.filter(input, function(value, index) {
    test.isEqual(value, index);
    return value == index;
  });

  this.isEqual(input.join(","), "0,1,2,3,4,5,6");  
  this.isNotIdentical(input, output);
});

suite.test("forEach", function()
{
  var counter = 0;
  core.Array.forEach([1,2,3], function() {
    counter++;
  });
  this.isEqual(counter, 3);

  var counter = 0;
  var array = [1,2,3];
  var context = {};
  var test = this;

  core.Array.forEach(array, function(value, index, arrayref) {
    test.isIdentical(this, context);
    test.isIdentical(array, arrayref);
    test.isIdentical(index, counter++);
  }, context);
  this.isEqual(counter, 3);  
});

suite.test("fromArguments", function() 
{
  var test = this;

  // join not available on arguments object
  this.raisesException(function()
  {
    (function(a,b,c) {
      test.isEqual(arguments.join("+"), "1+2+3");
    })(1,2,3);
  });

  (function(a,b,c) {
    test.isEqual(core.Array.fromArguments(arguments).join("+"), "1+2+3");
  })(1,2,3);
});

suite.test("insertAt", function() 
{
  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(core.Array.insertAt(arr1, "end"), "end");
  this.isEqual(arr1.join(","), "1,2,3,4,5,6,7,end");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(core.Array.insertAt(arr1, "begin", 0), "begin");
  this.isEqual(arr1.join(","), "begin,1,2,3,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(core.Array.insertAt(arr1, "fromBegin", 3), "fromBegin");
  this.isEqual(arr1.join(","), "1,2,3,fromBegin,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(core.Array.insertAt(arr1, "fromEnd", -3), "fromEnd");
  this.isEqual(arr1.join(","), "1,2,3,4,fromEnd,5,6,7");
});

suite.test("last", function() 
{
  var arr = [1,2,3,4,5];
  this.isEqual(core.Array.last(arr), 5);
});

suite.test("map", function() 
{
  this.isEqual(core.Array.map([1,2,3], function(value) {
    return value * 2;
  }).join(","), [2,4,6].join(","));

  this.isEqual(core.Array.map([1,2,3], function(value, index) {
    return value * index;
  }).join(","), [0,2,6].join(","));

  this.isEqual(core.Array.map([1,2,3], function(value, index, array) {
    return value + array[array.length-1-index];
  }).join(","), [4,4,4].join(","));

  var obj = 
  {
    data : [20,30,40],
    mapper : function(value, index) {
      return value + this.data[index];
    }
  };

  this.isEqual(core.Array.map([2,3,4], obj.mapper, obj).join(","), "22,33,44");
});

suite.test("max", function() 
{
  this.isEqual(core.Array.max([1,4,23,3]), 23);
  this.isEqual(core.Array.max([10,10,10]), 10);
  this.isEqual(core.Array.max([]), -Infinity);
});

suite.test("min", function() 
{
  this.isEqual(core.Array.min([1,4,23,3]), 1);
  this.isEqual(core.Array.min([10,10,10]), 10);
  this.isEqual(core.Array.min([]), Infinity);
});

suite.test("randomize", function() 
{
  var arr1 = [1,4,23,3,4,54,94,23,25,236];
  core.Array.randomize(arr1);
});

suite.test("remove", function() 
{
  var arr = [1,2,3,4,5,6];
  this.isEqual(core.Array.remove(arr, 4), 4);
  this.isEqual(arr.length, 5);
  this.isEqual(core.Array.remove(arr, 4));
  this.isEqual(arr.length, 5);

  var arr = [1,2,3,1,2,3];
  this.isEqual(core.Array.remove(arr, 3), 3);
  this.isEqual(arr.join(","), "1,2,1,2,3");
});

suite.test("removeAt", function() 
{
  var arr = [1,2,3,4,5,6];
  this.isEqual(core.Array.removeAt(arr, 2), 3);
  this.isEqual(core.Array.removeAt(arr, 12));
  this.isEqual(arr.join(","), "1,2,4,5,6");
});

suite.test("removeRange", function() 
{
  var arr = [1,2,3,4,5,6,7,8,9];
  core.Array.removeRange(arr, 1, 1);
  this.isEqual(arr.join(","), "1,3,4,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  core.Array.removeRange(arr, 1, 3);
  this.isEqual(arr.join(","), "1,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  core.Array.removeRange(arr, 1, -3);
  this.isEqual(arr.join(","), "1,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  core.Array.removeRange(arr, -5, -1);
  this.isEqual(arr.join(","), "1,2,3,4");

  // Sparse array
  var arr = [1,,3,4,5,6,7,8,9];
  core.Array.removeRange(arr, -5, -1);
  this.isEqual(arr.join(","), "1,,3,4");
});

suite.test("some", function() 
{
  this.isFalse(core.Array.some([], function() {}));

  this.isTrue(core.Array.some([1,2,3], function(value) {
    return value % 2 == 0;
  }));

  this.isFalse(core.Array.some([1,3,5], function(value) {
    return value % 2 == 0;
  }));
});

suite.test("sum", function() 
{
  this.isEqual(core.Array.sum([1,4,23,3]), 31);
  this.isEqual(core.Array.sum([1,4,23,,,3]), 31);
  this.isEqual(core.Array.sum([]), 0);
});

suite.test("toKeys", function()
{
  this.isEqual(JSON.stringify(core.Array.toKeys(["foo","bar","baz"])), '{"foo":true,"bar":true,"baz":true}');
  this.isEqual(JSON.stringify(core.Array.toKeys(["foo","bar","baz"], 42)), '{"foo":42,"bar":42,"baz":42}');
});
  
suite.test("unique", function() 
{
  var arr = [1,2,3,1,2,3];
  this.isEqual(core.Array.unique(arr).join(","), "1,2,3");

  // null values are treated special
  var arr = [1,2,null,null,2,3];
  this.isEqual(core.Array.unique(arr).join(","), "1,2,,3");

  // selection test
  var arr = [1,"2",3,"1",2,"3"];
  var unique = core.Array.unique(arr);
  this.isEqual(unique.join(","), "1,2,3");
  this.isEqual(typeof unique[0], "number");
  this.isEqual(typeof unique[1], "string");
  this.isEqual(typeof unique[2], "number");
  
  // does not support objects
  var arr = [{},{},{}];
  this.isEqual(core.Array.unique(arr).join(","), "[object Object]");
  
  // but can work with special objects
  var hashCode = 0;
  var Special = function() {
    this.hashCode = hashCode++;
  }
  Special.prototype.toString = function() {
    return "[object Special#" + this.hashCode + "]";
  }
  arr = [new Special, new Special, new Special];
  this.isEqual(core.Array.unique(arr).join(","), "[object Special#0],[object Special#1],[object Special#2]");
});

suite.test("zip", function() 
{
  var merged = core.Array.zip(["a","b","c"], [1,2,3]);
  this.isEqual(JSON.stringify(merged), '{"a":1,"b":2,"c":3}');
});
