module("Core :: Template");

test("Basic", function() {
  
  var template = core.template.Compiler.compile("Follow @{{screenName}}.");
  ok(template instanceof core.template.Template);

  var output = template.render({
    screenName: "dhg"
  });
  
  equal(output, "Follow @dhg.");
  
  var output = template.render({
    screenName: "wpbasti"
  });
  
  equal(output, "Follow @wpbasti.");
  
});

test("Line Breaks", function() {
  
  var template = core.template.Compiler.compile("Break\nHere {{value}}.");
  ok(template instanceof core.template.Template);

  var output = template.render({
    value: "xxx"
  });
  
  equal(output, "Break\nHere xxx.");
  
});

test("Lists", function() {

  var template = core.template.Compiler.compile("{{#repo}}<b>{{name}}</b>{{/repo}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  equal(output, "<b>resque</b><b>hub</b><b>rip</b>");
  
});

test("Conditional Lists", function() {

  var template = core.template.Compiler.compile("{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });
  
  equal(output, "Repos<br/><b>resque</b><b>hub</b><b>rip</b>");
  
  var output = template.render({
    "repo": []
  });
  
  equal(output, "");
  
  
  
  var template = core.template.Compiler.compile("{{#other}}<em>{{name}}</em>{{/other}}{{?repo}}Repos<br/>{{#repo}}<b>{{name}}</b>{{/repo}}{{/repo}}");

  var output = template.render({
    "repo": [],
    "other": [
      { "name": "resque" },
      { "name": "hub" },
      { "name": "rip" }
    ]
  });

  equal(output, "<em>resque</em><em>hub</em><em>rip</em>");
  
  
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

  equal(output, "<em>bar</em>Repos<br/><b>resque</b><b>hub</b><b>rip</b>");    
  
}); 

test("Non False", function() {

  var template = core.template.Compiler.compile("{{#person?}}Hi {{name}}!{{/person?}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "person?": { "name": "Jon" }
  });
  
  equal(output, "Hi Jon!");
  
});

test("Inverted Sections", function() {

  var template = core.template.Compiler.compile("{{#repo}}<b>{{.}}</b>{{/repo}}{{^repo}}No repos :({{/repo}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  equal(output, "No repos :(");
  
  var output = template.render({
    "repo": [1,2,3]
  });
  
  equal(output, "<b>1</b><b>2</b><b>3</b>");
  
});

test("Comments", function() {

  var template = core.template.Compiler.compile("<h1>Today{{! ignore me }}.</h1>");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "repo": []
  });
  
  equal(output, "<h1>Today.</h1>");
  
});


test("Unescaped", function() {

  var template = core.template.Compiler.compile("{{code}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  equal(output, "&lt;b&gt;Foo&lt;/b&gt;");
  
  var output = template.render({
    "code": "Bert & Ernie"
  });
  
  equal(output, "Bert &amp; Ernie");

  var template = core.template.Compiler.compile("{{&code}}");
  ok(template instanceof core.template.Template);
  
  var output = template.render({
    "code": "<b>Foo</b>"
  });
  
  equal(output, "<b>Foo</b>");
  
}); 

test("Partials", function() {

  var template = core.template.Compiler.compile("{{#tweets}}{{> tweet}}{{/tweets}}");
  ok(template instanceof core.template.Template);

  var tweetTemplate = core.template.Compiler.compile('<p data-id="{{id}}">{{text}}</p>');
  ok(tweetTemplate instanceof core.template.Template);
  
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
  
  equal(output, "<p data-id=\"1\">hello world</p><p data-id=\"2\">this is a test tweet</p><p data-id=\"3\">to impress you</p>");
  
});

test("Parser", function() {
  
  var text = "{{^check}}No{{/check}}{{#check}}Yes{{/check}}";
  var tree = core.template.Parser.parse(text);

  equal(tree[0].tag, "^");
  equal(tree[0].name, "check");
  equal(tree[1].tag, "#");
  equal(tree[1].name, "check");
  
});


test("Dots", function() {
  
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
  
  equal(output, "Sascha[0]Christoph[1]Ivo[2]");
  
}); 

