/** #require(ext.sugar.Object) */
var suite = new core.test.Suite("Ext :: Sugar");

suite.test("Object.isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.ok(Object.isEmpty({}));
  this.ok(!Object.isEmpty({toString:null}));
  this.ok(!Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("Object.values", function() 
{
  var values = Object.values({x:1, y:2, z:3}).sort().join(",");
  this.equal(values, "1,2,3");
});

suite.test("Object.fromArray", function() 
{
  this.equal(Object.keys(Object.fromArray(["foo","bar","baz"])).join(","), "foo,bar,baz");
  this.equal(Object.values(Object.fromArray(["foo","bar","baz"])).join(","), "true,true,true");

  this.equal(Object.keys(Object.fromArray(["foo","bar","baz"], "hello")).join(","), "foo,bar,baz");
  this.equal(Object.values(Object.fromArray(["foo","bar","baz"], "hello")).join(","), "hello,hello,hello");
});


/** #require(ext.sugar.Array) */

suite.test("Array.prototype.max", function() 
{
  this.equal([1,4,23,3].max(), 23);
  this.equal([10,10,10].max(), 10);
  this.equal([].max(), -Infinity);
});

suite.test("Array.prototype.min", function() 
{
  this.equal([1,4,23,3].min(), 1);
  this.equal([10,10,10].min(), 10);
  this.equal([].min(), Infinity);
});

suite.test("Array.prototype.sum", function() 
{
  this.equal([1,4,23,3].sum(), 31);
  this.equal([1,4,23,,,3].sum(), 31);
  this.equal([].sum(), 0);
});
  
suite.test("Array.prototype.insertAt", function() 
{
  var arr1 = [1,2,3,4,5,6,7];
  this.equal(arr1.insertAt("end"), "end");
  this.equal(arr1.join(","), "1,2,3,4,5,6,7,end");

  var arr1 = [1,2,3,4,5,6,7];
  this.equal(arr1.insertAt("begin", 0), "begin");
  this.equal(arr1.join(","), "begin,1,2,3,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.equal(arr1.insertAt("fromBegin", 3), "fromBegin");
  this.equal(arr1.join(","), "1,2,3,fromBegin,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.equal(arr1.insertAt("fromEnd", -3), "fromEnd");
  this.equal(arr1.join(","), "1,2,3,4,fromEnd,5,6,7");
});
  
suite.test("Array.prototype.contains", function() 
{
  var arr1 = [1,2,3,5,6,7];
  this.ok(arr1.contains(3));
  this.ok(!arr1.contains(4));
  this.ok(arr1.contains(5));
  
  var arr2 = ["true","1",3,false];
  this.ok(!arr2.contains(true));
  this.ok(!arr2.contains(1));
  this.ok(!arr2.contains("3"));
  this.ok(!arr2.contains("false"));

  this.ok(arr2.contains("true"));
  this.ok(arr2.contains("1"));
  this.ok(arr2.contains(3));
  this.ok(arr2.contains(false));
});

suite.test("Array.prototype.clone", function() 
{
  var orig = [1,2,3];
  var clone = orig.clone();
  this.equal(orig.length, clone.length);
  this.equal(orig.join(","), clone.join(","));

  var orig = [1,2,,,5];
  var clone = orig.clone();
  this.equal(orig.length, clone.length);
  this.equal(orig.join(","), clone.join(","));
});

suite.test("Array.prototype.remove", function() 
{
  var arr = [1,2,3,4,5,6];
  this.equal(arr.remove(4), 4);
  this.equal(arr.length, 5);
  this.equal(arr.remove(4));
  this.equal(arr.length, 5);

  var arr = [1,2,3,1,2,3];
  this.equal(arr.remove(3), 3);
  this.equal(arr.join(","), "1,2,1,2,3");
});

suite.test("Array.prototype.removeAt", function() 
{
  var arr = [1,2,3,4,5,6];
  this.equal(arr.removeAt(2), 3);
  this.equal(arr.removeAt(12));
  this.equal(arr.join(","), "1,2,4,5,6");
});

suite.test("Array.prototype.removeRange", function() 
{
  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 1);
  this.equal(arr.join(","), "1,3,4,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 3);
  this.equal(arr.join(","), "1,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, -3);
  this.equal(arr.join(","), "1,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(-3, -1);
  this.equal(arr.join(","), "1,2,3,4,5,6");
});

suite.test("Array.prototype.unique", function() 
{
  var arr = [1,2,3,1,2,3];
  this.equal(arr.unique().join(","), "1,2,3");

  // sparse arrays supported
  var arr = [1,2,,,2,3];
  this.equal(arr.unique().join(","), "1,2,3");

  // null values are treated special
  var arr = [1,2,null,null,2,3];
  this.equal(arr.unique().join(","), "1,2,,3");

  // selection test
  var arr = [1,"2",3,"1",2,"3"];
  var unique = arr.unique();
  this.equal(unique.join(","), "1,2,3");
  this.equal(typeof unique[0], "number");
  this.equal(typeof unique[1], "string");
  this.equal(typeof unique[2], "number");
  
  // does not support objects
  var arr = [{},{},{}];
  this.equal(arr.unique().join(","), "[object Object]");
  
  // but can work with special objects
  var hashCode = 0;
  var Special = function() {
    this.hashCode = hashCode++;
  }
  Special.prototype.toString = function() {
    return "[object Special#" + this.hashCode + "]";
  }
  arr = [new Special, new Special, new Special];
  this.equal(arr.unique().join(","), "[object Special#0],[object Special#1],[object Special#2]");
});

suite.test("Array.prototype.at", function() 
{
  var arr = [1,2,3,4,5];
  this.equal(arr.at(0), 1);
  this.equal(arr.at(-1), 5);
  this.equal(arr.at(20));
  this.equal(arr.at(-20));
});

suite.test("Array.prototype.compact", function() 
{
  var sparse = [1,2,3,,5,,,8];
  this.equal(sparse.compact().length, 5);

  var undef;
  var sparse = [1,2,3,null,5,,undef,8];
  this.equal(sparse.compact().length, 7);
  this.equal(sparse.compact(true).length, 5);
});

suite.test("Array.prototype.flatten", function() 
{
  this.equal([[1], 2, [3]].flatten().toString(), [1,2,3].toString());
  this.equal([["a"],[],"b","c"].flatten().toString(), ["a","b","c"].toString());
});

/** #require(ext.sugar.Function) */

suite.test("Function.prototype.debounce - END", function() 
{
  var test = this;

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
  
  setTimeout(function() {
    test.equal(counter, 1);
    test.done();
  }, 200)
}, 1000);

suite.test("Function.prototype.debounce - ASAP", function() 
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
  
  this.equal(counter, 1);
});

/** #require(ext.sugar.Number) */

suite.test("Number.prototype.pad", function() 
{
  this.equal((23).pad(2), "23");
  this.equal((23).pad(4), "0023");
  this.equal((23).pad(6), "000023");
  this.equal((0).pad(6), "000000");
});

/** #require(ext.sugar.String) */

suite.test("String.prototype.contains", function() 
{
  this.ok("hello world".contains("hello"));
  this.ok("hello world".contains(""));
  this.ok("hello world".contains(" "));
  this.ok(!"hello world".contains(12));
  this.ok(!"hello world".contains("dlrow"));
});

suite.test("String.prototype.hyphenate", function() 
{
  this.equal("backgroundColor".hyphenate(), "background-color");
  this.equal("WebkitTransform".hyphenate(), "-webkit-transform");
  this.equal("ISOString".hyphenate(), "-i-s-o-string");
});

suite.test("String.prototype.repeat", function() 
{
  this.equal("x".repeat(3), "xxx");
  this.equal("xyz".repeat(3), "xyzxyzxyz");
  this.equal("xyz".repeat(0), "");
});

