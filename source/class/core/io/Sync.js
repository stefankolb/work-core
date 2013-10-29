/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function()
{
  var doc = document;

  var replaceFields = function(inputString) {
    return inputString.replace("%checksum%", jasy.Env.CHECKSUM);
  };

  core.Module("core.io.Sync",
  {
    loadStyleSheet : function(assetId) {
      doc.write("<link rel='stylesheet' href='" + jasy.Asset.toUri(assetId) + "'/>");
    },

    loadScript : function(scriptId) {
      doc.write("<script src='" + replaceFields(scriptId) + "'></script>")
    }
  });
})();
