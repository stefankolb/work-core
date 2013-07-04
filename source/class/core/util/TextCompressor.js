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

	var MARKER = String.fromCharCode(9730);

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
				out.push(String.fromCharCode(chr));
				chr = (MAP[character] & MASK[rem]) << (16 - rem);
				bits = 16-rem;
			}
		}
		return out.join("");
	};

	/**
	 * {String} Returns unpacked base64 string representation of given @encodedText {String}.
	 */
	var decompress64 = function(encodedText) {
		if (encodedText[0] !== MARKER) return encodedText;

		var bitPos = 0;
		var out = [];
		var chr = 0;
		var chrPos = 0;
		var tmp = 0;
		var tmpBits = 0;
		for (var i=16, l=encodedText.length * 16; i<l; i=i+6) {
			bitPos = i % 16;
			chrPos = (i / 16) << 0;
			chr = encodedText.charCodeAt(chrPos);

			var remainingBits = 16-bitPos;
			if (remainingBits >= 6) {
				var r = (chr >> (remainingBits - 6)) & 63;
				out.push(REVMAP[r]);
			} else {
				tmpBits = 6-remainingBits;
				var r = (chr & MASK[remainingBits]) << tmpBits;
				chr = encodedText.charCodeAt(chrPos + 1);
				var c2 = chr >> (16-tmpBits);
				r = (r + c2) & 63;
				out.push(REVMAP[r]);
			}
		}

		return out.join("");
	};

	/**
	 * Text compressor to compress (mainly western) strings to UTF16 in an size efficient way. This is based upon work of FT.
	 */
	core.Module("core.util.TextCompressor", {
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
