import * as core from '@actions/core';
import * as github from '@actions/github';
import { loadConfig } from './config';
import { PullRequestOpenedEvent, PullRequestReopenedEvent, PullRequestClosedEvent, PullRequestLabeledEvent, PullRequestUnlabeledEvent, PullRequestEditedEvent } from '@octokit/webhooks-types';

export async function run() {
  try {
    console.log('Starting run function');
    const repoName = github.context.repo.repo;
    const repoOwner = github.context.repo.owner;

    // Set repository output
    const repositoryOutput = `${repoOwner}/${repoName}`;
    console.log(`Setting output: repository=${repositoryOutput}`);
    core.setOutput('repository', repositoryOutput);

    // Load the configuration
    const workspacePath = process.env.GITHUB_WORKSPACE || '';
    console.log('Workspace path: ', workspacePath);

    const configPath = core.getInput('configPath');
    console.log('Input config path: ', configPath);

    const config = loadConfig(workspacePath, configPath || undefined);
    console.log('Config loaded: ', JSON.stringify(config, null, 2));
    core.debug(`Loaded config: ${JSON.stringify(config)}`);

    const time = (new Date()).toTimeString();
    console.log(`Setting output time: ${time}`);
    core.setOutput('time', time);

    let eventType: string = '';

    const eventName = github.context.eventName;

    if ('action' in github.context.payload) {
      eventType = github.context.payload.action ?? '';
    }

    console.log(`Event name: ${eventName}`);
    console.log(`Event type: ${eventType}`);

    let labels: string[] = [];

    switch (eventName) {
      case 'pull_request':
        const payload = github.context.payload as PullRequestOpenedEvent | PullRequestReopenedEvent | PullRequestClosedEvent | PullRequestLabeledEvent | PullRequestUnlabeledEvent | PullRequestEditedEvent;
        labels = payload.pull_request.labels.map(label => label.name);

        break;
      // Add other event cases if needed
      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    console.log(`Collected labels: ${labels.join(', ')}`);
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
