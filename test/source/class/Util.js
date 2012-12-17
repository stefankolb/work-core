var suite = new core.test.Suite("Util");

suite.test("Id", function() 
{  
  var myFunc = new Function;
  
  this.identical(core.util.Id.get(myFunc), 1);
  this.identical(core.util.Id.get(myFunc), 1);

  this.identical(core.util.Id.get(document.body), 2);
  this.identical(core.util.Id.get(document.body), 2); 
});
