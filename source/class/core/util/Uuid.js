/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

"use strict";


(function() {
	var Random = core.util.Random;
	var ArrayType = typeof(Uint8Array) == "function" ? Uint8Array : Array;
	
	var hexTable = new Array(256);
	for (var i=0; i<256; i++) {
		if (i < 16) {
			hexTable[i] = "0" + i.toString(16);
		} else {
			hexTable[i] = i.toString(16);
		}
	}
	
	var getArrayOfBytes = function() {
		var uuid = new ArrayType(16);
		for (var i=0; i<16; i++) {
			if (i==6) {
				uuid[i] = 64 + (Random.getByte() & 0x0F); // 4 << 4 + RANDOM : First 4 bits representing version number (=4)
			} else if (i==8) {
				uuid[i] = (((Random.getByte() & 0x0F)&0x3|0x8) << 4) + (Random.getByte() & 0x0F); // Random byte with first two bits set to 10
			} else {
				uuid[i] = Random.getByte();
			}
		}
		return uuid;
	};
	
	/**
	 * RFC4122 UUID version 4 generator (http://www.ietf.org/rfc/rfc4122.txt)
	 */
	core.Module("core.util.Uuid", {
		/**
		 * {String} Returns a 36 characters long standard conform 
		 * UUID string containing dashes.
		 */
		get : function() {
			var uuidBytes = getArrayOfBytes();
			var uuidStrArray1 = new Array(4);
			var uuidStrArray2 = new Array(2);
			var uuidStrArray3 = new Array(2);
			var uuidStrArray4 = new Array(2);
			var uuidStrArray5 = new Array(6);
			var i;
			for (i=0; i<4; i++) {
				uuidStrArray1[i] = hexTable[uuidBytes[i]];
			}
			for (i=0; i<2; i++) {
				uuidStrArray2[i] = hexTable[uuidBytes[i + 4]];
			}
			for (i=0; i<2; i++) {
				uuidStrArray3[i] = hexTable[uuidBytes[i + 6]];
			}
			for (i=0; i<2; i++) {
				uuidStrArray4[i] = hexTable[uuidBytes[i + 8]];
			}
			for (i=0; i<6; i++) {
				uuidStrArray5[i] = hexTable[uuidBytes[i + 10]];
			}
			return uuidStrArray1.join("") + "-" + uuidStrArray2.join("") + "-" + uuidStrArray3.join("") + "-" + uuidStrArray4.join("") + "-" + uuidStrArray5.join("");
		},
		
		/**
		 * {String} Returns a 32 characters long plain string 
		 * representing hexadecimal value of UUID.
		 */
		getHex : function() {
			var uuidBytes = getArrayOfBytes();
			var uuidStrArray = new Array(16);
			for (var i=0; i<16; i++) {
				uuidStrArray[i] = hexTable[uuidBytes[i]];
			}
			return uuidStrArray.join("");
		},
	
		/**
		 * {Uint8Array|Array} Returns a 16 elements long array of bytes 
		 * representing an universally unique ID.
		 */
		getArrayOfBytes : getArrayOfBytes
	});
})();
