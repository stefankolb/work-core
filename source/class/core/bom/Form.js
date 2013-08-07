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
		var boollike = {};
		var undef;

		for (var i=0, l=elems.length; i<l; i++)
		{
			var item = elems[i];
			var name = item.name;
			var value = core.bom.FormItem.getValue(item);

			// Only keep successful items
			if (core.bom.FormItem.isSuccessful(item)) 
			{
				var stored = result[name];

			  // Always overwrite when it is a list value from e.g. a multi select field
				if (value instanceof Array) {
					result[name] = value;	
				}

				// Overwrite when current value is undefined
			  else if (stored === undef) 
			  {
			  	// Behave differently on whether the key already existed or not:
			  	// Check whether we expect an array return value
			  	// which is true whenever two fields of the same name exist
			  	if (name in result && !core.bom.FormItem.isExplicitSingle(item)) 
			  	{
			  		result[name] = [value];
			  		boollike[name] = false;
			  	}
			  	else
			  	{
			  		result[name] = value;
			  	}
			  }

				// If there is already something stored (e.g. multiple checkboxes with the same name)
				// we simple push to the list of values or create that list from the other value
				else if (stored instanceof Array) 
				{
					stored.push(value);
				}
				else
				{
					result[name] = [stored, value];
					boollike[name] = false;
				}
			}

			// Store undefined for the first value. Mainly for checkboxes
			// where non is enabled and to pass any value/key at all.
			else if (!(name in result))
			{
				result[name] = undef;	
				if (typeof value !== "boolean") {
					boollike[name] = false;
				}
			}

			// If we find the second form item with the same name we
			// automatically translate the value to an array
			else if (result[name] !== undef && (!result[name] instanceof Array))
			{
				result[name] = [result[name]];
			}
		}

		// Automatically translate checkboxes which have a unique name
		// and are not checked and have a truish value to a falsy value
		for (var name in result)
		{
			if (result[name] === undef && boollike[name] !== false) {
				result[name] = false;
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

