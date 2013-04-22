var suite = new core.testrunner.Suite("Template/Compiler");

suite.test("Basic", function() 
{
  var template = core.template.Compiler.compile("Follow @{{screenName}}.");
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({
    screenName: "dhg"
  });
  
  this.isEqual(output, "Follow @dhg.");
  
  var output = template.render({
    screenName: "wpbasti"
  });
  
  this.isEqual(output, "Follow @wpbasti.");
});

suite.test("Labels", function() 
{
  var template = core.template.Compiler.compile("{{_follow}} @{{screenName}}.", {
    follow : "Follow"
  });
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({ screenName: "dhg" });
  this.isEqual(output, "Follow @dhg.");
});

suite.test("Labels - Undefined", function() 
{
  var template = core.template.Compiler.compile("{{_follow}} @{{screenName}}.");
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({ screenName: "dhg" });
  this.isEqual(output, " @dhg.");
});

suite.test("Labels - Static with Placeholder", function() 
{
  var template = core.template.Compiler.compile("<b>{{_follow}}</b>", {
    follow : "Follow @{{screenName}}."
  });
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({ screenName: "dhg" });
  this.isEqual(output, "<b>Follow @dhg.</b>");
});

suite.test("Labels - Dynamic", function() 
{
  var template = core.template.Compiler.compile("<label>{{_selected}}</label>");
  this.isTrue(template instanceof core.template.Template);

  var number = 3;
  var output = template.render({}, null, {
    selected : number > 1 ? "Selected many files." : "Selected one file."
  });
  this.isEqual(output, "<label>Selected many files.</label>");

  var number = 1;
  var output = template.render({}, null, {
    selected : number > 1 ? "Selected many files." : "Selected one file."
  });
  this.isEqual(output, "<label>Selected one file.</label>");  
});

suite.test("Labels - Dynamic with Placeholder", function() 
{
  var template = core.template.Compiler.compile("<label>{{_selected}}</label>");
  this.isTrue(template instanceof core.template.Template);

  var number = 3;
  var output = template.render({ number : number }, null, {
    selected : number > 1 ? "Selected {{number}} files." : "Selected one file."
  });
  this.isEqual(output, "<label>Selected 3 files.</label>");

  var number = 1;
  var output = template.render({ number : number }, null, {
    selected : number > 1 ? "Selected {{number}} files." : "Selected one file."
  });
  this.isEqual(output, "<label>Selected one file.</label>");  
});

suite.test("Labels - Mixed", function() 
{
  var template = core.template.Compiler.compile("<label>{{_staticl}}</label> <label>{{_dynamicl}}</label>", {
    staticl : "This is static: {{value1}}."
  });
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({value1: 123, value2: 456}, null, {
    dynamicl : "This is dynamic: {{value2}}."
  });
  this.isEqual(output, "<label>This is static: 123.</label> <label>This is dynamic: 456.</label>");

  var output = template.render({value1: 123, value2: 456}, null, {
    dynamicl : "This is dynamic - changed: {{value2}}."
  });
  this.isEqual(output, "<label>This is static: 123.</label> <label>This is dynamic - changed: 456.</label>");  
});

suite.test("Labels - Dotted", function() 
{
  var template = core.template.Compiler.compile("{{_user.follow}} @{{screenName}}.", {
    "user.follow" : "Follow"
  });
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({ screenName: "dhg" });
  this.isEqual(output, "Follow @dhg.");
});

suite.test("Labels - Looped Static", function() 
{
  var template = core.template.Compiler.compile("{{#users}}<li>{{_follow}}</li>{{/users}}", {
    follow : "Follow @{{screenName}}"
  });
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({
    users : 
    [
      {screenName : "gruber"},
      {screenName : "dhg"},
      {screenName : "neutralshow"},
      {screenName : "boosc"},
      {screenName : "wpbasti"}
    ]
  });
  this.isEqual(output, "<li>Follow @gruber</li><li>Follow @dhg</li><li>Follow @neutralshow</li><li>Follow @boosc</li><li>Follow @wpbasti</li>");
});

suite.test("Labels - Looped Dynamic", function() 
{
  var template = core.template.Compiler.compile("{{#users}}<li>{{_follow}}</li>{{/users}}");
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({
    users : 
    [
      {screenName : "gruber"},
      {screenName : "dhg"},
      {screenName : "neutralshow"},
      {screenName : "boosc"},
      {screenName : "wpbasti"}
    ]
  }, null, {
    follow : "Folge @{{screenName}}"
  });
  this.isEqual(output, "<li>Folge @gruber</li><li>Folge @dhg</li><li>Folge @neutralshow</li><li>Folge @boosc</li><li>Folge @wpbasti</li>");
});

