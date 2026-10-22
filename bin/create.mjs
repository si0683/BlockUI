#!/usr/bin/env node
// create-lightwebsiteui — copies the starter (Astro + React + Tailwind CSS + shadcn/ui + Lucide + Motion)
// into a new folder and installs its dependencies. Optionally adds Payload CMS in cms/.
//
//   npm create lightwebsiteui@latest my-site
//   npm create lightwebsiteui@latest my-site -- --cms=payload --db=postgres
//   npx create-lightwebsiteui my-site --no-install --no-git

import { spawnSync } from "node:child_process"
import { randomBytes } from "node:crypto"
import { appendFileSync, cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import { basename, join, relative, resolve } from "node:path"
import { createInterface } from "node:readline/promises"
import { fileURLToPath } from "node:url"

const TEMPLATE = fileURLToPath(new URL("../template", import.meta.url))
// Optional CMS: cms/<name>/ = cms.json + app/ (→ project/cms) + site/ (over the site) + db/<db>/ + append/
const CMS = fileURLToPath(new URL("../cms", import.meta.url))
const SKIP = new Set(["node_modules", "dist", ".astro", ".next", "package-lock.json"])
const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))

const cmsList = [
  { name: "none", title: "без CMS — тексты в src/data/site.ts" },
  ...(existsSync(CMS) ? readdirSync(CMS) : []).map((name) => ({
    name,
    ...JSON.parse(readFileSync(join(CMS, name, "cms.json"), "utf8")),
  })),
]

const color = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text)
const bold = color(1)
const dim = color(2)
const green = color(32)
const red = color(31)
const magenta = color(35)

const args = process.argv.slice(2)
const flags = new Set()
const options = {}
let target
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  const option = /^--(cms|db)(?:=(.*))?$/.exec(arg)
  if (option) options[option[1]] = option[2] ?? args[++i]
  else if (arg.startsWith("-")) flags.add(arg)
  else target ??= arg
}

if (flags.has("-h") || flags.has("--help")) {
  console.log(`
${bold("create-lightwebsiteui")} ${dim(version)}

  npm create lightwebsiteui@latest ${dim("[folder]")} ${dim("[-- --cms=<name> --db=<name> --no-install --no-git]")}

  --cms=<name>   ${cmsList.map((c) => c.name).join(" | ")}  (default: none)
  --db=<name>    with --cms=payload: sqlite | postgres  (default: sqlite)
  --no-install   do not run npm install
  --no-git       do not run git init
`)
  process.exit(0)
}

console.log(`\n${magenta(bold("LightWebsiteUi"))} ${dim(version)} — Astro · React · Tailwind CSS · shadcn/ui · Lucide · Motion\n`)

// ---------- questions (only in a terminal and only for what is not given) ----------
const rl = process.stdin.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : undefined
async function choose(title, items) {
  console.log(title)
  items.forEach((item, i) => console.log(`  ${i + 1} — ${item.title}`))
  const answer = (await rl.question(`Выберите ${dim("(1)")}: `)).trim()
  return items[Number(answer) - 1]?.name ?? (items.some((item) => item.name === answer) ? answer : items[0].name)
}

if (!target && rl) target = (await rl.question(`Папка проекта ${dim("(my-site)")}: `)).trim()
target ||= "my-site"
if (!options.cms && rl && cmsList.length > 1) options.cms = await choose("CMS:", cmsList)
options.cms ||= "none"
const cms = cmsList.find((c) => c.name === options.cms)
if (!cms) fail(`Неизвестная CMS «${options.cms}». Доступны: ${cmsList.map((c) => c.name).join(", ")}`)
let db
if (cms.dbs) {
  const dbList = Object.entries(cms.dbs).map(([name, info]) => ({ name, ...info }))
  if (!options.db && rl) options.db = await choose("База данных:", dbList)
  options.db ||= dbList[0].name
  db = dbList.find((d) => d.name === options.db)
  if (!db) fail(`Неизвестная база «${options.db}». Доступны: ${dbList.map((d) => d.name).join(", ")}`)
}
rl?.close()

const root = resolve(target)
if (existsSync(root) && readdirSync(root).length > 0) fail(`Папка «${target}» не пуста. Укажите новую папку.`)

// ---------- site ----------
cpSync(TEMPLATE, root, {
  recursive: true,
  filter: (source) => !SKIP.has(basename(source)),
})
// npm never publishes a file called .gitignore, so the template keeps it as _gitignore
renameSync(join(root, "_gitignore"), join(root, ".gitignore"))

