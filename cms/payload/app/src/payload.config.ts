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
import { extraCollections, extraEndpoints } from './extensions'
import { Site } from './globals/Site'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Sites that may read content and send leads from the browser (SITE_URL, comma-separated)
const sites = (process.env.SITE_URL || 'http://localhost:4321')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Features, Plans, Reviews, Faq, Leads, ...extraCollections, Media, Users],
  endpoints: extraEndpoints,
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
  csrf: sites,
  sharp,
  // Demo content of the site template on the first start (empty database)
  onInit: seed,
})
