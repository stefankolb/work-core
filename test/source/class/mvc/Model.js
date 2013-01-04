var suite = new core.testrunner.Suite("Model");

suite.test("Empty", function() 
{
  var empty = new core.mvc.Model();

  this.identical(typeof empty.id, "string");
  this.identical(typeof empty.getId(), "string");
  this.identical(typeof empty.toJSON(), "object");
  this.identical(empty.toJSON().toString(), "[object Object]");
});

suite.test("Custom", function() 
{
  core.Class("my.test.Model",
  {
    include : [core.mvc.Model],

    properties :
    {
      textColor : 
      {
        fire : "changeTextColor",
        check : "String",
        nullable : true
      },

      backgroundColor : 
      {
        fire : "changeBackgroundColor",
        check : "String",
        nullable : true
      }
    }
  });

  var obj1 = new my.test.Model({textColor: "red"});
  this.identical(obj1.getTextColor(), "red");
  this.identical(obj1.get("textColor"), "red");
  this.identical(obj1.get("text-color"), "red");


})
