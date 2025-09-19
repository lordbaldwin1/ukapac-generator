// Type definitions for NRIC functions
type Firstchar = "S" | "T" | "F" | "G" | "M";
type Checksum = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "P" | "Q" | "R" | "T" | "U" | "W" | "X" | "Z";

// Interface for NRIC structure
interface NRICInfo {
  value: string;
  firstchar: string | null;
  identifier: string | null;
  checksum: string | null;
  isCorrectFormat: boolean;
  isValid: boolean;
}

/**
 * Validates if a string has the correct NRIC format
 * @param nric - The NRIC string to validate
 * @returns boolean indicating if format is correct
 */
export function isCorrectNRICFormat(nric: string): boolean {
  return /^[STFGM]\d{7}[A-Z]$/.test(nric.trim().toUpperCase());
}

/**
 * Get the checksum table based on the first character
 * @param firstchar - The first character of the NRIC
 * @returns Array of checksum characters
 */
function getChecksumTable(firstchar: Firstchar): Checksum[] {
  const checksums = {
    ST: ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"],
    FG: ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"],
    M: ["K", "L", "J", "N", "P", "Q", "R", "T", "U", "W", "X"],
  };

  const key = Object.keys(checksums).find((v) => v.includes(firstchar));
  if (!key) {
    throw new Error(`Unable to find checksum table for "${firstchar}"`);
  }

  const lookupKey = key as keyof typeof checksums;
  return checksums[lookupKey] as Checksum[];
}

/**
 * Calculates the NRIC checksum
 * @param firstchar - First character of NRIC
 * @param digitsStr - Seven digits of NRIC number
 * @returns The calculated checksum character
 */
function calculateChecksum(firstchar: Firstchar, digitsStr: string): Checksum {
  const digits: number[] = digitsStr.split("").map(Number);
  digits[0]! *= 2;
  digits[1]! *= 7;
  digits[2]! *= 6;
  digits[3]! *= 5;
  digits[4]! *= 4;
  digits[5]! *= 3;
  digits[6]! *= 2;

  const weight = digits.reduce((a, b) => a + b);
  const offset = firstchar === "T" || firstchar === "G" ? 4 : firstchar === "M" ? 3 : 0;
  let index = (offset + weight) % 11;

  if (firstchar === "M") {
    index = 10 - index;
  }

  const table = getChecksumTable(firstchar);

  return table[index]!;
}

/**
 * Validates the NRIC checksum
 * @param nric - The NRIC string to validate
 * @returns boolean indicating if checksum is valid
 */
function validateChecksum(nric: string): boolean {
  const normalizedNric = nric.trim().toUpperCase();
  
  if (!isCorrectNRICFormat(normalizedNric)) {
    return false;
  }

  const firstchar = normalizedNric.slice(0, 1) as Firstchar;
  const digits = normalizedNric.slice(1, -1);
  const checksum = normalizedNric.slice(-1);

  return checksum === calculateChecksum(firstchar, digits);
}

/**
 * Generates a random NRIC with valid checksum
 * @param firstchar - Optional first character of NRIC. If not provided, generates random one
 * @returns Generated NRIC string
 */
export function generateNRIC(firstchar: string | null = null): string {
  const getRandomFirstChar = (): Firstchar => {
    const chars: Firstchar[] = ["S", "T", "F", "G", "M"];
    return chars[Math.floor(Math.random() * chars.length)]!;
  };
  
  const computedFirstchar = firstchar && /^[STFGM]$/i.test(firstchar) 
    ? (firstchar.toUpperCase() as Firstchar) 
    : getRandomFirstChar();

  const digits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");

  const checksum = calculateChecksum(computedFirstchar, digits);

  return computedFirstchar + digits + checksum;
}

/**
 * Generate multiple NRICs
 * @param amount - Number of NRICs to generate
 * @param firstchar - Optional first character for all NRICs
 * @returns Array of generated NRIC strings
 */
export function generateManyNRICs(amount = 1, firstchar: string | null = null): string[] {
  if (isNaN(amount) || amount < 1) {
    amount = 1;
  }
  
  return Array.from({ length: amount }, () => generateNRIC(firstchar));
}

/**
 * Validates a single NRIC or an array of NRIC strings
 * @param value - Single NRIC string or array of NRIC strings
 * @returns true if all are valid NRICs
 */
export function validateNRIC(value: string | string[]): boolean {
  return Array.isArray(value) 
    ? value.every(item => validateChecksum(item))
    : validateChecksum(value);
}

/**
 * Gets detailed information about an NRIC
 * @param nric - The NRIC string to analyze
 * @returns Object with NRIC details
 */
export function getNRICInfo(nric: string): NRICInfo {
  const normalizedNric = nric.trim().toUpperCase();
  const isCorrectFormat = isCorrectNRICFormat(normalizedNric);
  
  return {
    value: normalizedNric,
    firstchar: isCorrectFormat ? normalizedNric.slice(0, 1) : null,
    identifier: isCorrectFormat ? normalizedNric.slice(-4) : null,
    checksum: isCorrectFormat ? normalizedNric.slice(-1) : null,
    isCorrectFormat,
    isValid: isCorrectFormat ? validateChecksum(normalizedNric) : false,
  };
}

/**
 * Formats an NRIC with spaces for better readability
 * @param nric - The NRIC string to format
 * @returns Formatted NRIC string (e.g., "S1234567A" -> "S 1234 567 A")
 */
export function formatNRIC(nric: string): string {
  const normalizedNric = nric.trim().toUpperCase();
  
  if (!isCorrectNRICFormat(normalizedNric)) {
    return normalizedNric;
  }
  
  const firstchar = normalizedNric.slice(0, 1);
  const digits = normalizedNric.slice(1, -1);
  const checksum = normalizedNric.slice(-1);
  
  return `${firstchar} ${digits.slice(0, 4)} ${digits.slice(4)} ${checksum}`;
}
