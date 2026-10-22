import { appendFileSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import type { PayloadRequest } from 'payload'

import { authorized, checkBasic, COOKIE, startSession } from './auth'
import { importFile } from './catalog'
import { exportOrders, importOrderChanges, markExported } from './sale'
import { exchangePath, resetExchange } from './storage'

// Largest part of a file 1C sends in one request; bigger files come in several parts
const FILE_LIMIT = Number(process.env.ONEC_FILE_LIMIT) || 50 * 1024 * 1024

const reply = (text: string, status = 200) =>
  new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

const failure = (message: string) => reply(`failure\n${message}`)

async function log(
  req: PayloadRequest,
  type: string,
  mode: string,
  result: 'success' | 'failure',
  message: string,
  filename?: string,
) {
  const kind = type === 'catalog' || type === 'sale' ? type : undefined
  await req.payload
    .create({ collection: 'exchange-log', data: { type: kind, mode, filename, result, message: message.slice(0, 2000) }, depth: 0 })
    .catch(() => null)
}

/**
 * GET/POST /api/1c/exchange?type=catalog|sale&mode=… — the CommerceML protocol of "Обмен с сайтом"
 * in 1C (УТ, КА, ERP, УНФ, Розница):
 *   checkauth → init → file (import.xml, offers.xml, pictures) → import (each file) — catalog
 *   checkauth → init → file (order changes from 1C) → query (new orders) → success — sale
 */
export async function exchange(req: PayloadRequest): Promise<Response> {
  const type = String(req.searchParams.get('type') ?? '')
  const mode = String(req.searchParams.get('mode') ?? '')
  const filename = String(req.searchParams.get('filename') ?? '')
  const headers = req.headers

  if (mode === 'checkauth') {
    if (!checkBasic(headers)) {
      await log(req, type, mode, 'failure', 'Неверный логин или пароль (ONEC_LOGIN / ONEC_PASSWORD)')
      return failure('Неверный логин или пароль')
    }
    return reply(`success\n${COOKIE}\n${startSession()}\n`)
  }
  if (!authorized(headers)) return failure('Нет авторизации: начните обмен заново (checkauth)')

  try {
    if (mode === 'init') {
      if (type === 'catalog') resetExchange()
      return reply(`zip=no\nfile_limit=${FILE_LIMIT}\n`)
    }

    if (mode === 'file') {
      const file = exchangePath(type === 'sale' ? `sale/${filename || 'orders.xml'}` : filename)
      if (!file) return failure(`Недопустимое имя файла: ${filename}`)
      const body = Buffer.from(await req.arrayBuffer!())
      mkdirSync(path.dirname(file), { recursive: true })
      // Catalog files may come in parts (appended); order changes come whole each exchange
      if (type === 'sale') writeFileSync(file, body)
      else appendFileSync(file, body)
      if (type === 'sale' && /\.xml$/i.test(file)) {
        const changed = await importOrderChanges(req.payload, file)
        await log(req, type, mode, 'success', `Изменений заказов из 1С: ${changed}`, filename)
      }
      return reply('success\n')
    }

    if (type === 'catalog' && mode === 'import') {
      const result = await importFile(req.payload, filename)
      if (!result.done && result.message.startsWith('Нет ')) {
        await log(req, type, mode, 'failure', result.message, filename)
        return failure(result.message)
      }
      if (result.done) await log(req, type, mode, 'success', result.message, filename)
      return reply(`${result.done ? 'success' : 'progress'}\n${result.message}\n`)
    }

    if (type === 'sale' && mode === 'query') {
      const xml = await exportOrders(req.payload)
      return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
    }

    if (type === 'sale' && mode === 'success') {
      const count = await markExported(req.payload)
      await log(req, type, mode, 'success', `Заказов передано в 1С: ${count}`)
      return reply('success\n')
    }

    return failure(`Неизвестный запрос: type=${type} mode=${mode}`)
  } catch (error) {
    req.payload.logger.error({ err: error }, `1C exchange failed: type=${type} mode=${mode}`)
    const message = error instanceof Error ? error.message : String(error)
    await log(req, type, mode, 'failure', message, filename)
    return failure(message)
  }
}
