export const generateHKID = (isSingleAlphabet: boolean | null) => {
  const random = (a = 1, b = 0) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
    return Math.floor(lower + Math.random() * (upper - lower + 1));
  };

  let sum = 0;
  const prefix = Array.from({ length: 8 }, (_, index) => {
    const isSingle = isSingleAlphabet ?? Math.random() < 0.5;
    const value = index <= 1 ? (isSingle && index === 0 ? 36 : random(10, 35)) : random(0, 9);
    sum += value * (9 - index);
    return index <= 1 ? (value === 36 ? "" : String.fromCharCode(value + 55)) : value.toString();
  });
  const remainder = sum % 11;
  const lastDigit = remainder === 0 ? "0" : remainder === 1 ? "A" : (11 - remainder).toString();

  return [...prefix, lastDigit].join("");
};

export const validateHKID = (hkid: string) => {
  if (hkid.length === 0 || !/^[A-Z]{1,2}[0-9]{6}[0-9A]{1}/.test(hkid)) return false;
  const digits = hkid.split("");
  const checkDigit = digits.pop();
  const sum = digits.reduce(
    (result, value, index) => {
      const multiple = digits.length + 1 - index;
      if (/[A-Z]/.test(value)) {
        return result + (value.charCodeAt(0) - 55) * multiple;
      } else {
        return result + parseInt(value) * multiple;
      }
    },
    digits.length % 2 === 0 ? 0 : 36 * 9,
  );
  const remainder = sum % 11;
  if (isNaN(remainder) || checkDigit === undefined || checkDigit.length === 0) {
    return false;
  } else if (remainder === 0) {
    return checkDigit === "0";
  } else if (remainder === 1) {
    return checkDigit === "A";
  } else {
    return 11 - remainder === parseInt(checkDigit);
  }
};

export default validateHKID;
