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
  var rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

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
    /**
     * Executes the given set of script @nodes {Element[]}. Checks whether the script node
     * is injected into the same document @context {Document?document} first. Supports 
     * both, script nodes with inline code and script nodes with `src` attribute to load 
     * and execute remote scripts.
     */
    execute : function(nodes, context)
    {
      if (context == null) {
        context = document;
      }

      var queue = [];

      // Evaluate executable scripts on first document insertion
      for (var i=0, l=nodes.length; i<l; i++) 
      {
        var node = nodes[i];
        
        if (rscriptType.test(node.type || "") && core.dom.Node.contains(context, node)) 
        {
          if (node.src) 
          {
            // Do basic synchronous XHR
            var xhr = new XMLHttpRequest;
            xhr.open("GET", node.src, false);
            xhr.send(null);

            if (xhr.readyState == 4 && core.io.Util.isStatusOkay(xhr.status))
            {
              execScript(xhr.responseText);
            }
            else
            {
              throw new Error("Unable to load script: " + node.src);
            }              
          }
          else
          { 
            var code = node.textContent.replace(rcleanScript, "");

            // Use global eval like feature from fix.ExecScript
            execScript(code);
          }
        }
      }

      core.io.Queue.load(queue);
    },


    /**
     * Positioned insert for document fragments. Inserts @fragment {DocumentFragment}
     * relative to the given @parent {Element} at the given @relation {String}.
     *
     * Supported relations are:
     *
     * - `beforebegin`
     * - `afterbegin`
     * - `beforeend`
     * - `afterend`
     */
    insert : function(fragment, parent, relation)
    {
      var parentParent = parent.parentNode;
      if (relation == "beforeend") 
      {
        parent.appendChild(fragment);
      } 
      else if (relation == "afterend") 
      {
        if (parent.nextSibling) {
          parentParent.insertBefore(fragment, parent.nextSibling);  
        } else {
          parentParent.appendChild(fragment);
        }
      }
      else if (relation == "beforebegin")
      {
        parentParent.insertBefore(fragment, parent);  
      }
      else if (relation == "afterbegin")
      {
        parent.insertBefore(fragment, parent.firstChild);
      }
      else if (jasy.Env.isSet("debug")) 
      {
        throw new Error("Invalid relation parameter: " + relation);
      }
    },


    /**
     * Processes the given @elems {Element[]|String[]} (mixed string and/or elements)
     * and inserts them in @relation {String} to the given @parent {Element}. The
     * parameter @context {Document?document} is used to correctly parse HTML
     * fragments to make them as children of that document (execution/DOM context).
     */
    inject : function(elems, context, parent, relation)
    {
      var scripts = [];
      var fragment = this.build(elems, context, scripts);

      this.insert(fragment, parent, relation);
      this.execute(scripts, context);
    },


    /**
     * {DocumentFragment} Converts the given @elems {Element[]|String[]} (mixed string and/or elements)
     * into a new document fragment. The @context {Document?document} defaults to the document in the execution
     * environment and might be changed to another document e.g. inside an iframe. During the build process 
     * scripts can optionally being extracted. To enable this feature pass @scripts {Array?} to the function.
     */
    build : function(elems, context, scripts) 
    {
      if (context == null) {
        context = document;
      }

      var fragment = context.createDocumentFragment();
      var nodes = [];

      for (var i=0, l=elems.length; i < l; i++) 
      {
        var elem = elems[i];

        if (elem || elem === 0) 
        {
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
            var wrapper = wrapper || fragment.appendChild(context.createElement("div"));

            // Deserialize a standard representation
            var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            var wrap = wrapMap[tag] || wrapMap._default;
            wrapper.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

            // Descend through wrappers to the right content
            var j = wrap[0];
            while (j--) {
              wrapper = wrapper.lastChild;
            }

            nodes.push.apply(nodes, wrapper.childNodes);

            // Remember the top-level container
            wrapper = fragment.firstChild;

            // Fixes #12346
            // Support: Webkit, IE
            wrapper.textContent = "";
          }
        }
      }

      // Remove wrapper from fragment
      fragment.textContent = "";

      // No append the real nodes
      var i = 0;
      while ((elem = nodes[i++])) 
      {
        // Append to fragment
        fragment.appendChild(elem)

        if (scripts) 
        {
          // Find script elements
          var scriptElems = elem.tagName == "SCRIPT" ? [elem] : elem.nodeType == 1 ? elem.getElementsByTagName("script") : [];

          // Capture executables
          var j = 0;
          while ((elem = scriptElems[j++])) 
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

  