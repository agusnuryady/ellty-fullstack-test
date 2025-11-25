import { describe, expect, it } from 'vitest';
import { applyOp } from './calc';

describe('applyOp', () => {
  it('adds numbers', () => {
    expect(applyOp(5, 'add', 3)).toBe(8);
  });

  it('multiplies numbers', () => {
    expect(applyOp(4, 'mul', 3)).toBe(12);
  });

  it('throws on invalid op', () => {
    expect(() => applyOp(1, 'xxx', 2)).toThrow();
  });
});
