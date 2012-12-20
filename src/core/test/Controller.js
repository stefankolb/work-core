core.Module("core.test.Controller",
{
  __suites : [],
  __randomizeTests : true,

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

  __isRunning : false,
  __isFinished : false,
  __currentIndex : 0,



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
          self.runNext();          
        });
      });
    }
    else
    {
      console.info("Executing Tests...");
      this.runNext();
    }
  },


  runNext : function() 
  {
    var currentIndex = this.__currentIndex++;
    var currentSuite = this.__suites[currentIndex];

    if (currentSuite) {
      currentSuite.run(this.runNext, this, this.__randomizeTests);
    } else {
      this.finalize();
    }
  },


  finalize : function() 
  {
    if (!this.__isRunning) {
      return;
    }

    this.__isRunning = false;
    this.__isFinished = true;

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
        var suites = this.__suites;
        var results = [];
        for (var i=0, l=suites.length; i<l; i++) {
          results.push.apply(results, suites[i].export());
        }

        console.log("Tests in Testem finished!", results, results.length, suites.length);

        for (var i=0, l=results.length; i<l; i++) {
          this.__testemSocket.emit("test-result", results[i]);
        }

        // Report back all test results and the fact that
        // we are done running them.
        this.__testemSocket.emit("all-test-results", results);
      }
    }
  }  
});
