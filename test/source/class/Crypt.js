var suite = new core.testrunner.Suite("Crypt");

suite.test("Adler32", function() {
  
  this.isIdentical(core.crypt.Adler32.checksum("hello world"), 436929629);
  this.isIdentical(core.crypt.Adler32.checksum("hello world!"), 512296062);
  this.isIdentical(core.crypt.Adler32.checksum("günthér falit°@"), 1479674097);
  
});

suite.test("CRC32", function() {
  
  this.isIdentical(core.crypt.CRC32.checksum("hello world"), 222957957);
  this.isIdentical(core.crypt.CRC32.checksum("hello world!"), 62177901);
  this.isIdentical(core.crypt.CRC32.checksum("günthér falit°@"), 1047403603);

});

suite.test("MD5", function() {

  this.isIdentical(core.String.toHex(core.crypt.MD5.checksum("hello world")), "5eb63bbbe01eeed093cb22bb8f5acdc3");
  this.isIdentical(core.String.toHex(core.crypt.MD5.checksum("hello karl")), "967f3d167631b54ea74b380e439ec2d5");
  this.isIdentical(core.String.toHex(core.crypt.MD5.checksum("günthér falit°@")), "c901b2c94c101e0c2fdb2c96a041ceda");
  
  this.isIdentical(core.String.toHex(core.crypt.MD5.hmac("secret", "hello world")), "78d6997b1230f38e59b6d1642dfaa3a4");
  this.isIdentical(core.String.toHex(core.crypt.MD5.hmac("secret", "hello karl")), "1df06dd6ad23a62de80b713bdfc5f59f");
  
  this.isIdentical(core.String.toHex(core.crypt.MD5.hmac("other secret", "hello world")), "614ff83602727ee68fba3e9500856fad");
  this.isIdentical(core.String.toHex(core.crypt.MD5.hmac("other secret", "hello karl")), "71b406e27e5184663c0c01448b57c5a7");
  
});

suite.test("SHA1", function() {
  
  this.isIdentical(core.String.toHex(core.crypt.SHA1.checksum("hello world")), "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
  this.isIdentical(core.String.toHex(core.crypt.SHA1.checksum("hello karl")), "1665bcf30c12443dbb332b84590123f7d544500b");
  this.isIdentical(core.String.toHex(core.crypt.SHA1.checksum("günthér falit°@")), "01695e64d0f83e453281f385209884e94784c7bf");

  this.isIdentical(core.String.toHex(core.crypt.SHA1.hmac("secret", "hello world")), "03376ee7ad7bbfceee98660439a4d8b125122a5a");
  this.isIdentical(core.String.toHex(core.crypt.SHA1.hmac("secret", "hello karl")), "1de9256cf6805f714a59b69806647b34315ae6ad");
  
  this.isIdentical(core.String.toHex(core.crypt.SHA1.hmac("other secret", "hello world")), "2b7dd1114abb301c6a3879612c040db1dc76efe7");
  this.isIdentical(core.String.toHex(core.crypt.SHA1.hmac("other secret", "hello karl")), "1005fc78d9e3c525c72c3dcaef4ec2d1ae2d638d");

});

suite.test("SHA256", function() {

  this.isIdentical(core.String.toHex(core.crypt.SHA256.checksum("hello world")), "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  this.isIdentical(core.String.toHex(core.crypt.SHA256.checksum("hello karl")), "710e9c35558708b24698b55e5e890b506fc946558b3aaa4b356ba008e4edc860");
  this.isIdentical(core.String.toHex(core.crypt.SHA256.checksum("günthér falit°@")), "2b62c8f744680ed05d50246db24cdbc491532f185a736c72e7cd94a7bbd41e77");

  this.isIdentical(core.String.toHex(core.crypt.SHA256.hmac("secret", "hello world")), "734cc62f32841568f45715aeb9f4d7891324e6d948e4c6c60c0621cdac48623a");
  this.isIdentical(core.String.toHex(core.crypt.SHA256.hmac("secret", "hello karl")), "22585ec85d81b38049d3446dd109507bd6d72478b07ef35efb4767260fe09715");
  
  this.isIdentical(core.String.toHex(core.crypt.SHA256.hmac("other secret", "hello world")), "02113759509b1c7ae0deaee8f022d84f828e7d46ae9255044c3d801ad2b09a39");
  this.isIdentical(core.String.toHex(core.crypt.SHA256.hmac("other secret", "hello karl")), "17f71ee9084ade98ed82ee4153ceb47707381e5852b473fb77eb8632e06e8bb8");

});
