# Legal Info Assistant — MVP (LA/California Employment)

This is a one-week MVP that delivers **neutral, non-advisory** legal information.
It follows Mihai's structure: confirm prohibition → what many people do → where info is found → similar cases (if applicable) → disclaimer.

## Tech Stack
- Next.js (App Router)
- API Route: `/api/answer` calls OpenAI
- Data: `/data/sources.json` (public source pointers)
- Weekly updater: `npm run update:sources`

## Quick Start
1. Install deps
   ```bash
   npm install
   ```
2. Copy env file
   ```bash
   cp .env.sample .env.local
   # Fill OPENAI_API_KEY
   ```
3. Dev
   ```bash
   npm run dev
   # open http://localhost:3000
   ```

## Deploy on Vercel
- Push this folder to GitHub.
- In Vercel: "New Project" → import → add env var `OPENAI_API_KEY`.
- Deploy.

## Updating Sources (Weekly)
- For demo: `npm run update:sources` (adds last_checked_at).
- In production: extend `scripts/update_sources.mjs` to fetch and summarize official pages (CRD/EEOC/etc.).

## Safety
- Output avoids legal analysis or code sections.
- Always includes disclaimer.
- Routes by topic and prefers LA → CA → Federal sources.
"# legal-assistant-mvp" 
