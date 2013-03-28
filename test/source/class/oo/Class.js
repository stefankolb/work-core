/*
---------------------------------------------------------------------------
  CLASSES :: BASICS
---------------------------------------------------------------------------
*/

var suite = new core.testrunner.Suite("OO/Classes/Basics", null, function() {
  core.Main.clearNamespace("abc.Class1");
  core.Main.clearNamespace("abc.Class2");
  core.Main.clearNamespace("abc.Class3");
});

suite.test("Invalid config", function() {
  this.raisesException(function() {
    core.Class("abc.Class1");
  });
  this.raisesException(function() {
    core.Class("abc.Class2", 42);
  })
  this.raisesException(function() {
    core.Class("abc.Class3", {
      unallowedKey : "foo"
    });
  });
});

suite.test("Creating empty class", function() {
  core.Class("abc.Class1", {});
  this.isEqual(core.Class.isClass(abc.Class1), true);
  this.isEqual(abc.Class1.className, "abc.Class1");
  this.isEqual(abc.Class1.toString(), "[class abc.Class1]");
});

suite.test("Class false validation", function() {
  this.isTrue(!core.Class.isClass({}));
  this.isTrue(!core.Class.isClass(3));
  this.isTrue(!core.Class.isClass(null));
});

  


/*
---------------------------------------------------------------------------
  CLASSES :: MEMBERS
---------------------------------------------------------------------------
*/  

var suite = new core.testrunner.Suite("OO/Classes/Members", null, function() {
  core.Main.clearNamespace("members.Class1");
  core.Main.clearNamespace("members.Include1");
  core.Main.clearNamespace("members.Include2");
});


/**
 * Two classes which should be mixed into another one define the same member. 
 * A conflict arises, as both could not be merged into the target class.
 */
suite.test("Conflicting member functions", function() {
  core.Class("members.Include1", {
    members : {
      foo : function() {}
    }
  });
  core.Class("members.Include2", {
    members : {
      foo : function() {}
    }
  });

  this.raisesException(function() {
    core.Class("members.Join", {
      include : [members.Include1, members.Include2]
    });
  });
});


/**
 * Two classes which should be mixed into another one define the same member.
 * A conflict arises, as both could not be merged into the target class.
 */
suite.test("Conflicting member data", function() {
  core.Class("members.Include1", {
    members : {
      foo : 1
    }
  });
  core.Class("members.Include2", {
    members : {
      foo : 2
    }
  });

  this.raisesException(function() {
    core.Class("members.Join", {
      include : [members.Include1, members.Include2]
    });
  });
}); 


/**
 * Two classes which should be mixed into another one define the same member. 
 * The conflict is prevented as the affected member is also defined locally. So
 * the author of the including class is aware of the conflict and could call the
 * original methods if that makes sense.
 */
suite.test("Conflicting member functions, correctly merged", function() {
  core.Class("members.Include1", {
    members : {
      foo : function() {}
    }
  });
  core.Class("members.Include2", {
    members : {
      foo : function() {}
    }
  });

  core.Class("members.Join", {
    include : [members.Include1, members.Include2],
    
    members : {
      // Merge manually
      foo : function() {
        members.Include1.prototype.foo.call(this);
        members.Include2.prototype.foo.call(this);
        
        doSomethingElse();
      }
    }
  });
  
  this.isTrue(true);
});


/**
 * Two classes which should be mixed into another one define the same member. 
 * The conflict is tried being prevented as the affected member is also defined locally. But as
 * it is not a function this is not regarded as solved. The individual included classes might
 * require that this member is a function!
 */
suite.test("Conflicting member functions, not merged correctly", function() {
  core.Class("members.Include1", {
    members : {
      foo : function() {}
    }
  });
  core.Class("members.Include2", {
    members : {
      foo : function() {}
    }
  });

  this.raisesException(function() {
    core.Class("members.Join", {
      include : [members.Include1, members.Include2],
    
      members : {
        // Invalid merge
        foo : null
      }
    });
  });
}); 


