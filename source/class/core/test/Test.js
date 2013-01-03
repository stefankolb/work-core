  /**
   * Wraps a function to test so that it can report back
   * to a whole suite of tests and is protected regarding
   * exceptions so that these do not influence the outside.
   */
  core.Class("core.test.Test",
  {
    /**
     * - @title {String} Human readable title of the test
     * - @func {Function} Function to test
     * - @suite {core.test.Suite} Instance of suite to assign to (for back reporting)
     * - @timeout {Integer?null} Configure timeout to enable async execution of test
     * - @total {Integer?null} Configure the total number of assertions which are expected to run
     */
    construct : function(title, func, suite, timeout, total) 
    {
      this.__title = title;
      this.__func = func;
      this.__suite = suite;
      this.__timeout = timeout;
      this.__totalCount = total;

      /** List of passed/failed assertions */
      this.__items = [];
    },


    members : 
    {
      /*
      ----------------------------------------------
        HELPER
      ----------------------------------------------
      */

      /** {=String} Reason of failure, value is `null` when successful */
      __failureReason : null,    

      /** Number of passed assertions */
      __passedCount : 0,

      /** Number of failed assertions */
      __failedCount : 0,

      
      /** 
       * Helper method to track new passed assertions with @message {String?""}. 
       */
      __passed : function(message) 
      {
        this.__items.push({
          passed : true,
          message : message,
          stacktrace: null
        });

        this.__passedCount++;
      },


      /** 
       * Helper method to track new failed assertions with @message {String?""} and
       * an optional exception @ex {Exception?null}.
       */
      __failed : function(message, ex) 
      {
        var combined = message || "";
        if (ex && combined != ex.message) 
        {
          if (combined) {
            combined += ": ";
          }

          combined += ex.message;
        }

        this.__items.push({
          passed : false,
          message : combined,
          stacktrace : ex.stack || null
        });

        this.__failedCount++;
      },



      /*
      ----------------------------------------------
        ASSERTION API FOR TEST
      ----------------------------------------------
      */

      /**
       * Test whether @a {var} and @b {var} are equal and register
       * the result to the internal storage. Optional @message {String?""}
       * for more details to understand the context of the assertion.
       */
      equal : function(a, b, message) 
      {
        try{
          core.Assert.equal(a, b, message);  
        } catch(ex) {
          return this.__failed(message, ex);
        }

        this.__passed(message);
      },


      /**
       * Test whether @a {var} and @b {var} are identical and register
       * the result to the internal storage. Optional @message {String?""}
       * for more details to understand the context of the assertion.
       */
      identical : function(a, b, message) 
      {
        try{
          core.Assert.identical(a, b, message);  
        } catch(ex) {
          return this.__failed(message, ex);
        }

        this.__passed(message);
      },      


      /**
       * Test whether @a {var} is truish and register
       * the result to the internal storage. Optional @message {String?""}
       * for more details to understand the context of the assertion.
       */
      ok : function(a, message) 
      {
        try{
          core.Assert.isTrue(a, message);  
        } catch(ex) {
          return this.__failed(message, ex);
        }

        this.__passed(message);
      },

      /**
       * Test whether @func {Function} raises an exception (which is should) 
       * and register the result to the internal storage. Optional @message {String?""}
       * for more details to understand the context of the assertion.
       */
      raises : function(func, message) 
      {
        try {
          func();
        } catch(ex) {
          return this.__passed(message);  
        }

        this.__failed(message + ": Did not throwed an exception!");
      },



      /*
      ----------------------------------------------
        STATUS API FOR TEST
      ----------------------------------------------
      */

      /**
       * Indicate that the test was successfully completed.
       */
      done : function() {
        this.__checkState();
      },


      /**
       * Indicate that the test was not executed successfully
       * e.g. exceptions or timeouts occured. Define the @reason {String}
       * to give more hints about the issue.
       */
      failure : function(reason) 
      {
        if (this.__timeoutHandle) {
          clearTimeout(this.__timeoutHandle);
        }

        this.__failureReason = "other";
        this.__suite.failure(this, reason);
      },



      /*
      ----------------------------------------------
        API FOR SUITE
      ----------------------------------------------
      */

      /**
       * {Map} Returns internal data to a Testem compatible JSON object.
       */
      export : function() 
      {
        // the result object to report for this test
        return {
          passed: this.__passedCount, 
          failed: this.__failedCount, 
          total: this.getTotalCount(), 
          id: this.getId(), 
          name: this.__title, 
          items: this.__items
        };
      },


      /**
       * {Boolean} Whether the test was successfully executed.
       */
      wasSuccessful : function() {
        return this.__failureReason == null;
      },


      /**
       * {Boolean} Whether the test is running asynchronously
       */      
      isAsynchronous : function() {
        return this.__timeout != null;
      },


      /**
       * {Array} Returns all assertion results.
       */
      getAssertions : function() {
        return this.__items;
      },


      /**
       * {Integer} Returns the number of assertions which are expected for being executed.
       */
      getTotalCount : function() {
        return this.__totalCount == null ? this.__passedCount + this.__failedCount : this.__totalCount;
      },


      /**
       * {String} Returns a useful one liner of the status of the test
       *
       * #require(ext.sugar.Number)
       */
      getSummary : function() 
      {
        var reason = this.__failureReason;

        var prefix = reason == null ? "Success" : "Failure"
        var base = ": " + this.__title + " [" + this.__passedCount.pad(2) + "/" + this.getTotalCount().pad(2) + "]";
        var postfix = reason == null ? "" : ": " + reason;

        return prefix + base + postfix;
      },


      /** 
       * {String} Returns the reason of the failure 
       */
      getFailureReason : function() {
        return this.__failureReason;
      },


      /**
       * {String} Returns the title of the test. This should be a human readable
       * explanation of the issue to solve in the test case.
       */
      getTitle : function() {
        return this.__title;
      },


      /**
       * Returns a unique ID for this test.
       */
      getId : function() {
        return core.util.Id.get(this);
      },


      /** 
       * This method is automatically triggered whenever the test was marked as done 
       */
      __checkState : function() 
      {
        if (this.__timeoutHandle) {
          clearTimeout(this.__timeoutHandle);
        }

        var failedAssertions = this.__failedCount;
        if (failedAssertions) 
        {
          this.__failureReason = "assertions";
          this.__suite.testFailed(this, "Did not successfully pass " + failedAssertions + " assertions.");
        }
        else if (this.__totalCount != null && this.__totalCount != this.__passedCount) 
        {
          this.__failureReason = "mismatch";
          this.__suite.testFailed(this, "Did to match number of assertions expected (" + this.__totalCount + " vs. " + this.__passedCount + ")");
        }
        else
        {
          this.__failureReason = null;
          this.__suite.testPassed(this);
        }
      },


      /**
       * Executes the attached test method
       */
      run : function() 
      {
        // Asynchronous test with timeout
        var timeout = this.__timeout;
        if (timeout != null) 
        {
          var self = this;
          this.__timeoutHandle = setTimeout((function() 
          {
            self.__failureReason = "timeout";
            self.__suite.testFailed(self, "Timeout (" + timeout + "ms)");
          }), timeout);
        }

        try
        {
          this.__func();    
        } 
        catch(ex) 
        {
          this.__failureReason = "exception";
          this.__suite.testFailed(this, "Exception: " + ex);

          return;
        }

        // Automatically mark as done for synchronous tests
        if (timeout == null) {
          this.__checkState();
        }
      }
    }
  });
