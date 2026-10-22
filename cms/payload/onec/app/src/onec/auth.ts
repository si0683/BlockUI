import { randomBytes, timingSafeEqual } from 'crypto'

import { loadState, saveState } from './storage'

export const COOKIE = 'onec_session'
const SESSION_MS = 2 * 60 * 60 * 1000

const login = process.env.ONEC_LOGIN || ''
const password = process.env.ONEC_PASSWORD || ''

const same = (a: string, b: string) => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/** Login and password from the 1C exchange settings (Basic auth) */
export function checkBasic(headers: Headers): boolean {
  if (!login || !password) return false
  const header = headers.get('authorization') || ''
  if (!header.startsWith('Basic ')) return false
  const [user, ...rest] = Buffer.from(header.slice(6), 'base64').toString('utf8').split(':')
  return same(user, login) && same(rest.join(':'), password)
}

/** "checkauth": a session token 1C sends back as a cookie in the next requests */
export function startSession(): string {
  const token = randomBytes(24).toString('hex')
  const state = loadState()
  state.session = { token, expires: Date.now() + SESSION_MS }
  saveState(state)
  return token
}

/** Every exchange request after "checkauth": the session cookie, or the login and password again */
export function authorized(headers: Headers): boolean {
  if (checkBasic(headers)) return true
  const session = loadState().session
  if (!session || session.expires < Date.now()) return false
  const cookie = headers.get('cookie') || ''
  const token = cookie
    .split(';')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === COOKIE)?.[1]
  return Boolean(token) && same(token!, session.token)
}