/**
 * Two classes which should be mixed into another one define the same member. 
 * The conflict is tried to being prevented as the affected member is also defined locally. 
 * But this is not allowed for private members.
 */
suite.test("Conflicting member functions with failed private merge", function() {
  core.Class("members.Include1", {
    members : {
      __foo : function() {}
    }
  });
  core.Class("members.Include2", {
    members : {
      __foo : function() {}
    }
  });

  this.raisesException(function() {
    core.Class("members.Join", {
      include : [members.Include1, members.Include2],
    
      members : {
        // Private merge... not allowed
        __foo : function() {
          members.Include1.prototype.foo.call(this);
          members.Include2.prototype.foo.call(this);
        
          doSomethingElse();
        }
      }
    });
  });
}); 



/*
---------------------------------------------------------------------------
  CLASSES :: EVENTS
---------------------------------------------------------------------------
*/

var suite = new core.testrunner.Suite("OO/Classes/Events", null, function() {
  core.Main.clearNamespace("events.Keyboard");
  core.Main.clearNamespace("events.Mouse");
  core.Main.clearNamespace("events.Widget");
  core.Main.clearNamespace("events.Widget2");
});

  
/**
 * Basic event declaration with additional test to mixin classes.
 */

// Prepare event classes
core.Class("MouseEvent", {});
core.Class("KeyEvent", {});
core.Class("TouchEvent", {});
core.Class("DataEvent", {});
core.Class("FocusEvent", {});


