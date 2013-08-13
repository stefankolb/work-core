var suite = new core.testrunner.Suite("Util/TextPacker");

suite.test("utf8", function() 
{
  var testString = "TEST WITH UMLAUTS: ü and ä and ö";
  var packed = core.util.TextCompressor.compress(testString);

  this.isIdentical(core.util.TextCompressor.decompress(packed), testString);
  this.isTrue(packed.length < testString.length);
});

suite.test("test compress decompress", function() {
	var testString = "{foo:123}";

	var packed = core.util.TextCompressor.compress(testString);
	var unpacked = core.util.TextCompressor.decompress(packed);

	this.isIdentical(unpacked, testString);
});

suite.test("test compress/decompress base64", function() {
	var testString = "{foo:123}";
	var testStringB64 = core.util.Base64.encode(testString);

	var packed = core.util.TextCompressor.compress64(testStringB64);
	var unpacked = core.util.TextCompressor.decompress64(packed);

	var decoded = core.util.Base64.decode(unpacked);

	this.isIdentical(unpacked, testStringB64.replace("=", ""));
});

suite.test("test compress/decompress base64 part 2", function() {
	var testString = "TEST WITH UMLAUTS: ü and ä and ö";
	var testStringB64 = core.util.Base64.encode(testString);

	var packed = core.util.TextCompressor.compress64(testStringB64);
	var unpacked = core.util.TextCompressor.decompress64(packed);

	var decoded = core.util.Base64.decode(unpacked);

	this.isIdentical(unpacked, testStringB64.replace("=", ""));
});

suite.test("complex string", function() {
	var testString = '@J@{"product":null,"internetRouter":"dir150n","tvHardware":"receiver-buy","phoneProof":null,"phoneProofAbbreviated":null,"phoneProofClean":null,"phoneEntry":null,"phoneEntryPrint":null,"phoneEntryDigital":null,"phoneEntryService":null,"phoneEntryReverse":null,"phoneTransfer":null,"phoneTransferAcademic":null,"phoneTransferFirstname":null,"phoneTransferName":null,"phoneTransferAreaCode":null,"phoneTransferFirstNumber":null,"phoneTransferSecondNumber":null,"phoneTransferProvider":null,"phoneTransferOtherProvider":null,"phoneLock0900":null,"phoneLockInternational":null,"personalTitle":null,"personalAcademic":null,"personalFirstname":null,"personalName":null,"personalBirthday":null,"personalEmail":null,"personalPhone":null,"personalCablebox":null,"personalFloor":null,"paymentFirstname":"Sebastian","paymentName":"Werner","paymentType":"bankcode","paymentBankcode":"50870024","paymentAccount":"018024000","paymentIban":null,"paymentBic":null,"billingAddress":null,"deliveryAddress":null,"id":null"}';

	var packed = core.util.TextCompressor.compress(testString);
	var unpacked = core.util.TextCompressor.decompress(packed);

	this.isIdentical(unpacked, testString);
});

suite.test("complex string 2", function() {
	var testString = '@J@{"product":null,"internetRouter":"dir150n","tvHardware":"recorder-buy","phoneProof":null,"phoneProofAbbreviated":null,"phoneProofClean":null,"phoneEntry":null,"phoneEntryPrint":null,"phoneEntryDigital":null,"phoneEntryService":null,"phoneEntryReverse":null,"phoneTransfer":null,"phoneTransferAcademic":null,"phoneTransferFirstname":null,"phoneTransferName":null,"phoneTransferAreaCode":null,"phoneTransferFirstNumber":null,"phoneTransferSecondNumber":null,"phoneTransferProvider":null,"phoneTransferOtherProvider":null,"phoneLock0900":null,"phoneLockInternational":null,"personalTitle":null,"personalAcademic":null,"personalFirstname":null,"personalName":null,"personalBirthday":null,"personalEmail":null,"personalPhone":null,"personalCablebox":null,"personalFloor":null,"paymentFirstname":null,"paymentName":null,"paymentType":null,"paymentBankcode":null,"paymentAccount":null,"paymentIban":null,"paymentBic":null,"billingAddress":null,"deliveryAddress":null,"id":null}';

	var packed = core.util.TextCompressor.compress(testString);
	var unpacked = core.util.TextCompressor.decompress(packed);

	this.isIdentical(unpacked, testString);
});