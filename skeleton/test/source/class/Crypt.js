var suite = new core.testrunner.Suite("Crypt");

suite.test("Adler32", function() {
  
  this.equal(core.crypt.Adler32.checksum("hello world"), 436929629);
  this.identical(core.crypt.Adler32.checksum("hello world!"), 512296062);
  this.identical(core.crypt.Adler32.checksum("günthér falit°@"), 1479674097);

});

suite.test("CRC32", function() {
  
  this.identical(core.crypt.CRC32.checksum("hello world"), 222957957);
  this.identical(core.crypt.CRC32.checksum("hello world!"), 62177901);
  this.identical(core.crypt.CRC32.checksum("günthér falit°@"), 1047403603);

});

suite.test("Timeout", function() {

  var self = this;
  setTimeout(function() {
    self.identical(1, 1);
    self.done();
  }, 300);
  
}, 1, 1000);
