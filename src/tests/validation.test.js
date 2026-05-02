import { describe, it, expect } from 'vitest';
import { validateInput } from '../utils/validation';

describe('validateInput', () => {
  it('returns false for null', () => {
    expect(validateInput(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(validateInput(undefined)).toBe(false);
  });

  it('returns false for non-string', () => {
    expect(validateInput(123)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateInput('')).toBe(false);
  });

  it('returns false for whitespace only', () => {
    expect(validateInput('   ')).toBe(false);
  });

  it('returns false for single character (below default minLength 2)', () => {
    expect(validateInput('a')).toBe(false);
  });

  it('returns true for valid string of 2 chars', () => {
    expect(validateInput('ab')).toBe(true);
  });

  it('returns true for normal input', () => {
    expect(validateInput('How do I register to vote?')).toBe(true);
  });

  it('returns false when string exceeds maxLength', () => {
    const longText = 'a'.repeat(501);
    expect(validateInput(longText)).toBe(false);
  });

  it('returns true at exactly maxLength', () => {
    const exactText = 'a'.repeat(500);
    expect(validateInput(exactText)).toBe(true);
  });

  it('respects custom minLength', () => {
    expect(validateInput('ab', 3)).toBe(false);
    expect(validateInput('abc', 3)).toBe(true);
  });

  it('respects custom maxLength', () => {
    expect(validateInput('hello world', 2, 5)).toBe(false);
    expect(validateInput('hi', 2, 5)).toBe(true);
  });

  it('trims before checking length', () => {
    // '  a  ' trims to 'a' which is length 1 < minLength 2
    expect(validateInput('  a  ')).toBe(false);
  });
});

describe('Voter Domain Validation Logic', () => {
  const isValidAge = (age) => Number.isInteger(age) && age >= 18 && age <= 120;
  const isValidPincode = (pin) => /^\d{6}$/.test(pin);

  it('accepts age 18', () => expect(isValidAge(18)).toBe(true));
  it('accepts age 65', () => expect(isValidAge(65)).toBe(true));
  it('rejects age 17', () => expect(isValidAge(17)).toBe(false));
  it('rejects float age', () => expect(isValidAge(18.5)).toBe(false));
  it('rejects age 121', () => expect(isValidAge(121)).toBe(false));

  it('accepts valid 6-digit pincode', () => expect(isValidPincode('600001')).toBe(true));
  it('rejects 5-digit pincode', () => expect(isValidPincode('60000')).toBe(false));
  it('rejects pincode with letters', () => expect(isValidPincode('6000AB')).toBe(false));
  it('rejects empty pincode', () => expect(isValidPincode('')).toBe(false));
});
