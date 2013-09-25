/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

"use strict";

(function() {

	var MASK = [0, 1, 3, 7, 15, 31, 63];
	var MAP = {};
	var REVMAP = {};
	(function() {
		var CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for (var i=0,ii=CHARSET.length; i<ii; i++) {
			var chr = CHARSET[i];
			MAP[chr] = i;
			REVMAP[i] = chr;
		}
	})();

	// first 12 bits, remaining 4 bits are size infos
	var MARKERINT = 2730;
	var MARKERINTSHIFT = MARKERINT << 4;
	var MARKER = String.fromCharCode(MARKERINTSHIFT);

	//
	// Fix illegal UTF-16 characters
	// based upon
	//
	// ES6 Unicode Shims 0.1
	// (c) 2012 Steven Levithan <http://slevithan.com/>
	// MIT License
	//
	// found at https://gist.github.com/slevithan/2290602#file-es6-unicode-shims-js-L50
	//
	var codePointAt = function (str, pos) {
		var code = str.charCodeAt(pos);
		var next = str.charCodeAt(pos + 1);
		// If a surrogate pair
		if (0xD800 <= code && code <= 0xDBFF && 0xDC00 <= next && next <= 0xDFFF) {
			return ((code - 0xD800) * 0x400) + (next - 0xDC00) + 0x10000;
		}
		return code;
	};

	var fromCodePoint = function (point) {
		var units;
		if (point > 0xFFFF) {
			var offset = point - 0x10000;
			units = [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)];
		} else {
			units = [point];
		}
		return String.fromCharCode.apply(null, units);
	};

	/**
	 * {String} Returns packed UTF16 representation of given base64 encoded @text {String}.
	 */
	var compress64 = function(text) {
		var out=[MARKER];
		var bits=16, chr=0, rem=0;
		for (var i=0, l=text.length; i<l; i++) {
			var character = text[i];
			if (character === "=") {
				break;
			}

			if (bits > 6) {
				bits -= 6;
				var e = MAP[character];
				chr += e << bits;
			} else {
				rem = 6 - bits;
				chr += MAP[character] >> rem;
				out.push(fromCodePoint(chr));
				chr = (MAP[character] & MASK[rem]) << (16 - rem);
				bits = 16-rem;
			}
		}

		if (bits != 16) {
			// Save used bits of last character into marker character
			out[0] = fromCodePoint(MARKERINTSHIFT + bits);
			out.push(fromCodePoint(chr));
		}
		
		return out.join("");
	};

	/**
	 * {String} Returns unpacked base64 string representation of given @encodedText {String}.
	 */
	var decompress64 = function(encodedText) {
		var marker = codePointAt(encodedText, 0);
		if ((marker >> 4) !== MARKERINT) return encodedText;

		var lastBits = 16 - (marker & 0x0f);
		var encodedTextLength = encodedText.length - 1;

		var bitPos = 0;
		var out = [];
		var chr = 0;
		var chrPos = 0;
		var tmpBits = 0;
		var r;
		for (var i=16, l=encodedText.length * 16; i<l; i=i+6) {
			bitPos = i % 16;
			chrPos = (i / 16) << 0;
			chr = codePointAt(encodedText, chrPos);

			if (chrPos == encodedTextLength) {
				if (bitPos + 6 > lastBits) {
					// Break if rest of text is filled up
					break;
				}
			}

			var remainingBits = 16-bitPos;
			if (remainingBits >= 6) {
				r = (chr >> (remainingBits - 6)) & 63;
				out.push(REVMAP[r]);
			} else {
				tmpBits = 6-remainingBits;
				r = (chr & MASK[remainingBits]) << tmpBits;
				chr = codePointAt(encodedText, chrPos + 1);
				var c2 = chr >> (16-tmpBits);
				r = (r + c2) & 63;
				out.push(REVMAP[r]);
			}

			if (chrPos == encodedTextLength) {
				if (bitPos + 6 == lastBits) {
					// Break if bit position is exactly on last bit
					break;
				}
			}
		}

		return out.join("");
	};

	/**
	 * Text compressor to compress (mainly western) strings to UTF16 in an size efficient way. This is based upon work of FT.
	 */
	core.Module("core.util.TextCompressor", 
	{
		compress64 : compress64,
		decompress64 : decompress64,

	
		/**
		 * {String} Returns packed UTF16 representation of given encoded @text {String}.
		 */
		compress : function(text) {
			return compress64(core.util.Base64.encode(text));
		},


		/**
		 * {String} Returns unpacked string representation of given @encodedText {String}.
		 */
		decompress : function(encodedText) {
			return core.util.Base64.decode(decompress64(encodedText));
		}
	});
})();
