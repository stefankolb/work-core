/** 
 * #require(QUnit) 
 * #require(test.*)
 * #asset(qunit.css)
 */
var global = this;
	


	/*
	---------------------------------------------------------------------------
		CORE :: MODULES
	---------------------------------------------------------------------------
	*/
	
	module("Core :: Modules", {
		teardown : function() {
			delete global.abc;
			delete global.x;
		}
	});
	
	test("Creating empty module", function() {
		core.Module("abc.Module1", {});
		equal(core.Module.isModule(abc.Module1), true);
		equal(abc.Module1.moduleName, "abc.Module1");
		equal(abc.Module1.toString(), "[module abc.Module1]");
	});
	
	test("Creating module with short namespace", function() {
		core.Module("x.Module1", {});
		equal(core.Module.isModule(x.Module1), true);
		equal(x.Module1.moduleName, "x.Module1");
		equal(x.Module1.toString(), "[module x.Module1]");
	});

	test("Module false validation", function() {
		ok(!core.Module.isModule({}));
		ok(!core.Module.isModule(3));
		ok(!core.Module.isModule(null));
	});
	
	test("Creating method module", function() {
		core.Module("abc.Module2", {
			method1 : function() {},
			method2 : function() {},
			method3 : function() {}
		});
		equal(core.Module.isModule(abc.Module2), true);
		ok(abc.Module2.method1 instanceof Function);
		ok(abc.Module2.method2 instanceof Function);
		ok(abc.Module2.method3 instanceof Function);
		equal(abc.Module2.method1.displayName, "abc.Module2.method1");
		equal(abc.Module2.method2.displayName, "abc.Module2.method2");
		equal(abc.Module2.method3.displayName, "abc.Module2.method3");
	});
	
	test("Checking module name", function() {
		raises(function() {
			core.Module("", {});
		});
		raises(function() {
			Module(true, {});
		});
		raises(function() {
			core.Module(" SpaceVoodoo ", {});
		});
		raises(function() {
			core.Module("has space", {});
		});
		raises(function() {
			core.Module("firstLow", {});
		});
		raises(function() {
			core.Module("two..Dots", {});
		});
	});
	
	
	
	/*
	---------------------------------------------------------------------------
		CORE :: CLASSES :: BASICS
	---------------------------------------------------------------------------
	*/
	
	module("Core :: Classes :: Basics", {
		teardown : function() {
			core.Main.clearNamespace("abc.Class1");
			core.Main.clearNamespace("abc.Class2");
			core.Main.clearNamespace("abc.Class3");
		}
	});

	test("Invalid config", function() {
		raises(function() {
			core.Class("abc.Class1");
		});
		raises(function() {
			core.Class("abc.Class2", 42);
		})
		raises(function() {
			core.Class("abc.Class3", {
				unallowedKey : "foo"
			});
		});
	});

	test("Creating empty class", function() {
		core.Class("abc.Class1", {});
		equal(core.Class.isClass(abc.Class1), true);
		equal(abc.Class1.className, "abc.Class1");
		equal(abc.Class1.toString(), "[class abc.Class1]");
	});
	
	test("Class false validation", function() {
		ok(!core.Class.isClass({}));
		ok(!core.Class.isClass(3));
		ok(!core.Class.isClass(null));
	});
	
		
	
	
	/*
	---------------------------------------------------------------------------
		CORE :: CLASSES :: MEMBERS
	---------------------------------------------------------------------------
	*/	
	
	module("Core :: Classes :: Members", {
		teardown : function() {
			core.Main.clearNamespace("members.Class1");
			core.Main.clearNamespace("members.Include1");
			core.Main.clearNamespace("members.Include2");
		}
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member functions", function() {
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

		raises(function() {
			core.Class("members.Join", {
				include : [members.Include1, members.Include2]
			});
		});
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member.
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member data", function() {
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

		raises(function() {
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
	test("Conflicting member functions, correctly merged", function() {
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
		
		ok(true);
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * The conflict is tried being prevented as the affected member is also defined locally. But as
	 * it is not a function this is not regarded as solved. The individual included classes might
	 * require that this member is a function!
	 */
	test("Conflicting member functions, not merged correctly", function() {
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

		raises(function() {
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
	test("Conflicting member functions with failed private merge", function() {
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

		raises(function() {
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
		CORE :: CLASSES :: EVENTS
	---------------------------------------------------------------------------
	*/
	
	module("Core :: Classes :: Events", {
		teardown : function() {
			core.Main.clearNamespace("events.Keyboard");
			core.Main.clearNamespace("events.Mouse");
			core.Main.clearNamespace("events.Widget");
			core.Main.clearNamespace("events.Widget2");
		}
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

	
	test("Events", function() {
		core.Class("events.Mouse", {
			events : {
				click : MouseEvent,
				mousedown : MouseEvent,
				mouseup : MouseEvent
			}
		});
		
		var eventMap = core.Class.getEvents(events.Mouse);
		ok((function() {
			core.Assert.isType(eventMap, "Map");
			return true;
		})(), "Events should be a returned as a map");
		equal(eventMap.click, MouseEvent, "No click event found");
		
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
		equal(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");

		core.Class("events.Widget2", {
			include : [events.Mouse, events.Keyboard],
			events : {
				custom : DataEvent
			}
		});

		var full = Object.keys(core.Class.getEvents(events.Widget2)).join(",");
		equal(full, "custom,click,mousedown,mouseup,keydown,keyup", "Merge of events with own events failed");
	});
	
	
	
	test("Event Conflicts", function() {
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
		equal(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");
		
		raises(function() {
			core.Class("events.Widget2", {
				// This should fail, two click events in include list
				include : [events.Mouse, events.Keyboard, events.Touch]
			});		
		})
	});
	
	test("Event Interfaces", function() 
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
		
		raises(function() 
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
	
	module("Core :: Classes :: Properties", {
		teardown : function() {
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
		}
	}); 
	
	test("Creating Properties", function() 
	{
		core.Class("properties.Simple", 
		{
			include : [core.event.MEvent],

			properties : 
			{
				color : 
				{
					type : "String",
					apply : function(value, old) {
						// pass
					}
				},
				
				backgroundColor : 
				{
					type : "String",
					apply : function(value, old) {
						// pass
					},
					fire : "changeBackgroundColor"
				}
			}
		});
		
		ok((function() {
			core.Class.assertIsClass(properties.Simple);
			return true;
		})());
		equal(Object.keys(core.Class.getProperties(properties.Simple)).join(","), "color,backgroundColor");

		equal(core.Class.getProperties(properties.Simple).color.type, "String");
		equal(typeof core.Class.getProperties(properties.Simple).color.apply, "function");

		ok(properties.Simple.prototype.getColor instanceof Function);
		ok(properties.Simple.prototype.getBackgroundColor instanceof Function);
		ok(properties.Simple.prototype.setColor instanceof Function);
		ok(properties.Simple.prototype.setBackgroundColor instanceof Function);

		equal(properties.Simple.prototype.getColor.displayName, "properties.Simple.getColor");
		equal(properties.Simple.prototype.getBackgroundColor.displayName, "properties.Simple.getBackgroundColor");
		equal(properties.Simple.prototype.setColor.displayName, "properties.Simple.setColor");
		equal(properties.Simple.prototype.setBackgroundColor.displayName, "properties.Simple.setBackgroundColor");
		
		equal(properties.Simple.prototype.getColor.length, 0);
		equal(properties.Simple.prototype.getBackgroundColor.length, 0);
		equal(properties.Simple.prototype.setColor.length, 1);
		equal(properties.Simple.prototype.setBackgroundColor.length, 1);
		
		var obj1 = new properties.Simple;
		equal(obj1.setColor("red"), "red");
		equal(obj1.setBackgroundColor("black"), "black");
		equal(obj1.getColor(), "red");
		equal(obj1.getBackgroundColor(), "black");
	});
	
	
	test("Property Interfaces", function()
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
			include : [core.event.MEvent],			
			properties : 
			{
				color : 
				{
					type : "String",
					fire : "changeColor"
				}
			}
		});
		
		raises(function() {
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
		
		raises(function() 
		{
			core.Class("properties.FontSizeMissing", {
				implement : [properties.IFontSize]
			});
		})
		
		raises(function() 
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
	
	test("Creating specific properties in classes without matching interfaces", function()
	{
		raises(function() 
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
		
		raises(function() 
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
		
		raises(function() 
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
	
	
	test("Inheriting Properties", function() 
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
		
		ok(core.Class.isClass(properties.Text));
		equal(Object.keys(core.Class.getProperties(properties.Text)).join(","), "wrap,color,fontFamily,lineHeight");



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

		ok(core.Class.isClass(properties.Dimension));
		equal(Object.keys(core.Class.getProperties(properties.Dimension)).join(","), "width,height");
		
		


		core.Class("properties.Label", 
		{
			include : [properties.Text, properties.Dimension],
			
			construct : function() 
			{
				this.__labelElement = document.createElement("label");
				
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
		
		ok(core.Class.isClass(properties.Label));
		equal(Object.keys(core.Class.getProperties(properties.Label)).join(","), "wrap,color,fontFamily,lineHeight,width,height");
		
		
		
		var ll = new properties.Label;
		equal(ll.getLineHeight(), 2);
	});
	
	
	test("Overwrite properties", function() 
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
		
		equal("Child1", child1.getProp());
		equal("Parent", child2.getProp());
	});
	

	/*
	---------------------------------------------------------------------------
		OBJECT EVENTS
	---------------------------------------------------------------------------
	*/
	
	module("Core :: Classes :: Events", {
		teardown : function() {
			core.Main.clearNamespace("events.Simple1");
			core.Main.clearNamespace("events.Simple2");
			core.Main.clearNamespace("events.Simple3");
			core.Main.clearNamespace("events.Simple4");
			core.Main.clearNamespace("events.Simple5");
			core.Main.clearNamespace("events.Simple6");
			core.Main.clearNamespace("events.Simple7");
			core.Main.clearNamespace("events.Simple8");
			core.Main.clearNamespace("events.Simple9");
		}
	});

	test("Basic", function() 
	{
		core.Class("events.Simple1", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testBasic : function() 
				{
					var eventExecuted = 0;
					this.addListener("simple1", function() {
						eventExecuted++;
					});

					this.fireEvent("simple1");
					equal(eventExecuted, 1);

					this.fireEvent("simple1");
					this.fireEvent("simple1");
					equal(eventExecuted, 3);
				}
			}
		});

		new events.Simple1().testBasic();
	});

	test("Context", function() 
	{
		core.Class("events.Simple2", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testContext : function() 
				{
					var contextObject = {valid : 1};

					this.addListener("simple2", function() {
						equal(this.valid, 1);
					}, contextObject);

					this.fireEvent("simple2");
				}
			}
		});

		new events.Simple2().testContext();
	});

	test("Deconnect", function() 
	{
		core.Class("events.Simple4", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testDeconnect : function() {

					var eventExecuted = 0;
					var myListener = function() {
						eventExecuted++;
					};

					this.addListener("simple4", myListener);

					this.fireEvent("simple4");
					equal(eventExecuted, 1);

					this.removeListener("simple4", myListener);

					equal(eventExecuted, 1);
					this.fireEvent("simple4");
					equal(eventExecuted, 1);

					equal(this.addListener("simple4", myListener), true);
					equal(this.addListener("simple4", myListener), false);
					equal(this.addListener("simple4", myListener), false);

					this.fireEvent("simple4");
					equal(eventExecuted, 2);

					equal(this.removeListener("simple4", myListener), true);
					equal(this.removeListener("simple4", myListener), false);
				}
			}
		});

		new events.Simple4().testDeconnect();
	});

	test("Has", function() 
	{
		core.Class("events.Simple5", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testHasListener : function() {

					var myListener = function() {};
					var myHelperObject = {};

					equal(this.hasListener("simple5"), false);
					this.addListener("simple5", myListener);
					equal(this.hasListener("simple5"), true);
					equal(this.hasListener("simple5", myListener), true);
					equal(this.hasListener("simple5", myListener, myHelperObject), false);
					this.removeListener("simple5", myListener);

					equal(this.hasListener("simple5"), false);
					this.addListener("simple5", myListener, myHelperObject);
					equal(this.hasListener("simple5"), true);
					equal(this.hasListener("simple5", myListener), false);
					equal(this.hasListener("simple5", myListener, myHelperObject), true);
					this.removeListener("simple5", myListener, myHelperObject);

				}
			}
		});

		new events.Simple5().testHasListener();
	});

	test("Connect While Fire", function() 
	{
		core.Class("events.Simple6", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testConnectWhileFire : function() {

					var count1 = 0;
					var count2 = 0;

					var myListener1 = function() {
						count1++;
					};

					var myListener2 = function() {
						count2++;
						this.addListener("simple6", myListener1);
					};

					this.addListener("simple6", myListener2);
					equal(count1, 0);
					equal(count2, 0);

					this.fireEvent("simple6");

					equal(count1, 0);
					equal(count2, 1);

					this.fireEvent("simple6");

					equal(count1, 1);
					equal(count2, 2);

				}
			}
		});

		new events.Simple6().testConnectWhileFire();
	});

	test("Deconnect While Fire", function() 
	{
		core.Class("events.Simple7", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testDeconnectWhileFire : function() {

					var count1 = 0;
					var count2 = 0;

					var myListener1 = function() {
						count1++;
					};

					var myListener2 = function() {
						count2++;
						this.removeListener("simple7", myListener1);
					};

					this.addListener("simple7", myListener1);
					this.addListener("simple7", myListener2);

					equal(count1, 0);
					equal(count2, 0);

					this.fireEvent("simple7");

					equal(count1, 1);
					equal(count2, 1);

					this.fireEvent("simple7");

					equal(count1, 1);
					equal(count2, 2);

				}
			}
		});

		new events.Simple7().testDeconnectWhileFire();
	});

	test("Deconnect Self", function() 
	{
		core.Class("events.Simple8", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testDeconnectSelf : function() {

					var count = 0;
					var myListener = function() {
						count++;
						this.removeListener("simple8", myListener);
					}

					this.addListener("simple8", myListener);
					equal(count, 0);

					this.fireEvent("simple8");
					equal(count, 1);

					this.fireEvent("simple8");
					equal(count, 1);

				}
			}
		});

		new events.Simple8().testDeconnectSelf();
	});

	test("Listen Once", function() 
	{
		core.Class("events.Simple9", 
		{
			include : [core.event.MEvent],
			members : 
			{
				testListenOnce : function() {

					var count = 0;
					var myListener = function() {
						count++;
					}

					this.addListenerOnce("simple9", myListener);
					equal(count, 0);

					this.fireEvent("simple9");
					equal(count, 1);

					this.fireEvent("simple9");
					equal(count, 1);

				}
			}
		});

		new events.Simple9().testListenOnce();
	});



	/*
	---------------------------------------------------------------------------
		OBJECT POOLING
	---------------------------------------------------------------------------
	*/
	
	module("Core :: Classes :: Pooling", {
		teardown : function() 
		{
			core.Main.clearNamespace("pooled.Simple1");
			core.Main.clearNamespace("pooled.Simple2");
			core.Main.clearNamespace("pooled.Simple3");
			core.Main.clearNamespace("pooled.Simple4");
			core.Main.clearNamespace("pooled.Simple5");
		}
	});

	test("Create Pooled Class", function() 
	{
		core.Class("pooled.Simple1",
		{
			pooling : true,

			construct: function(a) {
				this.a = a;
			}
		});

		var obj = pooled.Simple1.obtain(1);
		equal(typeof obj, "object");
		equal(obj.a, 1);
		equal(obj.constructor.className, "pooled.Simple1");
		equal(obj instanceof pooled.Simple1, true);

	});

	test("Reuse Pooled Class", function() 
	{
		core.Class("pooled.Simple2",
		{
			pooling : true,

			construct: function(a) {
				this.a = a;
			}
		});

		var obj1 = pooled.Simple2.obtain(1);
		equal(typeof obj1, "object");
		equal(obj1.a, 1);

		obj1.release();

		var obj2 = pooled.Simple2.obtain(2);
		equal(typeof obj2, "object");
		equal(obj2.a, 2);

	});

	test("Reuse/Extend Pooled Class", function() 
	{
		core.Class("pooled.Simple3",
		{
			pooling : true,

			construct: function(a) {
				this.a = a;
			}
		});

		equal(pooled.Simple3.getPoolSize(), 0);

		var obj1 = pooled.Simple3.obtain(1);
		equal(typeof obj1, "object");
		equal(obj1.a, 1);

		equal(pooled.Simple3.getPoolSize(), 0);

		obj1.release();

		equal(pooled.Simple3.getPoolSize(), 1);

		var obj2 = pooled.Simple3.obtain(2);
		equal(typeof obj2, "object");
		equal(obj2.a, 2);

		equal(pooled.Simple3.getPoolSize(), 0);

		var obj3 = pooled.Simple3.obtain(3);
		equal(typeof obj3, "object");
		equal(obj3.a, 3);

		equal(pooled.Simple3.getPoolSize(), 0);

		obj2.release();
		obj3.release();

		equal(pooled.Simple3.getPoolSize(), 2);

	});	


	test("Limited Pooled Class", function() 
	{
		core.Class("pooled.Simple4",
		{
			pooling : {
				max : 2
			},

			construct: function() {

			}
		});

		var obj1 = pooled.Simple4.obtain();
		equal(typeof obj1, "object");

		var obj2 = pooled.Simple4.obtain();
		equal(typeof obj2, "object");

		var obj3 = pooled.Simple4.obtain();
		equal(typeof obj3, "object");

		var obj4 = pooled.Simple4.obtain();
		equal(typeof obj4, "object");

		equal(pooled.Simple4.getPoolSize(), 0);

		obj1.release();
		obj2.release();
		obj3.release();
		obj4.release();

		equal(pooled.Simple4.getPoolSize(), 2);

	});

	test("Pooled Class Checks", function() 
	{
		core.Class("pooled.Simple5",
		{
			pooling : {
				max : 2
			},

			construct: function(a) {
				if (!this.isold) {
					this.isreused = false;
					this.isold = true;
				} else {
					this.isreused = true;
				}
			}
		});

		var obj1 = pooled.Simple5.obtain(1);
		equal(typeof obj1, "object");
		equal(obj1.isreused, false);

		obj1.release();

		var obj2 = pooled.Simple5.obtain(2);
		equal(typeof obj2, "object");
		equal(obj2.isreused, true);

		var obj3 = pooled.Simple5.obtain(3);
		equal(typeof obj3, "object");
		equal(obj3.isreused, false);

		obj2.release();
		obj3.release();

	});


