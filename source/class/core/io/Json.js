/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Fastner
==================================================================================================
*/

/**
 * Loads all kinds of text content like text, HTML and JSON.
 *
 */
(function(global) {
    /**
	 * Generic loader for any text content using XMLHTTPRequests.
	 */
	core.Module("core.io.Json", 
	{
		/** Whether the loader supports parallel requests */
		SUPPORTS_PARALLEL : true,

		/**
		 * Loads a text file from the given @uri {String} and fires a @callback {Function} (in @context {Object?}) when it was loaded.
		 * Optionally appends an random `GET` parameter to omit caching when @nocache {Boolean?false} is enabled. The optional
		 * @timeout {Number?10000} is configured to 10 seconds by default.
		 */
		load : function(uri, callback, context, nocache, timeout) 
		{
            if (!context) {
                context = global;
			}
            
			core.io.Xhr.request("GET", uri, null, function(request, failed) {
                if (failed) {
                    callback.call(context, uri, true);
                } else {
                    // Finally call the user defined callback (succeed with data)
                    var status = request.status;
                    var success = status >= 200 && status < 300 || status == 304 || status == 1223;
                    var data = null;
                    
                    if (success) {
                        try {
                            data = JSON.parse(request.responseText);
                            success = data !== null;
                        } catch(e) {
                            success = false;
                        }
                    }
                    
                    callback.call(context, uri, !success, { 
                        data : data
                    });
                }
			}, nocache, timeout);
		}
	});
})(core.Main.getGlobal());
