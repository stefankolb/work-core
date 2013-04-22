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
	var bitMask = [252, 252, 252, 248, 240, 224, 192, 128]; // And mask for 6, 6, 6, 5, 4, 3, 2, 1 leading bits

	var encodeArrayOfBytes = function(arr) {
		// This works like a bit register. Take first 6 bits and push it to result. Take next 6 bits and so on.
		// A special case is if the 6 bits represents 60, 61, 62 or 63. In this case one more bit is used to
		// reduce 6 bit (= 64 different values) by two values.
		var result = [];
		var charLength = arr.length;
		var bitLength = charLength * 8;
		var bitPos = 0;
		var specialBit = null;
	
		while (bitPos < bitLength) {
			var charOffset = bitPos / 8 | 0;
			var bitOffset = bitPos % 8;
		
			var extractedBits;
			if (charOffset + 1 >= charLength) {
				// Special case : no more next char so no more bits
				var remainingBits = bitLength - bitPos;
				var moveRight;
				if (remainingBits >= 6) {
					moveRight = 2;
				} else {
					moveRight = 8 - remainingBits;
				}
				extractedBits = ( (arr[charOffset] << bitOffset) & 252 ) >> moveRight;
			} else {
				var leftoverBits = bitOffset - 2;
				extractedBits = (( (arr[charOffset] << bitOffset) & bitMask[bitOffset] )
							+ ( (arr[charOffset+1] & bitMask[8-leftoverBits]) >> (6-leftoverBits) )) >> 2;
			}
		
			if ((extractedBits & 62) == 60) {
				extractedBits = 61;
				bitPos -= 1;
			} else if ((extractedBits & 62) == 62) {
				extractedBits = 62;
				bitPos -= 1;
			}
			result.push(extractedBits);
		
			bitPos += 6;
		}
	
		return result;
	};

	var decodeToArrayOfBytes = function(arr) {
		var result = [];
		var current = 0;
		var bitOffset = 0;
		var charOffset = 0;
		var charLength = arr.length;
	
		for (var charOffset=0; charOffset < charLength; charOffset++) {
			var char = arr[charOffset];
		
			var bitsNeeded = 8 - bitOffset;
			if (char == 61 || char == 62) {
				var correctBits = (char == 61) ? 30 : 31;
				if (bitsNeeded <= 5) {
					current = ((current << bitsNeeded) + (correctBits >> (5-bitsNeeded))) & 255;
					result.push(current);
					current = (((correctBits << bitsNeeded) & 255) >> bitsNeeded) & 63;
					bitOffset = 5 - bitsNeeded;
				} else {
					current = (current << 5) + correctBits;
					bitOffset += 5;
				
					if (bitOffset == 8) {
						result.push(current);
						current = 0;
					}
				}
			} else {
				if (bitsNeeded <= 6) {
					var last = charOffset == charLength -1;
					var charShift = char;
					if (!last) {
						charShift = char >> (6-bitsNeeded);
					}
					current = ((current << bitsNeeded) + charShift) & 255;
					result.push(current);
					if (!last) {
						current = (((char << bitsNeeded) & 255) >> bitsNeeded) & 63;
					}
					bitOffset = 6 - bitsNeeded;
				} else {
					current = (current << 6) + char;
					bitOffset += 6;
				
					if (bitOffset == 8) {
						result.push(current);
						current = 0;
					}
				}
			}
		}
	
		return result;
	};
	
	var encodeArrayToString = function(arr) {
		var result = encodeArrayOfBytes(arr);
		for (var i=0, ii=result.length; i<ii; i++) {
			result[i] = base62Table[result[i]];
		}
		
		return result.join("");
	};
	
	var decodeStringToArray = function(str) {
		var len = str.length;
		var byteArray = new Array(len);
		for (var i=0; i<len; i++) {
			byteArray[i] = base62InvertedTable[str[i]];
		}
		return decodeToArrayOfBytes(byteArray);
	};
	
	/**
	 * Base62 encoder and decoder.
	 * Most implementations out there encodes and decodes only one byte/character
	 * and joins the result to one result string. This is wrong behaviour as the
	 * resulting string is longer than needed.
	 * This implementation supports bit packing as described in 
	 * http://202.194.20.8/proc/ICCS2008/papers/156.pdf (A Secure, Lossless, and 
	 * Compressed Base62 Encoding) / Section Base62 Encoding.
	 */
	core.Module("core.util.Base62", {
		/**
		 * {String} Encodes @str {String} to base62 encoded string
		 */
		encode : function(str) {
			var len = str.length;
			var byteArray = new Array(len);
			for (var i=0; i<len; i++) {
				byteArray[i] = str.charCodeAt(i);
			}
			
			return encodeArrayToString(byteArray);
		},
		
		/**
		 * {Array} Encodes @arr {Array} to base62 encoded array
		 */
		encodeArray : encodeArrayOfBytes,
		
		/**
		 * {String} Encodes @arr {Array} to base62 encoded string.
		 */
		encodeArrayToString : encodeArrayToString,
		
		/**
		 * {String} Decodes base62 encoded @str {String} to plain text string.
		 */
		decode : function(str) {
			var result = decodeStringToArray(str);
			for (var i=0, ii=result.length; i<ii; i++) {
				result[i] = String.fromCharCode(result[i]);
			}
			
			return result.join("");
		},
		
		/**
		 * {Array} Decodes base62 encoded @arr {Array}.
		 */
		decodeArray : decodeToArrayOfBytes,
		
		/**
		 * {Array} Decodes base62 encoded @str {String}.
		 */
		decodeStringToArray : decodeStringToArray
	});
})();
