/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
==================================================================================================
*/

/**
 * For classes which use event firing properties.
 */
core.Interface("core.property.IEvent",
{
	members : 
	{
		/**
		 * Dispatches an previously created @eventObject {Object} to all listeners.
		 */
		dispatchEvent : function(eventObject) {}		
	}
});
