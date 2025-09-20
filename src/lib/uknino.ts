const PROHIBITED_COMBINATIONS = [
  'GB', 'BG', 'NK', 'KN', 'TN', 'NT', 'ZZ'
] as const;


const FIRST_ALLOWED_LETTERS = [
  'A', 'B', 'C', 'E', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
] as const;


const SECOND_ALLOWED_LETTERS = [
  'A', 'B', 'C', 'E', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'
] as const;


const SUFFIX_ALLOWED_LETTERS = [
  'A', 'B', 'C', 'D'
] as const;

export function generateNINO(): string {
  let prefix: string;
  do {
    const firstLetter = FIRST_ALLOWED_LETTERS[Math.floor(Math.random() * FIRST_ALLOWED_LETTERS.length)]!;
    const secondLetter = SECOND_ALLOWED_LETTERS[Math.floor(Math.random() * SECOND_ALLOWED_LETTERS.length)]!;
    prefix = firstLetter + secondLetter;
  } while (PROHIBITED_COMBINATIONS.includes(prefix as typeof PROHIBITED_COMBINATIONS[number]));

  const digits = Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');

  const suffix = SUFFIX_ALLOWED_LETTERS[Math.floor(Math.random() * SUFFIX_ALLOWED_LETTERS.length)];

  return prefix + digits + suffix;
}

export function validateNINO(nino: string): boolean {
  if (!nino || typeof nino !== 'string') {
    return false;
  }

  const cleanNINO = nino.replace(/\s/g, '').toUpperCase();

  const formatRegex = /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z][0-9]{6}[ABCD]?$/;

  if (!formatRegex.test(cleanNINO)) {
    return false;
  }

  const prefix = cleanNINO.substring(0, 2);
  if (PROHIBITED_COMBINATIONS.includes(prefix as typeof PROHIBITED_COMBINATIONS[number])) {
    return false;
  }

  return true;
}

export function generateMultipleNINOs(count: number): string[] {
  return Array.from({ length: count }, () => generateNINO());
}
