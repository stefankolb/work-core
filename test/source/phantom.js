phantom.onError = function(msg, trace) 
{
  var msgStack = ["Phantom Error: " + msg];
  
  if (trace) 
  {
    msgStack.push("Stack Trace:");
    trace.forEach(function(t) {
      msgStack.push(" -> " + (t.file || t.sourceURL) + ": " + t.line + (t.function ? " (in function " + t.function + ")" : ""));
    });
  }

  console.error(msgStack.join("\n"));
};

var page = require("webpage").create();

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log(msg);
};

page.onAlert = function(msg) {
  console.warn("Alert: " + msg);
};

page.onCallback = function(data) 
{
  if (data.action == "finished") {
    phantom.exit(data.status ? 0 : 1);       
  }
};

page.open("index.html", function(status) {
  console.log("Test suite loaded [" + status + "]");
});

