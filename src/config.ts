import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';
import { RelabelerConfig } from './types/relabeler-config';

// Update the schema import path
import schema from './schemas/relabeler-config.schema';

export function loadConfig(repoPath: string): RelabelerConfig {
    const configPaths = [
        path.join(repoPath, '.github', 'relabeler.config.yml'),
        path.join(repoPath, 'relabeler.config.yml')
    ];

    for (const configPath of configPaths) {
        if (fs.existsSync(configPath)) {
            const fileContents = fs.readFileSync(configPath, 'utf8');
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
    }

    throw new Error('Config file not found');
}
