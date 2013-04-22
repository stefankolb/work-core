/* 
==================================================================================================
  Core - JavaScript Foundation 
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on Remy Sharp's HTML5 Enabling Script:
  http://remysharp.com/2009/01/07/html5-enabling-script/
==================================================================================================
*/

"use strict";

/**
 * Adds HTML5 tag support to Internet Explorer 
 */
if (jasy.Env.isSet("runtime", "browser"))
{
  (function(doc) 
  {
		var tags = 'abbr article aside audio canvas details figcaption figure footer header hgroup main mark meter nav output progress section summary time video';
		tags.replace(/\w+/g, function(tagName) {
			doc.createElement(tagName); 
		});
  })(document);
}
