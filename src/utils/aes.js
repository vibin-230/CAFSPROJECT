const cryptLib = require("@skavinvarnan/cryptlib");

exports.encrypt = function (plainText, key) {
  try {
    const cipherText = cryptLib.encryptPlainTextWithRandomIV(plainText, key);
    return cipherText;
  } catch (error) {
    return false;
  }
};

exports.decrypt = function (text, key) {
  try {
    const decryptedString = cryptLib.decryptCipherTextWithRandomIV(text, key);
    return decryptedString;
  } catch (error) {
	  return false
  }
};