const pkgPath = join(root, "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
pkg.name = toPackageName(basename(root))

// ---------- CMS ----------
if (cms.name !== "none") {
  const dir = join(CMS, cms.name)
  const app = join(root, "cms")
  // The CMS app goes to cms/, the site parts that talk to it replace the static ones
  cpSync(join(dir, "app"), app, { recursive: true, filter: (source) => !SKIP.has(basename(source)) })
  renameSync(join(app, "_gitignore"), join(app, ".gitignore"))
  cpSync(join(dir, "site"), root, { recursive: true })
  if (existsSync(join(dir, "db", db.name))) cpSync(join(dir, "db", db.name), app, { recursive: true })

  // Database adapter package
  const appPkgPath = join(app, "package.json")
  const appPkg = JSON.parse(readFileSync(appPkgPath, "utf8"))
  for (const other of Object.values(cms.dbs)) delete appPkg.dependencies[other.package]
  appPkg.dependencies[db.package] = cms.version
  appPkg.dependencies = Object.fromEntries(Object.entries(appPkg.dependencies).sort())
  writeFileSync(appPkgPath, JSON.stringify(appPkg, null, 2) + "\n")

  // Settings: CMS secrets in cms/.env, the CMS address for the site in .env
  const cmsEnv = [
    `DATABASE_URL=${db.url}`,
    `PAYLOAD_SECRET=${randomBytes(24).toString("hex")}`,
    "SITE_URL=http://localhost:4321",
  ]
  writeFileSync(join(app, ".env"), cmsEnv.join("\n") + "\n")
  writeFileSync(join(app, ".env.example"), [`DATABASE_URL=${db.url}`, "PAYLOAD_SECRET=change-me", "SITE_URL=http://localhost:4321"].join("\n") + "\n")
  const siteEnv = "# Payload CMS address (the site reads content and sends leads there)\nPUBLIC_CMS_URL=http://localhost:3000\n"
  writeFileSync(join(root, ".env"), siteEnv)
  writeFileSync(join(root, ".env.example"), siteEnv)

  for (const file of cms.append ?? []) {
    // npm drops files named .gitignore from packages, so that one is stored as _gitignore
    const source = join(dir, "append", file === ".gitignore" ? "_gitignore" : file)
    appendFileSync(join(root, file), readFileSync(source, "utf8"))
  }
  pkg.scripts = { ...pkg.scripts, ...cms.scripts }
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

console.log(`${green("✔")} Проект создан: ${bold(root)}`)
if (cms.name !== "none") console.log(`${green("✔")} CMS: ${cms.title}, база: ${db.name}`)

// ---------- install ----------
const agent = (process.env.npm_config_user_agent ?? "npm").split("/")[0]
const pm = ["pnpm", "yarn", "bun"].includes(agent) ? agent : "npm"

let installed = false
if (!flags.has("--no-install")) {
  console.log(`${dim("…")} Устанавливаю зависимости (${pm} install), это займёт минуту\n`)
  installed = run(pm, ["install"], root)
  if (installed && cms.name !== "none") {
    console.log(`\n${dim("…")} Устанавливаю зависимости CMS (cms/)\n`)
    installed = run(pm, ["install"], join(root, "cms"))
  }
  console.log(installed ? `\n${green("✔")} Зависимости установлены` : red("✖ Установка не удалась — запустите её вручную"))
}

if (!flags.has("--no-git") && run("git", ["--version"], root, true)) {
  if (run("git", ["init", "-q"], root, true)) console.log(`${green("✔")} Git-репозиторий создан`)
}

const cd = relative(process.cwd(), root) || "."
const notInstalled = installed ? "" : `\n  ${pm} install${cms.name !== "none" ? ` && ${pm} --prefix cms install` : ""}`
const cmsSteps =
  cms.name === "none"
    ? ""
    : `${db.name === "postgres" ? `  cd cms && docker compose up -d && cd ..   ${dim("# PostgreSQL в Docker")}\n` : ""}  ${pm} run cms          ${dim("# CMS: http://localhost:3000/admin (первый вход — создать администратора)")}
  ${dim("# и во втором терминале:")}
`
console.log(`
${bold("Дальше:")}
  cd ${cd.includes(" ") ? `"${cd}"` : cd}${notInstalled}
${cmsSteps}  ${pm} run dev          ${dim("# http://localhost:4321")}

${bold("Компоненты shadcn/ui:")}
  npx shadcn@latest add calendar   ${dim("# любой из https://ui.shadcn.com/docs/components")}
${cms.name !== "none" ? `\n${bold("CMS:")} PAYLOAD.md — запуск, база данных, выкладка\n` : ""}`)

function fail(message) {
  rl?.close()
  console.error(red(message))
  process.exit(1)
}

function run(command, commandArgs, cwd, quiet = false) {
  const options = { cwd, stdio: quiet ? "ignore" : "inherit" }
  // npm, pnpm and yarn are .cmd files on Windows and need a shell (fixed arguments only)
  const result =
    process.platform === "win32"
      ? spawnSync([command, ...commandArgs].join(" "), { ...options, shell: true })
      : spawnSync(command, commandArgs, options)
  return result.status === 0
}

function toPackageName(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^[._]/, "")
      .replace(/[^a-z0-9-~]+/g, "-") || "my-site"
  )
}
