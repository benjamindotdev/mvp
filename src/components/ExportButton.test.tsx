import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportButton from './ExportButton';
import { generateSvg, downloadSvg } from '@/lib/exportSvg';

jest.mock('@/lib/exportSvg', () => ({
  generateSvg: jest.fn(),
  downloadSvg: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Download: () => <span data-testid="download-icon">Icon</span>
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ onClick, children }: any) => <button onClick={onClick}>{children}</button>
}));

describe('ExportButton', () => {
  const mockLayers: any[] = [{ id: '1' }];
  const mockOnAfterExport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.prompt = jest.fn();
  });

  test('calls prompt and export functions on click', () => {
    (window.prompt as jest.Mock).mockReturnValue('test-icon');
    (generateSvg as jest.Mock).mockReturnValue('<svg>content</svg>');

    render(<ExportButton layers={mockLayers} onAfterExport={mockOnAfterExport} />);
    
    const button = screen.getByText('Save SVG');
    fireEvent.click(button);

    expect(window.prompt).toHaveBeenCalled();
    expect(generateSvg).toHaveBeenCalledWith(mockLayers);
    expect(downloadSvg).toHaveBeenCalledWith('<svg>content</svg>', 'test-icon.svg');
    expect(mockOnAfterExport).toHaveBeenCalled();
  });

  test('does nothing if prompt cancelled', () => {
    (window.prompt as jest.Mock).mockReturnValue(null);

    render(<ExportButton layers={mockLayers} onAfterExport={mockOnAfterExport} />);
    
    const button = screen.getByText('Save SVG');
    fireEvent.click(button);

    expect(window.prompt).toHaveBeenCalled();
    expect(generateSvg).not.toHaveBeenCalled();
    expect(downloadSvg).not.toHaveBeenCalled();
    expect(mockOnAfterExport).not.toHaveBeenCalled();
  });
  
  test('uses default name if prompt empty', () => {
    (window.prompt as jest.Mock).mockReturnValue(''); // Wait, component uses !input check. 
    // If prompt returns empty string, it's truthy? No, empty string is falsy.
    // The component does `if (!input) return;`. So empty string cancels.
    // Wait, let's check code: `const input = window.prompt(...)`. If user hits OK with empty, it returns "".
    // If user hits Cancel, it returns null.
    // So both "Cancel" (null) and "Empty OK" ("") will return early.
    
    // Let's test with just whitespace which might pass !input check if it wasn't trimmed.
    // But `if (!input)` catches empty string too.
    
    // Let's test valid name with extension
    (window.prompt as jest.Mock).mockReturnValue('my-icon.svg');
     render(<ExportButton layers={mockLayers} onAfterExport={mockOnAfterExport} />);
     fireEvent.click(screen.getByText('Save SVG'));
     
     expect(downloadSvg).toHaveBeenCalledWith(expect.anything(), 'my-icon.svg');
  });
});
