/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Utilities to work with HTML form elements
 */
core.Module("core.bom.Form",
{
	/**
	 * {String} Serializes a HTML @form {Element}.
	 */
	serialize: function(form) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isEqual(args.length, 1);
			core.dom.Node.assertIsNode(form);
			core.Assert.isEqual(form.tagName, "FORM");
		}
		
		return Array.prototype.filter.call(form.elements, core.bom.FormItem.isSuccessful).map(core.bom.FormItem.serialize).join("&");
	}
});

