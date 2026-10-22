import { faq, features, plans, reviews, site } from "./site"

// Where the page content comes from. This project keeps it in src/data/site.ts.
// Created with --cms=payload, this file loads the same shape from Payload CMS instead.
export type Content = {
  site: typeof site
  features: typeof features
  // id and amount come from the CMS (--cms=payload) and enable online payment (--pay)
  plans: ((typeof plans)[number] & { id?: string | number; amount?: number })[]
  reviews: typeof reviews
  faq: typeof faq
}

export async function getContent(): Promise<Content> {
  return { site, features, plans, reviews, faq }
}
