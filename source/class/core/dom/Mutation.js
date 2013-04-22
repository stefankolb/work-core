if (jasy.Env.isSet("runtime", "browser"))
{
  (function(document, undef)
  {
    var testnode = document.createElement("b");

    if (testnode.prepend)
    {
      var args = function(list) {
        return Array.prototype.slice.call(list, 1);
      };

      var prepend = function(parent, child) {
        return parent.prepend.apply(parent, args(arguments));
      };

      var append = function(parent, child) {
        return parent.append.apply(parent, args(arguments));
      };

      var before = function(rel, child) {
        return rel.before.apply(rel, args(arguments));
      };

      var after = function(rel, child) {
        return rel.after.apply(rel, args(arguments));
      };

      var replace = function(rel, child) {
        return rel.replace.apply(rel, args(arguments));
      };
    }
    else if (testnode.insertAdjacentElement)
    {
      // TODO

      
    }
    else
    {
      var mutate = function(args) 
      {
        if (args.nodeType == 1) {
          return args;
        } 

        var fragment = document.createDocumentFragment();
        for (var i=0, l=args.length; i<l; i++)
        {
          var node = args[i];

          if (typeof node == "string") {
            node = document.createTextNode(node);
          }

          fragment.appendChild(node);
        }

        return fragment;
      };

      var prepend = function(parent, child) 
      {
        child = mutate(child);
        var first = parent.firstChild;
        if (first) {
          parent.insertBefore(child, first);
        } else {
          parent.appendChild(child);
        }
      };

      var append = function(parent, child) {
        parent.appendChild(mutate(child));
      };

      var before = function(rel, child) 
      {
        var parent = rel.parentNode;
        if (parent) {
          parent.insertBefore(mutate(child), rel);
        }
      };

      var after = function(rel, child) 
      {
        var parent = rel.parentNode;
        var next = rel.nextSibling;

        if (parent) 
        {
          child = mutate(child);  
          if (next) {
            parent.insertBefore(child, next);
          } else {
            parent.appendChild(child);
          }
        }
      };

      var replace = function(rel, child) 
      {
        var parent = rel.parentNode;
        if (parent) {
          parent.replaceChild(mutate(child), rel);
        }
      };
    }

    if (testnode.remove) 
    {
      var remove = function(rel) {
        rel.remove();
      };
    }
    else
    {
      var remove = function(rel) 
      {
        var parent = rel.parentNode;
        if (parent) {
          parent.removeChild(this);
        }
      };
    }

    core.Module("core.dom.Mutation",
    {
      prepend : prepend,
      append : append,
      before : before,
      after : after,
      replace : replace,
      remove : remove
    });
  })(document);
}
