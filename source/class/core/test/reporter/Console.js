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
    testStarted : function(test) 
    {
      if (test.isAsynchronous()) {
        console.info("- Start: " + test.getTitle());  
      }  
    },

    // interface implementation
    testFinished : function(test) 
    {
      console.info("- " + test.getSummary());
      if (!test.wasSuccessful()) 
      {
        if (test.getFailureReason() == "assertions") 
        {
          var items = test.export().items;
          for (var i=0, l=items.length; i<l; i++)
          {
            var current = items[i];

            if (current.passed) 
            {
              console.info("  #" + i + ": succeeded");
              continue;
            }

            console.error("  #" + i + ": failed: " + current.message);
            if (current.stacktrace)
            {
              var lines = current.stacktrace.split("\n");
              for (var j=0, jl=lines.length; j<jl; j++) {
                console.info("  " + lines[j])
              }
            }
          }
        }
      }
    }
  }
});
