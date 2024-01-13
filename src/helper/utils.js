import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const generateRandomChars = (length = 32) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const generateRandomCharss = (length = 32) => {
    var key = {'i': 'w', 'l': 'x', 'o': 'y', 'u': 'z'}
    return Math.floor(Math.random() * 1e18).toString(32).replace(/[ilou]/, (a) => key[a])

}
const generateOtpToken = (secret = "T8ZSWJ25LP5HMHP3", account) => {

// Create a new TOTP object.
    let totp = new OTPAuth.TOTP({
        issuer: "TOTP",
        label: account,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret, // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
    });

// Generate a token (returns the current token as a string).
    let token = totp.generate();
    return token;
}

const generateQR = async text => {
    let qrImage = "";
    // Url structure
    // otpauth://totp/Label:email?secret=[secret]&issuer=[issuer]
    try {
        qrImage = await QRCode.toDataURL(text)
    } catch (err) {
        console.error(err)
    }
    return qrImage;
}
const generateOtpUrl = (secret, account) => {
    return `otpauth://totp/TOTP:${account}?secret=${secret}&issuer=TOTPApp`;
}
export default {
    generateRandomChars,
    generateOtpToken,
    generateQR,
    generateOtpUrl
}