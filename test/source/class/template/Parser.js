var suite = new core.testrunner.Suite("Template/Parser");

suite.test("Parser", function() 
{
  var text = "{{^check}}No{{/check}}{{#check}}Yes{{/check}}{{foo}}{{=markup}}{{>deep1}}{{_label1}}";
  var tree = core.template.Parser.parse(text);

  this.isEqual(tree[0].tag, "^");
  this.isEqual(tree[0].name, "check");
  this.isEqual(tree[1].tag, "#");
  this.isEqual(tree[1].name, "check");
  this.isEqual(tree[2].tag, "$");
  this.isEqual(tree[2].name, "foo");
  this.isEqual(tree[3].tag, "=");
  this.isEqual(tree[3].name, "markup");
  this.isEqual(tree[4].tag, ">");
  this.isEqual(tree[4].name, "deep1");
  this.isEqual(tree[5].tag, "_");
  this.isEqual(tree[5].name, "label1");
});

