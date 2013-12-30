/**
 * Kernel class for API Browser to correctly load permutated implementation code.
 */
core.Module("core.apibrowser.Kernel",
{
  boot : function() {
    core.io.Script.load(jasy.Env.getPartUrl("main", "js"));
  }
});

