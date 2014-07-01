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
		var regexp = /([a-z]{2}-[a-z]{2})\;/ig;
		var nav = global.navigator || { };
		var language;
		
		// Let's see if we can get some language information out of the user agent
		if (regexp.test(nav.userAgent)) {
			language = RegExp.$1;
		} else {
			// Check the navigator user language and set default language if necessary
			language = (nav.userLanguage || nav.language || DEFAULT_LANGUAGE).toLowerCase();
		}
		
		if (language) {
			var split = language.indexOf('-');
			language = split > 0 ? language.substring(0, split) : language;
		}
		
		return language || DEFAULT_LANGUAGE;
		
	})(core.Main.getGlobal())
});
