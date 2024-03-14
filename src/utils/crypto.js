const encBase64 = require("crypto-js/enc-base64");
const AES = require("crypto-js/aes");

function isHex(str) {
  const re = /^[\da-f]{6,}$/gi;
  return re.test(str);
}

function isBase64(str) {
  if (str.trim() === "") {
    return false;
  }
  if (isHex(str)) {
    return false;
  }
  const re = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return re.test(str);
}

function hexToBase64(str) {
  if (!isHex(str)) {
    throw new Error(`"${str}" is not a hex string`);
  }
  // Slightly modified https://stackoverflow.com/a/41797377 for Typescript
  const matched = str.match(/\w{2}/g);
  if (matched) {
    return btoa(
      matched
        .map(function (a) {
          return String.fromCharCode(parseInt(a, 16));
        })
        .join("")
    );
  }
  throw new Error(`Could not convert "${str}" to base64`);
}

function base64ToHex(str) {
  if (!isBase64(str)) {
    throw new Error(`"${str}" is not a base64 string`);
  }
  // https://stackoverflow.com/a/39460839
  return atob(str)
    .split("")
    .map(function (aChar) {
      return ("0" + aChar.charCodeAt(0).toString(16)).slice(-2);
    })
    .join("");
}

function isValidMacaroon(macaroon) {
  return isHex(macaroon) || isBase64(macaroon);
}

function decryptString(encrypted, password) {
  const decrypted = AES.decrypt(encrypted || "", password).toString(encBase64);
  return atob(decrypted);
}

function decryptMacaroon(macaroon, password, decryptAsHex = false) {
  const decrypted = decryptString(macaroon, password);
  if (!isValidMacaroon(decrypted)) {
    throw new Error("Incorrect password");
  }
  if (decryptAsHex) {
    return isHex(decrypted) ? decrypted : base64ToHex(decrypted);
  } else {
    return isBase64(decrypted) ? decrypted : hexToBase64(decrypted);
  }
}

module.exports = {
  decryptMacaroon,
  base64ToHex,
};
