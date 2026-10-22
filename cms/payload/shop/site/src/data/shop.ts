// Shop catalog from Payload CMS (cms/: categories, products). Read when a page is rendered:
// on every request in `npm run dev`, once per `npm run build` for the static site.
export const CMS_URL = (
  import.meta.env.PUBLIC_CMS_URL || "http://localhost:3000"
).replace(/\/$/, "")

export type Category = {
  id: number | string
  name: string
  slug: string
  parent?: number | string | null
}

export type Product = {
  id: number | string
  name: string
  slug: string
  sku?: string | null
  price: number
  oldPrice?: number | null
  stock: number
  description?: string | null
  category?: Category | null
  images: { url: string; alt: string }[]
  attributes: { name: string; value: string }[]
}

type Media = { url?: string | null; alt?: string | null }
type RawProduct = Omit<Product, "images" | "category" | "attributes"> & {
  images?: (Media | number | string)[] | null
  category?: Category | number | string | null
  attributes?: { name: string; value: string }[] | null
}

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${CMS_URL}/api/${path}`)
  if (!response.ok) throw new Error(`${response.status}: ${path}`)
  return response.json() as Promise<T>
}

/** All documents of a collection, page by page */
async function all<T>(collection: string, query: string): Promise<T[]> {
  const docs: T[] = []
  for (let page = 1; ; page++) {
    const data = await api<{ docs: T[]; hasNextPage: boolean }>(
      `${collection}?${query}&limit=100&page=${page}`
    )
    docs.push(...data.docs)
    if (!data.hasNextPage) return docs
  }
}

const toProduct = (raw: RawProduct): Product => ({
  ...raw,
  stock: raw.stock ?? 0,
  category: typeof raw.category === "object" ? raw.category : null,
  attributes: raw.attributes ?? [],
  images: (raw.images ?? [])
    .filter(
      (image): image is Media => typeof image === "object" && !!image?.url
    )
    .map((image) => ({
      url: image.url!.startsWith("http")
        ? image.url!
        : `${CMS_URL}${image.url}`,
      alt: image.alt || raw.name,
    })),
})

let warned = false
async function safe<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load()
  } catch (error) {
    if (!warned) {
      console.warn(
        `[shop] ${CMS_URL} is not available —`,
        (error as Error).message
      )
      warned = true
    }
    return fallback
  }
}

export const getCategories = () =>
  safe(() => all<Category>("categories", "sort=order&depth=0"), [])

export const getProducts = () =>
  safe(
    async () =>
      (
        await all<RawProduct>(
          "products",
          "where[active][equals]=true&sort=name&depth=1"
        )
      ).map(toProduct),
    []
  )
