/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

(function() 
{
	/**
	 * Promises implementation of A+ specification passing Promises/A+ test suite.
	 * Very efficient due to object pooling.
	 * http://promises-aplus.github.com/promises-spec/
	 */
	core.Class("core.event.Promise", {
		pooling : true,
		
		construct : function() {
			// Clean up onFulfilled handlers
			var onFulfilled = this.__onFulfilled = this.__onFulfilled || [];
			onFulfilled.length = 0;

			// Clean up onRejected handlers
			var onRejected = this.__onRejected = this.__onRejected || [];
			onRejected.length = 0;

			// Reset value/reason to default
			this.resetValue();

			// Reset state to pending
			this.resetState();
		},
		
		properties : {
			/** {String} State of promise (pending, fulfilled, rejected) */
			state : {
				type : ["pending", "fulfilled", "rejected"],
				init : "pending",
				apply : function(value) {
					this.__locked = (value != "pending");
				}
			},
			
			/** Value (state == fulfilled) or reason (state == rejected) of promise */
			value : {
				nullable: true,
				init: null
			}
		},
		
		members : {
			/**
			 * Fulfill promise with @value
			 */
			fulfill : function(value) {
				if (this.__locked) {
					return;
				}
				core.util.Function.immediate(this.__handler.bind(this, "fulfilled", value));
			},
			
			/**
			 * Reject promise with @reason
			 */
			reject : function(reason) {
				if (this.__locked) {
					return;
				}
				core.util.Function.immediate(this.__handler.bind(this, "rejected", reason));
			},
		
			/**
			 * Handle single fulfillment or rejection handler @fnt with correct subsequent promise {core.event.Promise} @myPromise.
			 */	
			__handleFnt : function(fnt, myPromise, value, state) {
				if (fnt === null) {
					if (state == "rejected") {
						myPromise.reject(value);
					} else {
						myPromise.fulfill(value);
					}
					return;
				}

				var fulFnt = function(value) {
					myPromise.fulfill(value);
				};
				var rejFnt = function(reason) {
					myPromise.reject(reason);
				};				

				try {
					var retval = fnt(value);
					if (retval && retval.then && typeof retval.then == "function") { //instanceof core.event.Promise) {
						var retstate = retval.getState ? retval.getState() : "pending";

						if (retstate == "pending") {
							retval.then(fulFnt, rejFnt);
						} else if (retstate == "fulfilled") {
							myPromise.fulfill(retval.getValue());
						} else if (retstate == "rejected") {
							myPromise.reject(retval.getValue());
						}
					} else {
						myPromise.fulfill(retval);
					}
				} catch (e) {
					myPromise.reject(e);
				}
				
			},

			/**
			 * Handle fulfillment or rejection of promise
			 * Runs all registered then handlers
			 */
			__handler : function(state, value) {
				if (this.__locked) {
					return;
				}

				var fntList;
				if (state == "rejected") {
					fntList = this.__onRejected;
				} else {
					fntList = this.__onFulfilled;
				}
				this.setState(state);
				this.setValue(value);
				
				for (var i=0; i<fntList.length; i++) {
					var fntarr = fntList[i];
					this.__handleFnt(fntarr[0], fntarr[1], value, state);
				}

				this.release();
			},
			
			/**
			 * {core.event.Promise} Register fulfillment handler {function} @onFulfilled and rejection handler {function} @onRejected
			 * returning new subsequent promise.
			 */
			then : function(onFulfilled, onRejected) {
				var promise = core.event.Promise.obtain();
				
				if (onFulfilled && (typeof onFulfilled == "function")) {
					this.__onFulfilled.push([onFulfilled, promise]);
				} else {
					this.__onFulfilled.push([null, promise]);
				}
				if (onRejected && (typeof onRejected == "function")) {
					this.__onRejected.push([onRejected, promise]);
				} else {
					this.__onRejected.push([null, promise]);
				}
				
				return promise;
			}
		}
	});
})();
