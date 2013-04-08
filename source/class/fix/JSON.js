(function(global, undef) 
{
  var json = global.JSON;
  if (!json) {
    return;
  }

  var parseOrig = json.parse;

  // Fix Safari issue throwing errors when "undefined" is passed in
  try
  {
    json.parse();
  }
  catch(ex) 
  {
    json.parse = function(value) {
      return value === undef ? value : parseOrig(value);
    };
  }

})(core.Main.getGlobal());
