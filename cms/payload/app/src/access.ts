import type { Access } from 'payload'

const signedIn: Access = ({ req }) => Boolean(req.user)

// Site content: everyone reads it (the site fetches it), only signed-in users edit it
export const publicRead = {
  read: () => true,
  create: signedIn,
  update: signedIn,
  delete: signedIn,
}
