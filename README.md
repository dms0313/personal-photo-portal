# Personal Photo Portal

A single-owner photo portal built on Vite + React + TypeScript. The UI now includes a private login flow so you can manage uploads, drafts, and featured images without exposing controls to visitors.

## Getting started

```bash
pnpm install
pnpm dev
```

Visit the app at the printed localhost URL. Toggle light/dark mode from the header.

## Owner login

Set an owner passcode so the management controls unlock only for you:

```bash
export VITE_OWNER_PASSWORD="a-strong-passcode"
# Optional: label the signed-in account in the UI
export VITE_OWNER_EMAIL="you@example.com"
```

Restart the dev server after changing environment variables. Successful logins are stored in `localStorage` so you stay signed in on the same browser.
