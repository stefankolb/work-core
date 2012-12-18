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
    this.__errornous = [];

    this.__setup = setup;
    this.__teardown = teardown;

    // Self register to controller
    core.test.Controller.registerSuite(this);
  },

  members : 
  {
    /** How many tests are currently being executed */
    __currentTestNumber : 0,

    /** Internal marker used to indicate test suites which are currently/were running before. */
    __locked : false,

    /** Whether to automatically randomize test execution order */
    randomize : true,

    /**
     * Registers a new test @func {Function} with the given @title {String} to
     * the suite. The optional @timeout {Integer?} can be used to setup the test
     * as being asynchronous. In these tests the method {#done} needs to be called
     * after all tests have been processed.
     */
    test : function(title, func, timeout) {
      this.__tests.push(new core.test.Test(title, func, this, timeout));
    },

    check : function() 
    {
      // console.log("CHECK: ", this.__currentTestNumber, this.__passed.length, this.__failed.length)

      if (this.__currentTestNumber == (this.__passed.length + this.__failed.length + this.__errornous.length)) 
      {
        var errornous = this.__failed.length > 0;
        if (errornous) {
          console.error("Completed " + this.__caption + ": " + this.__passed.length + " passed; " + this.__failed.length + " failed");
        } else {
          console.info("Completed " + this.__caption + ": " + this.__passed.length + " passed; " + this.__failed.length + " failed");
        }


        core.test.Controller.finishedSuite(this, errornous);
      }

      // Waiting for next iteration...
    },

    isSuccessful : function() {
      return this.__failed.length == 0;
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
      console.log("- " + test.getSummary());
      this.__passed.push(test);      
    },

    /**
     * Marks the given @test {core.test.Test} as having failed for various reasons.
     */
    testFailed : function(test) 
    {
      console.log("- " + test.getSummary());
      this.__failed.push(test);
    },
  


    /*
    ----------------------------------------------
       API FOR USER OR CONTROLLER
    ----------------------------------------------
    */

    /**
     * {Boolean} Runs the test suite. Executes the given @callback {Function?} in the
     * given @context {Object?} when all tests have been completed. Returns `false` when
     * there are no tests registered to the suite.
     */
    run : function(callback, context) 
    {
      var queue = this.__tests;
      var length = queue.length;

      // Empty queue?
      if (!length) {
        return false;
      }

      console.log("Running " + this.__caption + " (" + queue.length + " tests)...");

      // Useful to be sure that test do not depend on each other
      // Works on a copy to be able to reproduce the list in the
      // order the developer has added the tests.
      if (this.randomize) 
      {
        queue.slice().sort(function() {
          return Math.random() < 0.5 ? -1 : 1;
        });
      }

      // Waiting for all async tests to finish
      this.__waitHandle = window.setInterval(this.check.bind(this, callback, context), 100);

      // With the first run the suite is locked
      this.__locked = true;

      // Process tests in queue
      for (var i=0; i<length; i++) {
        queue[i].run();
      }

      return true;
    }
  }
});
