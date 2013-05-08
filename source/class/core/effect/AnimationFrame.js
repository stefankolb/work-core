/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
==================================================================================================
*/

if (jasy.Env.isSet("runtime", "browser"))
{
	(function(global) 
	{
		var request = core.util.Experimental.get(global, "requestAnimationFrame");
		var cancel = core.util.Experimental.get(global, "cancelRequestAnimationFrame");

		if (request)
		{
			// Prefer native support: Resolve returned name on global object.
			// Bind to window because otherwise it throws errors in V8 and maybe other engines.
			request = global[request].bind(global);
			cancel = global[cancel].bind(global);
		}
		else
		{
			// Custom implementation
			var TARGET_FPS = 60;
			var requests = {};
			var rafHandle = 1;
			var timeoutHandle = null;

			/** 
			 * {var} Tells the browser that you wish to perform an animation; this requests that the browser schedule a 
			 * repaint of the window for the next animation frame. The method takes as an argument a @callback {Function} to 
			 * be invoked before the repaint and a @root {Element?} to specifying the element that visually bounds the entire animation.
			 * Returns a handle to cancel the request using {#cancel}.
			 *
			 * See also: https://developer.mozilla.org/en/DOM/window.requestAnimationFrame
			 */
			request = function(callback, root) 
			{
				var callbackHandle = rafHandle++;

				// Store callback
				requests[callbackHandle] = callback;

				// Create timeout at first request
				if (timeoutHandle === null) 
				{
					timeoutHandle = setTimeout(function() 
					{
						var time = Date.now();
						var currentRequests = requests;
						var keys = core.Object.getKeys(currentRequests);

						// Reset data structure before executing callbacks
						requests = {};
						timeoutHandle = null;

						// Process all callbacks
						for (var i=0, l=keys.length; i<l; i++) {
							currentRequests[keys[i]](time);
						}
					}, 1000 / TARGET_FPS);
				}

				return callbackHandle;
			};

			/**
			 * Stops the animation scheduled under the given @handle {var}.
			 * 
			 * See also: https://developer.mozilla.org/en/DOM/window.requestAnimationFrame
			 */
			cancel = function(handle) 
			{
				delete requests[handle];

				// Stop timeout if all where removed
				if (core.Object.isEmpty(requests)) 
				{
					clearTimeout(timeoutHandle);
					timeoutHandle = null;
				}
			};			
		}

		/**
		 * Module to request a function call for the next render loop.
		 *
		 * Used native methods where possible but includes a fallback to 
		 * a custom timeout based logic.
		 */
		core.Module("core.effect.AnimationFrame", 
		{
			request : request,
			cancel : cancel
		});

	})(core.Main.getGlobal());
}
