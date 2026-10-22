import { readFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'

// Elements that can repeat in CommerceML 2.x and must always be arrays
const ARRAYS = [
  'Группы.Группа',
  'Товар.Группы.Ид',
  'Товары.Товар',
  'Товар.Картинка',
  'Свойства.Свойство',
  'ВариантыЗначений.Справочник',
  'ЗначенияСвойств.ЗначенияСвойства',
  'ХарактеристикиТовара.ХарактеристикаТовара',
  'ЗначенияРеквизитов.ЗначениеРеквизита',
  'ТипыЦен.ТипЦены',
  'Предложения.Предложение',
  'Цены.Цена',
  'Предложение.Склад',
  'Остатки.Остаток',
  'КоммерческаяИнформация.Документ',
  'Документ.Товары.Товар',
]

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  isArray: (_name, jpath) => ARRAYS.some((suffix) => String(jpath).endsWith(suffix)),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node = any

export const parseXml = (text: string): Node => parser.parse(text)

/** 1C writes CommerceML in UTF-8 or windows-1251 — the encoding is taken from the XML declaration */
export function readXml(file: string): Node {
  const bytes = readFileSync(file)
  const head = bytes.subarray(0, 200).toString('latin1')
  const encoding = /encoding=["']([\w-]+)["']/i.exec(head)?.[1]?.toLowerCase() ?? 'utf-8'
  return parseXml(new TextDecoder(encoding === 'utf-8' ? 'utf-8' : encoding).decode(bytes))
}

export const list = <T = Node>(value: T | T[] | undefined | null): T[] =>
  value === undefined || value === null || value === '' ? [] : Array.isArray(value) ? value : [value]

export const str = (value: unknown): string =>
  value === undefined || value === null ? '' : typeof value === 'object' ? String((value as Node)['#text'] ?? '') : String(value)

/** "1 500,50" / "1500.50" → 1500.5 */
export const num = (value: unknown): number => {
  const parsed = parseFloat(str(value).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export const escapeXml = (text: unknown) =>
  str(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
