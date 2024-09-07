# Contribution Guidelines

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Reporting Issues

If you find a bug or have a feature request, please open an issue [here](https://github.com/your-repo/issues).

## Coding Standards

- Follow the existing code style.
- Write clear, concise commit messages.
- Add comments where necessary.

## Testing

Please ensure that your changes pass any existing tests and add new tests for any new features.

## Building, Packaging, and Releasing

### Building

The project uses TypeScript. To build the project, run:

```bash
npm run build
```

This will compile the TypeScript files in the `src` directory into JavaScript files in the `dist` directory.

### Packaging

The `dist` directory contains the compiled JavaScript files. Ensure that this directory is up-to-date before committing your changes.

### Releasing

Releases are managed using GitHub Actions and GitVersion for semantic versioning.

#### Creating a Release

1. **Tagging a Release**: To create a new release, create a new tag on the `main` branch. For example:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Release Branch**: The `create-release-branch.yml` workflow will automatically create a new branch named `releases/v1.0.0` based on this tag.

3. **Building and Packaging**: The `build-and-push.yml` workflow will run on the new release branch, compile the project, update the `dist` folder, and create a GitHub release.

#### Semantic Versioning

The project uses GitVersion to manage semantic versioning. The version is determined based on the commit history and branch names.

- **Major Changes**: Include `+semver: major` or `+semver: breaking` in your commit message.
- **Minor Changes**: Include `+semver: minor` or `+semver: feature` in your commit message.
- **Patch Changes**: Include `+semver: patch` or `+semver: fix` in your commit message (or let it default to patch).
- **No Version Bump**: Include `+semver: none` or `+semver: skip` in your commit message.

### Using the Action

- **Stable Releases**: Use the action with a specific version tag, e.g., `@v1`.
- **Bleeding Edge**: Use the action with the `main` branch for the latest changes, e.g., `@main`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
