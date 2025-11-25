import { describe, it, expect } from 'vitest';

function calculate(parent: number, op: string, right: number) {
  switch (op) {
    case '+':
      return parent + right;
    case '-':
      return parent - right;
    case '*':
      return parent * right;
    case '/':
      return parent / right;
    default:
      throw new Error('Invalid operator');
  }
}

describe('Calculation Logic', () => {
  it('adds correctly', () => {
    expect(calculate(5, '+', 3)).toBe(8);
  });

  it('subtracts correctly', () => {
    expect(calculate(5, '-', 2)).toBe(3);
  });

  it('multiplies correctly', () => {
    expect(calculate(4, '*', 3)).toBe(12);
  });

  it('divides correctly', () => {
    expect(calculate(10, '/', 2)).toBe(5);
  });

  it('throws on invalid operator', () => {
    expect(() => calculate(5, '%', 2)).toThrow('Invalid operator');
  });
});
