var suite = new core.testrunner.Suite("MVC/View");

suite.test("Empty", function() 
{
  var empty = new core.mvc.View();

  this.isInstance(empty, core.mvc.View);

  this.isNull(empty.getModel());
  this.isNull(empty.getTemplate());
});

suite.test("Constructor Args", function() 
{
  core.Class("TestView",
  {
    include : [core.mvc.View],

    construct : function(properties, renderCallBack) {
      this.renderCallBack = renderCallBack;
      core.mvc.View.call(this, properties);
    },

    members : 
    {
      render : function() {
        this.renderCallBack();
      }
    }
  });

  core.Class("TestModel",
  {
    include : [core.mvc.Model],

    construct : function(values) {
      core.mvc.Model.call(this, values);
    },

    properties : 
    {
      name : {
        type : "String",
      }
    }
  });  

  var model = new TestModel;
  var template = core.template.Compiler.compile("Hello {{name}}");

  var renderCount = 0;
  var test = new TestView({
    model : model,
    template : template
  }, function() {
    renderCount++;
  });

  this.isInstance(test, TestView);
  this.isIdentical(test.getModel(), model);
  this.isIdentical(test.getTemplate(), template);
  
  // Two expected calls - one for model change, one for template change
  this.isIdentical(renderCount, 2);

  test.render();

  // Another render
  this.isIdentical(renderCount, 3);

});

