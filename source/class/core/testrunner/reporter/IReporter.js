/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Interface which any reporter has to implement to be compatible to the testing framework.
 */
core.Interface("core.testrunner.reporter.IReporter",
{
  /**
   * @suites {core.testrunner.Suite[]} Array of suites to report for
   */
  // construct : function(suites) {},

  members :
  {
    /** 
     * Reports that the test run was started.
     */
    start : function() {},


    /** 
     * Reports that the test run is completely finished and the parameter
     * @successfully {Boolean} defines whether this run was successfully or not.
     */
    finished : function(successfully) {},


    /** 
     * Reports that the testing of the given @suite {core.testrunner.Suite} was started.
     */
    suiteStarted : function(suite) {},


    /** 
     * Reports that the testing of the given @suite {core.testrunner.Suite} was finished.
     */
    suiteFinished : function(suite) {},


    /** 
     * Reports that the testing of the given @test {core.testrunner.Test} was started.
     */
    testStarted : function(test) {},


    /** 
     * Reports that the testing of the given @test {core.testrunner.Test} was finished.
     */
    testFinished : function(test) {}
  }
});
