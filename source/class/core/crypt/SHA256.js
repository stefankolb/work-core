/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of:
  Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
  Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
  Distributed under the BSD License
  See http://pajhome.org.uk/crypt/md5 for details.
  Also http://anmar.eu.org/projects/jssha2/
==================================================================================================
*/

"use strict";

/* jshint bitwise:false */

(function(Util, StringUtil)
{
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-2.
	 */
	core.Module("core.crypt.SHA256",
	{
		/**
		 * {String} Returns the SHA256 checksum of the given @str {String} as a raw string.
		 */
		checksum : function(str) {
			return Util.byteArrayToRawString(this.checksumAsByteArray(str));
		},


		/**
		 * {Array} Returns the SHA256 checksum of the given @str {String} as an byte array.
		 */
		checksumAsByteArray : function(str)
		{
			str = StringUtil.encodeUtf8(str);
			return Util.bigEndianToByteArray(binb(Util.rawStringToBigEndian(str), str.length * 8));
		},


		/**
		 * {String} Returns a HMAC (Hash-based Message Authentication Code) using the SHA256 hash function as a raw string.
		 *
		 * HMAC is a specific construction for calculating a message authentication code (MAC) involving a
		 * cryptographic hash function in combination with a secret key.
		 *
		 * - @key {String} The secret key for verifying authenticity
		 * - @str {String} Message to compute the HMAC for
		 */
		hmac : function(key, str)
		{
			key = StringUtil.encodeUtf8(key);
			str = StringUtil.encodeUtf8(str);

			var bkey = Util.rawStringToBigEndian(key);
			if (bkey.length > 16) {
				bkey = binb(bkey, key.length * 8);
			}

			var ipad = new Array(16);
			var opad = new Array(16);

			for (var i = 0; i < 16; i++)
			{
				ipad[i] = bkey[i] ^ 0x36363636;
				opad[i] = bkey[i] ^ 0x5C5C5C5C;
			}

			var hash = binb(ipad.concat(Util.rawStringToBigEndian(str)), 512 + str.length * 8);
			return Util.bigEndianToRawString(binb(opad.concat(hash), 512 + 256));
		}
	});

	/*
	 * Main sha256 function, with its support functions
	 */
	function S (X, n) {return ( X >>> n ) | (X << (32 - n));}
	function R (X, n) {return ( X >>> n );}
	function Ch(x, y, z) {return ((x & y) ^ ((~x) & z));}
	function Maj(x, y, z) {return ((x & y) ^ (x & z) ^ (y & z));}
	function sigma0256(x) {return (S(x, 2) ^ S(x, 13) ^ S(x, 22));}
	function sigma1256(x) {return (S(x, 6) ^ S(x, 11) ^ S(x, 25));}
	function gamma0256(x) {return (S(x, 7) ^ S(x, 18) ^ R(x, 3));}
	function gamma1256(x) {return (S(x, 17) ^ S(x, 19) ^ R(x, 10));}

	var K =
	[
		1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
		-1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
		1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
		264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
		-1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
		113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
		1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
		-1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
		430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
		1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
		-1866530822, -1538233109, -1090935817, -965641998
	];

	function binb(m, l)
	{
		var HASH = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
		var W = new Array(64);
		var a, b, c, d, e, f, g, h;
		var i, j, T1, T2;

		/* append padding */
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for(i = 0; i < m.length; i += 16)
		{
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];

			for(j = 0; j < 64; j++)
			{
				if (j < 16) {
					W[j] = m[j + i];
				} else {
					W[j] = safeAdd(safeAdd(safeAdd(gamma1256(W[j - 2]), W[j - 7]), gamma0256(W[j - 15])), W[j - 16]);
				}

				T1 = safeAdd(safeAdd(safeAdd(safeAdd(h, sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safeAdd(sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safeAdd(d, T1);
				d = c;
				c = b;
				b = a;
				a = safeAdd(T1, T2);
			}

			HASH[0] = safeAdd(a, HASH[0]);
			HASH[1] = safeAdd(b, HASH[1]);
			HASH[2] = safeAdd(c, HASH[2]);
			HASH[3] = safeAdd(d, HASH[3]);
			HASH[4] = safeAdd(e, HASH[4]);
			HASH[5] = safeAdd(f, HASH[5]);
			HASH[6] = safeAdd(g, HASH[6]);
			HASH[7] = safeAdd(h, HASH[7]);
		}
		return HASH;
	}

	function safeAdd(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

		return (msw << 16) | (lsw & 0xFFFF);
	}

})(core.crypt.Util, core.String);
