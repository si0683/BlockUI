// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  // For GitHub Pages: site = "https://<user>.github.io", base = "/<repo-name>".
  // .github/workflows/deploy.yml passes both automatically; locally the site is served from "/".
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
})
