# relabeler

A GitHub Action that labels issues and pull requests on events.

## Requirements

- Node.js v20 or higher

## Usage

To use this action, create a workflow file (e.g., `.github/workflows/relabeler.yml`) in your repository with the following content:

```yaml
name: Relabeler

on:
  issues:
    types: [opened, edited, labeled, unlabeled]
  pull_request:
    types: [opened, edited, labeled, unlabeled]

jobs:
  labeler:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Run relabeler
        uses: viscalyx/relabeler@releases/v1 # or v1.0.1 for specific version, and @main for bleeding edge
        with:
          who-to-greet: 'World'
          repositoryToken: ${{ secrets.GITHUB_TOKEN }}
          configPath: '.github/relabeler.config.yml' # Optional: Custom path to the configuration file
```

### Using the Action

- **Stable Releases**: Use the action with a specific version tag, e.g., `@v1`.
- **Preview Releases**:
  - For the latest (bleeding edge): Use the action with the `main` branch, e.g., `@main`.
  - For a specific preview version: Use a specific preview tag, e.g., `@v1.2.3-preview.12`.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `who-to-greet` | Who to greet | Yes | 'World' |
| `repositoryToken` | The GitHub repository token | Yes | N/A |
| `configPath` | Path to the configuration file relative to the repository root | No | N/A |

## Outputs

| Output | Description |
|--------|-------------|
| `time` | The time we greeted you |
| `repository` | The current repository |

## Configuration

By default, the action looks for a configuration file at `./.github/relabeler.config.yml` or `./relabeler.config.yml` in your repository. You can specify a custom path using the `configPath` input parameter.

Example configuration file:

```yaml
# .github/relabeler.config.yml
pulls:
  labels:
    - label:
        name: "waiting for code fix"
        add:
          - when:
              statuses:
                continuous-integration/appveyor/pr: failure
                license/cla: success
        remove:
          - when:
              statuses:
                continuous-integration/appveyor/pr: success
                license/cla: success
```

For more detailed configuration options, please refer to the [Configuration Guide](CONFIGURATION.md).

## Contributing

Contributions are welcome! Please see our [Contribution Guidelines](CONTRIBUTION.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).
