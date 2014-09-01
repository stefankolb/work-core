/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Detects browser language settings
 */
core.Module("core.detect.Locale",
{
	/**
	 * {=String} Locale string as configured by the user e.g. `de_AT`, `es_ES` or short like `de`
	 */
	VALUE : (function(global)
	{

    var DEFAULT_LANGUAGE = 'de';
    var regexp = /(([a-z]{2})-([a-z]{2})?)\;?/ig;
    var nav = global.navigator || { };
    var language;

    // HACK [start]
    // We need boekhandelbe to always be in dutch
    var qs = global.location.search;
    if (qs.indexOf('partner=60') > -1 ||
      qs.indexOf('partner=boekhandel') > -1 ||
      qs.indexOf('partner=boekhandelbe') > -1 ||
      (global.sessionStorage && global.sessionStorage.getItem('master') === 'boekhandelbe')) {
      return 'nl';
    }
    // [HACK] end

    // Let's see if we can get some language information out of the user agent
    if (regexp.test(nav.userAgent)) {
      language = RegExp.$2;
    } else {
      // Check the navigator user language and set default language if necessary
      language = (nav.userLanguage || nav.language || DEFAULT_LANGUAGE).toLowerCase();
    }

    return language || DEFAULT_LANGUAGE;
		
	})(core.Main.getGlobal())
});
