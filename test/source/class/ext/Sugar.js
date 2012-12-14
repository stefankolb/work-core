module("Ext :: Sugar");

/** #require(ext.sugar.Object) */

test("Object.isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  ok(Object.isEmpty({}));
  ok(!Object.isEmpty({toString:null}));
  ok(!Object.isEmpty({toString:null, hello:null, foo:1}));
});

test("Object.values", function() 
{
  var values = Object.values({x:1, y:2, z:3}).sort().join(",");
  equal(values, "1,2,3");
});

test("Object.fromArray", function() 
{
  equal(Object.keys(Object.fromArray(["foo","bar","baz"])).join(","), "foo,bar,baz");
  equal(Object.values(Object.fromArray(["foo","bar","baz"])).join(","), "true,true,true");

  equal(Object.keys(Object.fromArray(["foo","bar","baz"], "hello")).join(","), "foo,bar,baz");
  equal(Object.values(Object.fromArray(["foo","bar","baz"], "hello")).join(","), "hello,hello,hello");
});


/** #require(ext.sugar.Array) */

test("Array.prototype.max", function() 
{
  equal([1,4,23,3].max(), 23);
  equal([10,10,10].max(), 10);
  equal([].max(), -Infinity);
});

test("Array.prototype.min", function() 
{
  equal([1,4,23,3].min(), 1);
  equal([10,10,10].min(), 10);
  equal([].min(), Infinity);
});

test("Array.prototype.sum", function() 
{
  equal([1,4,23,3].sum(), 31);
  equal([1,4,23,,,3].sum(), 31);
  equal([].sum(), 0);
});
  
test("Array.prototype.insertAt", function() 
{
  var arr1 = [1,2,3,4,5,6,7];
  equal(arr1.insertAt("end"), "end");
  equal(arr1.join(","), "1,2,3,4,5,6,7,end");

  var arr1 = [1,2,3,4,5,6,7];
  equal(arr1.insertAt("begin", 0), "begin");
  equal(arr1.join(","), "begin,1,2,3,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  equal(arr1.insertAt("fromBegin", 3), "fromBegin");
  equal(arr1.join(","), "1,2,3,fromBegin,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  equal(arr1.insertAt("fromEnd", -3), "fromEnd");
  equal(arr1.join(","), "1,2,3,4,fromEnd,5,6,7");
});
  
test("Array.prototype.contains", function() 
{
  var arr1 = [1,2,3,5,6,7];
  ok(arr1.contains(3));
  ok(!arr1.contains(4));
  ok(arr1.contains(5));
  
  var arr2 = ["true","1",3,false];
  ok(!arr2.contains(true));
  ok(!arr2.contains(1));
  ok(!arr2.contains("3"));
  ok(!arr2.contains("false"));

  ok(arr2.contains("true"));
  ok(arr2.contains("1"));
  ok(arr2.contains(3));
  ok(arr2.contains(false));
});

test("Array.prototype.clone", function() 
{
  var orig = [1,2,3];
  var clone = orig.clone();
  equal(orig.length, clone.length);
  equal(orig.join(","), clone.join(","));

  var orig = [1,2,,,5];
  var clone = orig.clone();
  equal(orig.length, clone.length);
  equal(orig.join(","), clone.join(","));
});

test("Array.prototype.remove", function() 
{
  var arr = [1,2,3,4,5,6];
  equal(arr.remove(4), 4);
  equal(arr.length, 5);
  equal(arr.remove(4));
  equal(arr.length, 5);

  var arr = [1,2,3,1,2,3];
  equal(arr.remove(3), 3);
  equal(arr.join(","), "1,2,1,2,3");
});

test("Array.prototype.removeAt", function() 
{
  var arr = [1,2,3,4,5,6];
  equal(arr.removeAt(2), 3);
  equal(arr.removeAt(12));
  equal(arr.join(","), "1,2,4,5,6");
});

test("Array.prototype.removeRange", function() 
{
  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 1);
  equal(arr.join(","), "1,3,4,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 3);
  equal(arr.join(","), "1,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, -3);
  equal(arr.join(","), "1,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(-3, -1);
  equal(arr.join(","), "1,2,3,4,5,6");
});

test("Array.prototype.unique", function() 
{
  var arr = [1,2,3,1,2,3];
  equal(arr.unique().join(","), "1,2,3");

  // sparse arrays supported
  var arr = [1,2,,,2,3];
  equal(arr.unique().join(","), "1,2,3");

  // null values are treated special
  var arr = [1,2,null,null,2,3];
  equal(arr.unique().join(","), "1,2,,3");

  // selection test
  var arr = [1,"2",3,"1",2,"3"];
  var unique = arr.unique();
  equal(unique.join(","), "1,2,3");
  equal(typeof unique[0], "number");
  equal(typeof unique[1], "string");
  equal(typeof unique[2], "number");
  
  // does not support objects
  var arr = [{},{},{}];
  equal(arr.unique().join(","), "[object Object]");
  
  // but can work with special objects
  var hashCode = 0;
  var Special = function() {
    this.hashCode = hashCode++;
  }
  Special.prototype.toString = function() {
    return "[object Special#" + this.hashCode + "]";
  }
  arr = [new Special, new Special, new Special];
  equal(arr.unique().join(","), "[object Special#0],[object Special#1],[object Special#2]");
});

test("Array.prototype.at", function() 
{
  var arr = [1,2,3,4,5];
  equal(arr.at(0), 1);
  equal(arr.at(-1), 5);
  equal(arr.at(20));
  equal(arr.at(-20));
});

test("Array.prototype.compact", function() 
{
  var sparse = [1,2,3,,5,,,8];
  equal(sparse.compact().length, 5);

  var undef;
  var sparse = [1,2,3,null,5,,undef,8];
  equal(sparse.compact().length, 7);
  equal(sparse.compact(true).length, 5);
});

test("Array.prototype.flatten", function() 
{
  equal([[1], 2, [3]].flatten().toString(), [1,2,3].toString());
  equal([["a"],[],"b","c"].flatten().toString(), ["a","b","c"].toString());
});

/** #require(ext.sugar.Function) */

asyncTest("Function.prototype.debounce - END", 1, function() 
{
  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = callback.debounce();
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  window.setTimeout(function() {
    equal(counter, 1);
    start();
  }, 200)
});

test("Function.prototype.debounce - ASAP", function() 
{
  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = callback.debounce(100, true);
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  equal(counter, 1);
});

/** #require(ext.sugar.Number) */

test("Number.prototype.pad", function() 
{
  equal((23).pad(2), "23");
  equal((23).pad(4), "0023");
  equal((23).pad(6), "000023");
  equal((0).pad(6), "000000");
});

/** #require(ext.sugar.String) */

test("String.prototype.contains", function() 
{
  ok("hello world".contains("hello"));
  ok("hello world".contains(""));
  ok("hello world".contains(" "));
  ok(!"hello world".contains(12));
  ok(!"hello world".contains("dlrow"));
});

test("String.prototype.hyphenate", function() 
{
  equal("backgroundColor".hyphenate(), "background-color");
  equal("WebkitTransform".hyphenate(), "-webkit-transform");
  equal("ISOString".hyphenate(), "-i-s-o-string");
});

test("String.prototype.repeat", function() 
{
  equal("x".repeat(3), "xxx");
  equal("xyz".repeat(3), "xyzxyzxyz");
  equal("xyz".repeat(0), "");
});

