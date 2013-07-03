/**
 * Kernel class of application $${name} based on $${origin.name}.
 *
 * Auto created by Jasy $${jasy.version}.
 */
core.Module("$${name}.Kernel",
{
  boot : function() {
    core.io.Script.load("script/$${name}-" + jasy.Env.getId() + ".js");
  }
});
