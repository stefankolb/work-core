/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function()
{
	var setters = {};
	var getters = {};
	var resetters = {};
	var validators = {};

	var up = function(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	};

	var undef;


	/**
	 * Generic setter/getter support for property API.
	 *
	 * Include this if your class uses properties and want to be able to generically
	 * set/get them based on the property names
	 */
	core.Class("core.property.MGeneric",
	{
		members :
		{
			/**
			 * {var} Generic setter. Supports two possible use cases for @property {String|Map} and @value {var?}:
			 *
			 *     set("property", value);
			 *     set({
			 *       property1: value1,
			 *       property2: value2
			 *     });
			 *
			 * Returns the value from the setter (if single property is used)
			 */
			set : function(property, value)
			{
				if (arguments.length == 2)
				{
					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(property, "String");
					}

					var method = setters[property];
					if (!method) {
						method = setters[property] = "set" + up(property);
					}

					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(this[method], "Function", "Invalid property to set: " + property);
					}

					return this[method](value);
				}
				else
				{
					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(property, "Map");
					}

					for (var name in property)
					{
						var method = setters[name];
						if (!method) {
							method = setters[name] = "set" + up(name);
						}

						if (jasy.Env.isSet("debug")) {
							core.Assert.isType(this[method], "Function", "Invalid property to set: " + name);
						}

						this[method](property[name]);
					}
				}
			},


			/**
			 * {Boolean} Rudimentary check whether a given @property {String} getter is available.
			 */
			hasGetter : function(property)
			{
				var method = getters[property];
				if (!method) {
					method = getters[property] = "get" + up(property);
				}

				return !!this[method];
			},


			/**
			 * {var} Generic getter for @property {String|Array}. 
			 * Supports three possible use cases:
			 *
			 *     var propertyValue = obj.get("property");
			 *     var listOfValues = obj.get(["property1", "property2"]);
			 *     var listOfAllValues = obj.get();
			 */
			get : function(property)
			{
				if (typeof property == "string")
				{
					var method = getters[property];
					if (!method) {
						method = getters[property] = "get" + up(property);
					}

					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(this[method], "Function", "Invalid property to get " + property + " on " + this);
					}

					return this[method]();
				}
				else
				{
					if (!property) 
					{
						property = core.Object.getKeys(core.Class.getProperties(this.constructor));
					}
					else if (jasy.Env.isSet("debug")) 
					{
						core.Assert.isType(property, "Array");
					}

					var ret = {};

					for (var i=0, l=property.length; i<l; i++)
					{
						var name = property[i];
						var method = getters[name];
						if (!method) {
							method = getters[name] = "get" + up(name);
						}

						if (jasy.Env.isSet("debug")) {
							core.Assert.isType(this[method], "Function", "Invalid property to get " + name + " on " + this);
						}

						ret[name] = this[method]();
					}

					return ret;
				}
			},


			/**
			 * {var} Generic resetter for @property {String|Array?all} being valid. 
			 * Supports three possible use cases:
			 *
			 *     var resetSingle = obj.reset("property");
			 *     var resetGiven = obj.reset(["property1", "property2"]);
			 *     var resetAll = obj.reset();
			 */
			reset : function(property)
			{
				if (typeof property == "string")
				{
					var method = resetters[property];
					if (!method) {
						method = resetters[property] = "reset" + up(property);
					}

					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(this[method], "Function", "Invalid property to reset " + property + " on " + this);
					}

					return this[method]();
				}
				else
				{
					if (!property) 
					{
						property = core.Object.getKeys(core.Class.getProperties(this.constructor));
					}
					else if (jasy.Env.isSet("debug")) 
					{
						core.Assert.isType(property, "Array");
					}

					for (var i=0, l=property.length; i<l; i++)
					{
						var name = property[i];
						var method = resetters[name];
						if (!method) {
							method = resetters[name] = "reset" + up(name);
						}

						if (jasy.Env.isSet("debug")) {
							core.Assert.isType(this[method], "Function", "Invalid property to reset " + name + " on " + this);
						}

						this[method]();
					}
				}
			},


			/**
			 * {var} Generic validator for @property {String|Array?all} being valid. 
			 * Supports three possible use cases:
			 *
			 *     var singleIsValid = obj.isValid("property");
			 *     var givenAreValid = obj.isValid(["property1", "property2"]);
			 *     var allAreValid = obj.isValid();
			 *
			 * When validating a list of properties (all or custom list) it's optionally possible 
			 * to @raise {Boolean?false} an error with the exact property not validating.
			 */
			isValid : function(property, raise)
			{
				if (typeof property == "string")
				{
					var method = validators[property];
					if (!method) {
						method = validators[property] = "isValid" + up(property);
					}

					if (jasy.Env.isSet("debug")) {
						core.Assert.isType(this[method], "Function", "Invalid property to validate: " + property);
					}

					return this[method]();
				}
				else if (property == null || core.Main.isTypeOf(property, "Array"))
				{
					if (!property) 
					{
						property = core.Object.getKeys(core.Class.getProperties(this.constructor));
						var all = true;
					}

					for (var i=0, l=property.length; i<l; i++)
					{
						var name = property[i];
						var method = validators[name];
						if (!method) {
							method = validators[name] = "isValid" + up(name);
						}

						if (all && !this[method]) {
							continue;
						}

						if (jasy.Env.isSet("debug")) {
							core.Assert.isType(this[method], "Function", "Invalid property to validate: " + name);
						}

						if (!this[method]()) 
						{
							if (jasy.Env.isSet("debug")) {
								this.log("Property " + name + " is not valid!");
							}

							if (raise) {
								throw new Error("Property " + name + " in " + this + " is not valid!");
							} else {
								return false;
							}
						}
					}

					return true;
				}
				else if (jasy.Env.isSet("debug"))
				{
					throw new Error("Invalid value for validation: " + property);
				}
			}
		}
	});
})();

