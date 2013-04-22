/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Reporter which produces visual HTML output into the document.
 */
core.Class("core.testrunner.reporter.Html", 
{
  implement: [core.testrunner.reporter.IReporter],

  /**
   * @suites {core.testrunner.Suite[]} Array of suites to report for
   */
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
              '<span class="passed">0</span>+' +
              '<span class="failed">0</span>→' +
              '<span class="total">{{total}}</span>' +
            '</span>' +
          '</h3>' + 
          '<ul class="tests">{{#tests}}' +
            '<li class="test" id="test-{{id}}">' +
              '<h4>{{title}}' +
                '<span class="running">running</span>' +
                '<span class="result">' +
                  '<span class="passed">0</span>+' +
                  '<span class="failed">0</span>→' +
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

    if (typeof console == "object") {
      this.__consoleReporter = new core.testrunner.reporter.Console(suites);  
    }
  },

  members : 
  {
    // interface implementation
    start : function() {

    },


    // interface implementation
    finished : function(successfully) {

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

      if (suite.wasSuccessful()) {
        core.bom.ClassName.add(li, "successful");
      } else {
        core.bom.ClassName.add(li, "failed");
      }

      var tests = suite.getTests();
      var failed = 0;
      var passed = 0;

      for (var i=0, l=tests.length; i<l; i++) {
        tests[i].wasSuccessful() ? passed++ : failed++;
      }

      li.querySelector(".result .passed").innerHTML = passed;
      li.querySelector(".result .failed").innerHTML = failed;
    },

    // interface implementation
    testStarted : function(test) 
    {
      var li = document.getElementById("test-" + test.getId());
      core.bom.ClassName.add(li, "running");
    },

    // interface implementation
    testFinished : function(test) 
    {
      var li = document.getElementById("test-" + test.getId());      
      core.bom.ClassName.remove(li, "running");

      if (test.wasSuccessful()) {
        core.bom.ClassName.add(li, "successful");
      } else {
        core.bom.ClassName.add(li, "failed");
      }

      var assertions = test.getAssertions();
      var failed = 0;
      var passed = 0;

      for (var i=0, l=assertions.length; i<l; i++) {
        assertions[i].passed ? passed++ : failed++;
      }

      li.querySelector(".result .passed").innerHTML = passed;
      li.querySelector(".result .failed").innerHTML = failed;

      // Be sure that total number is correct
      li.querySelector(".result .total").innerHTML = test.getTotalCount();

      // Forward to console reporter for details
      if (!test.wasSuccessful() && this.__consoleReporter) {
        this.__consoleReporter.testFinished(test);
      }
    }
  }
});

/** #asset(core/testrunner/index.css) */
core.io.StyleSheet.load(jasy.Asset.toUri("core/testrunner/index.css"));
