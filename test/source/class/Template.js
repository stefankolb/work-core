var suite = new core.test.Suite("Template");

suite.test("Basic", function() {
  
  var template = core.template.Compiler.compile("Follow @{{screenName}}.");
  this.ok(template instanceof core.template.Template);

  var output = template.render({
    screenName: "dhg"
  });
  
  this.equal(output, "Follow @dhg.");
  
  var output = template.render({
    screenName: "wpbasti"
  });
  
  this.equal(output, "Follow @wpbasti.");
  
});

suite.test("Line Breaks", function() {
  
  var template = core.template.Compiler.compile("Break\nHere {{value}}.");
  this.ok(template instanceof core.template.Template);

  var output = template.render({
    value: "xxx"
  });
  
  this.equal(output, "Break\nHere xxx.");

});

suite.test("Lists", function() {

  var template = core.template.Compiler.compile("{{#repo}}<b>{{name}}</b>{{/repo}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  this.equal(output, "<b>resque</b><b>hub</b><b>rip</b>");
  
});

suite.test("Conditional Lists", function() {

  var template = core.template.Compiler.compile("{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  this.equal(output, "Repos<br/><b>resque</b><b>hub</b><b>rip</b>");
  
  var output = template.render({
    "repo": []
  });
  
  this.equal(output, "");
  
  
  
  var template = core.template.Compiler.compile("{{#other}}<em>{{name}}</em>{{/other}}{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");

  var output = template.render({
    "repo": [],
    "other": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });

  this.equal(output, "<em>resque</em><em>hub</em><em>rip</em>");
  
  
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

  this.equal(output, "<em>bar</em>Repos<br/><b>resque</b><b>hub</b><b>rip</b>");    
  
}); 

suite.test("Non False", function() {

  var template = core.template.Compiler.compile("{{#person?}}Hi {{name}}!{{/person?}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "person?": { "name": "Jon" }
  });
  
  this.equal(output, "Hi Jon!");
  
});

suite.test("Inverted Sections", function() {

  var template = core.template.Compiler.compile("{{#repo}}<b>{{.}}</b>{{/repo}}{{^repo}}No repos :({{/repo}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  this.equal(output, "No repos :(");
  
  var output = template.render({
    "repo": [1,2,3]
  });
  
  this.equal(output, "<b>1</b><b>2</b><b>3</b>");
  
});

suite.test("Comments", function() {

  var template = core.template.Compiler.compile("<h1>Today{{! ignore me }}.</h1>");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  this.equal(output, "<h1>Today.</h1>");
  
});


suite.test("Unescaped", function() {

  var template = core.template.Compiler.compile("{{code}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  this.equal(output, "&lt;b&gt;Foo&lt;/b&gt;");
  
  var output = template.render({
    "code": "Bert & Ernie"
  });
  
  this.equal(output, "Bert &amp; Ernie");

  var template = core.template.Compiler.compile("{{&code}}");
  this.ok(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  this.equal(output, "<b>Foo</b>");
  
}); 

suite.test("Partials", function() {

  var template = core.template.Compiler.compile("{{#tweets}}{{> tweet}}{{/tweets}}");
  this.ok(template instanceof core.template.Template);

  var tweetTemplate = core.template.Compiler.compile('<p data-id="{{id}}">{{text}}</p>');
  this.ok(tweetTemplate instanceof core.template.Template);
  
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
  
  this.equal(output, "<p data-id=\"1\">hello world</p><p data-id=\"2\">this is a test tweet</p><p data-id=\"3\">to impress you</p>");
  
});

suite.test("Parser", function() {
  
  var text = "{{^check}}No{{/check}}{{#check}}Yes{{/check}}";
  var tree = core.template.Parser.parse(text);

  this.equal(tree[0].tag, "^");
  this.equal(tree[0].name, "check");
  this.equal(tree[1].tag, "#");
  this.equal(tree[1].name, "check");
  
});


suite.test("Dots", function() {
  
  var template = core.template.Compiler.compile("{{#tweets}}{{author.name}}[{{author.id}}]{{/tweets}}");
  var output = template.render({
    "tweets": [{
      author: {
        name : "Sascha",
        id : 0
      }
    }, {
      author: {
        name : "Christoph",
        id : 1
      }
    }, {
      author: {
        name : "Ivo",
        id : 2
      }
    }]
  });
  
  this.equal(output, "Sascha[0]Christoph[1]Ivo[2]");
  
}); 

