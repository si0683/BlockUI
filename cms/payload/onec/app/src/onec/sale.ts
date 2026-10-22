import type { Payload } from 'payload'

import { loadState, saveState } from './storage'
import { escapeXml as x, list, readXml, str, type Node } from './xml'

// Orders handed to 1C per "sale/query"; the rest go in the next exchange
const LIMIT = 100

const STATUS: Record<string, string> = {
  new: 'Новый',
  paid: 'Оплачен',
  processing: 'В работе',
  shipped: 'Отгружен',
  done: 'Выполнен',
  canceled: 'Отменён',
}

const pad = (n: number) => String(n).padStart(2, '0')
const date = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const time = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

const requisite = (name: string, value: unknown) =>
  `<ЗначениеРеквизита><Наименование>${x(name)}</Наименование><Значение>${x(value)}</Значение></ЗначениеРеквизита>`

/** mode=query: shop orders not yet sent to 1C, as CommerceML documents */
export async function exportOrders(payload: Payload): Promise<string> {
  const { docs } = await payload.find({
    collection: 'shop-orders',
    where: { exportedAt: { exists: false } },
    sort: 'createdAt',
    limit: LIMIT,
    depth: 0,
  })
  const state = loadState()
  state.salePending = docs.map((order) => order.id)
  saveState(state)

  const now = new Date()
  const documents = docs.map((order) => {
    const created = new Date(order.createdAt)
    const contacts = [
      `<Контакт><Тип>Телефон рабочий</Тип><Значение>${x(order.phone)}</Значение></Контакт>`,
      order.email ? `<Контакт><Тип>Почта</Тип><Значение>${x(order.email)}</Значение></Контакт>` : '',
    ].join('')
    const items = order.items
      .map(
        (item) =>
          `<Товар><Ид>${x(item.externalId || `site-${item.product ?? item.sku ?? item.name}`)}</Ид>` +
          `<Артикул>${x(item.sku)}</Артикул><Наименование>${x(item.name)}</Наименование>` +
          '<БазоваяЕдиница Код="796" НаименованиеПолное="Штука" МеждународноеСокращение="PCE">шт</БазоваяЕдиница>' +
          `<ЦенаЗаЕдиницу>${item.price}</ЦенаЗаЕдиницу><Количество>${item.qty}</Количество><Сумма>${item.price * item.qty}</Сумма>` +
          `<ЗначенияРеквизитов>${requisite('ВидНоменклатуры', 'Товар')}${requisite('ТипНоменклатуры', 'Товар')}</ЗначенияРеквизитов></Товар>`,
      )
      .join('')
    const requisites = [
      requisite('Статус заказа', STATUS[order.status ?? 'new'] ?? order.status),
      requisite('Заказ оплачен', order.paidAt ? 'true' : 'false'),
      order.paidAt ? requisite('Дата оплаты', date(new Date(order.paidAt))) : '',
      order.provider ? requisite('Метод оплаты', order.provider) : '',
      order.paymentId ? requisite('Номер платежного документа', order.paymentId) : '',
      requisite('Отменен', order.status === 'canceled' ? 'true' : 'false'),
      requisite('Сайт', 'LightWebsiteUi'),
    ].join('')
    return (
      `<Документ><Ид>${order.id}</Ид><Номер>${order.id}</Номер><Дата>${date(created)}</Дата><Время>${time(created)}</Время>` +
      '<ХозОперация>Заказ товара</ХозОперация><Роль>Продавец</Роль><Валюта>руб</Валюта><Курс>1</Курс>' +
      `<Сумма>${order.total}</Сумма>` +
      `<Контрагенты><Контрагент><Ид>${x(order.phone)}</Ид><Наименование>${x(order.name)}</Наименование>` +
      `<ПолноеНаименование>${x(order.name)}</ПолноеНаименование><Роль>Покупатель</Роль>` +
      (order.address ? `<АдресРегистрации><Представление>${x(order.address)}</Представление></АдресРегистрации>` : '') +
      `<Контакты>${contacts}</Контакты></Контрагент></Контрагенты>` +
      `<Комментарий>${x(order.comment)}</Комментарий>` +
      `<Товары>${items}</Товары><ЗначенияРеквизитов>${requisites}</ЗначенияРеквизитов></Документ>`
    )
  })
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<КоммерческаяИнформация ВерсияСхемы="2.08" ДатаФормирования="${date(now)}T${time(now)}">` +
    documents.join('') +
    '</КоммерческаяИнформация>'
  )
}

/** mode=success: 1C has saved the orders from the last query */
export async function markExported(payload: Payload): Promise<number> {
  const state = loadState()
  const ids = state.salePending ?? []
  const exportedAt = new Date().toISOString()
  for (const id of ids) {
    await payload.update({ collection: 'shop-orders', id, data: { exportedAt }, depth: 0 }).catch(() => null)
  }
  state.salePending = []
  saveState(state)
  return ids.length
}

/** sale, mode=file: order changes from 1C — paid, shipped or canceled */
export async function importOrderChanges(payload: Payload, file: string): Promise<number> {
  const root = readXml(file)?.['КоммерческаяИнформация']
  let changed = 0
  for (const doc of list(root?.['Документ'])) {
    const order = await findOrder(payload, doc)
    if (!order) continue
    const values = new Map<string, string>(
      list(doc['ЗначенияРеквизитов']?.['ЗначениеРеквизита']).map((entry: Node) => [
        str(entry['Наименование']).toLowerCase(),
        str(entry['Значение']),
      ]),
    )
    const yes = (name: string) => values.get(name) === 'true'
    const filled = (name: string) => Boolean(values.get(name)) && !values.get(name)!.startsWith('0001-01-01')

    const data: Record<string, unknown> = {}
    if (yes('отменен') || doc['ПометкаУдаления'] === 'true') data.status = 'canceled'
    else if (yes('финальный статус') || filled('дата отгрузки')) data.status = 'shipped'
    else if ((yes('заказ оплачен') || filled('дата оплаты')) && order.status === 'new') data.status = 'paid'
    if (data.status === 'paid' && !order.paidAt) data.paidAt = new Date().toISOString()
    if (data.status && data.status !== order.status) {
      await payload.update({ collection: 'shop-orders', id: order.id, data, depth: 0 })
      changed++
    }
  }
  return changed
}

/** The site's order number is in "Номер" (or "Ид" when 1C keeps ours) */
async function findOrder(payload: Payload, doc: Node) {
  for (const value of [str(doc['Номер']), str(doc['Ид'])]) {
    if (!/^\d+$/.test(value)) continue
    const order = await payload.findByID({ collection: 'shop-orders', id: Number(value), depth: 0 }).catch(() => null)
    if (order) return order
  }
  return null
}
