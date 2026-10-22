
## Two-factor sign-in (2FA)

This project was created with `--2fa`: plugin `payload-totp` in `cms/src/addons/security.ts` (docs: https://github.com/GeorgeHulpoi/payload-totp), `cms/src/proxy.ts` passes `x-pathname` to the admin panel (required by the plugin on Next 16).

- The plugin wraps the access of every collection and global: an anonymous request is refused unless the operation is marked public with `custom.totp.disableAccessWrapper` (helpers `publicReadCustom` / `publicCreateCustom` in `cms/src/access.ts`). Every new public collection needs that mark; custom endpoints and Local API calls with `overrideAccess: true` are not wrapped.
- It must stay the last plugin (`plugins: [...securityPlugins]` at the end of `payload.config.ts`).
- `TOTP_REQUIRED=true` in `cms/.env` forces every user to set up the app (`forceSetup`); `TOTP_ISSUER` is the name in the app.
- After changing plugins or admin components: `cd cms && npm run generate:importmap && npm run generate:types`.
