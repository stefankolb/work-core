/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on Unify <unify-project.org>
  Copyright: 2009-2010 Deutsche Telekom AG
==================================================================================================
*/

(function()
{
  /** {=RegExp} Matches location fragments (presenter.section:param) */
  var fragmentMatcher = /^([a-z0-9-]+)?(\.([a-z-]+))?(\:([a-zA-Z0-9_%=-]+))?$/;

  /**
   * {Map} Parses a location fragment @fragment {String} into a object with the keys "presenter", "section" and "param".
   */
  var parseFragment = function(fragment)
  {
    var match = fragmentMatcher.exec(fragment);

    if (jasy.Env.isSet("debug"))
    {
      if (!match) {
        throw new Error("Invalid fragment: " + fragment);
      }
    }

    return {
      presenter : RegExp.$1 || null,
      section : RegExp.$3 || null,
      param : RegExp.$5 || null
    };
  };


  /**
   * A path handler ideally suited for managing the path inside the URI hash part.
   *
   * Supports a structure of presenters, sections and parameters.
   */
  core.Class("core.util.HashPath", 
  {
    pooling : true,

    construct : function(path)
    {
      var data = this.__data;

      // Support reusing existing array for pooling
      if (!data) {
        data = this.__data = [];  
      } else {
        data.length = 0;
      }
      
      if (path && path.length > 0)
      {
        var fragments = path.split("/");
        for (var i=0, l=fragments.length; i<l; i++) {
          data.push(parseFragment(fragments[i]));
        }
      }    
    },

    members :
    {
      /**
       * Returns the current fragment - the last one - of the path.
       */
      getCurrent : function()
      {
        var data = this.__data;
        return data[data.length-1];
      },


      /**
       * Compares this path to the given @other {core.util.HashPath}. Returns either:
       *
       * - jump: presenter change without detectable direction
       * - out: movement one hierarchy up
       * - in: movement one hierarchy down
       * - param: parameter changed
       * - section: section changed
       * - equal: both paths are equal
       *
       * Please note: Only the first detected change is returned e.g. a path might have more differences
       * than just the first different part.
       */
      compareTo : function(other)
      {
        if (this === other) {
          return "equal";
        }

        var myData = this.__data;
        var otherData = other.__data;

        var maxLength = Math.max(myData.length, otherData.length);
        for (var i=0; i<maxLength; i++)
        {
          var myFragment = myData[i];
          var otherFragment = otherData[i];

          // Length differences
          if (!myFragment || !otherFragment)
          {
            if (i == 0) {
              return "jump";
            } else if (!myFragment) {
              return "in";
            } else if (!otherFragment) {
              return "out";
            }
          }

          // Fragment detail comparisions
          if (myFragment.presenter != otherFragment.presenter) {
            return "jump";
          } else if (myFragment.param != otherFragment.param) {
            return "param";
          } else if (myFragment.section != otherFragment.section) {
            return "section";
          }
        }

        return "equal";
      },


      /**
       * {core.util.HashPath} Returns a new path based on this path with the given @fragment {String} and an
       * optional @relation {String?}.
       */
      navigate : function(fragment, relation)
      {
        if (relation == "parent")
        {
          var destination = this.clone();
          var data = destination.__data;
          if (!data.pop()) 
          {
            destination.release();
            throw new Error("Already on top!");
          }

          return destination;
        }
        else if (fragment == "" && jasy.Env.isSet("debug"))
        {
          throw new Error("Invalid link!");
        }
        else if (relation == "top") 
        {
          // Replace current structure path with top level page
          var destination = core.util.HashPath.obtain(fragment);
        }
        else if (relation == "same") 
        {
          // New page replaces current page
          var destination = this.clone();
          var data = destination.__data;
          data[data.length-1] = parseFragment(fragment);
        }
        else
        {
          // New page is child of current page
          var destination = this.clone();
          destination.__data.push(parseFragment(fragment));
        }  
        
        return destination; 
      },


      /**
       * {core.util.HashPath} Returns the deeply cloned Path instance.
       */
      clone : function()
      {
        var clone = core.util.HashPath.obtain();

        var thisData = this.__data;
        var cloneData = clone.__data;

        // Sync length
        var length = cloneData.length = thisData.length;

        // Copy over fragments
        for (var i=0; i<length; i++)
        {
          var thisFragment = thisData[i];
          cloneData[i] = 
          {
            presenter : thisFragment.presenter,
            section : thisFragment.section,
            param : thisFragment.param
          };
        }

        return clone;
      },


      /**
       * {String} Serializes a Path object into a location string.
       */
      serialize : function()
      {
        var data = this.__data;
        var result = [];

        for (var i=0, l=data.length; i<l; i++)
        {
          var entry = data[i];
          var temp = entry.presenter;

          if (entry.section) {
            temp += "." + entry.section;
          }

          if (entry.param) {
            temp += ":" + entry.param;
          }

          result.push(temp);
        }

        return result.join("/");
      }    
    }
  });  

})();
