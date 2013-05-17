/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

"use strict";

(function() {

	var getRandomByte;
	var getRandomBytes;
	var getRandomRes53;
	var getRandomInt32;

	if (jasy.Env.isSet("runtime", "native")) {
	
		var Crypto = require("crypto");
		getRandomByte = function() {
			return Crypto.randomBytes(1)[0];
		};
		getRandomBytes = Crypto.randomBytes;
		getRandomInt32 = function() {
			var randArr = getRandomBytes(4);
			return randArr.readUInt32BE(0);
		};
		getRandomRes53 = function() {
			// Used version from MersenneTwister
			var a = getRandomInt32() >>> 5,
				b = getRandomInt32() >>> 6;
			return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
		};
		
	} else if (window.crypto && window.crypto.getRandomValues) {
	
		getRandomByte = function() {
			// Crypto API
			var array = new Uint8Array(1);
			window.crypto.getRandomValues(array);
			return array[0];
		};
		getRandomBytes = function(size) {
			var result = new Uint8Array(size);
			window.crypto.getRandomValues(result);
			return result;
		};
		getRandomInt32 = function() {
			var result = new Uint32Array(1);
			window.crypto.getRandomValues(result);
			return result[0];
		};
		getRandomRes53 = function() {
			// Used version from MersenneTwister
			var a = getRandomInt32() >>> 5,
				b = getRandomInt32() >>> 6;
			return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
		};
		
	} else {
	
		var ArrayType = "Uint8Array" in window ? Uint8Array : Array;
		var MersenneTwister = new core.util.MersenneTwister();
		
		var mtGetByte = function() {
			return MersenneTwister.randomInt32() & 0xFF;
		};
		var mtGetRandomInt32 = function() {
			return MersenneTwister.randomInt32();
		};
		var mtGetRes53 = function() {
			return MersenneTwister.randomRes53();
		};
		var mathGetByte = function() {
			return Math.floor(Math.random() * 256);
		};
		
		// Gets random byte. Opera has a per default strong random number generator,
		// see http://lists.w3.org/Archives/Public/public-webcrypto/2013Jan/0063.html
		getRandomByte = jasy.Env.isSet("engine", "presto") ? mathGetByte : mtGetByte;
		getRandomBytes = function(size) {
			var result = new ArrayType(size);
			for (var i=0; i<size; i++) {
				result[i] = getRandomByte();
			}
			return result;
		};
		getRandomInt32 = jasy.Env.isSet("engine", "presto") ? function() {
			return getRandomByte() * 0xFFFFFFFF;
		} : mtGetRandomInt32;
		getRandomRes53 = jasy.Env.isSet("engine", "presto") ? Math.random : mtGetRes53;
		
	}

	
	/**
	 * Strong pseudo random numbers, using best source different platforms and browsers could use
	 */
	core.Module("core.util.Random", {
		/**
		 * {Byte} Return random byte [0..0xFF]
		 */
		getByte : getRandomByte,
		
		/**
		 * {Array|Uint8Array} Returns array of random bytes containing @size {Integer} elements.
		 * If typed arrays available returns Uint8Array.
		 */
		getByteArray : getRandomBytes,
	
		/**
		 * {Integer} Returns a 32bit long random integer [0..0xFFFFFFFF]
		 */
		getInt32 : getRandomInt32,
		
		/**
		 * {Float} Returns a random float with a resolution of 53bit [0..1)
		 */
		getResolution53 : getRandomRes53
	});
})();
