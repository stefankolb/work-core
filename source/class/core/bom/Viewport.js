/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://www.quirksmode.org/blog/archives/2011/12/outerwidth_and.html
==================================================================================================
*/

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