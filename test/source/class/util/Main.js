var suite = new core.testrunner.Suite("Util");

suite.test("Id", function() 
{  
  var myFunc = new Function;

  var startId = core.util.Id.get(new Function());
  
  this.isIdentical(core.util.Id.get(myFunc), startId+1);
  this.isIdentical(core.util.Id.get(myFunc), startId+1);

  if (typeof document != "undefined")
  {
    this.isIdentical(core.util.Id.get(document.body), startId+2);
    this.isIdentical(core.util.Id.get(document.body), startId+2); 
  }
});
