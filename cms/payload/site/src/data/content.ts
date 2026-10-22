import * as fallback from "./site"

// Page content from Payload CMS (cms/). The REST API is read when a page is rendered:
// on every request in `npm run dev`, once per `npm run build` for the static site.
// If the CMS is not running, the demo content of src/data/site.ts is used and a warning is printed.
export type Content = {
  site: typeof fallback.site
  features: typeof fallback.features
  plans: typeof fallback.plans
  reviews: typeof fallback.reviews
  faq: typeof fallback.faq
}

export const CMS_URL = (
  import.meta.env.PUBLIC_CMS_URL || "http://localhost:3000"
).replace(/\/$/, "")

type Docs<T> = { docs: T[] }

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${CMS_URL}/api/${path}`)
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}: ${path}`)
  return response.json() as Promise<T>
}

const list = <T>(collection: string) =>
  api<Docs<T>>(`${collection}?sort=order&limit=100&depth=0`).then(
    (data) => data.docs
  )

export async function getContent(): Promise<Content> {
  try {
    const [site, features, plans, reviews, faq] = await Promise.all([
      api<Content["site"]>("globals/site?depth=0"),
      list<Content["features"][number]>("features"),
      list<{
        name: string
        price: string
        text?: string
        popular?: boolean
        items?: { text: string }[]
      }>("plans"),
      list<Content["reviews"][number]>("reviews"),
      list<Content["faq"][number]>("faq"),
    ])
    return {
      site: {
        ...fallback.site,
        ...site,
        nav: site.nav?.length ? site.nav : fallback.site.nav,
      },
      features,
      plans: plans.map((plan) => ({
        name: plan.name,
        price: plan.price,
        text: plan.text ?? "",
        items: (plan.items ?? []).map((item) => item.text),
        popular: Boolean(plan.popular),
      })),
      reviews,
      faq,
    }
  } catch (error) {
    console.warn(
      `[cms] ${CMS_URL} is not available, using src/data/site.ts —`,
      (error as Error).message
    )
    return { ...fallback }
  }
}
