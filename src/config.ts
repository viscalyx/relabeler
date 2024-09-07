import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { RelabelerConfig } from './types/relabeler-config';

export function loadConfig(repoPath: string): RelabelerConfig {
    const configPaths = [
        path.join(repoPath, '.github', 'relabeler.config.yml'),
        path.join(repoPath, 'relabeler.config.yml')
    ];

    for (const configPath of configPaths) {
        if (fs.existsSync(configPath)) {
            const fileContents = fs.readFileSync(configPath, 'utf8');
            return yaml.load(fileContents) as RelabelerConfig;
        }
    }

    throw new Error('Config file not found');
}
