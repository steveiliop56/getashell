import * as crypto from "crypto";

export const generateString = (length: number): string => {
  let generatedPassword = "";

  const validChars =
    "0123456789" + "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < length; i++) {
    generatedPassword += validChars[crypto.randomInt(0, validChars.length)];
  }

  return generatedPassword;
};
