/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function(undef)
{
	/** {=Array} List of selected field values */
	var key = [];

	/** {=Map} Internal database of available fields with their current values */
	var selected = {};

	// At this level Array.prototype.indexOf might not be support, so we implement a custom logic for a contains check
	var contains = function(array, value) 
	{
		for (var i=0, l=array.length; i<l; i++) 
		{
			if (array[i] == value) {
				return true;
			}
		}
	};

	/**
	 * {var} Returns the value of the field with the given @name {String}.
	 */
	var getValue = function(name) 
	{
		if (!(name in selected)) {
			throw new Error("jasy.Env: Field " + name + " is not available (yet)!");
		}

		return selected[name];
	};


	/**
	 * This class is the client-side representation for the permutation features of
	 * Jasy and supports features like auto-selecting builds based on specific feature sets.
	 */
	core.Module("jasy.Env",
	{
		SELECTED : selected,

		/** {=Number} Holds the checksum for the current permutation which is auto detected by features or by compiled-in data */
		CHECKSUM : null,


		/**
		 * Configure environment data dynamically via setting a field @name {String} and its @value {var}.
		 */
		define : function(name, value) {
			selected[name] = value;
		},


		/**
		 * Adds the given @field {Array} as exported by Jasy.
		 */
		addField : function(field)
		{
			// possible variants
			// 1: name, 1, test, [val1, val2]
			// 2: name, 2, value
			// 3: name, 3, test, default (not permutated)

			var name = field[0];
			var type = field[1]
			if (type == 1 || type == 3)
			{
				var test = field[2];
				var value = "VALUE" in test ? test.VALUE : test.get(name);
				var third = field[3];

				// Fallback to first value if test results in unsupported value
				if (type == 1 && !contains(third, value)) {
					value = third[0];
				}

				// Fill in missing value with default
				else if (type == 3 && value == null) {
					value = third;
				}
			}
			else
			{
				// In cases with no test, we don't have an array of fields but just a value
				value = field[2];
			}

			selected[name] = value;

			if (type != 3) {
				key.push(name + ":" + value);
			}

			key.sort();
			var sha1 = core.crypt.SHA1.checksum(key.join(";"));
			this.CHECKSUM = core.util.String.toHex(sha1);
		},


		/**
		 * Used by Jasy to inject @fields {Array} data
		 */
		setFields : function(fields)
		{
			// DEPRECATED

			for (var i=0, l=fields.length; i<l; i++) {
				this.addField(fields[i]);
			}
		},


		getValue : getValue,
		
		
		/**
		 * {Boolean} Whether the field with the given @name {String} was set to the given @value {var?true}. 
		 *
		 * Boolean fields could also be checked without a given value as the value
		 * defaults to `true`.
		 */
		isSet : function(name, value)
		{
			// Fallback to value of true
			if (value === undef) {
				value = true;
			}

			// Explicit use of normal equal here to not differ between numbers and strings etc.
			return getValue(name) == value;
		},


		/**
		 * {var} Selects and returns the current value of the field with the given 
		 * @name {String} from the given @map {Map}.
		 */
		select: function(name, map) {
			return map[getValue(name)];
		}
	});
})();

