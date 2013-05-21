/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

// TODO: For more compat support we might have a look at qooxdoo's XML classes:
// https://github.com/qooxdoo/qooxdoo/blob/master/framework/source/class/qx/xml/Document.js

/**
 * Utilities and wrappers for parsing typical web related documents.
 */
core.Module("core.dom.Parser",
{
  /**
   * {Document} Parses the given @content {String} as HTML and returns the generated document object.
   */
  parseHtml : function(content)
  {
    var doc = document.implementation.createHTMLDocument("");
    if (content.toLowerCase().indexOf('<!doctype') > -1) {
      doc.documentElement.innerHTML = content;
    } else {
      doc.body.innerHTML = content;
    }

    return doc;
  },


  /**
   * {Document} Parses the given @content {String} as XML and returns the generated document object.
   */
  parseXml : function(content)
  {
    var parser = new DOMParser();
    return parser.parseFromString(content, "application/xml");    
  }
});
