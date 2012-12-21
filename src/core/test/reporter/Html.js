/**
 * Reporter which produces visual HTML output into the document.
 */
core.Class("core.test.reporter.Html", 
{
  implement: [core.test.reporter.IReporter],

  construct : function(suites) 
  {
    var root = document.getElementById("reporter");
    if (!root) 
    {
      root = document.createElement("div");
      root.id = "reporter";
      document.body.appendChild(root);
    }
    
    var suitesTemplate = 
      core.template.Compiler.compile(
      '<ul class="suites">' +
        '{{#suites}}<li class="suite running" id="suite-{{id}}">' +
          '<h3>{{caption}}' +
            '<span class="running">running</span>' +
            '<span class="result">' +
              '<span class="passed">0</span>/' +
              '<span class="failed">0</span>/' +
              '<span class="total">{{total}}</span>' +
            '</span>' +
          '</h3>' + 
          '<ul class="tests">{{#tests}}' +
            '<li class="test" id="test-{{id}}">' +
              '<h4>{{title}}' +
                '<span class="running">running</span>' +
                '<span class="result">' +
                  '<span class="passed">0</span>/' +
                  '<span class="failed">0</span>/' +
                  '<span class="total">{{total}}</span>' +
                '</span>' +
              '</h4>' +
            '</li>' +
          '{{/tests}}</ul>' +
        '</li>{{/suites}}' +
      '</ul>');

    var suitesData = 
    { 
      suites : suites.map(function(suite)
      {
        return {
          id : suite.getId(),
          caption : suite.getCaption(),
          total : suite.getTests().length,
          tests : suite.getTests().map(function(test) 
          {
            return {
              id : test.getId(),
              total : test.getTotalCount(),
              title : test.getTitle()
            };
          })       
        };
      }) 
    };

    root.innerHTML = suitesTemplate.render(suitesData);
  },

  members : 
  {
    // interface implementation
    start : function() {

    },


    // interface implementation
    finished : function() {

    },


    // interface implementation
    suiteStarted : function(suite) 
    {
      var li = document.getElementById("suite-" + suite.getId());      
      core.bom.ClassName.add(li, "running");
      li.scrollIntoView();
    },

    // interface implementation
    suiteFinished : function(suite) 
    {
      var li = document.getElementById("suite-" + suite.getId());      
      core.bom.ClassName.remove(li, "running");
    },

    // interface implementation
    testStarted : function(test) 
    {
      console.info("- Start: " + test.getTitle());

      var li = document.getElementById("test-" + test.getId());
      core.bom.ClassName.add(li, "running");
    },

    // interface implementation
    testFinished : function(test) 
    {
      console.info("- " + test.getSummary());

      var li = document.getElementById("test-" + test.getId());      
      core.bom.ClassName.remove(li, "running");
    }
  }
});
