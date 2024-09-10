# relabeler

A GitHub Action that labels issues and pull requests on events.

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
  labeler:«
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Run relabeler
        uses: viscalyx/relabeler@releases/v1 # or v1.0.1 for specific version, and @main for bleeding edge
        with:
            who-to-greet: 'World'
            repositoryToken: ${{ secrets.GITHUB_TOKEN }}
```

### Using the Action

- **Stable Releases**: Use the action with a specific version tag, e.g., `@v1`.
- **Preview Releases**:
  - For the latest (bleeding edge): Use the action with the `main` branch, e.g., `@main`.
  - For a specific preview version: Use a specific preview tag, e.g., `@v1.2.3-preview.12`.

## Inputs

| Input            | Description                      | Required | Default |
|------------------|----------------------------------|----------|---------|
| `who-to-greet`   | Who to greet                     | true     | World   |
| `repositoryToken`| The GitHub repository token      | true     |         |

## Outputs

| Output       | Description                  |
|--------------|------------------------------|
| `time`       | The time we greeted you      |
| `repository` | The current repository       |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
