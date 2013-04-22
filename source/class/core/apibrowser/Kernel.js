/**
 * Kernel class for API Browser to correctly load permutated implementation code.
 */
core.Module("core.apibrowser.Kernel",
{
  init : function() {
    core.io.Script.load("script/apibrowser-" + jasy.Env.getChecksum() + ".js");
  }
});
