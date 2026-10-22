import type { Access } from 'payload'

const signedIn: Access = ({ req }) => Boolean(req.user)

// Site content: everyone reads it (the site fetches it), only signed-in users edit it
export const publicRead = {
  read: () => true,
  create: signedIn,
  update: signedIn,
  delete: signedIn,
}

// With 2FA (--2fa, payload-totp) every access check first requires a verified code.
// These marks keep the public parts public: anonymous reads of site content and new leads.
export const publicReadCustom = { totp: { disableAccessWrapper: { read: true } } }
export const publicCreateCustom = { totp: { disableAccessWrapper: { create: true } } }
