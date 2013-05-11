/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

"use strict";

/* 
Again rewrapped to be part of core - Sebastian Fastner 
Found at https://gist.github.com/banksean/300494
*/
/*
I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
so it's better encapsulated. Now you can have multiple random number generators
and they won't stomp all over eachother's state.

If you want to use this as a substitute for Math.random(), use the random()
method like so:

var m = new MersenneTwister();
var randomNumber = m.random();

You can also call the other genrand_{foo}() methods on the instance.

If you want to use a specific seed in order to get a repeatable random
sequence, pass an integer into the constructor:

var m = new MersenneTwister(123);

and that will always produce the same random sequence.

Sean McCullough (banksean@gmail.com)
*/
/* 
A C-program for MT19937, with initialization improved 2002/1/26.
Coded by Takuji Nishimura and Makoto Matsumoto.

Before using, initialize the state by using init_genrand(seed) 
or init_by_array(init_key, key_length).

Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
All rights reserved. 

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

3. The names of its contributors may not be used to endorse or promote 
products derived from this software without specific prior written 
permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Any feedback is very welcome.
http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

(function() {

	var N = 624;
	var M = 397;
	/* Period parameters */
	var MATRIX_A = 0x9908b0df; /* constant vector a */
	var UPPER_MASK = 0x80000000; /* most significant w-r bits */
	var LOWER_MASK = 0x7fffffff; /* least significant r bits */
	

	/**
	 * Mersenne twister strong pseudo random number generator
	 */
	core.Class("core.util.MersenneTwister", {
	
		construct : function(seed) {
			if (seed == undefined) {
				 seed = Date.now();
			}

			this.__mt = new Array(N); /* the array for the state vector */
			this.__mti = N + 1; /* mti==N+1 means mt[N] is not initialized */

			this.__initGenrand(seed);
		},

		members : {

			/* initializes mt[N] with a seed */
			__initGenrand : function(s) {
				this.__mt[0] = s >>> 0;
				for (this.__mti = 1; this.__mti < N; this.__mti++) {
					var s = this.__mt[this.__mti - 1] ^ (this.__mt[this.__mti - 1] >>> 30);
					this.__mt[this.__mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.__mti;
					/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
					/* In the previous versions, MSBs of the seed affect */
					/* only MSBs of the array mt[]. */
					/* 2002/01/09 modified by Makoto Matsumoto */
					this.__mt[this.__mti] >>>= 0;
					/* for >32 bit machines */
				}
			},

			/* initialize by an array with array-length */
			/* init_key is the array for initializing keys */
			/* key_length is its length */
			/* slight change for C++, 2004/2/26 */
			initByArray : function(init_key, key_length) {
				var i, j, k;
				this.__initGenrand(19650218);
				i = 1;
				j = 0;
				k = (N > key_length ? N : key_length);
				for (; k; k--) {
					var s = this.__mt[i - 1] ^ (this.__mt[i - 1] >>> 30)
					this.__mt[i] = (this.__mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
					this.__mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
					i++;
					j++;
					if (i >= N) {
						this.__mt[0] = this.__mt[N - 1];
						i = 1;
					}
					if (j >= key_length) j = 0;
				}
				for (k = N - 1; k; k--) {
					var s = this.__mt[i - 1] ^ (this.__mt[i - 1] >>> 30);
					this.__mt[i] = (this.__mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
					this.__mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
					i++;
					if (i >= N) {
						this.__mt[0] = this.__mt[N - 1];
						i = 1;
					}
				}

				this.__mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
			},

			/* generates a random number on [0,0xffffffff]-interval */
			randomInt32 : function() {
				var y;
				var mag01 = new Array(0x0, MATRIX_A);
				/* mag01[x] = x * MATRIX_A for x=0,1 */

				if (this.__mti >= N) { /* generate N words at one time */
					var kk;

					if (this.__mti == N + 1) /* if init_genrand() has not been called, */
						this.__initGenrand(5489); /* a default initial seed is used */

					for (kk = 0; kk < N - M; kk++) {
						y = (this.__mt[kk] & UPPER_MASK) | (this.__mt[kk + 1] & LOWER_MASK);
						this.__mt[kk] = this.__mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
					}
					for (; kk < N - 1; kk++) {
						y = (this.__mt[kk] & UPPER_MASK) | (this.__mt[kk + 1] & LOWER_MASK);
						this.__mt[kk] = this.__mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
					}
					y = (this.__mt[N - 1] & UPPER_MASK) | (this.__mt[0] & LOWER_MASK);
					this.__mt[N - 1] = this.__mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

					this.__mti = 0;
				}

				y = this.__mt[this.__mti++];

				/* Tempering */
				y ^= (y >>> 11);
				y ^= (y << 7) & 0x9d2c5680;
				y ^= (y << 15) & 0xefc60000;
				y ^= (y >>> 18);

				return y >>> 0;
			},

			/* generates a random number on [0,0x7fffffff]-interval */
			randomInt31 : function() {
				return (this.randomInt32() >>> 1);
			},

			/* generates a random number on [0,1]-real-interval */
			randomReal1 : function() {
				return this.randomInt32() * (1.0 / 4294967295.0);
				/* divided by 2^32-1 */
			},

			/* generates a random number on [0,1)-real-interval */
			random : function() {
				return this.randomInt32() * (1.0 / 4294967296.0);
				/* divided by 2^32 */
			},

			/* generates a random number on (0,1)-real-interval */
			randomReal3 : function() {
				return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
				/* divided by 2^32 */
			},

			/* generates a random number on [0,1) with 53-bit resolution*/
			randomRes53 : function() {
				var a = this.randomInt32() >>> 5,
					b = this.randomInt32() >>> 6;
				return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
			}

			/* These real versions are due to Isaku Wada, 2002/01/09 added */
		}
	});

})();
