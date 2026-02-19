import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from './page';

// Mock components to simplify integration test
jest.mock('@/components/ProjectManager', () => ({
  ProjectManager: () => <div data-testid="project-manager">ProjectManager</div>
}));
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));
jest.mock('@/components/IconPicker', () => ({
  __esModule: true,
  default: ({ onAddLayer }: any) => (
    <div data-testid="icon-picker">
        <button onClick={() => onAddLayer('square')}>Add Square</button>
    </div>
  )
}));
jest.mock('@/components/Canvas', () => ({
  __esModule: true,
  default: ({ layers, onSelectLayer }: any) => (
      <div data-testid="canvas">
          {layers.map((l: any) => (
              <div 
                key={l.id} 
                data-testid={`layer-${l.id}`}
                onClick={() => onSelectLayer && onSelectLayer(l.id)}
              >
                  {l.iconId} z{l.zIndex}
              </div>
          ))}
      </div>
  )
}));
jest.mock('@/components/LayerControls', () => ({
  __esModule: true,
  default: ({ onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }: any) => (
    <div data-testid="layer-controls">
        <button onClick={() => onUpdate({ scale: 2 })}>Update Scale</button>
        <button onClick={onDelete}>Delete Layer</button>
        <button onClick={onDuplicate}>Duplicate Layer</button>
        <button onClick={onMoveUp}>Move Up</button>
        <button onClick={onMoveDown}>Move Down</button>
    </div>
  )
}));
jest.mock('@/components/ColorPicker', () => ({
  __esModule: true,
  default: () => <div data-testid="color-picker">ColorPicker</div>
}));
jest.mock('@/components/ExportButton', () => ({
  __esModule: true,
  default: () => <div data-testid="export-button">ExportButton</div>
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />
}));

// Mock storage
jest.mock('@/lib/storage', () => ({
  getProjects: jest.fn().mockReturnValue([]),
  saveProject: jest.fn(),
  getLastProjectId: jest.fn().mockReturnValue(null),
  migrateLegacyProject: jest.fn()
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Github: () => <span>Github</span>,
  FilePlus2: () => <span>New SVG</span>,
  CircleParking: () => <span>P</span>,
  LucideChartNoAxesColumn: () => <span>M</span>,
  LucideChevronDown: () => <span>V</span>,
  Search: () => <span>Search</span>,
  Check: () => <span>Check</span>,
  Trash2: () => <span>Trash</span>,
  Copy: () => <span>Copy</span>,
  ArrowUp: () => <span>Up</span>,
  ArrowDown: () => <span>Down</span>
}));

describe('Home Page', () => {
  test('renders main layout', async () => {
    render(<Page />);
    
    // Wait for client-side hydration
    await waitFor(() => {
      // Find by partial text since it is split
      const header = screen.getByRole('heading', { level: 1 });
      expect(header).toHaveTextContent(/Modular/);
    });
    
    // Check components
    expect(screen.getByTestId('project-manager')).toBeInTheDocument();
    expect(screen.getByTestId('icon-picker')).toBeInTheDocument();
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    
    // Check footer credits
    expect(screen.getByText('Built by')).toBeInTheDocument();
  });
  test('allows adding and manipulating layers', async () => {
    render(<Page />);
    
    // Wait for load and verify initial state (1 layer auto-created if no projects)
    await waitFor(() => {
        expect(screen.getAllByText('square')).toHaveLength(1);
    });

    // Add another Square via IconPicker
    const addBtn = screen.getByText('Add Square');
    fireEvent.click(addBtn);
    
    // Verify 2 layers
    await waitFor(() => {
        expect(screen.getAllByText('square')).toHaveLength(2);
    });

    // Select the second layer (mock IconPicker adds it and selects it)
    // LayerControls should show up.
    const updateBtn = await screen.findByText('Update Scale'); 
    fireEvent.click(updateBtn);
    // (We just verify no crash here, as we can't easily check internal state without more complex mocks)
    
    // Duplicate Layer
    fireEvent.click(screen.getByText('Duplicate Layer'));
    
    // Verify 3 layers
    await waitFor(() => {
        expect(screen.getAllByText('square')).toHaveLength(3);
    });
    
    // Move Up/Down (ensure functions trigger without error)
    fireEvent.click(screen.getByText('Move Up'));
    fireEvent.click(screen.getByText('Move Down'));
    
    // Delete Layer
    fireEvent.click(screen.getByText('Delete Layer'));
    
    // Verify back to 2 layers
    await waitFor(() => {
        expect(screen.getAllByText('square')).toHaveLength(2);
    });
  });
});
