import { describe, it, expect, jest, beforeAll, beforeEach, afterEach } from '@jest/globals';

const context = describe;

import * as core from '@actions/core';
import * as github from '@actions/github';
import { run } from '../src/action';
import { loadConfig } from '../src/config';
import { RelabelerConfig } from '../src/types/relabeler-config';

import { Context } from '@actions/github/lib/context';
//import { WebhookPayload } from '@actions/github/lib/interfaces';
// https://github.com/octokit/webhooks/blob/main/payload-types/schema.d.ts
import {
  PushEvent
  //,IssuesEvent
  //,PullRequestEvent
} from '@octokit/webhooks-types';

// Keep these at the top level. Jest hoists these declarations to the top of the file. This ensures that the mocks are set up before any imports are processed.
jest.mock('@actions/core');
jest.mock('@actions/github', () => ({
  context: {
    payload: {
      action: 'opened',
    },
    repo: {
      repo: 'testRepo',
      owner: 'testOwner',
    },
  },
}));
jest.mock('../src/config');

// Declare mockedCore at the top level, but don't initialize it yet
let mockedCore: jest.Mocked<typeof core>;
let mockConfig: RelabelerConfig;

describe('Relabeler', () => {
  beforeAll(() => {
    mockedCore = core as jest.Mocked<typeof core>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_WORKSPACE = '/test/workspace';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    jest.unmock('@actions/github');
  });

  context('When configuration is found', () => {
    beforeAll(() => {
      mockConfig = {
        pulls: {
          labels: [
            {
              label: {
                name: 'test-label',
                add: [
                  { when: { canBeMerged: true } },
                  { when: { statuses: { 'ci/test': 'success' } } },
                  { when: { reviewRequestChange: true } },
                  { when: { notLabeled: ['bug', 'feature'] } },
                  { when: { reviewResponseToRequestChange: true } },
                  { when: { onPush: true } },
                  { when: { reviewApproved: true } },
                ],
                remove: [
                  { when: { canBeMerged: false } },
                  { when: { statuses: { 'ci/test': 'failure' } } },
                  { when: { reviewResponseToRequestChange: false } },
                  { when: { onPush: false } },
                  { when: { labeled: 'bug' } },
                  { when: { labeled: ['feature', 'enhancement'] } },
                  { when: { reviewApproved: false } },
                ],
              },
            },
          ],
        },
      };
    });

    beforeEach(() => {
      (loadConfig as jest.MockedFunction<typeof loadConfig>).mockImplementation((workspace: string) => {
        expect(workspace).toBe('/test/workspace');
        return mockConfig;
      });
    });

    it('should set outputs and load config correctly', async () => {
      await run();

      /*
      // DEBUG CODE
      // Wait for any pending promises to resolve
      await new Promise(process.nextTick);

      console.log('setOutput calls:', mockedCore.setOutput.mock.calls);
      */

      expect(mockedCore.setOutput).toHaveBeenCalledWith('repository', 'testOwner/testRepo');
      expect(mockedCore.setOutput).toHaveBeenCalledWith('time', expect.any(String));
      expect(loadConfig).toHaveBeenCalledWith('/test/workspace', undefined);
      expect(mockedCore.debug).toHaveBeenCalledWith(`Loaded config: ${JSON.stringify(mockConfig)}`);

      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it('should load all possible properties in the config', async () => {
      await run(); // Ensure run() is called to trigger loadConfig

      const loadedConfig = (loadConfig as jest.MockedFunction<typeof loadConfig>).mock.results[0].value as RelabelerConfig;

      expect(loadedConfig).toEqual(mockConfig);
      expect(loadedConfig.pulls.labels[0].label.name).toBe('test-label');

      // Check 'add' conditions
      const addConditions = loadedConfig.pulls.labels[0].label.add;
      expect(addConditions).toContainEqual({ when: { canBeMerged: true } });
      expect(addConditions).toContainEqual({ when: { statuses: { 'ci/test': 'success' } } });
      expect(addConditions).toContainEqual({ when: { reviewRequestChange: true } });
      expect(addConditions).toContainEqual({ when: { notLabeled: ['bug', 'feature'] } });
      expect(addConditions).toContainEqual({ when: { reviewResponseToRequestChange: true } });
      expect(addConditions).toContainEqual({ when: { onPush: true } });
      expect(addConditions).toContainEqual({ when: { reviewApproved: true } });

      // Check 'remove' conditions
      const removeConditions = loadedConfig.pulls.labels[0].label.remove;
      expect(removeConditions).toContainEqual({ when: { canBeMerged: false } });
      expect(removeConditions).toContainEqual({ when: { statuses: { 'ci/test': 'failure' } } });
      expect(removeConditions).toContainEqual({ when: { reviewResponseToRequestChange: false } });
      expect(removeConditions).toContainEqual({ when: { onPush: false } });
      expect(removeConditions).toContainEqual({ when: { labeled: 'bug' } });
      expect(removeConditions).toContainEqual({ when: { labeled: ['feature', 'enhancement'] } });
      expect(removeConditions).toContainEqual({ when: { reviewApproved: false } });

      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  context('When action should set output', () => {
    beforeAll(() => {
      (loadConfig as jest.MockedFunction<typeof loadConfig>).mockReturnValue({
        pulls: {
          labels: []
        }
      });
    });

    it('should set the repository output', async () => {
      await run();
      expect(mockedCore.setOutput).toHaveBeenCalledWith(
        'repository',
        'testOwner/testRepo'
      );

      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  context('When configuration is not found', () => {
    it('should call setFailed() with correct error message', async () => {
      const mockError = new Error('Mock failed to load config error');
      (loadConfig as jest.MockedFunction<typeof loadConfig>).mockImplementationOnce(() => {
        throw mockError;
      });

      await run();

      expect(mockedCore.setFailed).toHaveBeenCalledWith('Mock failed to load config error');
    });
  });

  context('When using custom config path', () => {
    it('should load config from specified path', async () => {
      const customConfigPath = 'custom/path/config.yml';

      // Mock core.getInput to return the custom config path
      mockedCore.getInput.mockReturnValue(customConfigPath);

      (loadConfig as jest.MockedFunction<typeof loadConfig>).mockImplementation((workspace: string, configPath?: string) => {
        expect(workspace).toBe('/test/workspace');
        expect(configPath).toBe(customConfigPath);
        return mockConfig;
      });

      await run();

      expect(mockedCore.getInput).toHaveBeenCalledWith('configPath');
      expect(mockedCore.setOutput).toHaveBeenCalledWith('repository', 'testOwner/testRepo');
      expect(mockedCore.setOutput).toHaveBeenCalledWith('time', expect.any(String));
      expect(loadConfig).toHaveBeenCalledWith('/test/workspace', customConfigPath);
      expect(mockedCore.debug).toHaveBeenCalledWith(`Loaded config: ${JSON.stringify(mockConfig)}`);

      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });

  // This test needs to be at the end of the file because it modifies the github mock
  // in a way that can affect other tests. Keeping it at the end minimizes its impact.
  context('When action fails', () => {
    it('should call setFailed() with correct error message', async () => {
      const mockContext: Context = {
        payload: {} as PushEvent,
        eventName: 'push',
        sha: '1234567890abcdef1234567890abcdef12345678',
        ref: 'refs/heads/main',
        workflow: 'Test Workflow',
        action: 'opened',
        actor: 'username',
        job: 'test-job',
        runNumber: 1,
        runId: 12345,
        apiUrl: 'https://api.github.com',
        serverUrl: 'https://github.com',
        graphqlUrl: 'https://api.github.com/graphql',
        issue: {
          owner: 'mockOwner',
          repo: 'mockRepo',
          number: 1
        },
        repo: {
          owner: 'mockOwner',
          repo: 'mockRepo'
        }
      };

      jest.mock('@actions/github', () => ({
        context: mockContext
      }));

      const mockError = new Error('Mock error when getting owner property.');

      // Simulate an error by overriding the getter after mocking
      Object.defineProperty(github.context.repo, 'owner', {
        get: () => { throw mockError; }
      });

      await run();

      expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
    });
  });

  // DO NOT PUT TESTS HERE. THEY WILL BREAK, SEE PREVIOUS COMMENTS.
});


