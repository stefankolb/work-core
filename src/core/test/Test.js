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
   * - @totel {Integer?null} Configure the total number of assertions which are expected to run
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

    __passedCount : 0,
    __failedCount : 0,

    __passed : function(msg) 
    {
      this.__items.push({
        passed : true,
        message : msg,
        stacktrace: null
      });

      this.__passedCount++;
    },

    __failed : function(msg, ex) 
    {
      this.__items.push({
        passed : false,
        message : msg + (ex ? ": " + ex.message : ""),
        stacktrace : ex.stack || null
      });

      this.__failedCount++;
    },



    /*
    ----------------------------------------------
      ASSERTION API FOR TEST
    ----------------------------------------------
    */

    equal : function(a, b, msg) 
    {
      try{
        core.Assert.equal(a, b, msg);  
      } catch(ex) {
        return this.__failed(msg, ex);
      }

      this.__passed(msg);
    },

    identical : function(a, b, msg) 
    {
      try{
        core.Assert.identical(a, b, msg);  
      } catch(ex) {
        return this.__failed(msg, ex);
      }

      this.__passed(msg);
    },      

    ok : function(a, msg) 
    {
      try{
        core.Assert.isTrue(a, msg);  
      } catch(ex) {
        return this.__failed(msg, ex);
      }

      this.__passed(msg);
    },

    raises : function(func, msg) 
    {
      try {
        func();
      } catch(ex) {
        return this.__passed(msg);  
      }

      this.__failed(msg + ": Did not throwed an exception!");
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
     * e.g. exceptions or timeouts occured.
     */
    failure : function(reason) 
    {
      this.__failureReason = "other";
      this.__suite.failure(this, reason);

      if (this.__timeoutHandle) {
        clearTimeout(this.__timeoutHandle);
      }
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
        id: this.__id, 
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


    /** {=String} Reason of failure, value is `null` when successful */
    __failureReason : null,


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
        this.__timeoutHandle = setTimeout((function() {
          this.__failureReason = "timeout";
          this.__suite.testFailed(this, "Timeout (" + timeout + "ms)");
        }).bind(this), timeout);
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

