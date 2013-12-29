core.Module("test.Kernel",
{
  boot : function() {
    core.io.Script.load(jasy.Env.getPartUrl("main", "js"));
  }
});
