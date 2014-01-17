# 1.5-alpha1

After a while here some changes which were developed over the last few month...

## Major changes

- Ready for Jasy-1.5-beta:
  - jasylibrary.py update
  - API browser fixed
  - Testrunner fixed
  - Adopted asset system to new data format
- Reimplemented Storage API `core.store.Abstract` for being usable in more scenarios. Unfortunately the new version is not API compatible with the old one.
- Added JSHint configuration
- Code Climate integration + added a ton of fixes to increase ranking :)
- Added `Normalize.style` for basic HTML formatting/reset using Jasy's new StyleSheet processor.

## Additions

- Added `core.Function.infiniteApply()`.
- Added `Buffer` based implementation to Base64 wrapper (core.util.Base64) for NodeJS.
- Added `jasy.Env.getPartUrl()` for resolving part script/stylesheets/templates from Jasy data.

## Minor changes

- Fixed missing `toInteger` function in polyfill for `Array.prototype.indexOf`
- Fixed implementation of `core.util.TextCompressor` for omitting encoding/decoding issues on some systems/configurations.
- Improved and fixed integration with Testem testrunner
- Using "Avenir Next" instead of Helvetica in API Browser
- Removed pretty rarely useful `core.Array.randomize()`
- Fixed undefined variable in `core.Array.toKeys()`
- Fixed `core.Model.Array` to correctly use ES5 emulated methods instead of expecting native methods being available.


# 0.9-beta4

## Hightlights

- Adopted to Jasy-1.1.1 (changes in permutation/build ID handling and updated skeleton to use new APIs and infrastructure)
- Moved all MVC classes (which never were actual MVC but more MVP-like) one level up so that `core.mvc.model.Abstract` is now `core.model.Abstract` etc.
- Added module `core.bom.Dimension` to compute inner dimensions of DOM elements.
- Major rework for `core.bom.Form` and `core.bom.FormItem` to more correctly support quite a wide range of form elements correctly. Supports new `getData()` to auto serialize HTML forms into JSON or `serialize()` to a URL form encoded string.
- Added `core.bom.FormItem.getLabel()` and `core.bom.FormItem.getValue()` to figure out a label for the given input field or reading out the value.
- Added "Scroller" from seperate project as a Core class called `core.component.Scroller`. You can remove old dependencies from the Zynga Scroller now.
- Added `core.bom.Fragment` to parse mixed HTML text content and nodes into a document fragment which can be later used for insertion. Supports executing scripts inside the HTML as well.
- Added `core.bom.HasEvent` to verify whether a specific DOM elements supports the given event type.
- Added `core.bom.HashHistory` to manage document history inside the so called hash of the URL location. Supports both modern and legacy clients. Useful for single page applications.
- Added `core.bom.Iframe` to inject markup into dynamically created iframes into the document. Offers optional security method to prohibit content in the iframe from accessing the main document. This method is useful for injecting advertising/tracking markup without affecting the root application.
- Added `core.event.Flow` for dealing with chains of promises and functions.
- Added `core.bom.MediaQuery` to execute a given media query and returning whether the client is currenly matching this media query. Internally prefers modern API methods but supports a traditional variant as well (client still has to support media queries though).
- Added `core.bom.Storage` to offer a nice useful wrapper for localStorage. Supports auto JSON.stringify/parse and compression using UTF-16 re-encoding.
- Added `core.bom.Transition` for easily managing basic transitions like `fadeIn` and `fadeOut` with full callback support etc.
- Added `core.detect.Browser` for browser and browser version detection.
- Added generic `reset()` method to property system to mass reset all properties or a specified list of properties. Super useful when working with data models.
- Improved and continued work on generic `isValid` property method. The method is now able to check all properties which have a validation method and returns the combined result.
- Added `core.service.location.GeoCode` for translating geo coordinates into address data using the Google location services.
- Added `core.util.Base62` - a full blown Base62 engine for Core. Useful for encoding/decoding URL-safe compressed strings.
- Added `core.util.HashPath` which is a poolable class for storing a hash path in a structured and easily accessible format. The class is used internally by the new path handling features in e.g. `core.bom.HashHistory`.
- Added `core.util.MersenneTwister` and `core.util.Random` for safer random numbers than `Math.random`.
- Added `core.util.TextCompressor` for UTF-16 based text compression. Useful for client side storage like `localStorage` etc.
- Added `core.util.Uuid` an RFC4122 UUID version 4 generator
- Added `core.view.DomLayer` for `SinglePage` application which should behave like mobile applications where everytime is only one layer visible and where the layer changes are animated.

