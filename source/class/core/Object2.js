(function(global, undef)
{
  // Shorthand
  var hasOwnProperty = Object.hasOwnProperty;

  // Fix for IE bug with enumerables
  var hasDontEnumBug = true;
  for (var key in {"toString": null}) {
    hasDontEnumBug = false;  
  }

  if (hasDontEnumBug)
  {
    // Used to fix the JScript [[DontEnum]] bug 
    var shadowed = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
    var shadowedLength = shadowed.length;    
  }

  var nativeKeys = Object.keys;
  if (!core.Main.isNative(nativeKeys)) {
    nativeKeys = null;
  }


  var createIterator = function(config)
  {
    var code = '';

    code += config.init || '';

    if (config.has && nativeKeys)
    {
      code += 'for(var i=0,keys=Object.keys(object),l=keys.length,key;i<l;i++)'
      code += '{';
      code +=   'key=keys[i];';
      code +=    config.iter || '';
      code += '}';
    }
    else
    {
      
      code += 'for(var key in object) ';
      code += '{';

      if (config.has) {
        code += 'if(hasOwnProperty.call(object,key)){'
      }

      code += config.iter || '';
      
      if (config.has) {
        code += '}';
      }

      if (hasDontEnumBug)
      {
        code += 'var undef;';
        code += 'for (var i=0;i<shadowedLength;i++) ';
        code += '{';
        code += 'var key=shadowed[key];';

        if (config.has) {
          code += 'if(hasOwnProperty.call(object,key)){';
        } else {
          code += 'if(object[key]!==undef){';
        }

        code += config.iter || '';
        code += '}}';
      }

      code += '}';
    }

    code += config.exit || "";



console.log("Code: " + code);

    var wrapperCode = '';

    wrapperCode += 'return function(object' + (config.args ? "," + config.args : "") + '){' + code + '};'

    compiledWrapper = Function("hasOwnProperty", "shadowed", "shadowedLength", wrapperCode);
    var compiled = compiledWrapper(hasOwnProperty, shadowed, shadowedLength);


    console.log("Compiled: " + compiled);

    return compiled;
  };



  core.Module("core.Object2",
  {
    isEmpty : createIterator(
    {
      has : true,
      iter : "return false;",
      exit : "return true;"
    }),

    getLength : createIterator(
    {
      has : true, 
      init : "var length=0;", 
      iter : "length++;", 
      exit : "return length;"
    }),

    forEach : createIterator(
    {
      has : true,
      args : "callback,context",
      iter : "callback.call(context,object[key],key,object);"
    }),

    forAll : createIterator(
    {
      args : "callback,context",
      iter : "callback.call(context,object[key],key,object);"
    }),


  });


})(core.Main.getGlobal());
