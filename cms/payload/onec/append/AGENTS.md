
## Exchange with 1C

This project was created with `--1c`. Details: `1C.md`.

- CMS: `cms/src/addons/integrations.ts` registers the `exchange-log` collection and `GET/POST /api/1c/exchange` (CommerceML 2.x, "Обмен с сайтом"). Code in `cms/src/onec/`: `exchange.ts` (protocol modes), `catalog.ts` (import/offers/prices/rests, batches of `ONEC_BATCH`), `sale.ts` (orders to 1C, statuses from 1C), `auth.ts` (Basic auth `ONEC_LOGIN`/`ONEC_PASSWORD`, session cookie), `storage.ts` (`cms/.1c-exchange/`, path checks), `xml.ts` (fast-xml-parser, UTF-8/windows-1251).
- Products and categories are matched by `externalId`; never touch products without it. New products stay hidden until a price arrives; visibility of 1C products is set by price > 0 and the deletion mark.
- Keep `exchangePath()` for every file name that comes from 1C, and keep the exchange working without a signed-in user (it authenticates with its own login).
