# Asset Dashboard

Frontend for the Eclypsium Sr. Frontend Engineer challenge: a dashboard to list, filter, and inspect assets and the vulnerabilities found on them. See the repo root [README](../README.md) for the original challenge brief and mock backend details.

## What's here

- **Asset listing** with filters by name/description, date range, and severity, plus pagination. This is the one hard requirement from the brief.
- **Asset detail view**: click an asset to see its components (in an accordion) and its full vulnerability list.
- **Severity aggregation**: the listing shows each asset's highest severity and vulnerability count, computed server-side from the raw per-asset vulnerability data the mock backend exposes — resolved with a single `Promise.allSettled` fan-out so one asset's failed lookup doesn't take down the rest of the table.
- **Theme toggle** (light/dark) and a **language toggle** (ES/EN) for the app's own UI text.
- **Create and delete assets**, entirely client-side. See below for why.

None of these were required by the brief — they're there because they made for a more complete submission.

### About create/delete

The mock backend only exposes `GET` endpoints — there's nowhere to actually persist a new asset or a deletion. Rather than fake a backend that doesn't really save anything either, creating and deleting assets here is honest about what it is: in-memory state that resets on page reload. Delete removes a row (real or newly-created) from view without touching the mock. Create opens a form for the asset's base fields plus its components and vulnerabilities, and the result shows up in the table exactly like a real asset — same filtering, same pagination, same severity badge, and its detail page renders through the identical components a real asset uses. Refresh the page and everything you created or deleted is back to how the mock actually has it.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui + Base UI for components. Jest + Testing Library for unit/integration tests, Playwright for e2e.

## Running it

You need Docker running for the mock backend — most of the app has nothing to show without it.

```bash
# from the repo root
docker compose up -d

# from here (ecl-fe/)
npm install
npm run dev
```

Open `http://localhost:3000`. It talks to the mock backend at `http://localhost:8080` out of the box — no `.env` file needed for the default setup. If you want to point it somewhere else, copy `.env.example` to `.env.local` and set `BACKEND_URL` (server-side only, never exposed to the browser).

If Docker isn't running, the app doesn't crash — you'll see an error screen with a retry button, which is intentional (it's one of the things the app is built to handle gracefully, not a bug).

## Testing

```bash
npm test                  # unit + integration (Jest), no Docker needed
npm run test:e2e          # e2e against the real mock backend — needs Docker up
npm run test:e2e:error    # e2e against a deliberately unreachable backend, covers the error/retry flow
```

## A few things worth knowing

- The mock backend only implements a simplified version of the model described in the challenge PDF — there's no `Scan` or `Threat` entity, vulnerabilities come back as a flat list per asset. The app is built against what the mock actually returns, not the full PDF model.
- One asset in the mock (`asset-13`) has its vulnerabilities endpoint deliberately return a 500. That's on purpose — it's there so the "one asset's data failed to load, the rest of the table still works" behavior is actually exercised, not just claimed.
