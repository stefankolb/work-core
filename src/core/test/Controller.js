core.Module("core.test.Controller",
{
  __suits : {},
  __length : 0,

  registerSuite : function(suite) 
  {
    var id = core.util.Id.get(suite);
    if (!this.__suits[id])
    {
      this.__suits[id] = suite;
      this.__length++;
    }
  },

  finishedSuite : function(suite, errornous)
  {
    var id = core.util.Id.get(suite);
    if (this.__suits[id])
    {
      delete this.__suits[id];
      this.__length--;
    }

    if (this.__length > 0) {
      return;
    }

    console.info("All tests finished!");

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
  },

  isSuccessful : function() 
  {
    var suits = this.__suits;
    var suite;

    for (var id in suits) 
    {
      var suit = suits[id];
      if (!suit.isSuccessful()) {
        return false;
      }
    }

    return true;
  },

  isRunning : function() {
    return this.__length > 0;
  },

  isFinished : function() {
    return this.__length == 0;
  }

});
