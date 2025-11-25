import { render, screen } from '@testing-library/react';
import CalculationTree from '@/components/CalculationTree';
import { test, expect } from 'vitest';

const posts = [
  {
    id: '1',
    value: 5,
    parentId: null,
    userId: 'u1',
    children: [
      {
        id: '2',
        value: 7,
        parentId: '1',
        userId: 'u2',
        children: [],
      },
    ],
  },
];

test('renders calculation tree', () => {
  render(<CalculationTree posts={posts} onRefresh={() => {}} />);

  // There are multiple "Value:" labels, so use getAllByText
  const valueLabels = screen.getAllByText('Value:');
  expect(valueLabels.length).toBe(2);

  // Check node values individually
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
});
