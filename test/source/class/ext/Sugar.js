var suite = new core.testrunner.Suite("Ext :: Sugar");

suite.test("core.Object.isEmpty", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.isTrue(core.Object.isEmpty({}));
  this.isTrue(!core.Object.isEmpty({toString:null}));
  this.isTrue(!core.Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("core.Object.values", function() 
{
  var values = core.Object.values({x:1, y:2, z:3}).sort().join(",");
  this.isEqual(values, "1,2,3");
});

suite.test("core.Object.fromArray", function() 
{
  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"])).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"])).join(","), "true,true,true");

  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "hello,hello,hello");
});


suite.test("core.Array.max", function() 
{
  this.isEqual(core.Array.max([1,4,23,3]), 23);
  this.isEqual(core.Array.max([10,10,10]), 10);
  this.isEqual(core.Array.max([]), -Infinity);
});

suite.test("core.Array.min", function() 
{
  this.isEqual(core.Array.min([1,4,23,3]), 1);
  this.isEqual(core.Array.min([10,10,10]), 10);
  this.isEqual(core.Array.min([]), Infinity);
});

suite.test("core.Array.sum", function() 
{
  this.isEqual(core.Array.sum([1,4,23,3]), 31);
  this.isEqual(core.Array.sum([1,4,23,,,3]), 31);
  this.isEqual(core.Array.sum([]), 0);
});
  
