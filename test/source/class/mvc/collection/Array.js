var suite = new core.testrunner.Suite("MVC/Collection/Array");

suite.test("Empty", function() 
{
  var empty = new core.mvc.model.Array();

  this.isInstance(empty, core.mvc.model.Array);
  core.Interface.assert(empty, core.mvc.model.IModel);

  this.isIdentical(typeof empty.getClientId(), "string");
  this.isIdentical(typeof empty.toJSON(), "object");
  this.isIdentical(empty.getLength(), 0);
  this.isIdentical(empty.toJSON().toString(), "");  
});

suite.test("Constructor", function() 
{
  var filled = new core.mvc.model.Array([1,2,3]);

  this.isInstance(filled, core.mvc.model.Array);
  core.Interface.assert(filled, core.mvc.model.IModel);

  this.isIdentical(filled.toJSON().toString(), "1,2,3");
  this.isIdentical(filled.getLength(), 3);
});

suite.test("Push", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.push(4), 4);
  this.isIdentical(manipulated.toJSON().toString(), "1,2,3,4");
  this.isIdentical(manipulated.getLength(), 4);
  this.isIdentical(eventCounter, 1);
});

suite.test("Push - Multi", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.push(4, 5, 6), 6);
  this.isIdentical(manipulated.toJSON().toString(), "1,2,3,4,5,6");
  this.isIdentical(manipulated.getLength(), 6);
  this.isIdentical(eventCounter, 3);
});

suite.test("Push - Circular", function() 
{
  // Somewhat testing nested event structures, too

  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function(evt) 
  { 
    eventCounter++; 
    var next = evt.getModel() + 1;
    if (next < 10) {
      this.push(next);  
    }
  });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.push(4), 9);
  this.isIdentical(manipulated.toJSON().toString(), "1,2,3,4,5,6,7,8,9");
  this.isIdentical(manipulated.getLength(), 9);
  this.isIdentical(eventCounter, 6);
});

suite.test("Pop", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.pop(), 3);
  this.isIdentical(manipulated.toJSON().toString(), "1,2");
  this.isIdentical(manipulated.getLength(), 2);
  this.isIdentical(eventCounter, 1);
});

suite.test("Clear", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  var oldLength = manipulated.getLength();
  this.isIdentical(manipulated.clear(), 0);
  this.isIdentical(manipulated.toJSON().toString(), "");
  this.isIdentical(manipulated.getLength(), 0);
  this.isIdentical(eventCounter, oldLength);

  // Pop after clear

  var eventCounter = 0;
  this.isEqual(manipulated.pop(), null);
  this.isIdentical(manipulated.toJSON().toString(), "");
  this.isIdentical(manipulated.getLength(), 0);
  this.isIdentical(eventCounter, 0);  
});

suite.test("Append", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.append([4,5,6]), 6);
  this.isIdentical(manipulated.toJSON().toString(), "1,2,3,4,5,6");
  this.isIdentical(manipulated.getLength(), 6);
  this.isIdentical(eventCounter, 3);
});

suite.test("Reset", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  var oldLength = manipulated.getLength();
  this.isIdentical(manipulated.reset([4,5,6,7,8]), 5);
  this.isIdentical(manipulated.toJSON().toString(), "4,5,6,7,8");
  this.isIdentical(manipulated.getLength(), 5);
  this.isIdentical(eventCounter, oldLength + 5);
});

suite.test("At", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.at(1), 2);
  this.isIdentical(eventCounter, 0);
});

suite.test("Shift", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.shift(), 1);
  this.isIdentical(manipulated.toJSON().toString(), "2,3");
  this.isIdentical(manipulated.getLength(), 2);
  this.isIdentical(eventCounter, 1);
});

suite.test("Unshift", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.unshift(0), 4);
  this.isIdentical(manipulated.toJSON().toString(), "0,1,2,3");
  this.isIdentical(manipulated.getLength(), 4);
  this.isIdentical(eventCounter, 1);
});

suite.test("Unshift - Multi", function() 
{
  var eventCounter = 0;
  var manipulated = new core.mvc.model.Array([1,2,3]);
  manipulated.addListener("add", function() { eventCounter++; });
  manipulated.addListener("remove", function() { eventCounter++; });

  this.isIdentical(manipulated.unshift(4,5,6), 6);
  this.isIdentical(manipulated.toJSON().toString(), "4,5,6,1,2,3");
  this.isIdentical(manipulated.getLength(), 6);
  this.isIdentical(eventCounter, 3);
});

