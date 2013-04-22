var suite = new core.testrunner.Suite("Type/String");

suite.test("contains", function() 
{
  this.isTrue(core.String.contains("hello world", "hello"));
  this.isTrue(core.String.contains("hello world", ""));
  this.isTrue(core.String.contains("hello world", " "));
  this.isTrue(!core.String.contains("hello world", 12));
  this.isTrue(!core.String.contains("hello world", "dlrow"));
});

suite.test("hyphenate", function() 
{
  this.isEqual(core.String.hyphenate("backgroundColor"), "background-color");
  this.isEqual(core.String.hyphenate("WebkitTransform"), "-webkit-transform");
  this.isEqual(core.String.hyphenate("ISOString"), "-i-s-o-string");
});

suite.test("repeat", function() 
{
  this.isEqual(core.String.repeat("x", 3), "xxx");
  this.isEqual(core.String.repeat("xyz", 3), "xyzxyzxyz");
  this.isEqual(core.String.repeat("xyz", 0), "");
});
