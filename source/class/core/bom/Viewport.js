/*
==================================================================================================
	Core - JavaScript Foundation
	Copyright 2010-2012 Zynga Inc.
	Copyright 2012-2014 Sebastian Werner
--------------------------------------------------------------------------------------------------
	Inspired by: http://www.quirksmode.org/blog/archives/2011/12/outerwidth_and.html
==================================================================================================
*/

"use strict";

(function(window)
{
	/**
	 * Support for the browsers viewport. Also contains methods
	 * specifically interesting for mobile devices like smartphones/tablets (orientation, etc.)
	 */
	core.Module("core.bom.Viewport",
	{
		/** {Integer} Returns the viewport width */
		getWidth: function() {
			return window.innerWidth;
		},

		/** {Integer} Returns the viewport height */
		getHeight: function() {
			return window.innerHeight;
		},

		/** {Boolean} Whether the viewport is in landscape orientation */
		isLandscape: function() {
			return window.outerWidth > window.outerHeight;
		},

		/** {Boolean} Whether the viewport is in portrait orientation */
		isPortrait: function() {
			return window.outerWidth < window.outerHeight;
		},

		/**
		 * Works the viewport magic on sites which do not like to offer native scrolling
		 * but works with fixed components and custom scrolling. In these app like sites
		 * we like to offer a view without the top browser bar. This is possible and will
		 * be applied by this method. The method also offers features to make
		 */
		enableAppLayout : function()
		{
			var helper = function()
			{
				// Ignore any effects from input elements
				var active = document.activeElement;
				if (active && active.tagName.match(/input|textarea|select/i)) {
					return;
				}

				// - First enforce height on documentElement to make document larger and allow scrolling
				// - Scroll to any location (will hide the menu bar)
				// - Sync body height with actual window inner height (now without the top bar)
				// - Undo change to documentElement to correctly support input field/keyboards
				document.documentElement.style.height = "5000px";
				window.scrollTo(0, 0);
				document.body.style.height = window.innerHeight + "px";
				document.documentElement.style.height = "";
			};

			// Execute on every orientation/size change
			window.addEventListener('orientationchange', helper, false);
			window.addEventListener('resize', helper, false);

			// Directly execute for the first time
			helper();
		},

		/** {String} Returns the viewport orientation. */
		getOrientation: function()
		{
			var orient = window.orientation;

			// TODO

			if (orient != null) {



			}

			return orient;

		}

	});

})(core.Main.getGlobal());