suite.test("Line Breaks", function()
{
  var template = core.template.Compiler.compile("Break\nHere {{value}}.", null, true);
  this.isTrue(template instanceof core.template.Template);

  var output = template.render({
    value: "xxx"
  });
  
  this.isEqual(output, "Break\nHere xxx.");
});

suite.test("Lists", function() 
{
  var template = core.template.Compiler.compile("{{#repo}}<b>{{name}}</b>{{/repo}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  this.isEqual(output, "<b>resque</b><b>hub</b><b>rip</b>");
});

suite.test("Conditional Lists", function() 
{
  var template = core.template.Compiler.compile("{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  this.isEqual(output, "Repos<br/><b>resque</b><b>hub</b><b>rip</b>");
  
  var output = template.render({
    "repo": []
  });
  
  this.isEqual(output, "");
  
  
  
  var template = core.template.Compiler.compile("{{#other}}<em>{{name}}</em>{{/other}}{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");

  var output = template.render({
    "repo": [],
    "other": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });

  this.isEqual(output, "<em>resque</em><em>hub</em><em>rip</em>");
  
  
  var template = core.template.Compiler.compile("{{#other}}<em>{{foo}}</em>{{/other}}{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");

  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ],
    "other": {
      "foo" : "bar"
    }
  });

  this.isEqual(output, "<em>bar</em>Repos<br/><b>resque</b><b>hub</b><b>rip</b>");    
}); 

suite.test("Non False", function()
{
  var template = core.template.Compiler.compile("{{#person?}}Hi {{name}}!{{/person?}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "person?": { "name": "Jon" }
  });
  
  this.isEqual(output, "Hi Jon!");
});

suite.test("Inverted Sections", function() 
{
  var template = core.template.Compiler.compile("{{#repo}}<b>{{.}}</b>{{/repo}}{{^repo}}No repos :({{/repo}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  this.isEqual(output, "No repos :(");
  
  var output = template.render({
    "repo": [1,2,3]
  });
  
  this.isEqual(output, "<b>1</b><b>2</b><b>3</b>");
});

suite.test("Comments", function() 
{
  var template = core.template.Compiler.compile("<h1>Today{{! ignore me }}.</h1>");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  this.isEqual(output, "<h1>Today.</h1>");
});


suite.test("Unescaped", function() 
{
  var template = core.template.Compiler.compile("{{code}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  this.isEqual(output, "&lt;b&gt;Foo&lt;/b&gt;");
  
  var output = template.render({
    "code": "Bert & Ernie"
  });
  
  this.isEqual(output, "Bert &amp; Ernie");

  var template = core.template.Compiler.compile("{{=code}}");
  this.isTrue(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  this.isEqual(output, "<b>Foo</b>");
}); 

suite.test("Partials", function() 
{
  var template = core.template.Compiler.compile("{{#tweets}}{{> tweet}}{{/tweets}}");
  this.isTrue(template instanceof core.template.Template);

  var tweetTemplate = core.template.Compiler.compile('<p data-id="{{id}}">{{text}}</p>');
  this.isTrue(tweetTemplate instanceof core.template.Template);
  
  var output = template.render({
    "tweets": [{
      text: "hello world",
      id: 1
    }, {
      text: "this is a test tweet",
      id: 2
    }, {
      text: "to impress you",
      id: 3
    }]
  }, {
    tweet: tweetTemplate
  });
  
  this.isEqual(output, "<p data-id=\"1\">hello world</p><p data-id=\"2\">this is a test tweet</p><p data-id=\"3\">to impress you</p>");
});

suite.test("Dots", function() 
{
  var template = core.template.Compiler.compile("{{#tweets}}{{author.name}}[{{author.id}}]{{/tweets}}");
  var output = template.render({
    "tweets": [{
      author: {
        name : "Reinhardt",
        id : 0
      }
    }, {
      author: {
        name : "Christoph",
        id : 1
      }
    }, {
      author: {
        name : "Harald",
        id : 2
      }
    }]
  });
  
  this.isEqual(output, "Reinhardt[0]Christoph[1]Harald[2]");
}); 

