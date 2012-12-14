module("Events", {
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