(function(global) 
{
  /**
   * #require(ext.sugar.Function)
   */
  core.Class("core.test.Suite",
  {
    /**
     * Creates a new test suite with the given @caption {String}.
     * The optionally defined @setup {Function?} and @teardown {Function?} can
     * be used to run methods either before or after each individual test.
     */
    construct : function(caption, setup, teardown) 
    {
      // Verify that an instance was created
      if (!(this instanceof core.test.Suite)) {
        throw new Error("Please use 'new' for creating Suite instances!");
      }

      this.__caption = caption;

      this.__tests = [];

      this.__passed = [];
      this.__failed = [];

      this.__setup = setup;
      this.__teardown = teardown;

      // Wrapped run method to allow auto execution as soon 
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

      /**
       * Registers a new test @func {Function} with the given @title {String} to
       * the suite. The optional @timeout {Integer?} can be used to setup the test
       * as being asynchronous. In these tests the method {#done} needs to be called
       * after all tests have been processed.
       */
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

      isSuccessful : function() {
        return this.__failed.length == 0;
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
