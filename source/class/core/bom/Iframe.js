/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013-2014 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Utilities for working with iframes.
 */
core.Module("core.bom.Iframe",
{
  /**
   * {Element} Loads the given @html {String} inside a newly created iFrame. This is
   * ideal for injecting advertising/tracking HTML into RIA apps.
   * Define the @parent {Element} to where the element should be injected.
   * Set @secure {Boolean?false} to true to prevent access when running on the same domain.
   * This adds a sandbox attribute and uses data URLs to prevent running on the same domain.
   * Secure still allows scripting but prevents access to the parent frame.
   */
  loadHtml : function(html, parent, secure)
  {
    if (!parent) {
      parent = document.body;
    }

    var doc = parent.ownerDocument;

    var frame = doc.createElement("iframe");
    var style = frame.style;

    style.width = "0px";
    style.height = "0px";
    style.position = "absolute";
    style.left = "-1000px";
    style.top = "-1000px";

    if (secure)
    {
      frame.setAttribute("sandbox", "allow-scripts");

      var encoded = core.util.Base64.encode(html);
      frame.src = "data:text/html;base64," + encoded;
    }
    else
    {
      var self = this;

      frame.onload = core.Function.debounce(function()
      {
        frame.onload = null;

        var doc = self.getDocument(frame);
        doc.open('text/html', 'replace');
        doc.write(html);
        // Don't close document for allowing document.write()
      });

      /**
       * #asset(core/empty.html)
       */
      frame.src = jasy.Asset.toUri("core/empty.html");
    };

    parent.appendChild(frame);

    return frame;
  },


  /**
   * {Window} Returns the DOM window object of an @iframe {Element}.
   */
  getWindow : function(iframe)
  {
    try {
      return iframe.contentWindow;
    } catch(ex) {
      return null;
    }
  },


  /**
   * {Document} Returns the DOM document object of an @iframe {Element}.
   */
  getDocument : function(iframe)
  {
    try {
      return iframe.contentDocument || this.getWindow(iframe).document;
    } catch(ex) {
      return null;
    }
  }
});
