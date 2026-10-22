import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import path from 'path'

// Files 1C sends (import.xml, offers.xml, pictures) and the exchange state live in cms/.1c-exchange
export const EXCHANGE_DIR = path.resolve(process.cwd(), '.1c-exchange')
const STATE_FILE = path.join(EXCHANGE_DIR, 'state.json')

export type Job = { stage: string; index: number; full?: boolean; seen?: string[] }

export type State = {
  session?: { token: string; expires: number }
  jobs: Record<string, Job>
  /** Shop order ids sent by the last "sale/query" — marked exported on "sale/success" */
  salePending?: (number | string)[]
}

export function loadState(): State {
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8')) as State
  } catch {
    return { jobs: {} }
  }
}

export function saveState(state: State) {
  mkdirSync(EXCHANGE_DIR, { recursive: true })
  writeFileSync(STATE_FILE, JSON.stringify(state))
}

/** A path inside the exchange folder; null for anything that tries to leave it */
export function exchangePath(filename: string): string | null {
  const clean = filename.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!clean || clean.split('/').some((part) => part === '..' || part === '')) return null
  const full = path.resolve(EXCHANGE_DIR, clean)
  return full.startsWith(EXCHANGE_DIR + path.sep) ? full : null
}

/** A new catalog exchange starts from a clean folder (the session survives) */
export function resetExchange() {
  const state = loadState()
  if (existsSync(EXCHANGE_DIR)) rmSync(EXCHANGE_DIR, { recursive: true, force: true })
  saveState({ session: state.session, jobs: {} })
}
