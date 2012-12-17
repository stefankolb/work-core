/**
 * #require(ext.sugar.Function)
 */
core.Class("core.test.Suite",
{
  construct : function(caption) 
  {
    this.__caption = caption;

    this.__tests = [];

    this.__passed = [];
    this.__failed = [];

    // Revamp run method to allow auto execution as soon 
    // as no further tests are being added
    this.__autoRun = this.run.debounce(100);

    

  },

  members : 
  {
    /** How many tests are currently being executed */
    __running : 0,

    /** Whether to automatically randomize test execution order */
    randomize : true,

    test : function(title, func, timeout) 
    {
      // Initialize test instance and trigger auto run
      this.__tests.push(new core.test.Test(title, func, this, timeout));
      this.__autoRun();
    },

    check : function() 
    {
      if (this.__running == (this.__passed.length + this.__failed.length)) 
      {
        console.info("Suite completed: " + this.__passed.length + " passed; " + this.__failed.length + " failed");

        // Stop from further checks
        window.clearInterval(this.__waitHandle);
      }

      // Waiting for next iteration...
    },

    done : function(test) 
    {
      console.log("- Success: " + test.title());
      this.__passed.push(test);      
    },

    fail : function(test) 
    {
      console.log("- Failed: " + test.title());
      this.__failed.push(test);
    },

    run : function() 
    {
      var queue = this.__tests;
      
      this.__running = queue.length;

      // Empty queue?
      if (!this.__running) {
        return;
      }

      // Initialize waiting routine
      this.__waitHandle = window.setInterval(this.check.bind(this), 100);

      console.debug("");
      console.debug("Running " + this.__caption + " (" + queue.length + " tests)...");
      console.debug("========================================");

      // Useful to be sure that test do not depend on each other
      if (this.randomize) 
      {
        queue.sort(function() {
          return Math.random() < 0.5 ? -1 : 1;
        });
      }

      while (queue.length)
      {
        var test = queue.pop();

        // Asynchronous test
        if ("timeout" in test)
        {
          window.setTimeout(function() {
            this.fail("Timeout (" + test.timeout + ")");
          }.bind(test), test.timeout);
        }

        try {
          test.run();
        }
        catch(ex) 
        {
          console.error("Failed: " + test.title());
          console.error(""+ex)
          this.__failed.push(test);
        }

      }
    }
  }
});
