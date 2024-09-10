import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from '../src/config';
import { RelabelerConfig } from '../src/types/relabeler-config';
import * as yaml from 'js-yaml';

// Mock the fs, path, and js-yaml modules
jest.mock('fs');
jest.mock('path');
jest.mock('js-yaml');

// Create a mock instance of Ajv with compile and errorsText methods
const mockAjvInstance = {
    compile: jest.fn(),
    errorsText: jest.fn(),
};

// Mock the Ajv module
jest.doMock('ajv', () => ({
    __esModule: true,
    // Create a mock Ajv class
    default: class MockAjv {
        compile() {
            // Return a function that logs the data and always returns true
            return (data: any) => {
                console.log('Validating data:', data);
                return true; // Always return true for now
            };
        }
        errorsText() {
            // Always return 'Mock error' when errorsText is called
            return 'Mock error';
        }
    }
}));

describe('loadConfig', () => {
    // Define a mock configuration object
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

    // Reset all mocks before each test
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should load config from .github folder', () => {
        // Mock path.join to simply join arguments with '/'
        (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
        // Mock fs.existsSync to return true only for paths containing '.github'
        (fs.existsSync as jest.Mock).mockImplementation((path: unknown) => typeof path === 'string' && path.includes('.github'));
        // Mock fs.readFileSync to return a stringified version of mockConfig
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));
        // Mock yaml.load to return mockConfig
        (yaml.load as jest.Mock).mockReturnValue(mockConfig);

        // Call the function we're testing
        const result = loadConfig('/repo/path');

        // Assert that the result matches our mockConfig
        expect(result).toEqual(mockConfig);
        // Check that fs.existsSync was called with the correct path
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml');
        // Check that fs.readFileSync was called with the correct path and encoding
        expect(fs.readFileSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml', 'utf8');
    });

    it('should load config from root folder if not found in .github', () => {
        // Mock path.join to simply join arguments with '/'
        (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
        // Mock fs.existsSync to return true only for paths not containing '.github'
        (fs.existsSync as jest.Mock).mockImplementation((path: unknown) => typeof path === 'string' && !path.includes('.github'));
        // Mock fs.readFileSync to return a stringified version of mockConfig
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));
        // Mock yaml.load to return mockConfig
        (yaml.load as jest.Mock).mockReturnValue(mockConfig);

        // Call the function we're testing
        const result = loadConfig('/repo/path');

        // Assert that the result matches our mockConfig
        expect(result).toEqual(mockConfig);
        // Check that fs.existsSync was called for both .github and root paths
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/.github/relabeler.config.yml');
        expect(fs.existsSync).toHaveBeenCalledWith('/repo/path/relabeler.config.yml');
        // Check that fs.readFileSync was called with the correct path and encoding
        expect(fs.readFileSync).toHaveBeenCalledWith('/repo/path/relabeler.config.yml', 'utf8');
    });

    it('should throw an error if config file is not found', () => {
        // Mock fs.existsSync to always return false
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        // Assert that calling loadConfig throws an error with the correct message
        expect(() => loadConfig('/repo/path')).toThrow('Config file not found');
    });

    it('should parse YAML config file', () => {
        // Mock fs.existsSync to return true
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        // Mock fs.readFileSync to return 'yaml content'
        (fs.readFileSync as jest.Mock).mockReturnValue('yaml content');
        // Mock yaml.load to return mockConfig
        (yaml.load as jest.Mock).mockReturnValue(mockConfig);

        // Call the function we're testing
        const result = loadConfig('/repo/path');

        // Assert that the result matches our mockConfig
        expect(result).toEqual(mockConfig);
        // Check that yaml.load was called with 'yaml content'
        expect(yaml.load).toHaveBeenCalledWith('yaml content');
    });

    it('should validate config against schema', () => {
        // Mock fs.existsSync to return true
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        // Mock fs.readFileSync to return 'yaml content'
        (fs.readFileSync as jest.Mock).mockReturnValue('yaml content');
        // Mock yaml.load to return mockConfig
        (yaml.load as jest.Mock).mockReturnValue(mockConfig);

        // Call the function we're testing
        loadConfig('/repo/path');

        // No assertions are made in this test
    });

    it('should throw an error if config is invalid', () => {
        // Reset all module mocks to ensure we're using fresh mocks
        jest.resetModules();

        // Re-mock fs module
        jest.doMock('fs', () => ({
            existsSync: jest.fn().mockReturnValue(true),
            readFileSync: jest.fn().mockReturnValue('yaml content'),
        }));
        // Re-mock path module
        jest.doMock('path', () => ({
            join: jest.fn((...args) => args.join('/')),
        }));
        // Re-mock js-yaml module
        jest.doMock('js-yaml', () => ({
            load: jest.fn().mockReturnValue({ some: 'config' }),
        }));

        // Mock Ajv to return false for validation and a specific error message
        jest.doMock('ajv', () => ({
            __esModule: true,
            default: class MockAjv {
                compile() {
                    return () => false;
                }
                errorsText() {
                    return 'Validation error';
                }
            }
        }));

        // Re-import loadConfig to use the new mocks
        const { loadConfig } = require('../src/config');

        // Assert that calling loadConfig throws an error with the correct message
        expect(() => loadConfig('/repo/path')).toThrow('Invalid config: Validation error');
    });
});
