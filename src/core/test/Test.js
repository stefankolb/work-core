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
   * - @assertions {Integer?null} Configure the number of assertions which are expected to run
   */
  construct : function(title, func, suite, timeout, assertions) 
  {
    this.__title = title;
    this.__func = func;
    this.__suite = suite;
    this.__timeout = timeout;
    this.__assertions = assertions;

    /** List of passed assertions */
    this.__passed = [];

    /** List of failed assertions */
    this.__failed = [];

  },

  members : 
  {
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
        this.__failed.push([msg, ex]);
      }

      this.__passed.push([msg]);
    },

    identical : function(a, b, msg) 
    {
      try{
        core.Assert.identical(a, b, msg);  
      } catch(ex) {
        this.__failed.push([msg, ex]);
      }

      this.__passed.push([msg]);
    },      

    ok : function(a, msg) 
    {
      try{
        core.Assert.isTrue(a, msg);  
      } catch(ex) {
        this.__failed.push([msg, ex]);
      }

      this.__passed.push([msg]);
    },

    raises : function(func, msg) 
    {
      try
      {
        func();
        this.__failed.push([msg, "Did not raise exception!"]);  
      }
      catch(ex) {
        this.__passed.push([msg]);        
      }
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
     * {Boolean} Whether the test was successfully executed.
     */
    wasSuccessful : function() {
      return this.__failureReason == null;
    },


    /**
     * {Integer} Returns the number of assertions which are expected for being executed.
     */
    getExpectedAssertions : function() {
      return this.__assertions == null ? this.__passed.length + this.__failed.length : this.__assertions;
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
      var base = ": " + this.__title + " [" + this.__passed.length.pad(2) + "/" + this.getExpectedAssertions().pad(2) + "]";
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
     * {Integer} Returns the number of passed assertions
     */
    getPassedAssertions : function() {
      return this.__passed.length;
    },


    /** 
     * {Integer} Returns the number of failed assertions
     */
    getFailedAssertions : function() {
      return this.__failed.length;
    },    


    /**
     * {String} Returns the title of the test. This should be a human readable
     * explanation of the issue to solve in the test case.
     */
    getTitle : function() {
      return this.__title;
    },


    /** {=String} Reason of failure, value is `null` when successful */
    __failureReason : null,


    /** 
     * This method is automatically triggered whenever the test was marked as done 
     */
    __checkState : function() 
    {
      if (this.__timeoutHandle) {
        clearTimeout(this.__timeoutHandle);
      }

      var failedAssertions = this.__failed.length;
      if (failedAssertions) 
      {
        this.__failureReason = "assertions";
        this.__suite.testFailed(this, failedAssertions + " number of failed assertions.");
      }
      else if (this.__assertions != null && this.__assertions != this.__passed.length) 
      {
        this.__failureReason = "mismatch";
        this.__suite.testFailed(this, "Did to match number of assertions expected (" + this.__assertions + " vs. " + this.__passed.length + ")");
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
