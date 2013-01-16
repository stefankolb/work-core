/**
 * Utilities for working with Maps.
 */
core.Module("core.util.Map",
{
  translate : function(map, table)
  {
    var result = {};
    for (var key in map) {
      result[table[key] || key] = map[key];
    }

    return result;
  }
});
