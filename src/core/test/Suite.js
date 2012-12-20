/**
 * Thematic wrapper around a set of tests. The test in a suite are 
 * processed at once but in arbitrary order.
 */
core.Class("core.test.Suite",
{
  /**
   * Creates a new test suite with the given @caption {String}.
   * The optionally defined @setup {Function?} and @teardown {Function?} can
   * be used to run methods either before or after each individual test.
   */
  construct : function(caption, setup, teardown) 
  {
    // Verify that an instance was created
    if (!(this instanceof core.test.Suite)) {
      throw new Error("Please use 'new' for creating Suite instances!");
    }

    this.__caption = caption;

    this.__tests = [];

    this.__passed = [];
    this.__failed = [];

    this.__setup = setup;
    this.__teardown = teardown;

    // Self register to controller
    core.test.Controller.registerSuite(this);
  },

  members : 
  {
    /*
    ----------------------------------------------
       INTERNAL API
    ----------------------------------------------
    */

    /** Internal marker used to indicate test suites which are currently/were running before. */
    __locked : false,

    __isFinishedInterval : function(callback) 
    {
      if ((this.__passed.length + this.__failed.length) == this.__tests.length) 
      {
        var errornous = this.__failed.length > 0;
        if (errornous) {
          console.error("- " + this.__passed.length + " tests passed; " + this.__failed.length + " tests failed");
        } else {
          console.info("- " + this.__passed.length + " tests passed");
        }

        if (this.__waitHandle) {
          clearInterval(this.__waitHandle);
        }

        if (callback) {
          callback(errornous);
        }
      }

      // Waiting for next iteration...
    },



    /*
    ----------------------------------------------
       API FOR TEST TO SEND FEEDBACK
    ----------------------------------------------
    */

    /**
     * Marks the given @test {core.test.Test} as being successfully completed.
     */
    testPassed : function(test) 
    {
      if (this.__verbose) {
        console.log("- " + test.getSummary());
      }
      
      this.__passed.push(test);
      this.__testDoneCallback(test);
    },


    /**
     * Marks the given @test {core.test.Test} as having failed for various reasons.
     */
    testFailed : function(test, message) 
    {
      console.error("- " + test.getSummary());
      if (message) {
        console.error("- " + message)
      }

      if (test.getFailureReason() == "assertions") 
      {
        var failed = test.getFailedAssertions();
        for (var i=0, l=failed.length; i<l; i++)
        {
          var msg = failed[i][0];
          var ex = failed[i][1];

          console.error("  - Assertion " + i + ": " + (msg||ex) + ", " + ex.line);
        }
      } 

      this.__failed.push(test);
      this.__testDoneCallback(test);
    },



  


    /*
    ----------------------------------------------
       API FOR USER OR CONTROLLER
    ----------------------------------------------
    */

    /**
     * {Array} Exports all test data 
     */
    export : function() 
    {
      return this.__tests.map(function(test) {
        return test.export();
      });
    },


    /**
     * Registers a new test @func {Function} with the given @title {String} to
     * the suite. The optional @timeout {Integer?} can be used to setup the test
     * as being asynchronous. In these tests the method {#done} needs to be called
     * after all tests have been processed.
     */
    test : function(title, func, timeout) {
      this.__tests.push(new core.test.Test(title, func, this, timeout));
    },

    isSuccessful : function() {
      return this.__failed.length == 0;
    },

    getCaption : function() {
      return this.__caption;
    },

    /**
     * {Boolean} Runs the test suite. Executes the given @allDoneCallback callback {Function?} when 
     * all tests have been completed. Executes the @testDoneCallback {Function?} callback
     * every time a single test is completed. Returns `false` when
     * there are no tests registered. 
     * 
     * Optional @randomize {Boolean?true} allows
     * for disabling auto randomization of test order (don't use this).
     */
    run : function(allDoneCallback, testDoneCallback, randomize) 
    {
      var queue = this.__tests;
      var length = queue.length;

      // Empty queue?
      if (!length) {
        return false;
      }

      console.log("Testing " + this.__caption + "...");

      // Useful to be sure that test do not depend on each other
      // Works on a copy to be able to reproduce the list in the
      // order the developer has added the tests.
      if (randomize !== false) 
      {
        queue = queue.slice().sort(function() {
          return Math.random() < 0.5 ? -1 : 1;
        });
      }

      // Waiting for all async tests to finish
      this.__waitHandle = setInterval(this.__isFinishedInterval.bind(this, allDoneCallback), 16);

      // Callback which should be executed after each test is completed
      this.__testDoneCallback = testDoneCallback;

      // With the first run the suite is locked
      this.__locked = true;

      // Disabling log output for successful items by default
      this.__verbose = false;

      // Process tests in queue
      for (var i=0; i<length; i++) {
        queue[i].run();
      }

      return true;
    }
  }
});
