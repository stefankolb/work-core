/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

"use strict";


(function() {
	
	var base62Table = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	var base62InvertedTable = {};
	for (var i=0; i<62; i++) {
		base62InvertedTable[base62Table[i]] = i;
	}
	
	var encodeArrayOfBytes = function(arr) {
		var inputLength = arr.length;
		var bitlen = inputLength * 8;
		var ret = [];
		
		var bitpos = 0;
		var getBits = 6;
		var specialBit = 0;
		var leadingZero = 0;
		var val;
		while (bitpos < bitlen) {
			var posMod8 = bitpos % 8;
			console.log(bitpos, posMod8);
			var posDiv8 = Math.floor(bitpos / 8);
			if (getBits == 6) {
				if (posMod8 < 2) {
					val = (arr[posDiv8] >> (2 - posMod8)) & 63;
				} else {
					var nextPos = posDiv8 + 1;
					if (nextPos >= inputLength) {
						val = ((arr[posDiv8] << posMod8) & 255) >> (8-posMod8);
					} else {
						var nextBits = 6-(8-posMod8);
						val = arr[nextPos] >> (8-nextBits);
						val += arr[posDiv8] << nextBits;
						val = val & 63;
					}
				}
			} else {
				if (posMod8 < 3) {
					val = (arr[posDiv8] >> (3 - posMod8)) & 31;
				} else {
					var nextPos = posDiv8 + 1;
					if (nextPos >= inputLength) {
						val = ((arr[posDiv8] << posMod8) & 255) >> posMod8;
						var bits = 8-posMod8;
						val = val << 5-bits;
						leadingZero = 6 - (bits + 1);
						console.log(bits, (val).toString(2));
					} else {
						var nextBits = 5-(8-posMod8);
						val = arr[nextPos] >> (8-nextBits);
						val += arr[posDiv8] << nextBits;
						val = val & 31;
					}
				}
				val |= specialBit;
				if (leadingZero) {
					val = val >> leadingZero;
					leadingZero = 0;
				}
				console.log("special", (val).toString(2));
			}
			
			bitpos += getBits;
			
			if (val == 60 || val == 61) {
				// Special case: bits are 111100 or 111101
				getBits = 5;
				specialBit = (val == 60) ? 0 : 32;
				ret.push(base62Table[60]);
			} else if (val == 62 || val == 63) {
				// Special case: bits are 111110 or 111111
				getBits = 5;
				specialBit = (val == 62) ? 0 : 32;
				ret.push(base62Table[61]);
			} else {
				getBits = 6;
				ret.push(base62Table[val]);
			}
		}
		
		return ret.join("");
	};
	
	var decodeToArrayOfBytes = function(str) {
		var ret = [];
		var cur = 0;
		var bitpos = 0;
		
		for (var i=0, ii=str.length; i<ii; i++) {
			var byte = base62InvertedTable[str[i]];
console.log(i, "bitpos: ", bitpos, cur.toString(2));
			if (byte == 60 || byte == 61) {
				cur = (byte == 60) ? 30 : 31;
				bitpos = 5;
			} else {
				if (bitpos == 0) {
					cur = byte;
					bitpos = 6;
				} else {
					var neededBits = 8-bitpos;
					console.log(i, "needed", neededBits);
					if (neededBits <= 6) {
						var val;
						if (i==ii-1) {
							val = byte;
						} else {
							val = byte >> (6 - neededBits);
						}
						cur = (cur << neededBits) + val;
						console.log(i, neededBits, byte.toString(2), val.toString(2), cur.toString(2));
						ret.push(cur);
						cur = ((byte << neededBits) & 63) >> neededBits;
						bitpos = 6 - neededBits;
					} else {
						cur = (cur << 6) + byte;
						console.log(i, cur.toString(2));
						bitpos += 6;
					}
				}
			}
		}
		
		return ret;
	};
	
	core.Module("core.util.Base62", {
		/**
		 * {String} Returns an universally unique ID generated using version 4 algorithm
		 * of http://www.ietf.org/rfc/rfc4122.txt
		 */
		encode : function() {
			
		},
		
		decode : function() {
		}
	});
})();
