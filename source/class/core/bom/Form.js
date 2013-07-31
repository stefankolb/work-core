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
			core.Assert.isEqual(arguments.length, 1);
			core.dom.Node.assertIsNode(form);
			core.Assert.isEqual(form.tagName, "FORM");
		}

		var elems = form.elements;
		var result = [];

		for (var i=0, l=elems.length; i<l; i++)
		{
			var elem = elems[i];

			if (core.bom.FormItem.isSuccessful(elem)) {
				result.push(core.bom.FormItem.serialize(elem));
			}
		}

		return result.join("&");
	}
});

