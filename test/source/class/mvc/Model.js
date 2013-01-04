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

    construct : function(values) {
      core.mvc.Model.call(this, values);
    },

    properties :
    {
      textColor : 
      {
        fire : "changeTextColor",
        type : "String",
        nullable : true
      },

      backgroundColor : 
      {
        fire : "changeBackgroundColor",
        type : "String",
        nullable : true
      }
    }
  });

  var obj1 = new my.test.Model({textColor: "red"});
  this.identical(obj1.getTextColor(), "red");
  this.identical(obj1.get("textColor"), "red");

  obj1.addListener("changeTextColor", function(evt) 
  {
    this.identical(evt.getValue(), "blue");
    this.identical(evt.getOldValue(), "red");
  }, this);

  this.identical(obj1.setTextColor("blue"), "blue");


}, 5);
