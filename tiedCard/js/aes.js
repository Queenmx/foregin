// import { aesjs } from 'aes-js';
// var aesjs = require('aes-js');
// var textBytes = aesjs.utils.utf8.toBytes(text);
// var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
// var encryptedBytes = aesCtr.encrypt(textBytes);
// var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

// var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
// var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
// var decryptedBytes = aesCtr.decrypt(encryptedBytes);
// var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);


function strEnc1(text, key) {
    console.log(key)
    var textBytes = aesjs.utils.utf8.toBytes(text);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    // var textBytes = aesjs.utils.utf8.toBytes(text);

    // var aesEcb = new aesjs.ModeOfOperation.ecb(key);
    // var encryptedBytes = aesEcb.encrypt(textBytes);
    // var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex
}

function strDec1(text, key) {
    var encryptedBytes = aesjs.utils.hex.toBytes(text);
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    // var aesEcb = new aesjs.ModeOfOperation.ecb(key);
    // var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // // Since electronic codebook does not store state, we can 
    // // reuse the same instance. 
    // //var aesEcb = new aesjs.ModeOfOperation.ecb(key); 
    // var decryptedBytes = aesEcb.decrypt(encryptedBytes);

    // // Convert our bytes back into text 
    // var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText
}
export function strEnc(word, key) {
    key = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}

/**
 * 解密
 * @param word
 * @returns {*}
 */
export function strDec(word, key) {
    key = CryptoJS.enc.Utf8.parse(key);
    var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    // console.log("hhhh", decrypt)
    // console.log(CryptoJS.enc.Utf8.stringify(decrypt))
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}