## Beta

- Beta addition to handle pointer and tap events. This is still very much in progress and can be found in `core.bom.PointerEvent` and `core.bom.TapEvent`.
- Added new class `core.application.SinglePage` which is a presenter/application class for single page / mobile esque application with a single active child presenter. Supports e.g. history management, activity tracking and indicator, etc.
- Added `core.detect.Device` for basic device category detection e.g. phone, tablet, desktop.
- Support placeholders of environment variables inside assetIds.

## Additions

- Added fixes for mishaving `Array.splice` and `Array.unshift`.
- Added ES5 based polyfill for `Array.indexOf` and `Array.lastIndexOf`.
- Added supports for passing a name to compiled templates for easier debugging/better error messages when properties/fields are not available etc.
- Minor improvement in template property accessor which now automatically camelizes the names used in the template. So that one can write the more natural `{{first-name}}` to access the `firstName` getter/property of the presenter.
- Improved support for partial errors in template system which much improved error messages.
- Added `core.event.Native` for firing native DOM element events.
- Added `core.detect.HighRes` for detecting high resolution displays.
- Added web worker detection to the runtime field via `core.detect.Runtime`.
- Added `core.detect.Touch` for detecting devices which are capable of working with touch events.
- Continued work on `core.dom.Mutation` and finalized in a first version of easy batch insertion of DOM content.
- Continued work on promises API. Disabled support for pooling as this made to many issues. Added support for optionally disabled safe execution of promises/functions for improved performance. Added new `done()` method to throw remaining errors in a promise chain as standard JavaScript errors.
- Added `core.dom.Parser` for parsing HTML and XML documents.
- Added new utilities `core.Function.curry()`, `core.Object.map()`, `core.Object.createEmpty()`, etc.
- Added new fields: "device" and "highres" with included detection classes
- Added manual field "safepromises" to control whether promises should use try-catch to prevent callback errors from stopping execution (slow but enabled by default and required by spec)
- Made script loader able to load scripts in native environment (NodeJS), too.

## Changes / Fixes

- Fixed issues with Android logging using `console` API.
- Removed "es5" field and detection.
- Removed IEDOM (core.bom.IEDOM) polyfill for adding support for IE-specific DOM manipulation methods to other browsers.
- Removed preliminary `core.mvc.Sync`
- Corrected skeleton to correctly pause/resume session for "server" task
- Fixed issues with not polyfilling `Object.keys()` anymore and use `core.Object.keys()` internally instead.
- File names from Jasy are now named by their build ID so you have to change: `jasy.Env.getChecksum()` to `jasy.Env.getId()`
- Improved some error handling for class/module creation.
- Added sealing of class prototypes for enhanced security.
- Reworked type detection in `core.Main` to use stability and performance wise improved system in `isTypeOf()`.
- Fixed issues with repeatly executing stylesheet load callback which lead to crazy side effects.
- Improved test coverage.


# 0.9-beta3

- Added detection for full native JSON support `core.detect.JSON`.
- Improved loading and positioning JS environment fixes in load order.
- Improved API docs for MVC layer.
- Renamed event class `core.mvc.event.Storage` to `core.mvc.event.Store`.
- Added new JSON test suite.


# 0.9-beta2

New/Better
----------

- Added new MVP feature: Stores - an abstract solution for dealing with incoming/outcoming data. A combination of a adapter pattern plus optional communication layer.
- Added label support to template infrastructure. Supporting both, static and dynamic labels (first mentioned are compiled into the template logic for optional performance).
- Removed `ext` namespace. Replaced with `fix` and individual static modules which offer utility methods like Base64, String utils, Object traversing, etc.
- Added advanced JSON detection as `core.detect.JSON`.
- Include all fixes from `fix.*` directly after `core.Main` being loaded. This fixes the most common issues and bugs in todays JS engines.
- Added new features for unit tests: `isNotEqual()`, `isNotIdentical()`, `isType()`
- Some test suite reorganizations and cleanups.

Changes
-------

