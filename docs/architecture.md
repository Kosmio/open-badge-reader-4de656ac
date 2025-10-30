# Architecture overview

This document provides a high-level description of the OpenBadge Reader architecture so contributors can quickly understand how
badge data flows through the application.

## Technology stack

- **Framework**: [React 18](https://react.dev/) with [React Router](https://reactrouter.com/) for routing.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and developer tooling.
- **Build tooling**: [Vite](https://vitejs.dev/) for development and production builds.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) component primitives.
- **State management**: Local component state with hooks and lightweight utilities.

## Application layout

```
src/
├── components/
│   ├── badge-display.tsx      # Presentation of parsed badge data
│   ├── badge-parser.ts        # Wrapper around parsing utilities
│   ├── badge-uploader.tsx     # Drag-and-drop upload and URL form
│   └── ui/                    # Reusable UI primitives (buttons, cards, dialogs)
├── hooks/
│   └── use-toast.ts           # Toast notifications API
├── lib/                       # Shared configuration and helper utilities
├── pages/
│   ├── Index.tsx              # Landing page and primary verification flow
│   └── Result.tsx             # Badge results (navigated to after parsing)
├── utils/
│   ├── badge-parser.ts        # Parsing logic for file and URL inputs
│   └── badge-storage.ts       # LocalStorage-backed persistence for sharing
└── main.tsx                   # Application bootstrap, router, and providers
```

## Data flow

1. Users interact with `BadgeUploader`, providing either a local file or URL.
2. `BadgeUploader` invokes the `onBadgeUpload` callback supplied by `pages/Index.tsx`.
3. The handler uses `BadgeParser` (wrapping utilities from `src/utils`) to parse badge metadata. When parsing fails, mock data
   is returned for demo purposes.
4. Parsed badge data is stored via `BadgeStorage.saveBadge` to support sharing and navigation.
5. The user is redirected to the results page, which reads badge data from navigation state or storage to render a
   comprehensive view with `BadgeInfo` components.

## Styling and theming

- Tailwind CSS utility classes define layout and spacing.
- shadcn/ui primitives in `src/components/ui/` provide accessible components that follow a consistent design system.
- Custom gradients and shadows are declared in `tailwind.config.ts` and referenced via class names such as `shadow-glow`.

## Error handling and notifications

- Toast notifications from `useToast` inform the user of success or failure during parsing.
- Parsing utilities throw descriptive errors that are surfaced in the UI.
- When parsing fails, a mocked badge ensures the interface remains demonstrative while alerting the user to the issue.

## Future enhancements

- Replace the mock verification flow with real cryptographic validation and revocation checks.
- Add offline caching of previously verified badges with user consent.
- Expose a plugin interface for integrating external verification APIs.
- Expand localisation support beyond French by externalising copy to translation files.
