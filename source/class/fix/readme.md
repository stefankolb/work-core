Essential fixes applied to the runtime environment.

Included ES5 Compatibility:

- Defines/Fixes for `Date.toISOString` (ES5)
- Defines `Date.now()` (ES5)
- Defines `Function.prototype.bind()` (ES5)
- Defines `Array.isArray()` (ES5)
- Defines `Array.prototype.indexOf()` and `Array.prototype.lastIndexOf()` (ES5)
- Defines `String.trim()`, `String.trimLeft()` and `String.trimRight()` (ES5)

Other Fixes/Extensions:

- Adds HTML5 Markup Support for older IEs (HTML5)
- Defines `console.log()`, `console.debug()`, `console.error()`, `console.warn()`, `console.info()` and `console.timeStamp()` (Firebug)
- Fixes `undefined` support for `JSON.stringify()` (Fix)
- Adds `document.head` (HTML5)
- Defines `global.execScript()` (IE)

Not included:

- JSON (full implementation): Alternative {core.JSON}

- `Array.prototype.every`: Alternative {core.Array#every}
- `Array.prototype.some`: Alternative {core.Array#some}
- `Array.prototype.forEach`: Alternative {core.Array#forEach}
- `Array.prototype.map`: Alternative {core.Array#map}
- `Array.prototype.filter`: Alternative {core.Array#filter}
- `Array.prototype.reduce`
- `Array.prototype.reduceRight`

- `Object.create`
- `Object.defineProperty`
- `Object.defineProperties`
- `Object.getPrototypeOf`
- `Object.keys`: Alternative {core.Object#keys}
- `Object.seal`
- `Object.freeze`
- `Object.preventExtensions`
- `Object.isSealed`
- `Object.isFrozen`
- `Object.isExtensible`
- `Object.getOwnPropertyDescriptor`
- `Object.getOwnPropertyNames`

See also:

- [ES5 Compat Table](http://kangax.github.io/es5-compat-table/)
- [Non Standard Extensions](http://kangax.github.io/es5-compat-table/non-standard)
