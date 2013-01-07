var suite = new core.testrunner.Suite("View");

suite.test("Empty", function() 
{
  var empty = new core.mvc.View();

  this.instance(empty, core.mvc.View);

  this.not(empty.getModel());
  this.not(empty.getTemplate());
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

  this.instance(test, TestView);
  this.identical(test.getModel(), model);
  this.identical(test.getTemplate(), template);
  
  // Two expected calls - one for model change, one for template change
  this.identical(renderCount, 2);

  test.render();

  // Another render
  this.identical(renderCount, 3);

});

