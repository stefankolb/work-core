(function() {

  var uniqueId = 0;

  core.Class("core.test.Test",
  {
    construct : function(title, func, suite, timeout) 
    {
      this.__id = uniqueId++;

      this.__title = title;
      this.__func = func;
      this.__suite = suite;
      this.__timeout = timeout;

      this.__passed = [];
      this.__failed = [];

    },

    members : 
    {
      title : function() {
        return this.__title;
      },

      equal : function(a, b, msg) 
      {
        try{
          core.Assert.equal(a, b, msg);  
        } catch(ex) {
          this.__failed.push([msg, ex]);
        }

        this.__passed.push([msg]);
      },

      ok : function(a, msg) 
      {
        try{
          core.Assert.isTrue(a, msg);  
        } catch(ex) {
          this.__failed.push([msg, ex]);
        }

        this.__passed.push([msg]);
      },

      done : function() {
        this.__suite.done(this);
      },

      fail : function(reason) 
      {
        console.error("Failed: " + reason);
        this.__suite.fail(this);
      },

      run : function() 
      {
        try{
          this.__func();    
        } catch(ex) {
          this.fail("Exception: " + ex);
        }

        if (this.__timeout == null) {
          this.done();  
        }
      }
    }

  });  

})();
