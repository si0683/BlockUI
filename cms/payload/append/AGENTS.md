
## Payload CMS

This project was created with `--cms=payload`. Details: `PAYLOAD.md`.

- `cms/` is a separate Next.js + Payload 3 app (own package.json, tsconfig, node_modules). Payload docs: https://payloadcms.com/docs. Do not import files across `src/` ↔ `cms/`; the site talks to the CMS only over HTTP.
- Content: `cms/src/collections/*` (features, plans, reviews, faq, leads, media, users) and `cms/src/globals/Site.ts`; demo data is seeded on first start by `cms/src/seed.ts`. Site side: `src/data/content.ts` maps the REST API to the shape of `src/data/site.ts` (the fallback when the CMS is down). Keep both in sync when fields change, then run `cd cms && npm run generate:types`.
- Leads: `src/lib/leads.ts` posts to `/api/leads`; the collection allows public create only, read/update/delete for signed-in users; honeypot field `website`. Allowed origins: `SITE_URL` in `cms/.env` (CORS/CSRF).
- Access: content collections are public read, signed-in write (`cms/src/access.ts`). Never open write access to anonymous users.
- Database adapter is in `cms/src/db.ts` (SQLite file or PostgreSQL via `DATABASE_URL`). Schema changes: dev pushes automatically; production uses `npm run payload migrate:create` / `migrate`.
- Secrets stay in `.env` files (ignored by git); `.env.example` documents the variables.
- Run: `npm run cms` (port 3000) + `npm run dev` (port 4321). Check: `cd cms && npx tsc --noEmit && npm run build`, and the site checks from above.
