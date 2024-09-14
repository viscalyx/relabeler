// Needed for test 'When executing as a process'
import * as core from '@actions/core';
import * as cp from 'child_process';
import * as github from '@actions/github';
import * as path from 'path';
import * as process from 'process';
import {
    describe,
    it,
    expect,
    jest,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll
} from '@jest/globals';

//import * as Webhooks from '@octokit/webhooks'
import {
    //WebhookEvent,
    PushEvent
    //IssuesOpenedEvent
} from '@octokit/webhooks-types';

import runOld from '../src/runOld';

describe('When calling action without mandatory parameters', () => {
    it('Should call the method setFailed() once', async () => {
        expect.assertions(2);

        const mockCoreSetFailed = jest.spyOn(core, 'setFailed');

        await runOld();

        expect(mockCoreSetFailed).toHaveBeenCalledTimes(1);
        expect(mockCoreSetFailed).toHaveBeenCalledWith('milliseconds not a number');
    });

    // it('Should call the method setFailed() once', async () => {
    //   await expect(runOld()).resolves.toThrow('milliseconds not a number');
    // });

    // it('Should not throw an error and call the correct mock', () => {
    //   expect.assertions(1)
    //   return runOld().catch(e => expect(e).toMatch('milliseconds not a number'))
    // })
});

describe('debug action debug messages', () => {
    beforeEach(() => {
        // Will prevent other imported modules from using a cached value
        jest.resetModules();

        // Set input environment variables
        process.env.GITHUB_REPOSITORY = 'testOwner/testRepo';
        process.env.INPUT_MILLISECONDS = '500';
        process.env.INPUT_REPOSITORYTOKEN = 'AnyValue'; // cSpell: ignore REPOSITORYTOKEN
        process.env.GITHUB_EVENT_NAME = 'push';
        process.env.GITHUB_EVENT_PATH =
            '/home/runner/work/_temp/_github_workflow/event.json';

        // Uses @octokit/webhooks-definitions for Type Script types for webhook events
        // https://www.npmjs.com/package/@octokit/webhooks-definitions#importing-types
        // const handleWebhookEvent = (event: WebhookEvent) => {
        //   if ("action" in event && event.action === "completed") {
        //     console.log(`${event.sender.login} completed something!`)
        //   }
        // }

        // const handleIssuesOpenedEvent = (event: IssuesOpenedEvent) => {
        //   console.log(
        //     `${event.sender.login} opened "${event.issue.title}" on ${event.repository.full_name}`
        //   )
        // }

        github.context.payload = (event: PushEvent) => {
            event.sender = {
                ...event.sender,
                login: 'mockUser'
            };
        };

        //
        // BELOW USE OF Webhooks.WebhookPayloadPush IS NO LONGER VALID AFTER @octokit/webhooks v8.x.x.
        // Use @octokit/webhooks-definitions, see code snippet above and
        // https://www.npmjs.com/package/@octokit/webhooks-definitions
        //

        // Mock the payload for event: push
        // github.context.payload = {
        //   sender: {
        //     login: 'mockUser'
        //   }
        // } as Webhooks.EventPayloads.WebhookPayloadPush
    });

    afterEach(() => {
        // Remove input environment variables
        delete process.env.GITHUB_REPOSITORY;
        delete process.env.INPUT_MILLISECONDS;
        delete process.env.INPUT_REPOSITORYTOKEN;
        delete process.env.GITHUB_EVENT_NAME;
        delete process.env.GITHUB_EVENT_PATH;
    });

    it('Should not throw an error and call the correct mock', async () => {
        const debugMock = jest.spyOn(core, 'debug');

        await runOld();

        expect(debugMock).toHaveBeenCalledWith('Waiting 500 milliseconds ...');
    });
});

describe('When executing as a process', () => {
    beforeAll(() => {
        // Will prevent other imported modules from using a cached value
        jest.resetModules();

        // Set input environment variables
        process.env.GITHUB_REPOSITORY = 'testOwner/testRepo';
        process.env.INPUT_MILLISECONDS = '500';
        process.env.INPUT_REPOSITORYTOKEN = 'AnyValue';
        process.env.GITHUB_EVENT_NAME = 'push';
        //process.env.GITHUB_EVENT_PATH =
        //    '/home/runner/work/_temp/_github_workflow/event.json';
    });

    afterAll(() => {
        // Remove input environment variables
        delete process.env.GITHUB_REPOSITORY;
        delete process.env.INPUT_MILLISECONDS;
        delete process.env.INPUT_REPOSITORYTOKEN;
        delete process.env.GITHUB_EVENT_NAME;
        //delete process.env.GITHUB_EVENT_PATH;
    });

    // NOTE: This test does not work since it will run the action, which is run(), not runOld().
    //
    // shows how the runner will run a javascript action with env / stdout protocol
    // it('Should not throw an error', () => {
    //     const np = process.execPath;
    //     const ip = path.join(__dirname, '..', 'dist', 'index.js');
    //     const options: cp.ExecFileSyncOptions = {
    //         env: process.env
    //     };
    //     const output = cp.execFileSync(np, [ip], options).toString();
    //     expect(output).toMatch(/::debug::Waiting 500 milliseconds .../i);
    //     //console.log(cp.execFileSync(np, [ip], options).toString())
    // });
});
