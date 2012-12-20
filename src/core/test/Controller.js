core.Module("core.test.Controller",
{
  __suites : [],
  __isRunning : false,
  __isFinished : false,
  __currentIndex : 0,  

  registerSuite : function(suite) {
    this.__suites.push(suite);
  },

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

  isRunning : function() {
    return this.__isRunning;
  },

  isFinished : function() {
    return this.__isFinished;
  },

  export : function() 
  {
    var suites = this.__suites;
    return Array.prototype.concat.apply([], this.__suites.map(function(suite) {
      return suite.export();
    }));          
  },


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

  __testComplete : function(test) 
  {
    var socket = this.__testemSocket;
    if (socket != null) {    
      socket.emit("test-result", test.export());
    }
  }  
});
