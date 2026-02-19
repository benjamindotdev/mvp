import { generateSvg, downloadSvg } from './exportSvg';
import { Layer } from '@/types/layer';

jest.mock('@/lib/icons', () => ({
  getIconById: jest.fn().mockImplementation((id) => {
    if (id === 'test-icon') {
      return {
        id: 'test-icon',
        name: 'Test Icon',
        component: function TestIcon(props: any) {
          return <svg {...props}><path d="M0 0h10v10H0z"/></svg>;
        }
      };
    }
    return null;
  }),
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('exportSvg', () => {
    const layers: Layer[] = [
        {
            id: 'l1',
            iconId: 'test-icon',
            color: '#000000',
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            zIndex: 1
        }
    ];

    test('generateSvg returns string', () => {
        const svg = generateSvg(layers, 512);
        expect(typeof svg).toBe('string');
        expect(svg).toContain('<svg');
        expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });
    
    test('generateSvg returns empty for invalid icon', () => {
        const badLayers: Layer[] = [{ ...layers[0], iconId: 'bad-icon' }];
        const svg = generateSvg(badLayers, 512);
        expect(svg).toContain('<svg');
        expect(svg).not.toContain('<path d="M0 0h10v10H0z"/>');
    });

    test('downloadSvg triggers download', () => {
        const content = '<svg>...</svg>';
        const filename = 'test.svg';
        
        // Mock createElement 'a'
        const link = {
            href: '',
            download: '',
            click: jest.fn(),
            style: {}
        };
        const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link as any);
        const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => link as any);
        const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => link as any);
        
        downloadSvg(content, filename);
        
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(link.download).toBe(filename);
        expect(link.click).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
        
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});
