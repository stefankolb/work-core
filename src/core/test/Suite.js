/**
 * #require(ext.sugar.Function)
 */
(function(global) 
{
  core.Class("core.test.Suite",
  {
    construct : function(caption, setup, teardown) 
    {
      if (!(this instanceof core.test.Suite)) {
        throw new Error("Please use 'new' for creating Suite instances!");
      }

      if (jasy.Env.isSet("runtime", "browser")) 
      {
        if (navigator.userAgent.indexOf("PhantomJS/") != -1) {
          console.debug("Environment: Headless browser")
        } else {
          console.debug("Environment: Browser")
        }
      }
      else 
      {
        console.info("Environment: Native");
      }

      this.__caption = caption;

      this.__tests = [];

      this.__passed = [];
      this.__failed = [];

      this.__setup = setup;
      this.__teardown = teardown;

      // Revamp run method to allow auto execution as soon 
      // as no further tests are being added
      this.__autoRun = this.run.debounce(100);

      // Self register to controller
      core.test.Controller.registerSuite(this);
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
        // console.log("CHECK: ", this.__running, this.__passed.length, this.__failed.length)

        if (this.__running == (this.__passed.length + this.__failed.length)) 
        {
          var errornous = this.__failed.length > 0;
          if (errornous) {
            console.error("Completed " + this.__caption + ": " + this.__passed.length + " passed; " + this.__failed.length + " failed");
          } else {
            console.info("Completed " + this.__caption + ": " + this.__passed.length + " passed; " + this.__failed.length + " failed");
          }

          // Stop from further checks
          window.clearInterval(this.__waitHandle);

          core.test.Controller.finishedSuite(this, errornous);
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

      __timeoutHandler : function() {
        this.fail("Timeout (" + this.timeout + ")");
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

        console.log("Running " + this.__caption + " (" + queue.length + " tests)...");

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

          // Asynchronous test with timeout
          if ("timeout" in test) {
            window.setTimeout(this.__timeoutHandler.bind(test), test.timeout);
          }

          // Run test in protected mode (try-catch :))
          try {
            test.run();
          }
          catch(ex) 
          {
            console.error("Failed: " + test.title());
            console.error("" + ex);

            this.__failed.push(test);
          }

        }
      }
    }
  });
})(core.Main.getGlobal());
