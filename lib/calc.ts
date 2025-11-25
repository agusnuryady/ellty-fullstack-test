export function applyOp(a: number, op: string, b: number) {
  if (op === 'add') return a + b;
  if (op === 'sub') return a - b;
  if (op === 'mul') return a * b;
  if (op === 'div') return a / b;
  throw new Error('Invalid op');
}
