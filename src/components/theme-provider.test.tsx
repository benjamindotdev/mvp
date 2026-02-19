import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: any) => <div>{children}</div>
}));

describe('ThemeProvider', () => {
    test('renders children', () => {
        render(
            <ThemeProvider>
                <div data-testid="child">Child</div>
            </ThemeProvider>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});
