/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(String) 
{
	/**
	 * Utility collection used by the different checksum/hashing implementations.
	 */
	core.Module("core.crypt.Util", 
	{
		/**
		 * {Array} Converts a raw @input {String} into an byte array.
		 */
		rawStringToByteArray : function(input)
		{
			var length = input.length;
			var result = new Array(length);

			for (var i=0; i<length; i++) {
				result[i] = input.charCodeAt(i);
			}

			return result;
		},


		/**
		 * {String} Convers a @input {ByteArray} to a raw string.
		 */
		byteArrayToRawString : function(input) {
			return String.fromCharCode.apply(String, input);
		},


		/**
		 * {Array} Convert @input {String} to an array of little-endian words.
		 * 
		 * Note: Characters >255 have their high-byte silently ignored.
		 */
		rawStringToLittleEndian : function(input)
		{
			var output = Array(input.length >> 2);
			
			for(var i = 0; i < output.length; i++) {
				output[i] = 0;
			}
				
			for(var i = 0; i < input.length * 8; i += 8) {
				output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
			}
				
			return output;
		},


		/**
		 * {String} Converts @input {Array} of little-endian words to a string.
		 */
		littleEndianToRawString : function(input) {
			return this.byteArrayToRawString(this.littleEndianToByteArray(input));
		},


		/**
		 * {Array} Converts @input {Array} of little-endian words to a byte array.
		 */
		littleEndianToByteArray : function(input)
		{
			var length = input.length * 32;
			var output = new Array(length / 8);
			
			for (var i=0; i<length; i+=8) {
				output[i/8] = (input[i>>5] >>> (i % 32)) & 0xFF;
			}
				
			return output;
		},		
		
		
		/**
		 * {Array} Converts a @input {String} to an array of big-endian words.
		 *
		 * Note: Characters >255 have their high-byte silently ignored.
		 */
		rawStringToBigEndian : function(input)
		{
			var output = Array(input.length >> 2);

			for (var i = 0; i < output.length; i++) {
				output[i] = 0;
			}

			for (var i = 0; i < input.length * 8; i += 8) {
				output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
			}

			return output;
		},
		
		
		/**
		 * {String} Converts @input {Array} of big-endian words to a string.
		 */
		bigEndianToRawString : function(input) {
			return this.byteArrayToRawString(this.bigEndianToByteArray(input));
		},


		/**
		 * {Array} Converts @input {Array} of big-endian words to a byte array.
		 */
		bigEndianToByteArray : function(input)
		{
			var length = input.length * 32;
			var output = new Array(length / 8);
			
			for (var i=0; i<length; i+=8) {
				output[i/8] = (input[i>>5] >>> (24 - i % 32)) & 0xFF;
			}
			
			return output;
		}		
	});

})(String);

