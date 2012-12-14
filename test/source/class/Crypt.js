module("Core :: Crypt");

test("Adler32", function() {
  
  strictEqual(core.crypt.Adler32.checksum("hello world"), 436929629);
  strictEqual(core.crypt.Adler32.checksum("hello world!"), 512296062);
  strictEqual(core.crypt.Adler32.checksum("günthér falit°@"), 1479674097);
  
});

test("CRC32", function() {
  
  strictEqual(core.crypt.CRC32.checksum("hello world"), 222957957);
  strictEqual(core.crypt.CRC32.checksum("hello world!"), 62177901);
  strictEqual(core.crypt.CRC32.checksum("günthér falit°@"), 1047403603);

});

test("MD5", function() {

  strictEqual(core.crypt.MD5.checksum("hello world").toHex(), "5eb63bbbe01eeed093cb22bb8f5acdc3");
  strictEqual(core.crypt.MD5.checksum("hello karl").toHex(), "967f3d167631b54ea74b380e439ec2d5");
  strictEqual(core.crypt.MD5.checksum("günthér falit°@").toHex(), "c901b2c94c101e0c2fdb2c96a041ceda");
  
  strictEqual(core.crypt.MD5.hmac("secret", "hello world").toHex(), "78d6997b1230f38e59b6d1642dfaa3a4");
  strictEqual(core.crypt.MD5.hmac("secret", "hello karl").toHex(), "1df06dd6ad23a62de80b713bdfc5f59f");
  
  strictEqual(core.crypt.MD5.hmac("other secret", "hello world").toHex(), "614ff83602727ee68fba3e9500856fad");
  strictEqual(core.crypt.MD5.hmac("other secret", "hello karl").toHex(), "71b406e27e5184663c0c01448b57c5a7");
  
});

test("SHA1", function() {
  
  strictEqual(core.crypt.SHA1.checksum("hello world").toHex(), "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
  strictEqual(core.crypt.SHA1.checksum("hello karl").toHex(), "1665bcf30c12443dbb332b84590123f7d544500b");
  strictEqual(core.crypt.SHA1.checksum("günthér falit°@").toHex(), "01695e64d0f83e453281f385209884e94784c7bf");

  strictEqual(core.crypt.SHA1.hmac("secret", "hello world").toHex(), "03376ee7ad7bbfceee98660439a4d8b125122a5a");
  strictEqual(core.crypt.SHA1.hmac("secret", "hello karl").toHex(), "1de9256cf6805f714a59b69806647b34315ae6ad");
  
  strictEqual(core.crypt.SHA1.hmac("other secret", "hello world").toHex(), "2b7dd1114abb301c6a3879612c040db1dc76efe7");
  strictEqual(core.crypt.SHA1.hmac("other secret", "hello karl").toHex(), "1005fc78d9e3c525c72c3dcaef4ec2d1ae2d638d");

});

test("SHA256", function() {

  strictEqual(core.crypt.SHA256.checksum("hello world").toHex(), "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  strictEqual(core.crypt.SHA256.checksum("hello karl").toHex(), "710e9c35558708b24698b55e5e890b506fc946558b3aaa4b356ba008e4edc860");
  strictEqual(core.crypt.SHA256.checksum("günthér falit°@").toHex(), "2b62c8f744680ed05d50246db24cdbc491532f185a736c72e7cd94a7bbd41e77");

  strictEqual(core.crypt.SHA256.hmac("secret", "hello world").toHex(), "734cc62f32841568f45715aeb9f4d7891324e6d948e4c6c60c0621cdac48623a");
  strictEqual(core.crypt.SHA256.hmac("secret", "hello karl").toHex(), "22585ec85d81b38049d3446dd109507bd6d72478b07ef35efb4767260fe09715");
  
  strictEqual(core.crypt.SHA256.hmac("other secret", "hello world").toHex(), "02113759509b1c7ae0deaee8f022d84f828e7d46ae9255044c3d801ad2b09a39");
  strictEqual(core.crypt.SHA256.hmac("other secret", "hello karl").toHex(), "17f71ee9084ade98ed82ee4153ceb47707381e5852b473fb77eb8632e06e8bb8");

});
