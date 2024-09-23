import { API_URL, CRYPTOJS_KEY } from "@env";
import CryptoJS from "crypto-js";

export const encrypt = (text) => {
  var encrypted = CryptoJS.HmacSHA256(text, CRYPTOJS_KEY).toString().slice(7);

  const first3Chars = encrypted.slice(0, 3);
  const remainingChars = encrypted.slice(3);
  encrypted =
    remainingChars.slice(0, 3) + first3Chars + remainingChars.slice(3);

  const last4Chars = encrypted.slice(-4);
  encrypted = (last4Chars + encrypted.slice(0, -4)).slice(7, 22);

  return encrypted;
};

export const isEmptyInput = (key, setKey) => {
  if (key.value === "" || key.value === null) {
    setKey({ ...key, error: `${key.title} không được trống` });
    return true;
  } else {
    setKey({ ...key, error: "" });
    return false;
  }
};