var suite = new core.testrunner.Suite("Effect :: AnimationFrame");

if (jasy.Env.isSet("runtime", "browser"))
{
  suite.test("requestAnimationFrame", function() 
  {
    var test = this;

    core.Effect.AnimationFrame.request(function() {
      test.isTrue(true, "always fine");
      test.done();
    });
  }, 1, 1000);
}

