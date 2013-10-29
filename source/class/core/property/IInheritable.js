/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * For classes which use inheritable properties.
 */
core.Interface("core.property.IInheritable",
{
	members :
	{
		/**
		 * {var} Returns the inherited value of the given @property {String}.
		 */
		getInheritedValue : function(property) {}
	}
});
