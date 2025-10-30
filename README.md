# OpenBadge Reader

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Alpha](https://img.shields.io/badge/status-alpha-orange)](#project-status)
[![Built with React](https://img.shields.io/badge/built%20with-React-61dafb?logo=react&logoColor=white)](https://react.dev/)

> A privacy-first web application for validating Open Badges (v2 and v3) directly in the browser.

OpenBadge Reader helps learners, issuers, and verifiers inspect the authenticity of Open Badges without sending badge data to
external services. Upload a badge file or paste a verification URL to obtain structured information about the badge, its
issuer, cryptographic signature, and evidence.

## Table of contents

- [Project status](#project-status)
- [Features](#features)
- [Live preview](#live-preview)
- [Quick start](#quick-start)
- [Usage](#usage)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community and support](#community-and-support)
- [License](#license)

## Project status

The project is currently in **alpha**. Core features for parsing and displaying Open Badge metadata are available, while badge
signature verification is partially mocked for demonstration purposes. Contributions that improve real-world badge parsing,
validation, accessibility, and internationalisation are welcome.

## Features

- ✅ **Instant validation** – Upload badge files (`.json`, `.png`, `.svg`) or paste URLs to parse metadata in the browser.
- 🔐 **Privacy first** – All parsing happens client side; badge data is not persisted on remote servers.
- 🪪 **Open Badge v2 & v3 support** – Built to align with IMS Global specifications for the latest badge formats.
- 📊 **Rich presentation** – Provides human-readable summaries of badge issuer, recipient, evidence, and validity periods.
- 💾 **Local storage for sharing** – Uses an in-browser store to allow temporary sharing of parsed badge results.
- 🎨 **Modern UI** – Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Live preview

A public demo will be published soon. In the meantime you can run the application locally by following the steps below.

## Quick start

### Prerequisites

- Node.js 18 or newer (use [`nvm`](https://github.com/nvm-sh/nvm) for effortless installs)
- npm 9+ (ships with recent Node.js releases)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kosmio/open-badge-reader-4de656ac.git
cd open-badge-reader-4de656ac

# Install dependencies
npm install

# Start a local development server (http://localhost:5173)
npm run dev
```

### Production build

```bash
# Create an optimised bundle in dist/
npm run build

# Preview the production bundle locally
npm run preview
```

### Quality checks

```bash
# Run ESLint across the project
npm run lint
```

## Usage

1. Launch the development server with `npm run dev`.
2. Open the application in your browser and upload an Open Badge file or paste a badge URL.
3. The application attempts to parse the badge via `BadgeParser`. If parsing fails, a sample badge is displayed while
   informative feedback is shown.
4. Parsed badge data is saved temporarily with `BadgeStorage` to enable sharing via result links.

Refer to the [Usage guide](docs/usage.md) for tips on supported formats and troubleshooting common parsing issues.

## Project structure

```text
src/
├── components/        # Reusable UI elements (badge uploader, cards, toasts)
├── hooks/             # Custom hooks such as toast utilities
├── lib/               # Shared configuration and helpers
├── pages/             # Route-level pages including the landing/verification flow
├── utils/             # Core logic for parsing and persisting badge data
└── main.tsx           # Application bootstrap and router
```

A deeper dive into the architecture, data flow, and key modules is available in [docs/architecture.md](docs/architecture.md).

## Documentation

- [Architecture overview](docs/architecture.md)
- [Usage guide](docs/usage.md)
- [Contributing guidelines](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)

If you spot gaps in the documentation or would like to improve translations, please open an issue.

## Contributing

We welcome contributions of all sizes—bug reports, feature requests, documentation improvements, and pull requests. Please
review the [contribution guidelines](CONTRIBUTING.md) and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) before
participating. To maintain a healthy repository, we prefer well-scoped pull requests with descriptive commit messages and
accompanying tests when applicable.

## Community and support

- **Issues** – Use [GitHub Issues](https://github.com/Kosmio/open-badge-reader-4de656ac/issues) to report bugs or request features.
- **Discussions** – Start a conversation via issues or propose a new discussion thread.
- **Security** – Report vulnerabilities privately by following the steps outlined in [SECURITY.md](SECURITY.md).

## License

This project is released under the [MIT License](LICENSE). OpenBadge Reader is maintained by [Kosm.io](https://kosm.io/).
