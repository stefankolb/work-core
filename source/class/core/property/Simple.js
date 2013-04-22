/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(undef)
{
	/** {Map} Maps simple property names to global property IDs */
	var propertyNameToId = {};

	/** {=String} Field where the data is stored */
	var store = "$$data";


	/**
	 * Property handling for simple key/value like properties which might have an optional init value.
	 *
	 * Supports the following configuration keys:
	 *
	 * - `type`: Check the incoming value for the given type or function.
	 * - `apply`: Link to function to call after a new value has been stored. The signature of the method is
	 * `function(newValue, oldValue)`
	 * - `fire`: Event to fire after a new value has been stored (and apply has been called). The listeners
	 * are called with 3 parameters: value, old value and property name.
	 * - `init`: Init value for the property. If no value is set or the property gets reset, the getter
	 * will return the `init` value.
	 * - `nullable`: Whether the property is able to store null values. This also allows the system to
	 * return `null` when no other value is available. Otherwise an error is thrown whenever no value is
	 * available.
	 * - `validate`: Link to function which should return a bool based on whether the valud passed detailed
	 * value validation. Especially useful for using properties inside data models (MVC, MVP, etc.)
	 *
	 * #break(core.property.Debug)
	 * #break(core.property.Event)
	 */
	core.Module("core.property.Simple",
	{
		/**
		 * {Map} Creates a new set of member methods for the given property @config {Map}.
		 *
		 * Please note that you need to define one of "init" or "nullable". Otherwise you
		 * might get errors during runtime function calls.
		 */
		create : function(config)
		{
			/*
			---------------------------------------------------------------------------
				 INTRO
			---------------------------------------------------------------------------
			*/

			// Shorthands: Better compression/obfuscation/performance
			var propertyName = config.name;
			var propertyNullable = config.nullable;
			var propertyInit = config.init;
			var propertyType = config.type;
			var propertyFire = config.fire;
			var propertyApply = config.apply;
			var propertyCast = config.cast;
			var propertyValidate = config.validate;

			// Validation
			if (jasy.Env.isSet("debug"))
			{
				core.Assert.doesOnlyHaveKeys(config, "name,nullable,init,type,fire,apply,cast,validate", "Unallowed keys in property: " + propertyName + "!");
				core.Assert.isType(propertyName, "String");

				if (propertyNullable !== undef) {
					core.Assert.isType(propertyNullable, "Boolean");
				}

				if (propertyType) {
					core.property.Debug.isValidType(propertyType);
				}

				if (propertyFire) {
					core.Assert.isType(propertyFire, "String");
				}

				if (propertyApply) {
					core.Assert.isType(propertyApply, "Function");
				}

				if (propertyCast != null) 
				{
					core.Assert.isType(propertyCast, "Boolean");

					/**
					 * When enabled the `type` should refer to a `core.Class`
					 *
					 * #break(core.Class)
					 */
					if (propertyCast && !core.Class.isClass(propertyType)) {
						throw new Error("Property declaration of " + propertyName + " contains invalid configuration: Casting support requires a core.Class for the type of the property!");
					}
				}

				if (propertyValidate) {
					core.Assert.isType(propertyValidate, "Function");
				}
			}

			// Generate property ID
			// Identically named property might store data on the same field
			// as in this case this is typicall on different classes.
			var propertyId = propertyNameToId[propertyName];
			if (!propertyId) {
				propertyId = propertyNameToId[propertyName] = (core.property.Core.ID++);
			}

			// Prepare return value
			var members = {};



			/*
			---------------------------------------------------------------------------
				 METHODS :: GET
			---------------------------------------------------------------------------
			*/

			members.get = function()
			{
				var data, value;
				var context = this;

				if (jasy.Env.isSet("debug")) {
					core.property.Debug.checkGetter(context, config, arguments);
				}

				data = context[store];
				if (data) {
					value = data[propertyId];
				}

				if (value === undef)
				{
					if (propertyInit !== undef) {
						return propertyInit;
					}

					if (jasy.Env.isSet("debug"))
					{
						if (!propertyNullable) {
							context.error("Missing value for: " + propertyName + " (during get())");
						}
					}

					value = null;
				}

				return value;
			};



			/*
			---------------------------------------------------------------------------
				 METHODS :: INIT
			---------------------------------------------------------------------------
			*/

			if (propertyInit !== undef)
			{
				members.init = function()
				{
					var context = this;
					var data = context[store];

					// Check whether there is already local data (which is higher prio than init data)
					if (!data || data[propertyId] === undef)
					{
						// Call apply
						if (propertyApply) {
							propertyApply.call(context, propertyInit, undef);
						}

						// Fire event
						if (propertyFire) 
						{
							var eventObject = core.property.Event.obtain(propertyFire, propertyInit, undef, propertyName);
							context.dispatchEvent(eventObject);
							eventObject.release();
						}
					}
				};
			}



			/*
			---------------------------------------------------------------------------
				 METHODS :: SET
			---------------------------------------------------------------------------
			*/

			members.set = function(value)
			{
				var context=this, data, old;

				// Wrap plain types to match property type
				// Modifying `value` should also modify the arguments object which
				// is required for value tests happening via checkSetter
				if (config.cast && core.Main.isTypeOf(value, "Plain")) 
				{
					value = new config.type(value);

					if (jasy.Env.isSet("debug")) 
					{
						// arguments object is not updated in strict mode anymore, fix this
						if (arguments[0] !== value) {
							arguments[0] = value;	
						}
					}
				}

				// Check types
				if (jasy.Env.isSet("debug")) {
					core.property.Debug.checkSetter(context, config, arguments);
				}

				data = context[store];
				if (!data) {
					data = context[store] = {};
				} else {
					old = data[propertyId];
				}

				if (value !== old)
				{
					if (old === undef && propertyInit !== undef) {
						old = propertyInit;
					}

					data[propertyId] = value;

					if (propertyApply) {
						propertyApply.call(context, value, old);
					}

					if (propertyFire) 
					{
						var eventObject = core.property.Event.obtain(propertyFire, value, old, propertyName);
						context.dispatchEvent(eventObject);
						eventObject.release();
					}
				}

				return value;
			};



			/*
			---------------------------------------------------------------------------
				 METHODS :: RESET
			---------------------------------------------------------------------------
			*/

			members.reset = function()
			{
				var context, data, old, value;
				context = this;

				if (jasy.Env.isSet("debug")) {
					core.property.Debug.checkResetter(context, config, arguments);
				}

				data = context[store];
				if (!data) {
					return;
				}

				old = data[propertyId];
				value = undef;

				if (old !== value)
				{
					data[propertyId] = value;

					if (propertyInit !== undef) {
						value = propertyInit;
					}
					else if (jasy.Env.isSet("debug"))
					{
						// Still no value. We warn about that the property is not nullable.
						if (!propertyNullable) {
							context.error("Missing value for: " + propertyName + " (during reset())");
						}
					}

					if (propertyApply) {
						propertyApply.call(context, value, old);
					}

					if (propertyFire) 
					{
						var eventObject = core.property.Event.obtain(propertyFire, value, old, propertyName);
						context.dispatchEvent(eventObject);
						eventObject.release();
					}
				}
			};



			/*
			---------------------------------------------------------------------------
				 METHODS :: ISVALID
			---------------------------------------------------------------------------
			*/			

			if (propertyValidate)
			{
				members.isValid = function()
				{
					var data, value;
					var context = this;

					if (jasy.Env.isSet("debug")) {
						core.property.Debug.checkIsValid(context, config, arguments);
					}

					data = context[store];
					if (data) {
						value = data[propertyId];
					}

					if (value === undef)
					{
						if (propertyInit !== undef) 
						{
							value = propertyInit;
						}
						else if (!propertyNullable) 
						{
							context.error("Missing value for: " + propertyName + " (during isValid())");
							return false;
						}
					}					

					return propertyValidate.call(context, value);
				};
			}



			/*
			---------------------------------------------------------------------------
				 DONE
			---------------------------------------------------------------------------
			*/

			return members;
		}
	});
})()
