core.Module("core.test.Controller",
{
  __suites : [],
  __randomize : true,

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


  testem : function(socket)
  {
    this.__testemSocket = socket;



    socket.emit("tests-start");






  },


  run : function() 
  {
    var suites = this.__suites;

    if (!this.__isRunning) 
    {
      if (location.hash == "#testem") 
      {
        if (this.__testemLoaded)
        {
          Testem.useCustomAdapter(this.testem.bind(this));
        }
        else
        {
          this.__testemLoaded = true;

          console.info("Welcome Testem!!!");

          core.io.Script.load("/testem.js", function() {
            console.info("Testem is ready!");
            this.run();
          }, this);

          return;        
        }
      }

      suites.sort(function(a, b) {
        return a.getCaption() > b.getCaption() ? 1 : -1;
      });
    }

    this.__isRunning = true;

    var firstSuite = suites.shift();
    if (firstSuite)
    {
      firstSuite.run(this.run, this, this.__randomize);
      return;
    }

    console.log("");
    console.info("All done!")

    this.__isRunning = false;
    this.__isFinished = true;

    if (jasy.Env.isSet("runtime", "browser")) 
    {
      console.log("IN BROWSER: ", this.__testemSocket);

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

        console.log("Tests in Testem finished!", results, suites.length);


        // Report back all test results and the fact that
        // we are done running them.
        this.__testemSocket.emit("all-test-results", results);


        
      }
    }
  }
});
