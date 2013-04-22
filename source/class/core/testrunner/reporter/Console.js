/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * A reporter for the `console` interface which is available in 
 * web browsers, NodeJS, PhantomJS, etc.
 */
core.Class("core.testrunner.reporter.Console", 
{
  implement: [core.testrunner.reporter.IReporter],

  /**
   * @suites {core.testrunner.Suite[]} Array of suites to report for
   */
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
        console.warn("Testing finished with errors!");
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

            console.warn("  #" + i + ": failed: " + current.message);
            if (current.stacktrace)
            {
              var lines = current.stacktrace.split("\n");
              for (var j=0, jl=lines.length; j<jl; j++) {
                console.log("  " + lines[j])
              }
            }
          }
        }
        else if (test.getFailureReason() == "exception")
        {
          var stacktrace = test.getFailureStack();
          var lines = stacktrace.split("\n");
          for (var j=0, jl=lines.length; j<jl; j++) {
            console.log("  " + lines[j])
          }          
        }
      }
    }
  }
});
