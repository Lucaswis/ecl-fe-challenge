# Eclypsium Frontend Challenge — Asset Dashboard

Frontend solution for the Eclypsium Sr. Frontend Engineer challenge: a dashboard to list, filter, and inspect assets and the vulnerabilities found on them.

## What's here

- **Asset listing** with filters by name/description, date range, and severity, plus pagination. This is the one hard requirement from the brief.
- **Asset detail view**: click an asset to see its components (in an accordion) and its full vulnerability list.
- **Severity aggregation**: the listing shows each asset's highest severity and vulnerability count, computed server-side from the raw per-asset vulnerability data the mock backend exposes.
- **Theme toggle** (light/dark) and a **language toggle** (ES/EN) for the app's own UI text.

None of the last three were required by the brief — they're there because they made for a more complete submission.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui + Base UI for components. Jest + Testing Library for unit/integration tests, Playwright for e2e.

## Running it

You need Docker running for the mock backend — most of the app has nothing to show without it.

```bash
# from the repo root
docker compose up -d

# in another terminal, from ecl-fe/
npm install
npm run dev
```

Open `http://localhost:3000`. The app expects the mock backend at `http://localhost:8080` by default (see `ecl-fe/.env.example` — `BACKEND_URL`, server-side only, never exposed to the browser).

If Docker isn't running, the app doesn't crash — you'll see an error screen with a retry button, which is intentional (it's one of the things the app is built to handle gracefully, not a bug).

## Testing

All from `ecl-fe/`:

```bash
npm test                  # unit + integration (Jest), no Docker needed
npm run test:e2e          # e2e against the real mock backend — needs Docker up
npm run test:e2e:error    # e2e against a deliberately unreachable backend, covers the error/retry flow
```

## A few things worth knowing

- The mock backend (`backend-mock/expectations.json`) only implements a simplified version of the model described in the challenge PDF — there's no `Scan` or `Threat` entity, vulnerabilities come back as a flat list per asset. The app is built against what the mock actually returns, not the full PDF model.
- One asset in the mock (`asset-13`) has its vulnerabilities endpoint deliberately return a 500. That's on purpose — it's there so the "one asset's data failed to load, the rest of the table still works" behavior is actually exercised, not just claimed.
- Severity aggregation happens through a small internal API route (`/api/assets`) that isn't called by the app itself — `page.tsx` calls the same aggregation function directly, since routing a server component through its own API would just add a pointless network hop. The route exists as a standalone, independently testable piece showing how the N+1 problem (one vulnerability fetch per asset) gets solved, in case that's useful to look at on its own.

## Mock backend reference

The mock is a [MockServer](https://www.mock-server.com/) instance seeded from `backend-mock/expectations.json`.

**Endpoints**

- `GET /assets` — list all assets
- `GET /assets/{id}` — asset detail, including its component IDs
- `GET /assets/{id}/vulnerabilities` — vulnerabilities for an asset
- `GET /assets/{assetId}/components/{componentId}` — component detail

Edit `backend-mock/expectations.json` directly if you want to change the sample data.

```bash
curl http://localhost:8080/assets
```
