(function(global, undef)
{
  // Shorthand
  var hasOwnProperty = Object.hasOwnProperty;

  // Fix for IE bug with enumerables
  if (jasy.Env.isSet("engine", "trident"))
  {
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
  }

  var nativeKeys = Object.keys;
  if (!core.Main.isNative(nativeKeys)) {
    nativeKeys = null;
  }

  // keys() is slow in Safari
  var hasKeysIsFast = !/\n{2,}/.test(Function());

  // bind() is slow in Chrome/Node/V8
  var bindIsFast = false;


  var createIterator = function(config)
  {
    var code = '';

    code += config.init || '';

    if (config.has && nativeKeys && !config.nokeys)
    {
      code += 'for(var i=0,keys=Object.keys(object),l=keys.length,key;i<l;i++)'
      code += '{';
      code +=   'key=keys[i];';
      code +=    config.iter || '';
      code += '}';
    }
    else
    {
      if (config.stable) { 
        code += 'var keys=[];';
      }

      code += 'for(var key in object){';

      if (config.has) {
        code += 'if(hasOwnProperty.call(object,key)){';
      }

      if (config.stable) {
        code += "keys.push(key);";
      } else if (config.iter) {
        code += config.iter;
      }

      if (config.has) {
        code += '}';
      }

      if (jasy.Env.isSet("engine", "trident") && hasDontEnumBug)
      {
        code += 'for(var i=0;i<shadowedLength;i++) ';
        code += '{';
        code += 'var key=shadowed[key];';

        if (config.has) {
          code += 'if(hasOwnProperty.call(object,key)){';
        } else {
          code += 'if(key in object){';
        }

        if (config.stable) {
          code += "keys.push(key);";
        } else if (config.iter) {
          code += config.iter;
        }

        code += '}}';
      }

      code += '}';

      if (config.stable)
      {
        code += "for(var i=0,l=keys.length;i<l;i++){";
        code += config.iter || "";
        code += "}";
      }
    }

    code += config.exit || "";

    console.log("Code: " + code);

    // Wrap code to allow injection of scope variables and
    // for being able to support given arguments list.
    var wrapperCode = 'return function(object' + (config.args ? "," + config.args : "") + '){' + code + '};'
    compiledWrapper = Function("global", "hasOwnProperty", "shadowed", "shadowedLength", wrapperCode);
    
    // Execute compiled wrapper to return generated method
    return compiledWrapper(global, hasOwnProperty, shadowed, shadowedLength);
  };



  core.Module("core.Object2",
  {
    isEmpty : createIterator(
    {
      has : true,
      stable : false,
      iter : "return false;",
      exit : "return true;",
      nokeys : true
    }),

    getLength : createIterator(
    {
      has : true, 
      stable : false,
      init : "var length=0;", 
      iter : "length++;", 
      exit : "return length;",
      nokeys : true
    }),

    forEach : createIterator(
    {
      has : true,
      stable : true,
      args : "callback,context",
      init : "if(!context)context=global;",
      iter : "callback.call(context,object[key],key,object);"
    }),

    forAll : createIterator(
    {
      stable : true,
      args : "callback,context",
      init : "if(!context)context=global;",
      iter : "callback.call(context,object[key],key,object);"
    })

  });

})(core.Main.getGlobal());
