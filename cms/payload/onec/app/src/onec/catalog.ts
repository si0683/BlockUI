import { existsSync } from 'fs'
import type { Payload } from 'payload'

import { slugify } from '../lib/slug'
import { exchangePath, loadState, saveState, type State } from './storage'
import { list, num, readXml, str, type Node } from './xml'

// Products handled by one "import" request: 1C repeats the request while the answer is "progress"
const BATCH = Number(process.env.ONEC_BATCH) || 100

const priceType = (process.env.ONEC_PRICE_TYPE || '').trim()
const oldPriceType = (process.env.ONEC_OLD_PRICE_TYPE || '').trim()

export type ImportResult = { done: boolean; message: string }

type Exchange = State & { seen?: string[]; deleted?: string[]; full?: boolean; deactivated?: boolean }

/** mode=import: import*.xml (catalog) or offers/prices/rests*.xml (prices and stock) */
export async function importFile(payload: Payload, filename: string): Promise<ImportResult> {
  const file = exchangePath(filename)
  if (!file || !existsSync(file)) return { done: false, message: `Нет файла ${filename}` }
  const root = readXml(file)?.['КоммерческаяИнформация']
  if (!root) return { done: false, message: `${filename}: это не CommerceML` }

  const state = loadState() as Exchange
  const job = (state.jobs[filename] ??= { stage: 'start', index: 0 })
  let result: ImportResult
  if (root['Классификатор'] || root['Каталог']) result = await importCatalog(payload, root, job, state)
  else if (root['ПакетПредложений']) result = await importOffers(payload, root['ПакетПредложений'], job, state)
  else result = { done: true, message: `${filename}: нечего загружать` }
  if (result.done) delete state.jobs[filename]
  saveState(state)
  return result
}

// ── import.xml: groups → categories, products → products ─────────────────────

type Job = State['jobs'][string]

async function importCatalog(payload: Payload, root: Node, job: Job, state: Exchange): Promise<ImportResult> {
  const classifier = root['Классификатор'] ?? {}
  const catalog = root['Каталог'] ?? {}

  if (job.stage === 'start') {
    let count = 0
    const walk = async (groups: Node, parent?: number) => {
      for (const group of list(groups?.['Группа'])) {
        const id = await upsertCategory(payload, str(group['Ид']), str(group['Наименование']), parent, count++)
        await walk(group['Группы'], id)
      }
    }
    await walk(classifier['Группы'])
    job.stage = 'products'
    job.index = 0
    return { done: false, message: `Категории: ${count}` }
  }

  // "Только изменения" = false: the file has the whole catalog, products missing from it are hidden later
  const onlyChanges = str(catalog['@СодержитТолькоИзменения'] ?? catalog['СодержитТолькоИзменения'] ?? 'true')
  if (onlyChanges === 'false') state.full = true

  const properties = readProperties(classifier)
  const products = list(catalog['Товары']?.['Товар'])
  const batch = products.slice(job.index, job.index + BATCH)
  for (const item of batch) await upsertProduct(payload, item, properties, state)
  job.index += batch.length
  const done = job.index >= products.length
  return { done, message: `Товары: ${job.index} из ${products.length}` }
}

async function upsertCategory(payload: Payload, externalId: string, name: string, parent: number | undefined, order: number) {
  const { docs } = await payload.find({ collection: 'categories', where: { externalId: { equals: externalId } }, limit: 1, depth: 0 })
  const data = { name, parent: parent ?? null, order }
  if (docs[0]) {
    await payload.update({ collection: 'categories', id: docs[0].id, data })
    return docs[0].id
  }
  const slug = await freeSlug(payload, 'categories', name, externalId)
  return (await payload.create({ collection: 'categories', data: { ...data, slug, externalId } })).id
}

type Properties = { names: Map<string, string>; values: Map<string, string> }

function readProperties(classifier: Node): Properties {
  const names = new Map<string, string>()
  const values = new Map<string, string>()
  for (const property of list(classifier['Свойства']?.['Свойство'])) {
    names.set(str(property['Ид']), str(property['Наименование']))
    for (const option of list(property['ВариантыЗначений']?.['Справочник'])) {
      values.set(str(option['ИдЗначения']), str(option['Значение']))
    }
  }
  return { names, values }
}

async function upsertProduct(payload: Payload, item: Node, properties: Properties, state: Exchange) {
  const externalId = str(item['Ид']).split('#')[0]
  if (!externalId) return
  state.seen = [...new Set([...(state.seen ?? []), externalId])]

  const deleted = str(item['@Статус'] ?? item['Статус']) === 'Удален' || str(item['ПометкаУдаления']) === 'true'
  if (deleted) state.deleted = [...new Set([...(state.deleted ?? []), externalId])]

  const groupId = str(list(item['Группы']?.['Ид'])[0])
  let category: number | null = null
  if (groupId) {
    const { docs } = await payload.find({ collection: 'categories', where: { externalId: { equals: groupId } }, limit: 1, depth: 0 })
    category = docs[0]?.id ?? null
  }

  const attributes = list(item['ЗначенияСвойств']?.['ЗначенияСвойства'])
    .map((entry: Node) => {
      const name = properties.names.get(str(entry['Ид'])) ?? ''
      const raw = str(entry['Значение'])
      return { name, value: properties.values.get(raw) ?? raw }
    })
    .filter((entry) => entry.name && entry.value)

  const name = str(item['Наименование']) || externalId
  const data: Record<string, unknown> = {
    name,
    sku: str(item['Артикул']) || undefined,
    category,
    description: str(item['Описание']) || undefined,
    attributes,
  }
  if (deleted) data.active = false

  const { docs } = await payload.find({ collection: 'products', where: { externalId: { equals: externalId } }, limit: 1, depth: 0 })
  let product = docs[0]
  if (product) {
    product = await payload.update({ collection: 'products', id: product.id, data, depth: 0 })
  } else {
    // A new product is hidden until offers.xml brings its price
    const slug = await freeSlug(payload, 'products', name, externalId)
    product = await payload.create({
      collection: 'products',
      data: { ...data, name, slug, externalId, price: 0, stock: 0, active: false },
      depth: 0,
    })
  }
  await syncImages(payload, product, list(item['Картинка']).map(str).filter(Boolean), name)
}

