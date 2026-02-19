import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from "next-themes";

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Sun: () => <span>Sun</span>,
  Moon: () => <span>Moon</span>,
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: React.forwardRef(({ children, onClick, ...props }: any, ref: any) => (
    <button ref={ref} onClick={onClick} {...props}>{children}</button>
  ))
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="menu-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <div onClick={onClick} role="menuitem">{children}</div>,
}));

describe('ThemeToggle', () => {
    const mockSetTheme = jest.fn();
    
    beforeEach(() => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
        });
        mockSetTheme.mockClear();
    });

    test('renders toggle button', () => {
        render(<ThemeToggle />);
        expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });

    test('menu items call setTheme', () => {
        const { getByText } = render(<ThemeToggle />);
        
        // Mock render structure puts content in the DOM directly in our mock.
        
        fireEvent.click(getByText('Light'));
        expect(mockSetTheme).toHaveBeenCalledWith('light');

        fireEvent.click(getByText('Dark'));
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
        
        fireEvent.click(getByText('System'));
        expect(mockSetTheme).toHaveBeenCalledWith('system');
    });
});
