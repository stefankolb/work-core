/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Wraps a function to test so that it can report back
 * to a whole suite of tests and is protected regarding
 * exceptions so that these do not influence the outside.
 */
core.Class("core.testrunner.Test",
{
  /**
   * - @title {String} Human readable title of the test
   * - @func {Function} Function to test
   * - @suite {core.testrunner.Suite} Instance of suite to assign to (for back reporting)
   * - @total {Integer?null} Configure the total number of assertions which are expected to run
   * - @timeout {Integer?null} Configure timeout to enable async execution of test
   */
  construct : function(title, func, suite, total, timeout) 
  {
    this.__title = title;
    this.__func = func;
    this.__suite = suite;
    this.__totalCount = total;
    this.__timeout = timeout;

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

    /** {=String} Message to describe the failure */
    __failureMessage : null,    

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
    isEqual : function(a, b, message) 
    {
      try{
        core.Assert.isEqual(a, b);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },


    /**
     * Test whether @a {var} and @b {var} are not equal and register
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isNotEqual : function(a, b, message) 
    {
      try{
        core.Assert.isNotEqual(a, b);  
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
    isIdentical : function(a, b, message) 
    {
      try{
        core.Assert.isIdentical(a, b);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },      


    /**
     * Test whether @a {var} and @b {var} are not identical and register
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isNotIdentical : function(a, b, message) 
    {
      try{
        core.Assert.isNotIdentical(a, b);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },         


    /**
     * Test whether @a {var} is truish and registers
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isTrue : function(a, message) 
    {
      try{
        core.Assert.isTrue(a);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },


    /**
     * Test whether @a {var} is falsy and registers
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isFalse : function(a, message) 
    {
      try{
        core.Assert.isFalse(a);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },    


    /**
     * Test whether @a {var} is null and registers
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isNull : function(a, message) 
    {
      try{
        core.Assert.isNull(a);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },    


    /**
     * Test whether @a {var} is an instance of @b {var} and registers
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isInstance : function(a, b, message) 
    {
      try{
        core.Assert.isInstance(a, b);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    },    
    

    /**
     * Test whether @a {var} is type of @b {var} and registers
     * the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    isType : function(a, b, message) 
    {
      try{
        core.Assert.isType(a, b);  
      } catch(ex) {
        return this.__failed(message, ex);
      }

      this.__passed(message);
    }, 


    /**
     * Test whether @func {Function} raises an exception (which it should) 
     * and register the result to the internal storage. Optional @message {String?""}
     * for more details to understand the context of the assertion.
     */
    raisesException : function(func, message) 
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
     * e.g. exceptions or timeouts occured. Define the @message {String}
     * to give more hints about the issue.
     */
    failure : function(message) 
    {
      if (this.__timeoutHandle) {
        clearTimeout(this.__timeoutHandle);
      }

      this.__failureReason = "other";
      this.__failureMessage = message;

      this.__updateOnFatalError();

      this.__suite.testFailed(this);
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
     */
    getSummary : function() 
    {
      var reason = this.__failureReason;
      var message = this.__failureMessage;

      var prefix = reason == null ? "Success" : "Failure"
      var base = ": " + this.__title + " [" + core.Number.pad(this.__passedCount, 2) + "/" + core.Number.pad(this.getTotalCount(), 2) + "]";
      var postfix = message == null ? reason == null ? "" : ": " + reason : ": " + message;

      return prefix + base + postfix;
    },


    /** 
     * {String} Returns the reason of the failure. One of:
     *
     * - assertions: Failed assertions
     * - mismatch: Mismatch in expexted vs. executed number of assertions
     * - exception: Exception during execution
     * - timeout: Timeout occoured
     * - other: Custom error by test itself
     */
    getFailureReason : function() {
      return this.__failureReason;
    },


    /**
     * {String} Returns the failure message (only when available).
     */
    getFailureMessage : function() {
      return this.__failureMessage;
    },


    /**
     * {String} Returns the actual stack trace of the failure - if one happened.
     */
    getFailureStack : function() {
      return this.__failureStack;
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
     * Used to update failed count to sensible value when error happens
     */
    __updateOnFatalError : function() 
    {
      if (this.__totalCount == null) 
      {
        // Assume that at least one assertion is failed
        if (this.__failedCount == 0) {
          this.__failedCount++;
        }
      }
      else
      {
        // Mark all remaining assertions as failed
        this.__failedCount = Math.max(this.__totalCount - this.__passedCount, 1);
      }
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
        this.__failureMessage = "Did not successfully pass " + failedAssertions + " assertions.";

        this.__suite.testFailed(this);
      }
      else if (this.__totalCount != null && this.__totalCount != this.__passedCount) 
      {
        this.__failureReason = "mismatch";
        this.__failureMessage = "Did to match number of assertions expected (" + this.__totalCount + " vs. " + this.__passedCount + ")";

        this.__updateOnFatalError();

        this.__suite.testFailed(this);
      }
      else
      {
        this.__failureReason = null;
        this.__failureMessage = null;

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
          self.__failureMessage = "Timeout (" + timeout + "ms)";

          self.__updateOnFatalError();

          self.__suite.testFailed(self);
        }), timeout);
      }

      try
      {
        this.__func();    
      } 
      catch(ex) 
      {
        this.__failureReason = "exception";
        this.__failureMessage = "Exception: " + ex;
        this.__failureStack = ex.stack;

        this.__updateOnFatalError();

        this.__suite.testFailed(this);

        return;
      }

      // Automatically mark as done for synchronous tests
      if (timeout == null) {
        this.__checkState();
      }
    }
  }
});
