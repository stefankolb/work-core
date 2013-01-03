var suite = new core.testrunner.Suite("Collection/LinkedList");

suite.test("Create", function() 
{
  var ll = new core.collection.LinkedList;
  this.ok(ll instanceof core.collection.LinkedList);
});

suite.test("Import/Export", function() 
{
  var Cls = function(i) {
    this.id = i;
  };

  var array = [new Cls(1), new Cls(2), new Cls(3), new Cls(4), new Cls(5)];
  var ll = new core.collection.LinkedList(array);
  this.ok(ll instanceof core.collection.LinkedList);
  this.equal(ll.getLength(), array.length);
  
  var exported = ll.toArray();
  this.ok(exported instanceof Array);
  this.equal(exported.length, array.length);
  
  this.equal(array[0], exported[0]);
  this.equal(array[1], exported[1]);
  this.equal(array[2], exported[2]);
  this.equal(array[3], exported[3]);
  this.equal(array[4], exported[4]);

});

suite.test("Add/Remove Sorted", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.ok(ll instanceof core.collection.LinkedList);
  this.equal(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  this.identical(ll.add(first), ll);
  this.equal(ll.getLength(), 1);
  this.identical(ll.add(second), ll);
  this.equal(ll.getLength(), 2);
  this.identical(ll.add(third), ll);
  this.equal(ll.getLength(), 3);
  
  var exported = ll.toArray();
  
  this.identical(ll.remove(first), ll);
  this.equal(ll.getLength(), 2);
  this.identical(ll.remove(second), ll);
  this.equal(ll.getLength(), 1);
  this.identical(ll.remove(third), ll);
  this.equal(ll.getLength(), 0);
  
  // Exported not modified by changes
  this.equal(exported.length, 3);

});

suite.test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.ok(ll instanceof core.collection.LinkedList);
  this.equal(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  this.identical(ll.add(first), ll);
  this.equal(ll.getLength(), 1);
  var exported = ll.toArray();
  this.identical(exported[0], first);
  
  this.identical(ll.add(second), ll);
  this.equal(ll.getLength(), 2);
  var exported = ll.toArray();
  this.equal(exported.length, 2);
  this.identical(exported[0], first);
  this.identical(exported[1], second);

  this.identical(ll.remove(first), ll);
  this.equal(ll.getLength(), 1);
  var exported = ll.toArray();
  this.equal(exported.length, 1);
  this.identical(exported[0], second);

  this.identical(ll.add(third), ll);
  this.equal(ll.getLength(), 2);
  this.identical(ll.remove(third), ll);
  this.equal(ll.getLength(), 1);
  this.identical(ll.remove(second), ll);
  this.equal(ll.getLength(), 0);
  
});


suite.test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.ok(ll instanceof core.collection.LinkedList);
  this.equal(ll.getLength(), 0);
  
  
});
