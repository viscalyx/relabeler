import * as core from '@actions/core';
import * as github from '@actions/github';
import { wait } from './wait';

export async function runOld(): Promise<void> {
  try {
    const dryRunMessage = 'dry-run: ';

    // Always set to true when GitHub Actions is running the workflow.
    // You can use this variable to differentiate when tests are being run
    // locally or by GitHub Actions.
    const isGitHubActions = process.env.GITHUB_ACTIONS;

    // The name of the webhook event that triggered the workflow.
    const webHookEventName = process.env.GITHUB_EVENT_NAME ?? '';

    // The path of the file with the complete webhook event payload.
    // For example, /github/workflow/event.json.
    const webHookEventPath = process.env.GITHUB_EVENT_PATH ?? '';

    let runningMessage = '';

    if (!isGitHubActions) {
      runningMessage = dryRunMessage;
    }

    const gitHubActor = process.env.GITHUB_ACTOR;
    if (gitHubActor) {
      runningMessage = `${runningMessage}Running the action Relabeler due to generated event '${webHookEventName}' by user @${gitHubActor}.`;
    } else {
      runningMessage = `${runningMessage}Running the action Relabeler due to generated event '${webHookEventName}' as an unknown user.`;
    }

    core.info(runningMessage);

    core.info(webHookEventPath);

    if (github.context.payload.sender) {
      const senderLogin = github.context.payload.sender.login as string;

      if (senderLogin) {
        core.debug(`A push from ${senderLogin}!`);
      }
    }

    // Action inputs can be read with getInput
    const ms: string = core.getInput('milliseconds');

    core.debug(`Waiting ${ms} milliseconds ...`);

    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    // Manually wrap output in a foldable group
    core.startGroup('Do some function');
    //doSomeFunction()
    core.warning('Just a warning message');
    core.endGroup();

    // Wrap an asynchronous function call in a foldable group
    const result = await core.group(
      'Do the wait async in a group',
      async () => {
        await wait(parseInt(ms, 10));
        return 1;
      }
    );

    core.info(`Returned ${result} from group`);

    if (core.isDebug()) {
      // curl -v https://github.com
    } else {
      // curl https://github.com
    }

    // Outputs can be set with setOutput which makes them available to be mapped
    // into inputs of other actions to ensure they are decoupled.
    core.setOutput('time', new Date().toTimeString());

    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const repositoryToken: string = core.getInput('repositoryToken');

    // Usage: https://github.com/actions/toolkit/tree/main/packages/github#usage
    const octokit = github.getOctokit(repositoryToken);

    const nwo = process.env.GITHUB_REPOSITORY ?? '/';
    const [owner, repo] = nwo.split('/');

    core.debug(`action: ${github.context.payload.action}`);

    if (
      isGitHubActions &&
      github.context.payload.issue &&
      github.context.payload.action === 'opened'
    ) {
      const issue = github.context.payload.issue;

      //Created to will trigger abuse rate limit. See https://docs.github.com/en/rest/guides/best-practices-for-integrators#dealing-with-abuse-rate-limits.
      const issueCommentResponse = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issue.number,
        body: 'Thank you for this issue!'
      });

      core.debug(
        `Replied with thanks message: ${issueCommentResponse.data.url}`
      );
    }

    // const token = process.env['GITHUB_TOKEN']
    // if (!token) return
    //const octokit: github.GitHub = new github.GitHub(repoToken)

    //const context = github.context

    // const newIssue = await octokit.issues.create({
    //   ...context.repo,
    //   title: 'New issue!',
    //   body: 'Hello Universe!'
    // })

    // The npm module @octokit/webhooks provides type definitions for the response payloads. You can cast the payload to these types for better type information.
    // First, install the npm module npm install @octokit/webhooks
    // Then, assert the type based on the eventName
    // https://github.com/actions/toolkit/tree/main/packages/github#webhook-payload-typescript-definitions
    // Note that changes to the exported types are not considered breaking changes,
    // as the changes will not impact production code, but only fail locally or during CI at build time.
    // https://www.npmjs.com/package/@octokit/webhooks#typescript
    //
    // if (github.context.eventName === 'push') {
    //   const pushPayload = github.context.payload as Webhooks.WebhookPayloadPush
    //   core.info(`The head commit is: ${pushPayload.head}`)
    // }
  } catch (error) {
    // Update: Use core.setFailed for all errors
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

export default runOld;
