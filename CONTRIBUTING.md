# Contributing to OpenBadge Reader

Thank you for considering contributing to OpenBadge Reader! This document explains how to set up your environment, propose
changes, and collaborate with the community.

## Ways to contribute

- Report bugs or inconsistencies via [GitHub Issues](https://github.com/Kosmio/open-badge-reader-4de656ac/issues).
- Suggest new features, UI improvements, or documentation topics.
- Submit pull requests for code, tests, or documentation.
- Triage existing issues by reproducing bugs or clarifying requirements.

## Code of Conduct

By participating in this project, you agree to uphold the standards described in our [Code of Conduct](CODE_OF_CONDUCT.md).

## Development environment

1. Fork the repository and clone your fork.
2. Install dependencies with `npm install`.
3. Run the development server via `npm run dev` to iterate on changes.
4. Execute quality checks before submitting a pull request:

   ```bash
   npm run lint
   ```

## Branching and pull requests

- Create feature branches from `main` using a descriptive name (`feature/badge-verification`, `docs/update-readme`, etc.).
- Keep pull requests focused. Smaller changes are easier to review and merge.
- Provide a clear description summarising the change, motivation, and any follow-up work.
- Link related issues using GitHub keywords (`Fixes #123`).
- Include screenshots or recordings when changing the UI.

## Commit guidelines

- Write concise commit messages in the imperative mood (e.g. `Add badge verification helper`).
- Group related changes into a single commit when possible; avoid unrelated modifications.
- Ensure tests and linting pass locally before pushing.

## Reviewing process

1. Automated checks (when available) run against pull requests.
2. Maintainers review code for correctness, accessibility, performance, and documentation.
3. Feedback is shared through comments; please respond or update your branch accordingly.
4. Once approved, a maintainer will merge the pull request.

## Issue reporting template

When reporting a bug, please include:

- A clear and descriptive title.
- Steps to reproduce the issue.
- Expected vs. actual results.
- Environment details (browser, OS, Node.js version).
- Relevant screenshots or logs if applicable.

## Release management

We currently use manual releases. Contributions that affect user-facing functionality should include release notes in the pull
request description to ease changelog curation.

## Need help?

If you have questions or need guidance on a contribution, open a draft pull request or start a discussion in an issue. The
maintainers at [Kosm.io](https://kosm.io/) are happy to help.
