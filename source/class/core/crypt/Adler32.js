/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Implements the Adler32 checksum
 * 
 * See also: http://en.wikipedia.org/wiki/Adler-32
 */
core.Module("core.crypt.Adler32",
{
	/**
	 * {Integer} Returns the Adler-32 checksum of @str {String}
	 */
	checksum : function(str)
	{
		var MOD_ADLER = 65521;
		var a=1, b=0;
		
		str = core.String.encodeUtf8(str);

		// Process each byte of the string in order
		for (var index=0, len=str.length; index<len; ++index)
		{
			a = (a + str.charCodeAt(index)) % MOD_ADLER;
			b = (b + a) % MOD_ADLER;
		}

		return (b << 16) | a;
	}
})