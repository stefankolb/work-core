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

suite.test("Manipulate", function() 
{
  var manipulated = new core.mvc.Collection([1,2,3]);
  var eventCounter = 0;

  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.instance(manipulated, core.mvc.Collection);
  core.Interface.assert(manipulated, core.mvc.IModel);

  this.identical(manipulated.toJSON().toString(), "1,2,3");
  this.identical(manipulated.getLength(), 3);
  this.identical(eventCounter, 0);

  // PUSH

  eventCounter = 0;
  manipulated.push(4);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4");
  this.identical(manipulated.getLength(), 4);
  this.identical(eventCounter, 1);

  eventCounter = 0;
  manipulated.push(5, 6, 7);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4,5,6,7");
  this.identical(manipulated.getLength(), 7);
  this.identical(eventCounter, 3);

  // POP

  eventCounter = 0;
  this.identical(manipulated.pop(), 7);
  this.identical(manipulated.toJSON().toString(), "1,2,3,4,5,6");
  this.identical(manipulated.getLength(), 6);
  this.identical(eventCounter, 1);

  // CLEAR

  var oldLength = manipulated.getLength();
  eventCounter = 0;
  manipulated.clear();
  this.identical(manipulated.toJSON().toString(), "");
  this.identical(manipulated.getLength(), 0);
  this.identical(eventCounter, oldLength);

  // APPEND

  eventCounter = 0;
  manipulated.append([1,2,3]);
  this.identical(manipulated.toJSON().toString(), "1,2,3");
  this.identical(manipulated.getLength(), 3);
  this.identical(eventCounter, 3);

  // RESET

  var oldLength = manipulated.getLength();
  eventCounter = 0;
  manipulated.reset([4,5,6,7,8]);
  this.identical(manipulated.toJSON().toString(), "4,5,6,7,8");
  this.identical(manipulated.getLength(), 5);
  this.identical(eventCounter, oldLength + 5);

});


