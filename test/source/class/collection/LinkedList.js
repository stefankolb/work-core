module("Collection :: LinkedList");

test("Create", function() 
{
  var ll = new core.collection.LinkedList;
  ok(ll instanceof core.collection.LinkedList);
});

test("Import/Export", function() 
{
  var Cls = function(i) {
    this.id = i;
  };

  var array = [new Cls(1), new Cls(2), new Cls(3), new Cls(4), new Cls(5)];
  var ll = new core.collection.LinkedList(array);
  ok(ll instanceof core.collection.LinkedList);
  equal(ll.getLength(), array.length);
  
  var exported = ll.toArray();
  ok(exported instanceof Array);
  equal(exported.length, array.length);
  
  equal(array[0], exported[0]);
  equal(array[1], exported[1]);
  equal(array[2], exported[2]);
  equal(array[3], exported[3]);
  equal(array[4], exported[4]);

});

test("Add/Remove Sorted", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  ok(ll instanceof core.collection.LinkedList);
  equal(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  strictEqual(ll.add(first), ll);
  equal(ll.getLength(), 1);
  strictEqual(ll.add(second), ll);
  equal(ll.getLength(), 2);
  strictEqual(ll.add(third), ll);
  equal(ll.getLength(), 3);
  
  var exported = ll.toArray();
  
  strictEqual(ll.remove(first), ll);
  equal(ll.getLength(), 2);
  strictEqual(ll.remove(second), ll);
  equal(ll.getLength(), 1);
  strictEqual(ll.remove(third), ll);
  equal(ll.getLength(), 0);
  
  // Exported not modified by changes
  equal(exported.length, 3);

});

test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  ok(ll instanceof core.collection.LinkedList);
  equal(ll.getLength(), 0);
  
  var first = new Cls(1);
  var second = new Cls(2);
  var third = new Cls(3);
  
  strictEqual(ll.add(first), ll);
  equal(ll.getLength(), 1);
  var exported = ll.toArray();
  strictEqual(exported[0], first);
  
  strictEqual(ll.add(second), ll);
  equal(ll.getLength(), 2);
  var exported = ll.toArray();
  equal(exported.length, 2);
  strictEqual(exported[0], first);
  strictEqual(exported[1], second);

  strictEqual(ll.remove(first), ll);
  equal(ll.getLength(), 1);
  var exported = ll.toArray();
  equal(exported.length, 1);
  strictEqual(exported[0], second);

  strictEqual(ll.add(third), ll);
  equal(ll.getLength(), 2);
  strictEqual(ll.remove(third), ll);
  equal(ll.getLength(), 1);
  strictEqual(ll.remove(second), ll);
  equal(ll.getLength(), 0);
  
});


test("Add/Remove Random", function() {
  
  var Cls = function(i) {
    this.id = i;
  };
  
  var ll = new core.collection.LinkedList;
  ok(ll instanceof core.collection.LinkedList);
  equal(ll.getLength(), 0);
  
  
});
