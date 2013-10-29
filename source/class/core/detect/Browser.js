/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(global, RegExp)
{
  if (jasy.Env.isSet("runtime", "native")) {
    var agent = "native";
  } else {
    var agent = navigator.userAgent.toLowerCase();
  }

  var name = jasy.Env.getValue("engine");
  var version = null;
  var mobile = false;

  if (jasy.Env.isSet("engine", "trident"))
  {
    if (/(msie) ([0-9.]+)/.exec(agent))
    {
      name = "ie";
      version = RegExp.$2;
    }
  }
  else if (jasy.Env.isSet("engine", "gecko"))
  {
    if (/(firefox)\/([0-9.]+)/.exec(agent))
    {
      name = RegExp.$1;
      version = RegExp.$2;
    }
  }
  else if (jasy.Env.isSet("engine", "webkit"))
  {
    // Behavior test first (differences between JS engines V8 vs. Nitro)
    if (!/\n{2,}/.test(Function()) && /version\/([0-9.]+)/.exec(agent))
    {
      name = "safari";
      version = RegExp.$1;

      if (agent.indexOf("mobile/") != -1) {
        mobile = true;
      }
    }
    else if ((global.chrome || global.chromium) && (/opr\/([0-9.]+)/.exec(agent) || /(chrome)\/([0-9.]+)/.exec(agent)))
    {
      if (RegExp.$2)
      {
        name = "chrome";
        version = RegExp.$2;
      }
      else
      {
        name = "opera";
        version = RegExp.$1;
      }

      if (agent.indexOf("mobile safari") != -1) {
        mobile = true;
      }
    }
    else if (agent == "native")
    {
      name = "nodejs";
    }
    else if (agent.indexOf("linux") != 1 && /(android) ([0-9.]+)/.exec(agent))
    {
      name = RegExp.$1;
      version = RegExp.$2;
      mobile = true;
    }
  }
  else if (jasy.Env.isSet("engine", "presto") && (/version\/([0-9.]+)/.exec(agent) || /opera ([0-9.]+)/.exec(agent)))
  {
    name = "opera";
    version = RegExp.$1;
  }

  var value = name;
  var major = null;

  if (version != null && version != "")
  {
    major = parseInt(version || "", 10);

    if (mobile) {
      value += " mobile";
    }

    value += " " + major;
  }


  /**
   * Browser version info
   */
  core.Module("core.detect.Browser",
  {
    VALUE : value,
    VERSION : major,
    FULLVERSION : version,
    NAME : name,
    MOBILE : true
  });
})(core.Main.getGlobal(), RegExp);
