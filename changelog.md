0.9-beta2
=========

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
