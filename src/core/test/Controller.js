/**
 * Main controller of test environment in Core. Is automatically used
 * by {core.test.Suite} instances for self registration. The controller
 * joins together the flow and results of the individual suites. It also
 * supports the Testem (https://github.com/airportyh/testem/) test runner
 * for automating multi browser tests.
 */
core.Module("core.test.Controller",
{
  /** {=core.test.Suite[]} List of suite instances */
  __suites : [],

  /** Whether the test suites are being executed right now */
  __isRunning : false,

  /** Whether the test suites are finished with execution */
  __isFinished : false,

  /** Current suite (by index) to execute */
  __currentIndex : 0,  


  /**
   * Registers the given @suite {core.test.Suite} to the controller.
   */
  registerSuite : function(suite) {
    this.__suites.push(suite);
  },


  /** 
   * {Boolean} Whether the suites have been executed successfully */
   */
  isSuccessful : function() 
  {
    var suites = this.__suites;
    for (var i=0, l=suites.length; i<l; i++) 
    {
      if (!suites[i].isSuccessful()) {
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

    // Sort suites by caption
    suites.sort(function(a, b) {
      return a.getCaption() > b.getCaption() ? 1 : -1;
    });

    // Integration with Testem Runner
    if (location.hash == "#testem") 
    {
      var self = this;

      console.info("Loading Testem...");
      core.io.Script.load("/testem.js", function() 
      {
        console.info("Initializing Testem...");
        
        Testem.useCustomAdapter(function(socket) 
        {
          self.__testemSocket = socket;
          socket.emit("tests-start");

          console.info("Executing Tests...");
          self.__runNextSuite();          
        });
      });
    }
    else
    {
      console.info("Executing Tests...");
      this.__runNextSuite();
    }
  },


  /**
   * Internal helper to execute the next suite in the list.
   */
  __runNextSuite : function() 
  {
    var currentIndex = this.__currentIndex++;
    var currentSuite = this.__suites[currentIndex];

    if (currentSuite) 
    {
      var allComplete = core.util.Function.bind(this.__runNextSuite, this);
      var testComplete = core.util.Function.bind(this.__testComplete, this);

      currentSuite.run(allComplete, testComplete, true);
    }
    else if (this.__isRunning)
    {
      console.info("Finished!")

      this.__isRunning = false;
      this.__isFinished = true;

      if (jasy.Env.isSet("runtime", "browser")) 
      {
        if (typeof callPhantom == "function") 
        {
          callPhantom({
            action : "finished",
            status : this.isSuccessful()
          });
        }

        if (this.__testemSocket != null)
        {
          // Report back all test results and the fact that
          // we are done running them.
          this.__testemSocket.emit("all-test-results", this.export());
        }
      }      
    }
  },


  /** 
   * Callback which is being executed every time a @test {core.test.Test} is completed.
   */
  __testComplete : function(test) 
  {
    var socket = this.__testemSocket;
    if (socket != null) {    
      socket.emit("test-result", test.export());
    }
  }  
});
