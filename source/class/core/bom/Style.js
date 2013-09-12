/*
==================================================================================================
	Core - JavaScript Foundation
	Copyright 2010-2012 Zynga Inc.
	Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(document, undef) 
{
	/** Caches CSS property names to browser specific names. Can be used as a fast lookup alternative to {#property}. */
	var nameCache = {};

	var helperElem = document.createElement('div');
	var helperStyle = helperElem.style;


	// Following spec is to expose vendor-specific style properties as:
	//   elem.style.WebkitBorderRadius
	// and the following would be incorrect:
	//   elem.style.webkitBorderRadius

	// Webkit ghosts their properties in lowercase but Opera & Moz do not.
	// Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
	//   erik.eae.net/archives/2008/03/10/21.48.10/
	
	var vendorPrefix = jasy.Env.select("engine", 
	{
		trident: 'ms',
		gecko: 'Moz',
		webkit: 'Webkit',
		presto: 'O'
	});


	/**
	 * {String} Returns the supported property (e.g. `WebkitTransform`) of the given standard CSS property 
	 * @name {String} like `transform`. Returns `null` when the property is not supported.
	 */
	var getProperty = function(name) 
	{
		// Fast path, real native property
		if (name in helperStyle) {
			return name;
		}

		// Fixed name already cached?
		var fixedName = nameCache[name];
		if (fixedName !== undef) {
			return fixedName;
		}

		// Find vendor name
		var vendorName = vendorPrefix + name.charAt(0).toUpperCase() + name.slice(1);
		if (vendorName in helperStyle) {
			return (nameCache[name] = vendorName);
		}
		
		return null;
	};


	/**
	 * Utility class for working with HTML style properties (setting/getting). Automatically figures out the
	 * correct property name when the engine does not yet support the specified name, but a vendor prefixed one.
	 */
	core.Module("core.bom.Style", 
	{
		names: nameCache,
		property: getProperty,


		/**
		 * Inject element with style element and some CSS ruless
		 */
		injectElementWithStyles : function(rules, callback) 
		{
			var id = 'elementtest';

			var div = document.createElement('div');
			var body = document.body;

			var fakeBody = !body;
			if (fakeBody) {
				body = document.createElement("body");
			}

			// <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
			// when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
			// with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
			// msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
			// Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
			var style = ['&#173;','<style id="s', id, '">', rules, '</style>'].join('');
			div.id = id;
			div.innerHTML += style;
			
			body.appendChild(div);
			
			if (fakeBody) 
			{
				// Avoid crashing IE8, if background image is used
				body.style.background = '';
				docElement.appendChild(body);
			}

			var ret = callback(div, rules);

			// If this is done after page load we don't want to remove the body so check if body exists
			if (fakeBody) {
				body.parentNode.removeChild(body);
			} else {
				div.parentNode.removeChild(div);
			}

			return !!ret;
		},


		/**
		 * {String} Returns the value of the given property @name {String} on the given @element {Element}. By
		 * default the method returns the locally applied property value but there is also support for figuring
		 * out the @computed {Boolean?false} value by triggering the corresponding flag.
		 *
		 * **Note:** In Internet Explorer there is no 100% possibility to have access to the computed value.
		 * We fallback to the only supported thing: cascaded properties. These are the actual value
		 * of the property as applied - non interpreted. This means that units are not translated
		 * to pixels etc. like which is normally the case in computed properties.
		 */
		get: function(element, name, computed) 
		{
			// Find real name, use if supported
			var supported = name in helperStyle && name || nameCache[name] || getProperty(name);

			// Fast-path: local styles
			if (!computed) {
				return element.style[supported];
			}

			// Check support for computed style, fall back to cascaded styles
			// The solution is not 100% correct in IE, but as there is no 100% solution we omit the
			// whole thing here and just implement the basic fallback. Should be enough in most cases.
			var global = element.ownerDocument.defaultView;
			if (global) {
				return global.getComputedStyle(element, null)[supported];
			} else if (element.currentStyle) {
				return element.currentStyle[supported];
			}
		},


		/**
		 * {Integer} Returns an integer representation of the given style property @name {String} on the 
		 * given @element {Element}. By default the method returns the locally applied property value 
		 * but there is also support for figuring out the @computed {Boolean?false} value by triggering 
		 * the corresponding flag.
		 */
		getInteger: function(element, name, computed) {
			return parseInt(this.get(element, name, computed), 10) || 0;
		},
		

		/**
		 * Sets one or multiple style properties on the given @element {Element}. If @name {String|Map} is a `String`
		 * the third parameter @value defines the value to apply. Alternatively @name can be a `Map` which defines
		 * all properties to set.
		 */
		set: function(element, name, value) 
		{
			var style = element.style;
			var supported;

			if (typeof name === 'string') 
			{
				// Find real name, apply if supported
				supported = name in helperStyle && name || nameCache[name] || getProperty(name);
				if (supported) {
					style[supported] = value == null ? '' : value;
				}
			}
			else
			{
				for (var key in name) 
				{
					// Find real name, apply if supported
					value = name[key];
					supported = key in helperStyle && key || nameCache[key] || getProperty(key);
					if (supported) {
						style[supported] = value == null ? '' : value;
					}
				}
			}
		}
	});
})(document);

