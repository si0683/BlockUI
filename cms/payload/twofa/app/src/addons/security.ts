import type { Plugin } from 'payload'
import { payloadTotp } from 'payload-totp'

// Two-factor sign-in to the admin panel (--2fa): a 6-digit code from an authenticator app
// (Яндекс Ключ, Google Authenticator, Aegis…). https://github.com/GeorgeHulpoi/payload-totp
// The plugin wraps the access of every collection, so it must stay the last plugin;
// public reads and new leads are kept open by `custom.totp.disableAccessWrapper` (src/access.ts).
export const securityPlugins: Plugin[] = [
  payloadTotp({
    collection: 'users',
    // true — every user must set up the app before working in the admin panel (cms/.env)
    forceSetup: process.env.TOTP_REQUIRED === 'true',
    totp: { issuer: process.env.TOTP_ISSUER || 'CMS' },
    forceWhiteBackgroundOnQrCode: true,
  }),
]
