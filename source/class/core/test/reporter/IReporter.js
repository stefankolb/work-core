/**
 * Interface which any reporter has to implement to be compatible to the testing framework.
 */
core.Interface("core.test.reporter.IReporter",
{
  /**
   * @suites {core.test.Suite[]} Collection of suites to report for
   */
  construct : function(suites) {},

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
     * Reports that the testing of the given @suite {core.test.Suite} was started.
     */
    suiteStarted : function(suite) {},


    /** 
     * Reports that the testing of the given @suite {core.test.Suite} was finished.
     */
    suiteFinished : function(suite) {},


    /** 
     * Reports that the testing of the given @test {core.test.Test} was started.
     */
    testStarted : function(test) {},


    /** 
     * Reports that the testing of the given @test {core.test.Test} was finished.
     */
    testFinished : function(test) {}
  }
});