suite.test("core.Array.insertAt", function() 
{
  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(arr1.insertAt("end"), "end");
  this.isEqual(arr1.join(","), "1,2,3,4,5,6,7,end");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(arr1.insertAt("begin", 0), "begin");
  this.isEqual(arr1.join(","), "begin,1,2,3,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(arr1.insertAt("fromBegin", 3), "fromBegin");
  this.isEqual(arr1.join(","), "1,2,3,fromBegin,4,5,6,7");

  var arr1 = [1,2,3,4,5,6,7];
  this.isEqual(arr1.insertAt("fromEnd", -3), "fromEnd");
  this.isEqual(arr1.join(","), "1,2,3,4,fromEnd,5,6,7");
});
  
suite.test("core.Array.contains", function() 
{
  var arr1 = [1,2,3,5,6,7];
  this.isTrue(arr1.contains(3));
  this.isTrue(!arr1.contains(4));
  this.isTrue(arr1.contains(5));
  
  var arr2 = ["true","1",3,false];
  this.isTrue(!arr2.contains(true));
  this.isTrue(!arr2.contains(1));
  this.isTrue(!arr2.contains("3"));
  this.isTrue(!arr2.contains("false"));

  this.isTrue(arr2.contains("true"));
  this.isTrue(arr2.contains("1"));
  this.isTrue(arr2.contains(3));
  this.isTrue(arr2.contains(false));
});

suite.test("Array.prototype.clone", function() 
{
  var orig = [1,2,3];
  var clone = orig.clone();
  this.isEqual(orig.length, clone.length);
  this.isEqual(orig.join(","), clone.join(","));

  var orig = [1,2,,,5];
  var clone = orig.clone();
  this.isEqual(orig.length, clone.length);
  this.isEqual(orig.join(","), clone.join(","));
});

suite.test("Array.prototype.remove", function() 
{
  var arr = [1,2,3,4,5,6];
  this.isEqual(arr.remove(4), 4);
  this.isEqual(arr.length, 5);
  this.isEqual(arr.remove(4));
  this.isEqual(arr.length, 5);

  var arr = [1,2,3,1,2,3];
  this.isEqual(arr.remove(3), 3);
  this.isEqual(arr.join(","), "1,2,1,2,3");
});

suite.test("Array.prototype.removeAt", function() 
{
  var arr = [1,2,3,4,5,6];
  this.isEqual(arr.removeAt(2), 3);
  this.isEqual(arr.removeAt(12));
  this.isEqual(arr.join(","), "1,2,4,5,6");
});

suite.test("Array.prototype.removeRange", function() 
{
  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 1);
  this.isEqual(arr.join(","), "1,3,4,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, 3);
  this.isEqual(arr.join(","), "1,5,6,7,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(1, -3);
  this.isEqual(arr.join(","), "1,8,9");

  var arr = [1,2,3,4,5,6,7,8,9];
  arr.removeRange(-3, -1);
  this.isEqual(arr.join(","), "1,2,3,4,5,6");
});

suite.test("Array.prototype.unique", function() 
{
  var arr = [1,2,3,1,2,3];
  this.isEqual(arr.unique().join(","), "1,2,3");

  // sparse arrays supported
  var arr = [1,2,,,2,3];
  this.isEqual(arr.unique().join(","), "1,2,3");

  // null values are treated special
  var arr = [1,2,null,null,2,3];
  this.isEqual(arr.unique().join(","), "1,2,,3");

  // selection test
  var arr = [1,"2",3,"1",2,"3"];
  var unique = arr.unique();
  this.isEqual(unique.join(","), "1,2,3");
  this.isEqual(typeof unique[0], "number");
  this.isEqual(typeof unique[1], "string");
  this.isEqual(typeof unique[2], "number");
  
  // does not support objects
  var arr = [{},{},{}];
  this.isEqual(arr.unique().join(","), "[object Object]");
  
  // but can work with special objects
  var hashCode = 0;
  var Special = function() {
    this.hashCode = hashCode++;
  }
  Special.prototype.toString = function() {
    return "[object Special#" + this.hashCode + "]";
  }
  arr = [new Special, new Special, new Special];
  this.isEqual(arr.unique().join(","), "[object Special#0],[object Special#1],[object Special#2]");
});

suite.test("Array.prototype.at", function() 
{
  var arr = [1,2,3,4,5];
  this.isEqual(arr.at(0), 1);
  this.isEqual(arr.at(-1), 5);
  this.isEqual(arr.at(20));
  this.isEqual(arr.at(-20));
});

suite.test("Array.prototype.compact", function() 
{
  var sparse = [1,2,3,,5,,,8];
  this.isEqual(sparse.compact().length, 5);

  var undef;
  var sparse = [1,2,3,null,5,,undef,8];
  this.isEqual(sparse.compact().length, 7);
  this.isEqual(sparse.compact(true).length, 5);
});

suite.test("Array.prototype.flatten", function() 
{
  this.isEqual([[1], 2, [3]].flatten().toString(), [1,2,3].toString());
  this.isEqual([["a"],[],"b","c"].flatten().toString(), ["a","b","c"].toString());
});

suite.test("core.Function.debounce - END", function() 
{
  var test = this;

  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = core.Function.debounce(callback);
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  setTimeout(function() {
    test.isEqual(counter, 1);
    test.done();
  }, 200)
}, 1, 1000);

suite.test("core.Function.debounce - ASAP", function() 
{
  var counter = 0;
  var callback = function() {
    counter++;
  };
  
  var debounced = core.Function.debounce(callback, 100, true);
  debounced();
  debounced();
  debounced();
  debounced();
  debounced();
  
  this.isEqual(counter, 1);
});

suite.test("Number.prototype.pad", function() 
{
  this.isEqual((23).pad(2), "23");
  this.isEqual((23).pad(4), "0023");
  this.isEqual((23).pad(6), "000023");
  this.isEqual((0).pad(6), "000000");
});

suite.test("core.String.contains()", function() 
{
  this.isTrue(core.String.contains("hello world", "hello"));
  this.isTrue(core.String.contains("hello world", ""));
  this.isTrue(core.String.contains("hello world", " "));
  this.isTrue(!core.String.contains("hello world", 12));
  this.isTrue(!core.String.contains("hello world", "dlrow"));
});

suite.test("core.String.hyphenate()", function() 
{
  this.isEqual(core.String.hyphenate("backgroundColor"), "background-color");
  this.isEqual(core.String.hyphenate("WebkitTransform"), "-webkit-transform");
  this.isEqual(core.String.hyphenate("ISOString"), "-i-s-o-string");
});

suite.test("core.String.repeat()", function() 
{
  this.isEqual(core.String.repeat("x", 3), "xxx");
  this.isEqual(core.String.repeat("xyz", 3), "xyzxyzxyz");
  this.isEqual(core.String.repeat("xyz", 0), "");
});

