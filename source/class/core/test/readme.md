This is the integrated unit testing framework for Core-based applications and frameworks.

It supports a wide-array of other infrastructure out of the box:

- Any modern web browser
- [NodeJS](http://nodejs.org) (Plain JavaScript Environment)
- [PhantomJS](http://phantomjs.org/) (Headless Browser)
- [Testem](https://github.com/airportyh/testem) (Test Runner)

Writing tests is simple. Just initialize a {core.test.Suite} and call {core.test.Suite#test} for every
function you like to test. Inside that function you are able to chose from an array of assertion helpers as well:

- {core.test.Suite#equal}
- {core.test.Suite#identical}
- {core.test.Suite#ok}
- {core.test.Suite#raises}

### Example:

    var suite = new core.test.Suite("Crypt");

    suite.test("CRC32", function() 
    {  
      this.identical(core.crypt.CRC32.checksum("hello world"), 222957957);
      this.identical(core.crypt.CRC32.checksum("hello world!"), 62177901);
    });

### Usage:

- `jasy source`: Building source version of test suite. Open `source/index.html` in any browser.
- `jasy build`: Building build version of test suite. Open `build/index.html` in any browser.
- `jasy test`: Run the test suite automatically using either NodeJS, PhantomJS or Testem
- `jasy clean`: Basic cleanup of build results and caches
- `jasy distclean`: Full cleanup of all generated or downloaded files

There are a few parameters to `jasy test`:

- `--tool <node|phantom|testem>`: Select the tool to use for automated testing.
- `--target <source|build>`: Select whether either source or build should be tested.
- `--browsers <string>`: Comma separated string of browsers to test via Testem e.g. `chrome,firefox`

It is also possible to execute the tools on your own (when using the skeleton based test suite environment):

- NodeJS: Go to the `source` or `build` directory execute `node node.js`.
- PhantomJS: Go to the `source` or `build` directory execute `phantomjs phantomjs.js`.
- Testem: Go to the project root folder execute `testem -f testem.json`. See next section for more info.

### Testem:

Testem is pretty useful for automatically testing range of browsers automatically and repeatedly.
