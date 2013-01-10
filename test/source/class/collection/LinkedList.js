var suite = new core.testrunner.Suite("Collection/LinkedList");

suite.test("Create", function() 
{
  var ll = new core.collection.LinkedList;
  this.isTrue(ll instanceof core.collection.LinkedList);
});

suite.test("Import/Export", function() 
{
  var Cls = function(i) {
    this.id = i;
  };

  var array = [new Cls(1), new Cls(2), new Cls(3), new Cls(4), new Cls(5)];
  var ll = new core.collection.LinkedList(array);
  this.isTrue(ll instanceof core.collection.LinkedList);
  this.isEqual(ll.getLength(), array.length);
  
  var exported = ll.toArray();
  this.isTrue(exported instanceof Array);
  this.isEqual(exported.length, array.length);
  
  this.isEqual(array[0], exported[0]);
  this.isEqual(array[1], exported[1]);
  this.isEqual(array[2], exported[2]);
  this.isEqual(array[3], exported[3]);
  this.isEqual(array[4], exported[4]);

});

suite.test("Add/Remove Sorted", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.isTrue(ll instanceof core.collection.LinkedList);
  this.isEqual(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  this.isIdentical(ll.add(first), ll);
  this.isEqual(ll.getLength(), 1);
  this.isIdentical(ll.add(second), ll);
  this.isEqual(ll.getLength(), 2);
  this.isIdentical(ll.add(third), ll);
  this.isEqual(ll.getLength(), 3);
  
  var exported = ll.toArray();
  
  this.isIdentical(ll.remove(first), ll);
  this.isEqual(ll.getLength(), 2);
  this.isIdentical(ll.remove(second), ll);
  this.isEqual(ll.getLength(), 1);
  this.isIdentical(ll.remove(third), ll);
  this.isEqual(ll.getLength(), 0);
  
  // Exported not modified by changes
  this.isEqual(exported.length, 3);

});

suite.test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.isTrue(ll instanceof core.collection.LinkedList);
  this.isEqual(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  this.isIdentical(ll.add(first), ll);
  this.isEqual(ll.getLength(), 1);
  var exported = ll.toArray();
  this.isIdentical(exported[0], first);
  
  this.isIdentical(ll.add(second), ll);
  this.isEqual(ll.getLength(), 2);
  var exported = ll.toArray();
  this.isEqual(exported.length, 2);
  this.isIdentical(exported[0], first);
  this.isIdentical(exported[1], second);

  this.isIdentical(ll.remove(first), ll);
  this.isEqual(ll.getLength(), 1);
  var exported = ll.toArray();
  this.isEqual(exported.length, 1);
  this.isIdentical(exported[0], second);

  this.isIdentical(ll.add(third), ll);
  this.isEqual(ll.getLength(), 2);
  this.isIdentical(ll.remove(third), ll);
  this.isEqual(ll.getLength(), 1);
  this.isIdentical(ll.remove(second), ll);
  this.isEqual(ll.getLength(), 0);
  
});


suite.test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  this.isTrue(ll instanceof core.collection.LinkedList);
  this.isEqual(ll.getLength(), 0);
  
  
});
