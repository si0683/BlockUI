import type { Plugin } from 'payload'

// Two-factor sign-in (--2fa) replaces this file with the payload-totp plugin.
// Plugins listed here go last in payload.config.ts — payload-totp requires that.
export const securityPlugins: Plugin[] = []
