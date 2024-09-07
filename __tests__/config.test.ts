import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from '../src/config';
import { RelabelerConfig } from '../src/types/relabeler-config';

jest.mock('fs');
jest.mock('path');

describe('loadConfig', () => {
    const mockConfig: RelabelerConfig = {
        pulls: {
            labels: [
                {
                    label: {
                        name: 'test-label',
                        add: [{ when: { canBeMerged: true } }],
                        remove: [{ when: { canBeMerged: false } }],
                    },
                },
            ],
        },
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should load config from .github folder', () => {
        (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
        (fs.existsSync as jest.Mock).mockImplementation((path: unknown) => typeof path === 'string' && path.includes('.github'));
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));

        const result = loadConfig('/repo/path');

        expect(result).toEqual(mockConfig);
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml');
        expect(fs.readFileSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml', 'utf8');
    });

    it('should load config from root folder if not found in .github', () => {
        (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
        (fs.existsSync as jest.Mock).mockImplementation((path: unknown) => typeof path === 'string' && !path.includes('.github'));
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));

        const result = loadConfig('/repo/path');

        expect(result).toEqual(mockConfig);
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml');
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/relabeler.config.yml');
        expect(fs.readFileSync).toHaveBeenCalledWith('/repo/path/relabeler.config.yml', 'utf8');
    });

    it('should throw an error if config file is not found', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        expect(() => loadConfig('/repo/path')).toThrow('Config file not found');
    });
});
