var suite = new core.testrunner.Suite("Effect/AnimationFrame");

if (jasy.Env.isSet("runtime", "browser"))
{
  suite.test("Request", function() 
  {
    var test = this;

    core.effect.AnimationFrame.request(function() 
    {
      test.isTrue(true, "always fine");
      test.done();
    });
  }, 1, 1000);

  suite.test("Request and Cancel", function() 
  {
    var test = this;

    var id1 = core.effect.AnimationFrame.request(function() {
      test.failure("Canceled request should not be executed.")
    });

    core.effect.AnimationFrame.cancel(id1);

    var id2 = core.effect.AnimationFrame.request(function() 
    {
      test.isTrue(true, "always fine");
      test.done();
    });    
  }, 1, 1000);  
}

