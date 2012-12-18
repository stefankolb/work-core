var suite = new core.test.Suite("Util");

suite.test("Id", function() 
{  
  var myFunc = new Function;

  var startId = core.util.Id.get(new Function());
  
  this.identical(core.util.Id.get(myFunc), startId+1);
  this.identical(core.util.Id.get(myFunc), startId+1);

  this.identical(core.util.Id.get(document.body), startId+2);
  this.identical(core.util.Id.get(document.body), startId+2); 
});
