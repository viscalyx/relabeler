import * as core from '@actions/core';
import * as github from '@actions/github';
import { loadConfig } from './config';

export async function run() {
  try {
    console.log('Starting run function');
    const repoName = github.context.repo.repo;
    const repoOwner = github.context.repo.owner;

    console.log(`Setting output: repository=${repoOwner}/${repoName}`);
    core.setOutput('repository', `${repoOwner}/${repoName}`);

    // Load the configuration
    const workspacePath = process.env.GITHUB_WORKSPACE || '';
    const config = loadConfig(workspacePath);
    console.log('Config loaded:', config);
    core.debug(`Loaded config: ${JSON.stringify(config)}`);

    const time = (new Date()).toTimeString();
    console.log(`Setting output: time=${time}`);
    core.setOutput('time', time);
  } catch (error) {
    if (error instanceof Error) {
      if (!error.message.startsWith('Mock')) {
        console.error('Error in run function:', error);
      }

      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}
