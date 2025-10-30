# Security policy

## Supported versions

OpenBadge Reader is currently under active development. Security fixes are applied to the default branch (`main`). When tagged
releases become available, this document will list supported versions explicitly.

## Reporting a vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue.
2. Email the maintainers at [security@kosm.io](mailto:security@kosm.io) with details of the vulnerability.
3. Include information that helps us reproduce the issue (affected component, steps to trigger, potential impact).
4. Encrypt communications if possible; request our PGP key in your first message.

We aim to acknowledge vulnerability reports within **5 business days**. After assessment and remediation, we will coordinate a
disclosure timeline with you. Credit will be given in release notes unless you prefer to remain anonymous.

## Security best practices for users

- Always download builds from trusted sources (official GitHub releases or Kosm.io infrastructure).
- Verify the integrity of downloaded assets when checksums or signatures are provided.
- Avoid uploading sensitive badge data on shared devices.

## Dependency management

We rely on npm advisories, Dependabot alerts, and community reports to track vulnerabilities in dependencies. Contributions that
upgrade packages should mention relevant security fixes in the pull request description.
