# Usage guide

This guide explains how to verify Open Badges with OpenBadge Reader and how to interpret the results provided by the
application.

## Supported inputs

OpenBadge Reader works entirely in the browser. You can provide badge data in several formats:

- **JSON files** exported directly from an issuer platform.
- **PNG or SVG images** with embedded Open Badge metadata.
- **Public URLs** that resolve to badge JSON documents.

> ℹ️ The demo build ships with a mocked verification flow that returns a sample badge if parsing fails. This allows you to
> explore the interface while proper validation features are under construction.

## Uploading a badge

1. Click **Choisir un fichier** or drag & drop a badge file into the upload zone.
2. Alternatively, paste a badge URL in the form field and submit it.
3. The interface shows a loading indicator while parsing takes place. Successful parsing redirects you to the results view.

## Reading the results

The results page surfaces multiple sections:

- **Badge summary** – Title, description, version, and status of the badge.
- **Issuer** – Organisation name, verification URL, and contact details.
- **Recipient** – Name, email, and hashed identity (if present).
- **Evidence** – Supporting documents or links provided by the issuer.
- **Validity** – Issuance and expiration dates.
- **Raw JSON** – Collapsible section exposing the original credential payload for advanced users.

## Troubleshooting

| Symptom | Possible cause | Suggested fix |
| --- | --- | --- |
| The badge fails to parse and a demo badge appears. | The file or URL is malformed, or a CORS error occurred. | Ensure the badge conforms to Open Badge specs or try downloading and uploading the JSON manually. |
| Evidence links do not open. | The issuer-provided URL is unavailable. | Validate the link externally or contact the issuer. |
| Uploaded badge disappears after refresh. | Badge data is stored in browser memory/local storage for the session only. | Re-upload the badge or share the generated result link immediately after verification. |

## Privacy considerations

- Badge files are processed locally in the browser; no badge data leaves your device by default.
- Temporary storage is powered by `localStorage` solely for sharing across routes. Clearing your browser storage removes cached
  badges.
- Avoid uploading badges on shared or untrusted devices.

## Keyboard navigation & accessibility

- Buttons, dialogs, and form controls follow accessible semantics provided by shadcn/ui primitives.
- Toast notifications announce outcomes but do not block navigation.
- Future milestones include dedicated accessibility testing and screen-reader verification.

## Next steps

- Explore the [architecture](architecture.md) to understand how parsing is implemented.
- Review the [contribution guidelines](../CONTRIBUTING.md) if you plan to improve usability or implement full verification.
