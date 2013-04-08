(function(global, undef) 
{
  var json = global.JSON;
  if (!json) {
    return;
  }

  var stringifyOrig = json.stringify;

  // Fix Safari issue throwing errors when "undefined" is passed in
  try
  {
    json.stringify();
  }
  catch(ex) 
  {
    json.stringify = function(value) {
      return value === undef ? value : stringifyOrig.apply(json, arguments);
    };
  }
})(core.Main.getGlobal());
