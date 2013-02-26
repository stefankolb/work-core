(function() {

var id = 100;

// http://promises-aplus.github.com/promises-spec/
core.Class("core.event.Promise", {
	//pooling : true,
	
	construct : function() {
		var onFulfilled = this.__onFulfilled = this.__onFulfilled || [];
		onFulfilled.length = 0;
		var onRejected = this.__onRejected = this.__onRejected || [];
		onRejected.length = 0;
		this.resetValue();
		this.resetState();
		this.__locked = false;
		this.__id = id++;
	},
	
	properties : {
		state : {
			type : ["pending", "fulfilled", "rejected"],
			init : "pending",
			apply : function(value) {
				this.__locked = (value != "pending");
			}
		},
		
		value : {
			nullable: true,
			init: null
		}
	},
	
	members : {
		fulfill : function(value) {
			if (this.__locked) {
				return;
			}
			setTimeout(this.__handler.bind(this, "fulfilled", value), 0);
		},
		
		reject : function(reason) {
			if (this.__locked) {
				return;
			}
			setTimeout(this.__handler.bind(this, "rejected", reason), 0);
		},
		
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

			//this.release();
		},
		
		then : function(onFulfilled, onRejected) {
			var promise = new core.event.Promise(); //.obtain();
			
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
