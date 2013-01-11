var suite = new core.testrunner.Suite("MVC/Model");

suite.test("Empty", function() 
{
  var empty = new core.mvc.model.Model();

  this.isInstance(empty, core.mvc.model.Model);
  core.Interface.assert(empty, core.mvc.model.IModel);

  this.isIdentical(typeof empty.getClientId(), "string");
  this.isIdentical(typeof empty.toJSON(), "object");
  this.isIdentical(empty.toJSON().toString(), "[object Object]");
});

suite.test("Custom", function() 
{
  core.Class("my.test.Model",
  {
    include : [core.mvc.model.Model],

    construct : function(values) {
      core.mvc.model.Model.call(this, values);
    },

    properties :
    {
      textColor : 
      {
        fire : "changeTextColor",
        type : "String",
        nullable : true
      }
    }
  });

  var obj1 = new my.test.Model({textColor: "red"});

  this.isIdentical(obj1.getTextColor(), "red");
  this.isIdentical(obj1.get("textColor"), "red");

  obj1.addListener("changeTextColor", function(evt) 
  {
    this.isIdentical(evt.getValue(), "blue");
    this.isIdentical(evt.getOldValue(), "red");
  }, this);

  this.isIdentical(obj1.setTextColor("blue"), "blue");

}, 5);
