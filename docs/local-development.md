# Local Development

StyleOS Creator Studio CE v0.2 runs as a local-first Next.js app. It is not StyleOS Cloud.

## Requirements

- Node.js compatible with Next.js 14.
- npm.
- A local browser with localStorage enabled.

## Install

```bash
npm install
```

## Run Dev Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Lint

v0.2 does not configure a lint script. If a future version adds one, run:

```bash
npm run lint
```

## Reset Local Data

Use the Dashboard action:

```text
Dashboard -> Reset Local Data
```

This clears CE localStorage records and restores the synthetic seed creator and seed Hairstyle Suitability Card service.

Manual browser reset method:

1. Open browser devtools.
2. Open Application / Storage.
3. Remove localStorage keys starting with `styleos_ce_`.
4. Reload `http://localhost:3000`.

## Known Limitations

- No StyleOS Cloud account.
- No production database.
- No payment flow.
- No real AI API.
- No real image upload.
- No real authentication or permission model.
- No external UI framework.
- Local browser data can be cleared by the user or browser.
- Hairstyle rules are starter `E0` seed rules and require creator review before any real use.
- Shared report links are local-only and do not provide real access control.
