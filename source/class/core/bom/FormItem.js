/*
==================================================================================================
	Core - JavaScript Foundation
	Copyright 2010-2012 Zynga Inc.
	Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Collection of serialization methods for form items
 */
core.Module("core.bom.FormItem",
{
	/**
	 * {Boolean} Returns whether the form @item {Element} is successful (should be submitted to the server)
	 */
	isSuccessful: function(item)
	{
		if (jasy.Env.isSet("debug"))
		{
			core.Assert.isEqual(arguments.length, 1);
			core.dom.Node.assertIsNode(item);
		}

		if (!item.name || item.disabled) {
			return false;
		}

		switch (item.type)
		{
			case "button":
			case "reset":
				return false;

			case "radio":
			case "checkbox":
				return item.checked;

			case "image":
			case "submit":
				return item == (item.ownerDocument || item.document).activeElement;
		}

		return true;
	},


	/**
	 * {String} Finds a label for the given form @item {Element} in the
	 * given @root {Element?document} to be shown in e.g. error messages.
	 */
	getLabel : function(item, root)
	{
		if (!root) {
			root = document.body;
		}

		// Find matching label
		if (item.id)
		{
			var label = root.querySelector("label[for=" + item.id + "]");
			if (label)
			{
				label = label.innerText;

				if (label)
				{
					// Strip marker for required field
					if (core.String.endsWith(label, "*")) {
						label = label.slice(0, label.length-1);
					}

					return label;
				}
			}
		}

		var label = item.getAttribute("data-label");
		return label || item.placeholder || item.name || null;
	},


	/**
	 * {String} Returns the value of the given form @item {Element}.
	 */
	getValue : function(item)
	{
		if (jasy.Env.isSet("debug"))
		{
			core.Assert.isEqual(arguments.length, 1);
			core.dom.Node.assertIsNode(item);
		}

		if (item.tagName == "SELECT")
		{
			// Inspired by jQuery
			var index = item.selectedIndex;
			var options = item.options;
			var one = item.type === "select-one" || index < 0;
			var max = one ? index + 1 : options.length;
			var values = one ? null : [];
			var i = index < 0 ? max : one ? index : 0;

			for (; i<max; i++)
			{
				var option = options[i];

				// Ignore disabled options
				if (option.disabled) {
					continue;
				}

				// Ignore options which are in disabled optgroups
				var parent = option.parentNode;
				if (parent.disabled && parent.tagName == "OPTGROUP") {
					continue;
				}

				var value = option.value;

				if (one) {
					return value;
				} else {
					values.push(value);
				}
			}

			return values;
		}
		else
		{
			return core.String.interpret(item.value || item.text);
		}
	},


	/**
	 * {Boolean} Return whether from @item {Element} there is only exactly one value storable.
	 */
	isExplicitSingle : function(item)
	{
		// Currently only true for radio fields where native behavior actually prevents
		// selecting two radio buttons with the same name. Other fields like text fields
		// and even select fields are all serialized and added the result.
		return item.type == "radio";
	},


	/**
	 * {String} Returns the serialized representation of the given form @item {Element}.
	 */
	serialize: function(item)
	{
		if (jasy.Env.isSet("debug"))
		{
			core.Assert.isEqual(arguments.length, 1);
			core.dom.Node.assertIsNode(item);
			core.Assert.isType(item.name, "String");
		}

		var name = encodeURIComponent(item.name);
		var value = this.getValue(item);

		// Support for select boxes with multiple values
		if (value instanceof Array)
		{
			var result = [];
			for (var i=0, l=value.length; i<l; i++) {
				result.push(name + "=" + encodeURIComponent(value[i]));
			}

			return result.join("&");
		}

		// Or everything else
		else
		{
			return name + "=" + encodeURIComponent(value);
		}
	}
});