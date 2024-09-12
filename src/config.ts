import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';
import { RelabelerConfig } from './types/relabeler-config';

import schema from './schemas/relabeler-config.schema';

export function loadConfig(repoPath: string, configPath?: string): RelabelerConfig {
    let configFilePath: string;

    if (configPath) {
        configFilePath = path.join(repoPath, configPath);
        if (!fs.existsSync(configFilePath)) {
            throw new Error(`Config file not found at specified path: ${configFilePath}`);
        }
    } else {
        const configPaths = [
            path.join(repoPath, '.github', 'relabeler.config.yml'),
            path.join(repoPath, 'relabeler.config.yml')
        ];

        let foundConfigPath: string | undefined;

        for (const configPath of configPaths) {
            if (fs.existsSync(configPath)) {
                foundConfigPath = configPath;
                break;
            }
        }

        if (!foundConfigPath) {
            throw new Error('No config file was found in any of the default paths');
        }

        configFilePath = foundConfigPath;
    }

    console.log('Config file path: ', configFilePath);

    const fileContents = fs.readFileSync(configFilePath, 'utf8');
    const config = yaml.load(fileContents) as RelabelerConfig;

    // Validate the config against the schema
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (!valid) {
        throw new Error(`Invalid config: ${ajv.errorsText(validate.errors)}`);
    }

    return config;
}
