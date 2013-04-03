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

  // Method to create iterators through objects
  var createIterator = function(config)
  {
    var code = '';

    code += config.init || '';

    if (config.has && nativeKeys && !config.nokeys)
    {
      if (config.iter)
      {
        code += 'for(var i=0,keys=Object.keys(object),l=keys.length,key;i<l;i++)'
        code += '{';
        code +=   'key=keys[i];';
        code +=    config.iter;
        code += '}';
      }
      else
      {
        code += 'var keys=Object.keys(object);';
      }
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
        code += "key=keys[i];";
        code += config.iter || "";
        code += "}";
      }
    }

    code += config.exit || "";

    // Wrap code to allow injection of scope variables and
    // for being able to support given arguments list.
    var wrapperCode = 'return function(object' + (config.args ? "," + config.args : "") + '){' + code + '};'

    if (jasy.Env.isSet("engine", "trident"))
    {
      var compiledWrapper = Function("global", "hasOwnProperty", "shadowed", "shadowedLength", wrapperCode);
      return compiledWrapper(global, hasOwnProperty, shadowed, shadowedLength);
    }
    else
    {
      var compiledWrapper = Function("global", "hasOwnProperty", wrapperCode);
      return compiledWrapper(global, hasOwnProperty);
    }
  };

  var callbackArgs = "callback,context";
  var contextFix = "if(!context)context=global;";
  var executeCallback = "callback.call(context,object[key],key,object);";

  /**
   * A collection of utility methods for native JavaScript objects.
   */
  core.Module("core.Object",
  {
    /**
     * {Map} Create a shallow-copied clone of the @object {Map}. Any nested 
     * objects or arrays will be copied by reference, not duplicated.
     */
    clone : createIterator(
    {
      has : true, 
      stable : false,
      init : "var clone={};", 
      iter : "clone[key]=object[key];", 
      exit : "return clone;"
    }),


    /**
     * Loops trough all entries - including inherited ones - of the given @object {Object} and executes the
     * given @callback {Function} in the given @context {Object} on each entry.
     * The @callback is called with these arguments: `value`, `key`, `object`.
     */
    forAll : createIterator(
    {
      stable : true,
      args : callbackArgs,
      init : contextFix,
      iter : executeCallback
    }),

    
    /**
     * Loops trough the entries of the given @object {Object} and executes the
     * given @callback {Function} in the given @context {Object} on each entry.
     * The @callback is called with these arguments: `value`, `key`, `object`.
     */
    forEach : createIterator(
    {
      has : true,
      stable : true,
      args : callbackArgs,
      init : contextFix,
      iter : executeCallback
    }),


    /**
     * {Array} Returns all the keys of the given @object {Object}.
     */
    getKeys : createIterator(
    {
      has : true, 
      stable : true, // otherwise we might not have "keys"
      exit : "return keys;"
    }),


    /**
     * {Integer} Returns the length of the given @object {Object}.
     */
    getLength : createIterator(
    {
      has : true, 
      stable : false,
      init : "var length=0;", 
      iter : "length++;", 
      exit : "return length;",
      nokeys : true
    }),


    /**
     * {Array} Returns all the values of the given @object {Object}.
     */
    getValues : createIterator(
    {
      has : true, 
      stable : false,
      init : "var values=[];",
      iter : "values.push(object[key]);",
      exit : "return values;"
    }),


    /**
     * {Boolean} Returns whether the given @object {Object} is empty.
     */
    isEmpty : createIterator(
    {
      has : true,
      stable : false,
      iter : "return false;",
      exit : "return true;",
      nokeys : true
    }),


    /**
     * {Map} Returns a copy of the @object {Object}, 
     * filtered to only have values for the whitelisted @keys {String...}.
     */
    pick : function(object, keys) 
    {
      var result = {};
      var args = arguments;

      for (var i=1, l=args.length; i<l; i++) 
      {
        var key = args[i];
        result[key] = object[key];
      }

      return result;
    },


    /**
     * {Map} Create a shallow-copied clone of the @object {Object} where all the
     * keys of @table {Map} will be translated to the value of that mapping.
     * It uses the original key when no translation is available.
     * Any nested objects or arrays will be copied by reference, not duplicated.
     */
    translate : createIterator(
    {
      has : true, 
      stable : false,
      args : "table",
      init : "var result={};", 
      iter : "result[table[key]||key]=object[key];", 
      exit : "return result;"
    })
  });

})(core.Main.getGlobal());
