/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

/**
 * Promises implementation of A+ specification passing Promises/A+ test suite.
 * Very efficient due to object pooling.
 * http://promises-aplus.github.com/promises-spec/
 */
core.Class("core.event.Promise", 
{
	pooling : true,
	
	construct : function() 
	{
		// Initialize lists on new Promises
		if (this.__onFulfilledQueue == null)
		{
			this.__onFulfilledQueue = [];
			this.__onRejectedQueue = [];
		}
	},
	
	members : 
	{
		/** {=String} Current state */
		__state : "pending",


		/** {=Boolean} Whether the promise is locked */
		__locked : false,


		/** {=any} Any value */
		__valueOrReason : null,


		/** 
		 * {any} Returns the value of the promise
		 */
		getValue : function() {
			return this.__valueOrReason;
		},


		/**
		 * {String} Returns the current state. One of pending, fulfilled or rejected.
		 */
		getState : function() {
			return this.__state;
		},


		/**
		 * Fulfill promise with @value {any?}.
		 */
		fulfill : function(value) 
		{
			if (!this.__locked) 
			{
				this.__locked = true;
				this.__state = "fulfilled";
				this.__valueOrReason = value;

				core.util.Function.immediate(this.__execute, this);
			}
		},
		

		/**
		 * Reject promise with @reason {String|any?}.
		 */
		reject : function(reason) 
		{
			if (!this.__locked) 
			{
				this.__locked = true;
				this.__state = "rejected";
				this.__valueOrReason = reason;

				core.util.Function.immediate(this.__execute, this);
			}
		},

	
		/**
		 * Executes a single fulfillment or rejection queue @entry {Array} 
		 * with the give @valueOrReason {any} and state {String}.
		 */	
		__executeEntry : function(entry, valueOrReason, state) 
		{
			var child = entry[0];
			var callback = entry[1];

			if (callback === null) 
			{
				if (state == "rejected") {
					child.reject(valueOrReason);
				} else {
					child.fulfill(valueOrReason);
				}
			}
			else
			{
				try 
				{
					var context = entry[2];
					var retval = context ? callback.call(context, valueOrReason) : callback(valueOrReason);
					if (retval && retval.then && typeof retval.then == "function") 
					{ 
						var retstate = retval.getState ? retval.getState() : "pending";
						if (retstate == "pending") 
						{
							retval.then(function(value) {
								child.fulfill(value);
							}, function(reason) {
								child.reject(reason);
							});
						}
						else if (retstate == "fulfilled") 
					  {
							child.fulfill(retval.getValue());
						}
						else if (retstate == "rejected") 
						{
							child.reject(retval.getValue());
						}
					} 
					else 
					{
						child.fulfill(retval);
					}
				} 
				catch (ex) {
					child.reject(ex);
				}
			}
		},


		/**
		 * Handle fulfillment or rejection of promise
		 * Runs all registered then handlers
		 */
		__execute : function() 
		{
			// Shorthands
			var rejectedQueue = this.__onRejectedQueue;
			var fullfilledQueue = this.__onFulfilledQueue;
			var valueOrReason = this.__valueOrReason;
			var state = this.__state;

			// Process the relevant queue
			var queue = this.__state == "rejected" ? rejectedQueue : fullfilledQueue;
			for (var i=0, l=queue.length; i<l; i++) {
				this.__executeEntry(queue[i], valueOrReason, state);
			}

			// Cleanup lists for next usage
			rejectedQueue.length = 0;
			fullfilledQueue.length = 0;

			// Cleanup internal state
			this.__state = "pending";
			this.__locked = false;
			
			// Auto release promise after fulfill/reject and all handlers being processed
			this.release();
		},
		

		/**
		 * {core.event.Promise} Register fulfillment handler {function} @onFulfilled 
		 * and rejection handler {function} @onRejected returning new child promise.
		 */
		then : function(onFulfilled, onRejected, context) 
		{
			var child = core.event.Promise.obtain();

			var fullfilledQueue = this.__onFulfilledQueue;
			var rejectedQueue = this.__onRejectedQueue;

			if (onFulfilled && typeof onFulfilled == "function") {
				fullfilledQueue.push([child, onFulfilled, context]);
			} else {
				fullfilledQueue.push([child]);
			}

			if (onRejected && typeof onRejected == "function") {
				rejectedQueue.push([child, onRejected, context]);
			} else {
				rejectedQueue.push([child]);
			}
			
			return child;
		}
	}
});

