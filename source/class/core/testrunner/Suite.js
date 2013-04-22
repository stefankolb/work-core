/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Wrapper around a group of {core.testrunner.Test}s. All tests in a suite are 
 * processed in arbitrary order.
 */
core.Class("core.testrunner.Suite",
{
  /**
   * Creates a new test suite with the given @caption {String}.
   * The optionally defined @setup {Function?} and @teardown {Function?} can
   * be used to run methods either before or after each individual test.
   */
  construct : function(caption, setup, teardown) 
  {
    // Verify that an instance was created
    if (!(this instanceof core.testrunner.Suite)) {
      throw new Error("Please use 'new' for creating Suite instances!");
    }

    this.__caption = caption;

    this.__tests = [];

    this.__passed = [];
    this.__failed = [];

    this.__setup = setup;
    this.__teardown = teardown;

    // Self register to controller
    core.testrunner.Controller.registerSuite(this);
  },

  members : 
  {
    /*
    ----------------------------------------------
       INTERNAL API
    ----------------------------------------------
    */

    /**
     * Method which is being executed on a regular basis to check
     * whether all tests of this suite are finished. When this
     * happens it kills the interval and reports back to the given
     * @callback {Function?} that the suite was finished.
     */
    __isFinishedInterval : function(callback) 
    {
      if ((this.__passed.length + this.__failed.length) == this.__tests.length) 
      {
        if (this.__waitHandle) {
          clearInterval(this.__waitHandle);
        }

        if (callback) {
          callback(this.__failed.length > 0);
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
     * Marks the given @test {core.testrunner.Test} as being successfully completed.
     */
    testPassed : function(test) 
    {
      this.__passed.push(test);
      this.__testFinishedCallback(test);
    },


    /**
     * Marks the given @test {core.testrunner.Test} as having failed for various reasons.
     */
    testFailed : function(test) 
    {
      this.__failed.push(test);
      this.__testFinishedCallback(test);
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
     * {core.testrunner.Test[]} Returns the list of tests
     */
    getTests : function() {
      return this.__tests;
    },


    /**
     * Registers a new test @func {Function} with the given @title {String} to
     * the suite. It's possible to define the @total {Integer?} number of expected assertions. 
     * This is especially useful in asynchronous or event based tests. Asynchronous mode
     * can be triggered via the optional @timeout {Integer?} which is the time to wait for
     * `done` in milliseconds. For asynchronous tests the method {core.testrunner.Test#done} 
     * needs to be called after all assertions have been processed. 
     */
    test : function(title, func, total, timeout) {
      this.__tests.push(new core.testrunner.Test(title, func, this, total, timeout));
    },


    /**
     * {Boolean} Whether there were no failed tests in this suite.
     */
    wasSuccessful : function() {
      return this.__failed.length == 0 && this.__passed.length > 0;
    },


    /** 
     * {String} Returns the caption of this test suite
     */
    getCaption : function() {
      return this.__caption;
    },


    /**
     * Returns a unique ID for this suite.
     */
    getId : function() {
      return core.util.Id.get(this);
    },


    /**
     * {Boolean} Runs the test suite. Executes the given @allDoneCallback {Function?} when 
     * all tests have been completed. Executes the @testStartedCallback {Function?} every
     * single time a test was started. Executes the @testFinishedCallback {Function?} callback
     * every time a single test is completed. Returns `false` when
     * there are no tests registered. 
     * 
     * Optional @randomize {Boolean?true} allows
     * for disabling auto randomization of test order (don't use this).
     */
    run : function(allDoneCallback, testStartedCallback, testFinishedCallback, randomize) 
    {
      var queue = this.__tests;
      var length = queue.length;

      // Empty queue?
      if (!length) {
        return false;
      }

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
      this.__testFinishedCallback = testFinishedCallback;

      // Disabling log output for successful items by default
      this.__verbose = false;

      // Process tests in queue
      for (var i=0; i<length; i++) 
      {
        if (this.__setup) {
          this.__setup();  
        }        

        testStartedCallback(queue[i]);
        queue[i].run();

        if (this.__teardown) {
          this.__teardown();  
        }        
      }

      return true;
    }
  }
});
