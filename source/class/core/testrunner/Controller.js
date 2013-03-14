/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Main controller of test environment in Core. Is automatically used
 * by {core.testrunner.Suite} instances for self registration. The controller
 * joins together the flow and results of the individual suites. It also
 * supports the Testem (https://github.com/airportyh/testem/) test runner
 * for automating multi browser tests.
 */
core.Module("core.testrunner.Controller",
{
  /** {=core.testrunner.Suite[]} List of suite instances */
  __suites : [],

  /** Whether the test suites are being executed right now */
  __isRunning : false,

  /** Whether the test suites are finished with execution */
  __isFinished : false,

  /** Current suite (by index) to execute */
  __currentIndex : -1,  

  /** {=Object} Socket object used to transfer status to testem test runner */
  __testemSocket : null,  


  /**
   * Registers the given @suite {core.testrunner.Suite} to the controller.
   */
  registerSuite : function(suite) {
    this.__suites.push(suite);
  },


  /** 
   * {Boolean} Whether the suites have been executed successfully
   */
  wasSuccessful : function() 
  {
    var suites = this.__suites;
    for (var i=0, l=suites.length; i<l; i++) 
    {
      if (!suites[i].wasSuccessful()) {
        return false;
      }
    }

    return true;
  },


  /**
   * {Boolean} Whether the test suites are being executed right now
   */
  isRunning : function() {
    return this.__isRunning;
  },


  /** 
   * {Boolean} Whether the test suites are finished with execution 
   */
  isFinished : function() {
    return this.__isFinished;
  },


  /**
   * {Array} Exports the internal suite data into a list of test results.
   */
  export : function() 
  {
    var suites = this.__suites;
    return Array.prototype.concat.apply([], this.__suites.map(function(suite) {
      return suite.export();
    }));          
  },


  __initReporter : function()
  {
    if (this.__reporter) {
      return;
    }

    var suites = this.__suites;

    if (jasy.Env.isSet("runtime", "browser") && typeof callPhantom != "function") {
      this.__reporter = new core.testrunner.reporter.Html(suites);
    } else if (typeof console !== "undefined") {
      this.__reporter = new core.testrunner.reporter.Console(suites);
    } else {
      this.__reporter = null;
    }
  },


  /**
   * Executes all tests of all registered test suites.
   */
  run : function() 
  {
    if (this.__isRunning) {
      return;
    }

    this.__isRunning = true;

    var suites = this.__suites;

    var filter = core.detect.Param.get("filter");
    if (filter) 
    {
      filter = filter.toLowerCase();
      this.__suites = suites = suites.filter(function(value) {
        return value.getCaption().toLowerCase().indexOf(filter) != -1; 
      });
    }
  
    // Sort suites by caption
    suites.sort(function(a, b) {
      return a.getCaption() > b.getCaption() ? 1 : -1;
    });

    // Initialize view
    this.__initReporter(suites);

    // Integration with Testem Runner
    if (jasy.Env.isSet("runtime", "browser") && location.hash == "#testem") 
    {
      var self = this;

      core.io.Script.load("/testem.js", function() 
      {
        Testem.useCustomAdapter(function(socket) 
        {
          self.__testemSocket = socket;
          socket.emit("tests-start");

          self.__reporter.start(suites);
          self.__runNextSuite();          
        });
      });
    }
    else
    {
      this.__reporter.start(suites);
      this.__runNextSuite();
    }
  },


  /**
   * Internal helper to execute the next suite in the list.
   */
  __runNextSuite : function() 
  {
    var previousSuite = this.__suites[this.__currentIndex];
    var currentSuite = this.__suites[++this.__currentIndex];

    if (previousSuite) {
      this.__reporter.suiteFinished(previousSuite);  
    }
    
    if (currentSuite) 
    {
      this.__reporter.suiteStarted(currentSuite);

      var allComplete = core.Function.bind(this.__runNextSuite, this);
      var testStarted = core.Function.bind(this.__testStarted, this);
      var testFinished = core.Function.bind(this.__testFinished, this);

      currentSuite.run(allComplete, testStarted, testFinished, true);
    }
    else if (this.__isRunning)
    {
      var successfully = this.wasSuccessful();

      this.__reporter.finished(successfully);

      this.__isRunning = false;
      this.__isFinished = true;

      if (jasy.Env.isSet("runtime", "browser")) 
      {
        if (typeof callPhantom == "function") 
        {
          callPhantom({
            action : "finished",
            status : successfully
          });
        }

        if (this.__testemSocket != null)
        {
          // Report back all test results and the fact that
          // we are done running them.
          this.__testemSocket.emit("all-test-results", this.export());
        }
      }
      else if (jasy.Env.isSet("runtime", "native") && typeof process != "undefined") 
      {
        // NodeJS integration
        process.exit(successfully ? 0 : 1);
      }
    }
  },


  /** 
   * Callback which is being executed every time a @test {core.testrunner.Test} was started.
   */
  __testStarted : function(test) {
    this.__reporter.testStarted(test);
  },


  /** 
   * Callback which is being executed every time a @test {core.testrunner.Test} was finished.
   */
  __testFinished : function(test) 
  {
    this.__reporter.testFinished(test);

    var socket = this.__testemSocket;
    if (socket != null) {    
      socket.emit("test-result", test.export());
    }
  }  
});
