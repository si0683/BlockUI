// Removes the authenticator app of a user who lost their phone: run on the server,
//   cd cms && npm run reset-2fa -- user@example.com
// The user signs in with the password and sets up the app again.
import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.argv.slice(2).find((arg) => arg.includes('@'))
if (!email) {
  console.error('Usage: npm run reset-2fa -- user@example.com')
  process.exit(1)
}

const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})
if (!docs[0]) {
  console.error(`User ${email} not found`)
  process.exit(1)
}
await payload.update({
  collection: 'users',
  id: docs[0].id,
  data: { totpSecret: null } as Record<string, unknown>,
  overrideAccess: true,
})
console.log(`2FA removed for ${email}: sign in with the password and set up the app again`)
process.exit(0)
