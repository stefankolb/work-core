/* 
==================================================================================================
	Core - JavaScript Foundation
	Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
	Based on the work of Microsoft Corporation
	Hand.js v1.0.13, Wed Jul 10, 2013 at 9:00 AM
	http://handjs.codeplex.com
	Apache License 2.0
==================================================================================================
*/

if (jasy.Env.isSet("runtime", "browser"))
{
	(function()
	{
		var supportedEventsNames = [
			"pointerdown", "pointerup", "pointermove", "pointerover", "pointerout", "pointercancel", "pointerenter", "pointerleave"
		];

		var POINTER_TYPE_TOUCH = "touch";
		var POINTER_TYPE_PEN = "pen";
		var POINTER_TYPE_MOUSE = "mouse";
		
		var previousTargets = {};

		var generateMouseProxy = function(evt, eventName) 
		{
			evt.pointerId = 1;
			evt.pointerType = POINTER_TYPE_MOUSE;

			core.bom.TouchLikeEvent.create(evt, eventName);
		};

		var generateTouchEventProxy = function(name, touchPoint, target, eventObject) 
		{
			// Just to not override mouse id
			var touchPointId = touchPoint.identifier + 2; 

			touchPoint.pointerId = touchPointId;
			touchPoint.pointerType = POINTER_TYPE_TOUCH;
			touchPoint.currentTarget = target;
			touchPoint.target = target;

			if (eventObject.preventDefault !== undefined) 
			{
				touchPoint.preventDefault = function() {
					eventObject.preventDefault();
				};
			}

			core.bom.TouchLikeEvent.create(touchPoint, name);
		};
		
		// Check if user registered this event
		var generateTouchEventProxyIfRegistered = function(eventName, touchPoint, target, eventObject) 
		{
			if (target._handjs_registeredEvents) 
			{
				for (var index = 0; index < target._handjs_registeredEvents.length; index++) 
				{
					if (target._handjs_registeredEvents[index] === eventName) {
						generateTouchEventProxy(target._handjs_registeredEvents[index], touchPoint, target, eventObject);
					}
				}
			}
		};

		var handleOtherEvent = function(eventObject, name, useLocalTarget, checkRegistration) 
		{
			if (eventObject.preventManipulation) {
				eventObject.preventManipulation();
			}

			for (var i = 0; i < eventObject.changedTouches.length; ++i) 
			{
				var touchPoint = eventObject.changedTouches[i];
				
				if (useLocalTarget) {
					previousTargets[touchPoint.identifier] = touchPoint.target;
				}

				if (checkRegistration) {
					generateTouchEventProxyIfRegistered(name, touchPoint, previousTargets[touchPoint.identifier], eventObject);
				} else {
					generateTouchEventProxy(name, touchPoint, previousTargets[touchPoint.identifier], eventObject);
				}
			}
		};
		
		var getMouseEquivalentEventName = function(eventName) {
			return eventName.replace("pointer", "mouse");
		};

		var getPrefixEventName = function(item, prefix, eventName) 
		{
			var newEventName;

			if (eventName == eventName) 
			{
				var indexOfUpperCase = supportedEventsNames.indexOf(eventName) - (supportedEventsNames.length / 2);
				newEventName = prefix + supportedEventsNames[indexOfUpperCase];
			}
			else 
			{
				newEventName = prefix + eventName;
			}

			// Fallback to PointerOver if PointerEnter is not currently supported
			if (newEventName === prefix + "PointerEnter" && item["on" + prefix + "pointerenter"] === undefined) {
				newEventName = prefix + "PointerOver";
			}

			// Fallback to PointerOut if PointerLeave is not currently supported
			if (newEventName === prefix + "PointerLeave" && item["on" + prefix + "pointerleave"] === undefined) {
				newEventName = prefix + "PointerOut";
			}

			return newEventName;
		};

		var registerOrUnregisterEvent = function(item, name, func, enable) 
		{
			if (enable) {
				item.addEventListener(name, func, false);
			} else {
				item.removeEventListener(name, func);
			}
		};

		var setTouchAware = function(item, eventName, enable) 
		{
			// If item is already touch aware, do nothing
			if (item.onpointerdown !== undefined) {
				return;
			}

			// IE 10
			if (item.onmspointerdown !== undefined) 
			{
				var msEventName = getPrefixEventName(item, "MS", eventName);
				registerOrUnregisterEvent(item, msEventName, function(evt) { 
					core.bom.TouchLikeEvent.create(evt, eventName); 
				}, enable);

				// We can return because MSPointerXXX integrate mouse support
				return;
			}

			// Chrome, Firefox
			if (item.ontouchstart !== undefined) 
			{
				switch (eventName) 
				{
					case "pointermove":
						registerOrUnregisterEvent(item, "touchmove", function(evt) { 
							handleOtherEvent(evt, eventName); 
						}, enable);
						break;

					case "pointercancel":
						registerOrUnregisterEvent(item, "touchcancel", function(evt) { 
							handleOtherEvent(evt, eventName); 
						}, enable);
						break;

					case "pointerdown":
					case "pointerup":
					case "pointerout":
					case "pointerover":
					case "pointerleave":
					case "pointerenter":
						// These events will be handled by the window.ontouchmove function
						if (!item._handjs_registeredEvents) {
							item._handjs_registeredEvents = [];
						}

						var index = item._handjs_registeredEvents.indexOf(eventName);
						
						if (enable && index === -1) {
							item._handjs_registeredEvents.push(eventName);
						}  else if (!enable && index != -1) {
							item._handjs_registeredEvents.splice(index, 1);
						}
						break;
				}
			}

			// Fallback to mouse
			switch (eventName) {
				case "pointerdown":
					registerOrUnregisterEvent(item, "mousedown", function(evt) { 
						generateMouseProxy(evt, eventName); 
					}, enable);
					break;

				case "pointermove":
					registerOrUnregisterEvent(item, "mousemove", function(evt) { 
						generateMouseProxy(evt, eventName); 
					}, enable);
					break;

				case "pointerup":
					registerOrUnregisterEvent(item, "mouseup", function(evt) { 
						generateMouseProxy(evt, eventName); 
					}, enable);
					break;

				case "pointerover":
					registerOrUnregisterEvent(item, "mouseover", function(evt) { 
						generateMouseProxy(evt, eventName); 
					}, enable);
					break;

				case "pointerout":
					registerOrUnregisterEvent(item, "mouseout", function(evt) { 
						generateMouseProxy(evt, eventName); 
					}, enable);
					break;

				case "pointerenter":
					// Fallback to mouseover
					if (item.onmouseenter === undefined) 
					{
						registerOrUnregisterEvent(item, "mouseover", function(evt) { 
							generateMouseProxy(evt, eventName); 
						}, enable);
					}
					else 
					{
						registerOrUnregisterEvent(item, "mouseenter", function(evt) { 
							generateMouseProxy(evt, eventName); 
						}, enable);
					}
					break;

				case "pointerleave":
					// Fallback to mouseout
					if (item.onmouseleave === undefined) 
					{ 
						registerOrUnregisterEvent(item, "mouseout", function(evt) { 
							generateMouseProxy(evt, eventName); 
						}, enable);
					} 
					else
					{
						registerOrUnregisterEvent(item, "mouseleave", function(evt) { 
							generateMouseProxy(evt, eventName); 
						}, enable);
					}

					break;
			}
		};

		// Intercept addEventListener calls by changing the prototype
		var interceptAddEventListener = function(root) 
		{
			var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;

			var customAddEventListener = function(name, func, capture) 
			{
				// Branch when a PointerXXX is used
				if (supportedEventsNames.indexOf(name) != -1) {
					setTouchAware(this, name, true);
				}

				if (current === undefined) {
					this.attachEvent("on" + getMouseEquivalentEventName(name), func);
				} else {
					current.call(this, name, func, capture);
				}
			};

			if (root.prototype) {
				root.prototype.addEventListener = customAddEventListener;
			} else {
				root.addEventListener = customAddEventListener;
			}
		};

		// Intercept removeEventListener calls by changing the prototype
		var interceptRemoveEventListener = function(root) 
		{
			var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;

			var customRemoveEventListener = function(name, func, capture) 
			{
				// Release when a PointerXXX is used
				if (supportedEventsNames.indexOf(name) != -1) {
					setTouchAware(this, name, false);
				}

				if (current === undefined) {
					this.detachEvent(getMouseEquivalentEventName(name), func);
				} else {
					current.call(this, name, func, capture);
				}
			};

			if (root.prototype) {
				root.prototype.removeEventListener = customRemoveEventListener;
			} else {
				root.removeEventListener = customRemoveEventListener;
			}
		};

		// Hooks
		interceptAddEventListener(document);
		interceptAddEventListener(HTMLBodyElement);
		interceptAddEventListener(HTMLDivElement);
		interceptAddEventListener(HTMLImageElement);
		interceptAddEventListener(HTMLSpanElement);
		interceptAddEventListener(HTMLUListElement);
		interceptAddEventListener(HTMLAnchorElement);
		interceptAddEventListener(HTMLLIElement);

		if (window.HTMLCanvasElement) {
			interceptAddEventListener(HTMLCanvasElement);
		}

		if (window.SVGElement) {
			interceptAddEventListener(SVGElement);
		}

		interceptRemoveEventListener(document);
		interceptRemoveEventListener(HTMLBodyElement);
		interceptRemoveEventListener(HTMLDivElement);
		interceptRemoveEventListener(HTMLImageElement);
		interceptRemoveEventListener(HTMLSpanElement);
		interceptRemoveEventListener(HTMLUListElement);
		interceptRemoveEventListener(HTMLAnchorElement);
		interceptRemoveEventListener(HTMLLIElement);

		if (window.HTMLCanvasElement) {
			interceptRemoveEventListener(HTMLCanvasElement);
		}

		if (window.SVGElement) {
			interceptRemoveEventListener(SVGElement);
		}
		
		// Handling move on window to detect pointerleave/out/over
		if (window.ontouchstart !== undefined) 
		{       
			window.addEventListener('touchstart', function(eventObject) 
			{
				for (var i = 0; i < eventObject.changedTouches.length; ++i) 
				{
					var touchPoint = eventObject.changedTouches[i];
					previousTargets[touchPoint.identifier] = touchPoint.target;

					generateTouchEventProxyIfRegistered("pointerenter", touchPoint, touchPoint.target, eventObject);
					generateTouchEventProxyIfRegistered("pointerover", touchPoint, touchPoint.target, eventObject);
					generateTouchEventProxyIfRegistered("pointerdown", touchPoint, touchPoint.target, eventObject);
				}
			});
			
			window.addEventListener('touchend', function(eventObject) 
			{
				for (var i = 0; i < eventObject.changedTouches.length; ++i) 
				{
					var touchPoint = eventObject.changedTouches[i];
					var currentTarget = previousTargets[touchPoint.identifier];
					
					generateTouchEventProxyIfRegistered("pointerup", touchPoint, currentTarget, eventObject);
					generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject);
					generateTouchEventProxyIfRegistered("pointerleave", touchPoint, currentTarget, eventObject);
				}
			});

			window.addEventListener('touchmove', function(eventObject) 
			{
				for (var i = 0; i < eventObject.changedTouches.length; ++i) 
				{
					var touchPoint = eventObject.changedTouches[i];
					var newTarget = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
					var currentTarget = previousTargets[touchPoint.identifier];
					
					// We can skip this as the pointer is effectively over the current target
					if (currentTarget === newTarget) {
						continue; 
					}

					if (currentTarget)
					 {
						// Raise out
						generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject);

						// Raise leave
						if (!currentTarget.contains(newTarget)) 
						{
							// Leave must be called if the new target is not a child of the current
							generateTouchEventProxyIfRegistered("pointerleave", touchPoint, currentTarget, eventObject);
						}
					}

					if (newTarget) 
					{
						// Raise over
						generateTouchEventProxyIfRegistered("pointerover", touchPoint, newTarget, eventObject);

						// Raise enter
						if (!newTarget.contains(currentTarget)) 
						{
							// Enter must be called if the new target is not the parent of the current
							generateTouchEventProxyIfRegistered("pointerenter", touchPoint, newTarget, eventObject);
						}
					}

					previousTargets[touchPoint.identifier] = newTarget;
				}
			});
		}

		// Extension to navigator
		if (navigator.pointerEnabled === undefined) 
		{
			// Indicates if the browser will fire pointer events for pointing input
			navigator.pointerEnabled = true;

			// IE
			if (navigator.msPointerEnabled) {
				navigator.maxTouchPoints = navigator.msMaxTouchPoints;
			}
		}

	})();
}
	