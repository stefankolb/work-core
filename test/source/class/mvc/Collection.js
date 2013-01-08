var suite = new core.testrunner.Suite("MVC/Collection");

suite.test("Empty", function() 
{
  var empty = new core.mvc.Collection();

  this.instance(empty, core.mvc.Collection);
  core.Interface.assert(empty, core.mvc.IModel);

  this.identical(typeof empty.id, "string");
  this.identical(typeof empty.getId(), "string");
  this.identical(typeof empty.toJSON(), "object");
  this.identical(empty.getLength(), 0);
  this.identical(empty.toJSON().toString(), "");  
});

suite.test("Constructor", function() 
{
  var filled = new core.mvc.Collection([1,2,3]);

  this.instance(filled, core.mvc.Collection);
  core.Interface.assert(filled, core.mvc.IModel);

  this.identical(filled.toJSON().toString(), "1,2,3");
  this.identical(filled.getLength(), 3);
});

suite.test("Push", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.push(4), 4);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4");
  this.identical(manipulated.getLength(), 4);
  this.identical(eventCounter, 1);
});

suite.test("Push - Multi", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.push(4, 5, 6), 6);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4,5,6");
  this.identical(manipulated.getLength(), 6);
  this.identical(eventCounter, 3);
});

suite.test("Pop", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.pop(), 3);
  this.identical(manipulated.toJSON().toString(), "1,2");
  this.identical(manipulated.getLength(), 2);
  this.identical(eventCounter, 1);

});

suite.test("Clear", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  var oldLength = manipulated.getLength();
  this.identical(manipulated.clear(), 0);
  this.identical(manipulated.toJSON().toString(), "");
  this.identical(manipulated.getLength(), 0);
  this.identical(eventCounter, oldLength);

  // Pop after clear

  var eventCounter = 0;
  this.equal(manipulated.pop(), null);
  this.identical(manipulated.toJSON().toString(), "");
  this.identical(manipulated.getLength(), 0);
  this.identical(eventCounter, 0);  
});

suite.test("Append", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.append([4,5,6]), 6);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4,5,6");
  this.identical(manipulated.getLength(), 6);
  this.identical(eventCounter, 3);
});

suite.test("Reset", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  var oldLength = manipulated.getLength();
  this.identical(manipulated.reset([4,5,6,7,8]), 5);
  this.identical(manipulated.toJSON().toString(), "4,5,6,7,8");
  this.identical(manipulated.getLength(), 5);
  this.identical(eventCounter, oldLength + 5);
});

suite.test("At", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.at(1), 2);
  this.identical(eventCounter, 0);
});

suite.test("Shift", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.shift(), 1);
  this.identical(manipulated.toJSON().toString(), "2,3");
  this.identical(manipulated.getLength(), 2);
  this.identical(eventCounter, 1);
});

suite.test("Unshift", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.unshift(0), 4);
  this.identical(manipulated.toJSON().toString(), "0,1,2,3");
  this.identical(manipulated.getLength(), 4);
  this.identical(eventCounter, 1);
});

suite.test("Unshift - Multi", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.Collection([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.identical(manipulated.unshift(4,5,6), 6);
  this.identical(manipulated.toJSON().toString(), "4,5,6,1,2,3");
  this.identical(manipulated.getLength(), 6);
  this.identical(eventCounter, 3);
});

