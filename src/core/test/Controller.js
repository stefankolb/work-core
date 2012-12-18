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

  run : function() 
  {
    var suites = this.__suites;

    if (!this.__isRunning) 
    {
      suites.sort(function(a, b) {
        return a.getCaption() > b.getCaption() ? 1 : -1;
      });
    }

    this.__isRunning = true;

    var first = suites.shift();
    if (first)
    {
      first.run(this.run, this, this.__randomize);
      return;
    }

    console.log("");
    console.info("All done!")

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
    }
  }
});
