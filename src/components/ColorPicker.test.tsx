import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ColorPicker from './ColorPicker';

// Mock specific parts of the module to control test input
jest.mock('@/lib/colors', () => ({
  tailwindColors: {
    slate: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
    },
    red: {
      '500': '#ef4444', 
    }
  }
}));

describe('ColorPicker Component', () => {
  const mockOnChange = jest.fn();
  const initialValue = '#123456';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with initial custom color', () => {
    render(<ColorPicker value={initialValue} onChange={mockOnChange} />);
    
    // Check if the custom color value is displayed
    expect(screen.getByText(initialValue)).toBeInTheDocument();
  });

  test('calls onChange when Black button is clicked', () => {
    render(<ColorPicker value={initialValue} onChange={mockOnChange} />);
    
    const blackButton = screen.getByTitle('Black');
    fireEvent.click(blackButton);

    expect(mockOnChange).toHaveBeenCalledWith('#000000');
  });

  test('calls onChange when White button is clicked', () => {
    render(<ColorPicker value={initialValue} onChange={mockOnChange} />);
    
    const whiteButton = screen.getByTitle('White');
    fireEvent.click(whiteButton);
    expect(mockOnChange).toHaveBeenCalledWith('#ffffff');
  });
  
  test('calls onChange when a tailwind color is clicked', () => {
    render(<ColorPicker value={initialValue} onChange={mockOnChange} />);
    
    // Since we mocked tailwindColors, we expect 'red-500' to be rendered
    const redButton = screen.getByTitle('red-500');
    fireEvent.click(redButton);
    expect(mockOnChange).toHaveBeenCalledWith('#ef4444');
  });
});