/** Pictures from import_files/…: uploaded to "Файлы" once, re-uploaded only when the list changes */
async function syncImages(payload: Payload, product: { id: number; syncedImages?: string | null }, pictures: string[], alt: string) {
  const key = pictures.join('|')
  if ((product.syncedImages ?? '') === key) return
  const images: number[] = []
  for (const picture of pictures) {
    const file = exchangePath(picture)
    if (!file || !existsSync(file)) continue
    const media = await payload.create({ collection: 'media', data: { alt }, filePath: file })
    images.push(media.id)
  }
  // Pictures were promised but not sent yet: try again on the next exchange
  const complete = images.length === pictures.length
  await payload.update({
    collection: 'products',
    id: product.id,
    data: { images, syncedImages: complete ? key : '' },
    depth: 0,
  })
}

async function freeSlug(payload: Payload, collection: 'categories' | 'products', name: string, externalId: string) {
  const slug = slugify(name)
  const { totalDocs } = await payload.count({ collection, where: { slug: { equals: slug } } })
  return totalDocs ? `${slug}-${slugify(externalId).slice(0, 8)}` : slug
}

// ── offers.xml / prices.xml / rests.xml: prices and stock ───────────────────

type Offer = { price?: number; oldPrice?: number; stock?: number }

async function importOffers(payload: Payload, pack: Node, job: Job, state: Exchange): Promise<ImportResult> {
  const types = list(pack['ТипыЦен']?.['ТипЦены'])
  const findType = (name: string) => types.find((type: Node) => str(type['Наименование']) === name)
  const main = priceType ? findType(priceType) : types[0]
  if (priceType && !main && types.length) {
    return { done: false, message: `Нет типа цен «${priceType}» (ONEC_PRICE_TYPE). В файле: ${types.map((t: Node) => str(t['Наименование'])).join(', ')}` }
  }
  const mainId = str(main?.['Ид'])
  const oldId = oldPriceType ? str(findType(oldPriceType)?.['Ид']) : ''

  // Offers of one product's characteristics ("<товар>#<характеристика>") are merged:
  // the lowest price and the total stock
  const offers = new Map<string, Offer>()
  for (const entry of list(pack['Предложения']?.['Предложение'])) {
    const externalId = str(entry['Ид']).split('#')[0]
    if (!externalId) continue
    const offer = offers.get(externalId) ?? {}
    for (const price of list(entry['Цены']?.['Цена'])) {
      const value = num(price['ЦенаЗаЕдиницу'])
      const typeId = str(price['ИдТипаЦены'])
      if (typeId === mainId || (!mainId && offer.price === undefined)) offer.price = Math.min(offer.price ?? value, value)
      if (oldId && typeId === oldId) offer.oldPrice = Math.max(offer.oldPrice ?? 0, value)
    }
    const stock = readStock(entry)
    if (stock !== undefined) offer.stock = (offer.stock ?? 0) + stock
    offers.set(externalId, offer)
  }

  const entries = [...offers.entries()]
  const batch = entries.slice(job.index, job.index + BATCH)
  const deleted = new Set(state.deleted ?? [])
  for (const [externalId, offer] of batch) {
    const { docs } = await payload.find({ collection: 'products', where: { externalId: { equals: externalId } }, limit: 1, depth: 0 })
    if (!docs[0]) continue
    const data: Record<string, unknown> = {}
    if (offer.stock !== undefined) data.stock = Math.max(0, Math.floor(offer.stock))
    if (offer.price !== undefined) {
      data.price = offer.price
      data.active = offer.price > 0 && !deleted.has(externalId)
      if (oldId) data.oldPrice = offer.oldPrice && offer.oldPrice > offer.price ? offer.oldPrice : null
    }
    if (Object.keys(data).length) await payload.update({ collection: 'products', id: docs[0].id, data, depth: 0 })
  }
  job.index += batch.length
  if (job.index < entries.length) return { done: false, message: `Предложения: ${job.index} из ${entries.length}` }

  // Full catalog: products from 1C that were not in it are hidden (manual products stay)
  if (state.full && !state.deactivated && state.seen?.length) {
    const hidden = await payload.update({
      collection: 'products',
      where: { and: [{ externalId: { exists: true } }, { externalId: { not_in: state.seen } }, { active: { equals: true } }] },
      data: { active: false },
      depth: 0,
    })
    state.deactivated = true
    return { done: true, message: `Предложения: ${entries.length}, скрыто отсутствующих в 1С: ${hidden.docs.length}` }
  }
  return { done: true, message: `Предложения: ${entries.length}` }
}

function readStock(entry: Node): number | undefined {
  if (entry['Количество'] !== undefined) return num(entry['Количество'])
  const stores = list(entry['Склад'])
  if (stores.length) return stores.reduce((sum: number, store: Node) => sum + num(store['@КоличествоНаСкладе']), 0)
  const rests = list(entry['Остатки']?.['Остаток'])
  if (rests.length) {
    return rests.reduce((sum: number, rest: Node) => {
      const inStores = list(rest['Склад'])
      return sum + (inStores.length ? inStores.reduce((s: number, store: Node) => s + num(store['Количество']), 0) : num(rest['Количество']))
    }, 0)
  }
  return undefined
}
