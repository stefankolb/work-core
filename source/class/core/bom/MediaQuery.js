/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of the Modernizr project
  Copyright Modernizr, http://modernizr.com/, MIT License
==================================================================================================
*/

core.Module("core.bom.MediaQuery",
{
  // adapted from matchMedia polyfill
  // by Scott Jehl and Paul Irish
  // gist.github.com/786768
  test : (function(window)
  {
    var matchMedia = window.matchMedia || window.msMatchMedia;
    if (matchMedia)
    {
      return function(mq) {
        var mql = matchMedia(mq);
        return mql && mql.matches || false;
      };
    }

    return function(mq)
    {
      var result = false;

      core.bom.Style.injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
        result = (window.getComputedStyle ? window.getComputedStyle(node, null) : node.currentStyle)['position'] == 'absolute';
      });

      return result;
    };
  })(window)
});
