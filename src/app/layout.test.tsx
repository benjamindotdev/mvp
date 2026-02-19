import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

jest.mock('next/font/google', () => ({
  Rubik: () => ({ variable: 'font-rubik' }),
  Bree_Serif: () => ({ variable: 'font-bree' }),
}));

jest.mock('@/components/theme-provider', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>
}));

describe('Root Layout', () => {
    test('renders children inside theme provider', () => {
        const { container } = render(
            <RootLayout>
                <div data-testid="child">Child Content</div>
            </RootLayout>
        );
        
        expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toBeInTheDocument();
        // Check html and body tags? render() renders only container div usually.
        // But layout returns html/body.
        // So container should contain html/body tags?
        // testing-library usually renders into a div container.
        // So html/body inside div is weird but valid for test.
    });
});
