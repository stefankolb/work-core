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
	 * {Map} Serializes a HTML @form {Element}.
	 */	
	getData : function(form)
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isEqual(arguments.length, 1);
			core.dom.Node.assertIsNode(form);
			core.Assert.isEqual(form.tagName, "FORM");
		}

		var elems = form.elements;
		var result = {};
		var undef;

		for (var i=0, l=elems.length; i<l; i++)
		{
			var item = elems[i];
			var name = item.name;

			if (core.bom.FormItem.isSuccessful(item)) 
			{
				var value = core.bom.FormItem.getValue(item);
				var stored = result[name];

				if (stored !== undef) 
				{
					if (stored instanceof Array) {
						stored.push(value);
					} else {
						result[name] = [stored, value];
					}
				}
				else
				{
					result[name]	= value;	
				}
			}
			else if (!(name in result))
			{
				// Relevant for checkboxes which are about enabling a specific flag
				// This way these are available as key only and can be passed to 
				// the property system etc.
				result[name] = undef;
			}
		}

		return result;
	},


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

