/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function(undef)
{
	/** {=Map} Map of selected field values */
	var permutated = {};

	/** {=Map} Internal database of available fields with their current values */
	var selected = {};

	/** {=String} Computed checksum */
	var checksum = null;

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
			throw new Error("[jasy.Env]: Field " + name + " is not available (yet)!");
		}

		return selected[name];
	};


	/**
	 * This class is the client-side representation for the permutation features of
	 * Jasy and supports features like auto-selecting builds based on specific feature sets.
	 */
	core.Module("jasy.Env",
	{
		/** {=Map} Map of all fields with their values. */
		SELECTED : selected,

		/** {=Map} Map of all permutated fields which are relevant for checksum compution */
		PERMUTATED : permutated,


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
			var type = field[1];
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

			// Add all fields - even static ones - to the selected data
			selected[name] = value;

			// Only add permutated fields to the permutated map.
			if (type != 3) 
			{
				permutated[name] = value;
				checksum = null;
			}
		},


		/**
		 * {String} Returns the SHA1 checksum of the current permutated field set.
		 * This checksum computition is compatatible with the Jasy approach for
		 * computing it.
		 */
		getChecksum : function()
		{
			if (checksum != null) {
				return checksum;
			}

			var names = [];
			for (var name in permutated) {
				names.push(name);
			}

			names.sort();

			var list = [];
			for (var i=0, l=names.length; i<l; i++) 
			{	
				var name = names[i];
				list.push(name + ":" + permutated[name]);
			}			

			var sha1 = core.crypt.SHA1.checksum(list.join(";"));
			return checksum = core.String.toHex(sha1);
		},


		/**
		 * Used by Jasy to inject @fields {Array} data
		 *
		 * Deprecated!
		 */
		setFields : function(fields)
		{
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