- Moved native utilities for Strings, Numbers, Arrays, Objects into modules and converted all of them into static methods.
- Removed old JSON / ES5 polyfills - new solutions are on the way.
- Renamed some assertion methods to start with leading "is": `equal` to `isEqual`, `notEqual` to `isNotEqual` etc.
- Added assertion method `isNotUndefined`, `doesOnlyHaveKeys`.
- Changed valid key validation (properties, modules, classes) from old Object extension to new assertion method.
- Reworked parameters support for setTimeout/setInterval using custom methods instead of overriding native methods (old IE support fix). Use new `core.Function.timeout()/interval()` instead.
- Reworked override support in `core.Main.addMembers()/addStatics()` and changed default to `false`.
- Crypt API now uses `core.String.toHex()` instead of custom implementation.
- Merged `core.util.String` methods into `core.String`.
- Fixed Safari detection for being WebKit in `core.detect.Engine`.
- Removed inline `requestAnimationFrame`-fix in `core.effect.Animate` using new `core.effect.AnimationFrame` instead.


0.9-beta1
==========

This is the first follow up release of the Core project by Sebastian Software. Updated Copyright headers for new owner (of this fork).

- Integrated API Browser into Core.
- First version of Test Runner integrated into Core.
- Added ready-to-use skeleton "test" for creating a new test environment in any existing Core-based application.
- Added `jasylibrary.py` to Core with support for generating API docs, building test runner and cleaning up projects - a set of common tasks made available to Core based projects.
- Restructured Core to contain assets which basically means converting it into some kind of application structure with `source/class` and `source/asset` folder.
- Converted existing QUnit based unit tests into tests for the new integrated Test Runner.
- Added new `runtime` field to differ between pure native JavaScript environments like NodeJS and JavaScript inside the browser.
- Cleanup of `jasyscript.py`
- Support for generating API Browser for Core itself.
- IE10 fixes in `core.io.Script`.
- Added NodeJS support to `core.io.Script`.


0.8
===

- Added Jasy 0.8 ready skeleton to easily start new projects based on Jasy/Core/ApiBrowser
- Updated jasyscript.py for Jasy 0.8
- Converted jasyproject.json into jasyproject.yaml
- Cleaned up roadmap in readme.md which has actually no validity for the upcoming releases.
- Jasy relevant client side APIs were moved to new top-level "jasy" namespace.
  - `core.io.Asset.toUri()` => `jasy.Asset.toUri()`
  - `core.io.Asset.has()` => `jasy.Asset.has()`
  - `core.io.Asset.getType()` => `jasy.Asset.getType()`
  - `core.Env.isSet()` => `jasy.Env.isSet()`
  - `core.Env.getValue()` => `jasy.Env.getValue()`
- `core.io.Queue` has now marked all loader classes as optional which basically means that using the class means less bloat when only a few types are actually loaded.
- Added new translation APIs for Jasy 0.8 in `jasy.Translate`


0.7
===

- Use type data in assets delivered by Jasy-0.7 final
- Check possible keys in core.Interface
- Minor fixes

0.7-beta2
=========

- Added support for asset delegates to allow building custom urls based from asset IDs/config.
- Added support for asset profiles instead of old deploy/source handling as in Jasy-0.7-beta3
- Optimized String extension repeat()
- Fixed hasOwnProperty usage in ext/Object.js
- Removed temporary added FPS support

0.7-beta1
=========

- Major rework of asset handling for Jasy 0.7 with support for image sprites and image animations
- Removed load tracking from core.ui.Queue (this is not seen as useful in that class anymore)
- Improved system detection
- Added new Array extensions: zip() and last()
- Added new Function extension: throttle()
- Restructured Object extensions
- Updated build scripts for Jasy 0.7
- Added unit tests for new asset handling

0.6-beta2
=========

- Fixed Function.prototype.bind() issues

0.6-beta1
=========

- Refactoring
- Zynga Adoption

0.5-beta3
=========

- Renamed core.Bootstrap to core.Main and changed attach all methods previously added to the native {Object} to the class itself.
- Added trimLeft/trimRight

0.5-beta2
=========

- Reworked polyfills and extensions to be less dependend and finer grained for good browsers.
- Introduced core.template a Hogan.JS based template engine which is further optimized for performance and size.
- Reworked build script for unit tests to use Jasy and added a full blown source and build version to it.

0.5-beta1
=========

- Reworked polyfills, ES5 fixes etc. to work with new Jasy API documentation support.
- Changed structure of bootstrap/kernel. Splitted out some core features into Bootstrap.js
- Finalized Crypt APIs which are now well tested and being used by the Env.js module for computing the checksum.
- Cleanup of some old modules and classes

0.3.1
=====

- Minor bugfixes

0.3
===

- Initial Public Release
