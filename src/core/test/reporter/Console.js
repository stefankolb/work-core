/**
 * A reporter for the `console` interface which is available in 
 * web browsers, NodeJS, PhantomJS, etc.
 */
core.Class("core.test.reporter.Console", 
{
  implement: [core.test.reporter.IReporter],

  construct : function(suites) {
    console.info("Suites: " + suites.length);
  },

  members : 
  {
    // interface implementation
    start : function() {
      console.info("Testing started!");
    },

    // interface implementation
    finished : function(successfully) 
    {
      if (successfully) {
        console.info("Testing finished successfully.");
      } else {
        console.info("Testing finished with errors!");
      }
    },

    // interface implementation
    suiteStarted : function(suite) {
      console.info("Testing: " + suite.getCaption());
    },

    // interface implementation
    suiteFinished : function(suite) {
      console.info("");
    },

    // interface implementation
    testStarted : function(test) {
      console.info("- Start: " + test.getTitle());
    },

    // interface implementation
    testFinished : function(test) {
      console.info("- " + test.getSummary());
    }
  }
});
