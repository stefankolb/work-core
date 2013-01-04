var suite = new core.testrunner.Suite("View");

suite.test("Empty", function() 
{
  var empty = new core.mvc.View();

  this.instance(empty, core.mvc.View);

});

