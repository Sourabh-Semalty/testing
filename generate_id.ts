import generate from "nanoid/generate";

const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const randChars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ref = new Date("2020-01-01").getTime();

export function genId(size: number) {
  return generate(randChars, size);
}

export function toPaddedStr(num: number, size: number) {
  let result = `${num}`;
  while (result.length < size) result = `0${result}`;
  return result;
}

function toBase62(num: number, digits: number) {
  let tmp = num;
  let result = "";
  do {
    const rem = tmp % 62;
    result = chars.substr(rem, 1) + result;
    tmp = (tmp - rem) / 62;
  } while (tmp > 0);
  while (result.length < digits) result = `0${result}`;
  return result;
}

export function genTimeStampId() {
  const secs = Math.round((Date.now() - ref) / 1000);
  return toBase62(secs, 5);
}