suite.test("Events", function() {
  core.Class("events.Mouse", {
    events : {
      click : MouseEvent,
      mousedown : MouseEvent,
      mouseup : MouseEvent
    }
  });
  
  var eventMap = core.Class.getEvents(events.Mouse);
  this.isTrue((function() {
    core.Assert.isType(eventMap, "Map");
    return true;
  })(), "Events should be a returned as a map");
  this.isEqual(eventMap.click, MouseEvent, "No click event found");
  
  core.Class("events.Keyboard", {
    events : {
      keydown : KeyEvent,
      keyup : KeyEvent
    }
  });
  
  core.Class("events.Widget", {
    include : [events.Mouse, events.Keyboard]
  });
  
  var full = Object.keys(core.Class.getEvents(events.Widget)).join(",");
  this.isEqual(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");

  core.Class("events.Widget2", {
    include : [events.Mouse, events.Keyboard],
    events : {
      custom : DataEvent
    }
  });

  var full = Object.keys(core.Class.getEvents(events.Widget2)).join(",");
  this.isEqual(full, "custom,click,mousedown,mouseup,keydown,keyup", "Merge of events with own events failed");
});



suite.test("Event Conflicts", function() {
  core.Class("events.Mouse", {
    events : {
      click : MouseEvent,
      mousedown : MouseEvent,
      mouseup : MouseEvent
    }
  });
  
  core.Class("events.Keyboard", {
    events : {
      keydown : KeyEvent,
      keyup : KeyEvent
    }
  });
  
  core.Class("events.Widget", {
    include : [events.Mouse, events.Keyboard],
    
    events : {
      // This override should be okay
      click : MouseEvent
    }
  });
  
  core.Class("events.Touch", {
    events : {
      click : TouchEvent,
      tap : TouchEvent
    }
  });    
  
  var full = Object.keys(core.Class.getEvents(events.Widget)).join(",");
  this.isEqual(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");
  
  this.raisesException(function() {
    core.Class("events.Widget2", {
      // This should fail, two click events in include list
      include : [events.Mouse, events.Keyboard, events.Touch]
    });    
  })
});

suite.test("Event Interfaces", function() 
{
  core.Interface("events.UserActions", 
  {
    events : 
    {
      click : MouseEvent,
      mousedown : MouseEvent,
      mouseup : MouseEvent,
      focus : FocusEvent,
      blur : FocusEvent,
      keydown : KeyEvent,
      keyup : KeyEvent
    }
  });
  
  this.raisesException(function() 
  {
    var MouseEvent = true;
    core.Class("events.Mouse", 
    {
      implement : [events.UserActions],
      events : {
        click : MouseEvent,
        mousedown : MouseEvent,
        mouseup : MouseEvent
      }
    });
  });
});



/*
---------------------------------------------------------------------------
  CLASSES :: PROPERTIES
---------------------------------------------------------------------------
*/

var suite = new core.testrunner.Suite("OO/Classes/Properties", null, function() {
  core.Main.clearNamespace("properties.Text");
  core.Main.clearNamespace("properties.Dimension");
  core.Main.clearNamespace("properties.Label");
  core.Main.clearNamespace("properties.Simple");
  core.Main.clearNamespace("properties.IColor");
  core.Main.clearNamespace("properties.IFontSize");
  core.Main.clearNamespace("properties.ColorImplementer");
  core.Main.clearNamespace("properties.ColorWrongImplementer");
  core.Main.clearNamespace("properties.FontSizeImplementer");
  core.Main.clearNamespace("properties.FontSizeMissing");
  core.Main.clearNamespace("properties.FontSizeWrongImplementer");
  core.Main.clearNamespace("properties.Parent");
  core.Main.clearNamespace("properties.Child1");
  core.Main.clearNamespace("properties.Child2");
}); 

suite.test("Creating Properties", function() 
{
  core.Class("properties.Simple", 
  {
    include : [core.event.MEventTarget],

    properties : 
    {
      color : 
      {
        type : "String",
        apply : function(value, old) {
          // pass
        }
      }
    }
  });
  
  this.isTrue((function() {
    core.Class.assertIsClass(properties.Simple);
    return true;
  })());
  this.isEqual(Object.keys(core.Class.getProperties(properties.Simple)).join(","), "color");

  this.isEqual(core.Class.getProperties(properties.Simple).color.type, "String");
  this.isEqual(typeof core.Class.getProperties(properties.Simple).color.apply, "function");

  this.isTrue(properties.Simple.prototype.getColor instanceof Function);
  this.isTrue(properties.Simple.prototype.setColor instanceof Function);

  this.isEqual(properties.Simple.prototype.getColor.displayName, "properties.Simple.getColor");
  this.isEqual(properties.Simple.prototype.setColor.displayName, "properties.Simple.setColor");
  
  this.isEqual(properties.Simple.prototype.getColor.length, 0);
  this.isEqual(properties.Simple.prototype.setColor.length, 1);
  
  var obj1 = new properties.Simple;
  this.isEqual(obj1.setColor("red"), "red");
  this.isEqual(obj1.getColor(), "red");
});


suite.test("Property Interfaces", function()
{
  core.Interface("properties.IColor", 
  {
    properties : 
    {
      color : {
        type : "String",
        fire : "changeColor"
      }
    }
  });
  
  core.Class("properties.ColorImplementer", 
  {
    implement : [properties.IColor],
    include : [core.event.MEventTarget],      
    properties : 
    {
      color : 
      {
        type : "String",
        fire : "changeColor"
      }
    }
  });
  
  this.raisesException(function() {
    core.Class("properties.ColorImplementer",
    {
      implement : [properties.IColor],
      properties : 
      {
        color : 
        {
          type : "String"
        }
      }
    });
  });

  core.Interface("properties.IFontSize", 
  {
    properties : 
    {
      /** #require(core.property.Multi) */
      fontSize : {
        type : "Integer",
        inheritable : true
      }
    }
  });
  
  core.Class("properties.FontSizeImplementer", 
  {
    implement : [properties.IFontSize],
    properties : 
    {
      fontSize : 
      {
        type : "Integer",
        inheritable : true
      }
    },
    
    members : 
    {
      // Interface implementation
      getInheritedValue : function(property) {
        // pass
      }
    }
  });
  
  this.raisesException(function() 
  {
    core.Class("properties.FontSizeMissing", {
      implement : [properties.IFontSize]
    });
  })
  
  this.raisesException(function() 
  {
    core.Class("properties.FontSizeWrongImplementer", 
    {
      implement : [properties.IFontSize],
      properties : 
      {
        fontSize : 
        {
          type : "String",
          inheritable : true
        }
      },

      members : 
      {
        // Interface implementation
        getInheritedValue : function(property) {
          // pass
        }
      }
    });
  });
});

suite.test("Creating specific properties in classes without matching interfaces", function()
{
  this.raisesException(function() 
  {
    core.Class("properties.NoFireEvent", 
    {
      properties : 
      {
        size : {
          fire : "changeSize"
        }
      }
    });
  });
  
  this.raisesException(function() 
  {
    core.Class("properties.NoGetThemed", 
    {
      properties : 
      {
        size : {
          themeable : true
        }
      }
    });
  });
  
  this.raisesException(function() 
  {
    core.Class("properties.NoGetInherited", 
    {
      properties : 
      {
        size : {
          inheritable : true
        }
      }
    });
  });
});


suite.test("Inheriting Properties", function() 
{
  core.Class("properties.Text", 
  {
    construct : function(element) {
      this.__textElement = element;
    },
    
    properties : 
    {
      wrap : 
      {
        type : "Boolean",
        apply : function(value, old) {
          this.__textElement.style.whiteSpace = value ? "" : "no-wrap"
        }
      },
      
      color : 
      {
        type : "String",
        apply : function(value, old) {
          this.__textElement.style.color = value;
        }
      },
      
      fontFamily : 
      {
        type : ["sans-serif", "serif", "monospace"],
        apply : function(value, old) {
          this.__textElement.style.fontFamily = value;
        }
      },
      
      lineHeight : 
      {
        type : "Integer",
        apply : function(value, old) {
          this.__textElement.style.lineHeight = value;
        }
      }
    },
    
    members : 
    {
      destruct : function() {
        this.__textElement = null;
      }
    }
  });
  
  this.isTrue(core.Class.isClass(properties.Text));
  this.isEqual(Object.keys(core.Class.getProperties(properties.Text)).join(","), "wrap,color,fontFamily,lineHeight");



  core.Class("properties.Dimension", 
  {
    properties : 
    {
      width : {
        type : "Integer"
      },
      
      height : {
        type : "Integer"
      }
    }
  });

  this.isTrue(core.Class.isClass(properties.Dimension));
  this.isEqual(Object.keys(core.Class.getProperties(properties.Dimension)).join(","), "width,height");
  
  


  core.Class("properties.Label", 
  {
    include : [properties.Text, properties.Dimension],
    
    construct : function() 
    {
      // Fake DOM element
      this.__labelElement = typeof document != "undefined" ? document.createElement("label") : {style:{}};
      
      properties.Text.call(this, this.__labelElement);
      
      this.setLineHeight(2);
    },
    
    members :
    {
      destruct : function() 
      {
        properties.Text.prototype.destruct.call(this);
        this.__labelElement = null;
      }
    }
  });
  
  this.isTrue(core.Class.isClass(properties.Label));
  this.isEqual(Object.keys(core.Class.getProperties(properties.Label)).join(","), "wrap,color,fontFamily,lineHeight,width,height");
  
  
  
  var ll = new properties.Label;
  this.isEqual(ll.getLineHeight(), 2);
});


suite.test("Overwrite properties", function() 
{
  core.Class("properties.Parent",
  {
    properties : {
      prop : {
        init: "Parent"
      }
    }
  });
  core.Class("properties.Child1",
  {
    include : [properties.Parent],
    properties : {
      prop : {
        init: "Child1"
      }
    }
  });
  core.Class("properties.Child2",
  {
    include : [properties.Parent]
  });
  
  var child1 = new properties.Child1();
  var child2 = new properties.Child2();
  
  this.isEqual("Child1", child1.getProp());
  this.isEqual("Parent", child2.getProp());
});

