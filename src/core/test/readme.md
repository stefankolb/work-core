# Unit Testing Framework

This is the integrated unit testing framework for Core-based applications and frameworks.

It supports a wide-array of other infrastructure out of the box:

- Any web browser
- NodeJS
- PhantomJS
- Testem test runner

Writing tests is simple. Just initialize a {core.test.Suite} and call {core.test.Suite#test} for every
function you like to test. Inside that function you are able to chose from an array of assertion helpers as well:

- {core.test.Suite#equal}
- {core.test.Suite#identical}
- {core.test.Suite#ok}
- {core.test.Suite#raises}

Have fun!
