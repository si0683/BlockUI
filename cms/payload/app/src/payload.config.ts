import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Faq } from './collections/Faq'
import { Features } from './collections/Features'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Plans } from './collections/Plans'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { db } from './db'
import { paymentCollections } from './addons/payments'
import { securityPlugins } from './addons/security'
import { shopCollections, shopSeed } from './addons/shop'
import { Site } from './globals/Site'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Sites that may read content and send leads from the browser (SITE_URL, comma-separated)
const sites = (process.env.SITE_URL || 'http://localhost:4321')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)
// The CMS's own address: the admin panel sends its requests with this Origin
const cmsUrl = (process.env.CMS_URL || 'http://localhost:3000').replace(/\/$/, '')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Features, Plans, Reviews, Faq, Leads, ...paymentCollections, ...shopCollections, Media, Users],
  globals: [Site],
  editor: lexicalEditor(),
  // Admin panel in Russian (users can switch to English in their account)
  i18n: { fallbackLanguage: 'ru', supportedLanguages: { ru, en } },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  cors: sites,
  // Cookies are accepted only from these origins: the admin panel itself and the sites
  csrf: [cmsUrl, ...sites],
  sharp,
  // Must stay the last plugins (payload-totp wraps the access of everything before it)
  plugins: [...securityPlugins],
  // Demo content of the site template on the first start (empty database)
  onInit: async (payload) => {
    await seed(payload)
    await shopSeed(payload)
  },
})
