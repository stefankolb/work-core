/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2014 Sebastian Software GmbH
==================================================================================================
*/

"use strict";

(function(undef)
{

	var emptyFnt = function() {};
	/**
	 * Property handling for computed key/value like properties (based upon simple properties).
	 *
	 * Supports the following configuration keys:
	 *
	 * - `type`: Check the incoming value for the given type or function.
	 * - `apply`: Link to function to call after a new value has been stored. The signature of the method is
	 * `function(newValue, oldValue)`
	 * - `fire`: Event to fire after a new value has been stored (and apply has been called). The listeners
	 * are called with 3 parameters: value, old value and property name.
	 * - `nullable`: Whether the property is able to store null values. This also allows the system to
	 * return `null` when no other value is available. Otherwise an error is thrown whenever no value is
	 * available.
	 * - `validate`: Link to function which should return a bool based on whether the valud passed detailed
	 * value validation. Especially useful for using properties inside data models (MVC, MVP, etc.)
	 * - `compute`: Function callback to compute value. Value is cached until values changed, that are observed
	 * via @observes
	 * - `observes`: Observes all properties in observes array (array of strings). If value changed cache is
	 * marked dirty and recomputed on next get()
	 * - `setter`: Function to set value, e.g. to write to a property this property is based upon.
	 *
	 * #break(core.property.Debug)
	 * #break(core.Class)
	 */
	core.Module("core.property.Compute",
	{
		/**
		 * {Map} Creates a new set of member methods for the given property @config {Map}.
		 *
		 * Please note that you need to define one of "init" or "nullable". Otherwise you
		 * might get errors during runtime function calls.
		 */
		create : function(config)
		{
			// Shorthands: Better compression/obfuscation/performance
			var propertyName = config.name;
			var propertyInit = config.init;
			var propertyCompute = config.compute;
			var propertyObserves = config.observes || [];
			var propertySetter = config.setter || emptyFnt;

			if (jasy.Env.isSet("debug"))
			{
				core.Assert.isNull(propertyInit, "Unallowed key 'init' in property: " + propertyName + "!");
			}

			var simplePropertyConfig = core.Object.reduce(config, function(key, value) {
				if (["compute", "observes", "setter"].indexOf(key) < 0) {
					return true;
				}
			});
			simplePropertyConfig.nullable = true;
			simplePropertyConfig.init = null;
			var property = core.property.Simple.create(simplePropertyConfig);

			var members = {
				get: function() {
					var value = property.get.call(this);
					var isDirty = !!property.$$isDirty;

					if (value == null) {
						isDirty = true;

						var properties = core.Class.getProperties(this.constructor);
						for (var i=0,ii=propertyObserves.length; i<ii; i++) {
							var propertyName = propertyObserves[i];
							this.addListener(properties[propertyName].fire, function() {
								property.$$isDirty = true;
							});
						}
					} 
					if (isDirty) {
						value = propertyCompute.call(this);
						property.set.call(this, value);

						property.$$isDirty = false;
					}

					return value;
				},
				set: propertySetter,
				reset: function() {
					property.$$isDirty = true;
				}
			};

			return members;
		}
	});
})();
