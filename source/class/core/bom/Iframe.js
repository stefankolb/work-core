/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

/**
 * Utilities for working with iframes.
 *
 * #asset(core/empty.html)
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

    if (secure)
    {
      var encoded = core.util.Base64.encode(html);
      frame.src = "data:text/html;base64," + encoded;
    }
    else
    {
      frame.src = jasy.Asset.toUri("core/empty.html");  
    }
    
    frame.style.display = "none";

    if (secure) {
      frame.setAttribute("sandbox", "allow-scripts");  
    }

    parent.appendChild(frame);

    if (!secure)
    {
      var doc = this.getDocument(frame);
      doc.open('text/html', 'replace');
      doc.write(html);

      // Don't close document for allowing document.write()
    }

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
