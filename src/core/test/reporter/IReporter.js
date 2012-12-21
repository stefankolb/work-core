/**
 * Interface which reporters for the testing infrastructure have to implement
 * to be usable by the {core.test.Controller}.
 */
core.Interface("core.test.reporter.IReporter",
{
  members :
  {
    /** 
     * Reports that the test run was started.
     */
    start : function() {},


    /** 
     * Reports that the test run is completely finished.
     */
    finished : function() {},


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
