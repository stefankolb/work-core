module.exports = {
	resolved : function(value) {
		var promise = new core.event.Promise();
		promise.fulfill(value);
		return promise;
	},

	rejected : function(reason) {
		var promise = new core.event.Promise();
		promise.reject(reason);
		return promise;
	},

	deferred : function() {
		var promise = new core.event.Promise();

		return {
			promise: promise,
			resolve: promise.fulfill,
			reject: promise.reject
		};
	}
};
