var suite = new core.testrunner.Suite("Ext :: Sugar");

suite.test("core.Object.isEmpty()", function() 
{
  // toString etc. are special in IE because these are built-in keys
  this.isTrue(core.Object.isEmpty({}));
  this.isTrue(!core.Object.isEmpty({toString:null}));
  this.isTrue(!core.Object.isEmpty({toString:null, hello:null, foo:1}));
});

suite.test("core.Object.values()", function() 
{
  var values = core.Object.values({x:1, y:2, z:3}).sort().join(",");
  this.isEqual(values, "1,2,3");
});

suite.test("core.Object.fromArray()", function() 
{
  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"])).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"])).join(","), "true,true,true");

  this.isEqual(core.Object.keys(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "foo,bar,baz");
  this.isEqual(core.Object.values(core.Object.fromArray(["foo","bar","baz"], "hello")).join(","), "hello,hello,hello");
});


suite.test("core.Array.max()", function() 
{
  this.isEqual(core.Array.max([1,4,23,3]), 23);
  this.isEqual(core.Array.max([10,10,10]), 10);
  this.isEqual(core.Array.max([]), -Infinity);
});

suite.test("core.Array.min()", function() 
{
  this.isEqual(core.Array.min([1,4,23,3]), 1);
  this.isEqual(core.Array.min([10,10,10]), 10);
  this.isEqual(core.Array.min([]), Infinity);
});

suite.test("core.Array.sum()", function() 
{
  this.isEqual(core.Array.sum([1,4,23,3]), 31);
  this.isEqual(core.Array.sum([1,4,23,,,3]), 31);
  this.isEqual(core.Array.sum([]), 0);
});
  
suite.test("core.Array.insertAt()", function() 
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
  
suite.test("core.Array.contains()", function() 
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

suite.test("core.Array.clone()", function() 
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

suite.test("core.Array.remove()", function() 
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

suite.test("core.Array.removeAt()", function() 
{
  var arr = [1,2,3,4,5,6];
  this.isEqual(core.Array.removeAt(arr, 2), 3);
  this.isEqual(core.Array.removeAt(arr, 12));
  this.isEqual(arr.join(","), "1,2,4,5,6");
});

suite.test("core.Array.removeRange()", function() 
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
  core.Array.removeRange(arr, -3, -1);
  this.isEqual(arr.join(","), "1,2,3,4,5,6");
});

suite.test("core.Array.unique()", function() 
{
  var arr = [1,2,3,1,2,3];
  this.isEqual(core.Array.unique(arr).join(","), "1,2,3");

  // sparse arrays supported
  var arr = [1,2,,,2,3];
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

suite.test("core.Array.at()", function() 
{
  var arr = [1,2,3,4,5];
  this.isEqual(core.Array.at(arr, 0), 1);
  this.isEqual(core.Array.at(arr, -1), 5);
  this.isEqual(core.Array.at(arr, 20));
  this.isEqual(core.Array.at(arr, -20));
});

suite.test("core.Array.compact()", function() 
{
  var sparse = [1,2,3,,5,,,8];
  this.isEqual(core.Array.compact(sparse).length, 5);

  var undef;
  var sparse = [1,2,3,null,5,,undef,8];
  this.isEqual(core.Array.compact(sparse).length, 7);
  this.isEqual(core.Array.compact(sparse, true).length, 5);
});

suite.test("core.Array.flatten()", function() 
{
  this.isEqual(core.Array.flatten([[1], 2, [3]]).toString(), [1,2,3].toString());
  this.isEqual(core.Array.flatten([["a"],[],"b","c"]).toString(), ["a","b","c"].toString());
});

suite.test("core.Function.debounce() - END", function() 
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

suite.test("core.Function.debounce() - ASAP", function() 
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

suite.test("core.Number.pad()", function() 
{
  this.isEqual(core.Number.pad(23, 2), "23");
  this.isEqual(core.Number.pad(23, 4), "0023");
  this.isEqual(core.Number.pad(23, 6), "000023");
  this.isEqual(core.Number.pad(0, 6), "000000");
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

