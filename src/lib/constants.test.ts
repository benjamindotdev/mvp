import { tailwindColors } from './colors';
import { icons } from './icons';

describe('Constants', () => {
  test('tailwindColors are defined', () => {
    expect(tailwindColors).toBeDefined();
    expect(Object.keys(tailwindColors).length).toBeGreaterThan(0);
  });

  test('icons are defined', () => {
    expect(icons).toBeDefined();
    expect(icons.length).toBeGreaterThan(0);
  });
});
