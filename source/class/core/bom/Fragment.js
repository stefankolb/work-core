/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of the jQuery project
  Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
==================================================================================================
*/

"use strict";

(function() 
{
  var rscriptType = /^$|\/(?:java|ecma)script/i;
  var rhtml = /<|&#?\w+;/;
  var rtagName = /<([\w:]+)/;
  var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;

  // We have to close these tags to support XHTML (#13200)
  var wrapMap = 
  {
    // Support: IE 9
    option: [1, "<select multiple='multiple'>", "</select>"],

    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

    _default: [0, "", ""]
  };

  // Support: IE 9
  wrapMap.optgroup = wrapMap.option;

  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;


  core.Module("core.bom.Fragment",
  {
    build : function(elems, context, scripts) 
    {
      var elem, tmp, tag, wrap, contains, j,
        i = 0,
        l = elems.length,
        fragment = context.createDocumentFragment(),
        nodes = [];

      for (; i < l; i++) {
        elem = elems[i];

        if (elem || elem === 0) {

          // Add nodes directly
          if (typeof elem === "object") 
          {
            if (elem.nodeType) {
              nodes.push(elem);
            } else {
              nodes.push.apply(nodes, elem);
            }
          }

          // Convert non-html into a text node
          else if (!rhtml.test(elem))
          {
            nodes.push(context.createTextNode(elem));
          }
          
          // Convert html into DOM nodes
          else 
          {
            tmp = tmp || fragment.appendChild(context.createElement("div"));

            // Deserialize a standard representation
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

            // Descend through wrappers to the right content
            j = wrap[0];
            while (j--) {
              tmp = tmp.lastChild;
            }

            nodes.push.apply(nodes, tmp.childNodes);

            // Remember the top-level container
            tmp = fragment.firstChild;

            // Fixes #12346
            // Support: Webkit, IE
            tmp.textContent = "";
          }
        }
      }

      // Remove wrapper from fragment
      fragment.textContent = "";

      i = 0;
      while ((elem = nodes[i++])) 
      {
        // Append to fragment
        fragment.appendChild(elem)

        // Find script elements
        var tmp = elem.tagName == "SCRIPT" ? [elem] : elem.getElementsByTagName("script")

        // Capture executables
        if (scripts) 
        {
          j = 0;
          while ((elem = tmp[j++])) 
          {
            if (rscriptType.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }

      return fragment;
    }
  })

})();



  