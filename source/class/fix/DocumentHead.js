/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Fixes missing `document.head` in older browser engines.
 */
if (jasy.Env.isSet("runtime", "browser"))
{
  (function(doc) 
  {
    if (!doc.head) {
      doc.head = doc.getElementsByTagName('head')[0];
    }
  })(document);  
}
