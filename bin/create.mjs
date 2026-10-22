#!/usr/bin/env node
// create-lightwebsiteui — copies the starter (Astro + React + Tailwind CSS + shadcn/ui + Lucide + Motion)
// into a new folder and installs its dependencies. Optionally adds Payload CMS in cms/.
//
//   npm create lightwebsiteui@latest my-site
//   npm create lightwebsiteui@latest my-site -- --cms=payload --db=postgres --pay=yookassa
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
  const option = /^--(cms|db|pay)(?:=(.*))?$/.exec(arg)
  if (option) options[option[1]] = option[2] ?? args[++i]
  // --2fa alone means "optional"; --2fa=required makes the code mandatory for everyone
  else if (/^--2fa(=|$)/.test(arg)) options.twofa = arg.includes("=") ? arg.slice(6) : "optional"
  else if (arg === "--shop") options.shop = true
  else if (arg === "--1c") options.onec = true
  else if (arg.startsWith("-")) flags.add(arg)
  else target ??= arg
}

if (flags.has("-h") || flags.has("--help")) {
  console.log(`
${bold("create-lightwebsiteui")} ${dim(version)}

  npm create lightwebsiteui@latest ${dim("[folder]")} ${dim("[-- --cms=<name> --db=<name> --pay=<name> --2fa[=required] --shop --1c --no-install --no-git]")}

  --cms=<name>   ${cmsList.map((c) => c.name).join(" | ")}  (default: none)
  --db=<name>    with --cms=payload: sqlite | postgres  (default: sqlite)
  --pay=<name>   with --cms=payload: none | yookassa | stripe  (default: none)
  --2fa[=mode]   with --cms=payload: code from an authenticator app for the admin panel;
                 optional (what --2fa means) | required | none
  --shop         with --cms=payload: catalog, product pages, cart, shop orders
  --1c           with --shop: exchange with 1C (CommerceML) — catalog, prices, stock, orders
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
let pay
if (cms.pays) {
  const payList = [{ name: "none", title: "без онлайн-оплаты" }, ...Object.entries(cms.pays).map(([name, info]) => ({ name, ...info }))]
  if (!options.pay && rl) options.pay = await choose("Онлайн-оплата:", payList)
  options.pay ||= "none"
  pay = payList.find((p) => p.name === options.pay)
  if (!pay) fail(`Неизвестная оплата «${options.pay}». Доступны: ${payList.map((p) => p.name).join(", ")}`)
} else if (options.pay && options.pay !== "none") {
  fail("Онлайн-оплата работает только вместе с CMS: добавьте --cms=payload")
}
let twofa
if (cms.twofa) {
  const modeList = [{ name: "none", title: "без 2FA" }, ...Object.entries(cms.twofa.modes).map(([name, info]) => ({ name, ...info }))]
  if (!options.twofa && rl) options.twofa = await choose("Вход в админку с кодом из приложения (2FA):", modeList)
  options.twofa ||= "none"
  twofa = modeList.find((m) => m.name === options.twofa)
  if (!twofa) fail(`Неизвестный режим 2FA «${options.twofa}». Доступны: ${modeList.map((m) => m.name).join(", ")}`)
} else if (options.twofa && options.twofa !== "none") {
  fail("2FA работает только вместе с CMS: добавьте --cms=payload")
}
if (cms.shop && options.shop === undefined && rl) {
  options.shop = (await choose("Магазин (каталог, корзина, заказы):", [
    { name: "no", title: "не нужен" },
    { name: "yes", title: "добавить" },
  ])) === "yes"
} else if (!cms.shop && options.shop) {
  fail("Магазин работает только вместе с CMS: добавьте --cms=payload")
}
const shop = Boolean(cms.shop && options.shop)
if (cms.onec && shop && options.onec === undefined && rl) {
  options.onec = (await choose("Обмен с 1С (каталог, цены, остатки, заказы):", [
    { name: "no", title: "не нужен" },
    { name: "yes", title: "добавить" },
  ])) === "yes"
} else if (options.onec && !shop) {
  fail("Обмен с 1С работает только вместе с магазином: добавьте --cms=payload --shop")
}
const onec = Boolean(cms.onec && shop && options.onec)
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
    "# Address of this CMS (the admin panel); on the server: https://cms.your-site",
    "CMS_URL=http://localhost:3000",
  ]
  writeFileSync(join(app, ".env"), cmsEnv.join("\n") + "\n")
  writeFileSync(join(app, ".env.example"), cmsEnv.join("\n").replace(/PAYLOAD_SECRET=.*/, "PAYLOAD_SECRET=change-me") + "\n")
  const siteEnv = "# Payload CMS address (the site reads content and sends leads there)\nPUBLIC_CMS_URL=http://localhost:3000\n"
  writeFileSync(join(root, ".env"), siteEnv)
  writeFileSync(join(root, ".env.example"), siteEnv)

  for (const file of cms.append ?? []) {
    // npm drops files named .gitignore from packages, so that one is stored as _gitignore
    const source = join(dir, "append", file === ".gitignore" ? "_gitignore" : file)
    appendFileSync(join(root, file), readFileSync(source, "utf8"))
  }

  // Online payment: orders + endpoints in the CMS, pay dialog and /thanks on the site
  if (pay.name !== "none") {
    for (const part of ["common", pay.name]) {
      const from = join(dir, "pay", part)
      if (existsSync(join(from, "app"))) cpSync(join(from, "app"), app, { recursive: true })
      if (existsSync(join(from, "site"))) cpSync(join(from, "site"), root, { recursive: true })
    }
    const payEnv = ["", `# Online payment (${pay.title}). Test keys first, see PAYMENTS.md`, ...pay.env, ""].join("\n")
    appendFileSync(join(app, ".env"), payEnv)
    appendFileSync(join(app, ".env.example"), payEnv)
    for (const file of cms.payAppend ?? []) {
      appendFileSync(join(root, file), readFileSync(join(dir, "pay", "append", file), "utf8"))
    }
  }
  // Two-factor sign-in to the admin panel: payload-totp plugin
  if (twofa.name !== "none") {
    cpSync(join(dir, "twofa", "app"), app, { recursive: true })
    const [name, ver] = cms.twofa.package
    const twofaPkg = JSON.parse(readFileSync(appPkgPath, "utf8"))
    twofaPkg.dependencies = Object.fromEntries(Object.entries({ ...twofaPkg.dependencies, [name]: ver }).sort())
    twofaPkg.scripts = { ...twofaPkg.scripts, ...cms.twofa.scripts }
    writeFileSync(appPkgPath, JSON.stringify(twofaPkg, null, 2) + "\n")
    const twofaEnv = [
      "",
      "# Two-factor sign-in (2FA, see PAYLOAD.md): true — every user must set up an authenticator app",
      `TOTP_REQUIRED=${twofa.required}`,
      "# Name shown in the authenticator app",
      `TOTP_ISSUER=${pkg.name}`,
      "",
    ].join("\n")
    appendFileSync(join(app, ".env"), twofaEnv)
    appendFileSync(join(app, ".env.example"), twofaEnv)
    for (const file of cms.twofa.append ?? []) {
      appendFileSync(join(root, file), readFileSync(join(dir, "twofa", "append", file), "utf8"))
    }
  }
  // Shop: categories, products and shop orders in the CMS; catalog, cart and order pages on the site
  if (shop) {
    cpSync(join(dir, "shop", "app"), app, { recursive: true })
    cpSync(join(dir, "shop", "site"), root, { recursive: true })
    for (const file of cms.shop.append ?? []) {
      appendFileSync(join(root, file), readFileSync(join(dir, "shop", "append", file), "utf8"))
    }
  }
  // 1C: CommerceML exchange endpoint /api/1c/exchange and the exchange log in the CMS
  if (onec) {
    cpSync(join(dir, "onec", "app"), app, { recursive: true })
    cpSync(join(dir, "onec", "site"), root, { recursive: true })
    const [name, ver] = cms.onec.package
    const onecPkg = JSON.parse(readFileSync(appPkgPath, "utf8"))
    onecPkg.dependencies = Object.fromEntries(Object.entries({ ...onecPkg.dependencies, [name]: ver }).sort())
    writeFileSync(appPkgPath, JSON.stringify(onecPkg, null, 2) + "\n")
    const onecEnv = ["", "# Exchange with 1C (see 1C.md)", ...cms.onec.env, ""].join("\n")
    appendFileSync(join(app, ".env"), onecEnv.replace("ONEC_PASSWORD=", `ONEC_PASSWORD=${randomBytes(12).toString("hex")}`))
    appendFileSync(join(app, ".env.example"), onecEnv)
    for (const file of cms.onec.append ?? []) {
      appendFileSync(join(root, file), readFileSync(join(dir, "onec", "append", file), "utf8"))
    }
  }
  pkg.scripts = { ...pkg.scripts, ...cms.scripts }
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

console.log(`${green("✔")} Проект создан: ${bold(root)}`)
if (cms.name !== "none") console.log(`${green("✔")} CMS: ${cms.title}, база: ${db.name}`)
if (pay && pay.name !== "none") console.log(`${green("✔")} Оплата: ${pay.title} — ключи в cms/.env, см. PAYMENTS.md`)
if (twofa && twofa.name !== "none") console.log(`${green("✔")} 2FA: ${twofa.title}`)
if (shop) console.log(`${green("✔")} ${cms.shop.title} — см. SHOP.md`)
if (onec) console.log(`${green("✔")} ${cms.onec.title} — логин и пароль в cms/.env, см. 1C.md`)
// Options that add collections, fields or admin components need fresh types and the admin import map
const addons = (pay && pay.name !== "none") || (twofa && twofa.name !== "none") || shop

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
    if (installed && addons) {
      run(pm, ["run", "generate:types"], join(root, "cms"), true)
      run(pm, ["run", "generate:importmap"], join(root, "cms"), true)
    }
  }
  console.log(installed ? `\n${green("✔")} Зависимости установлены` : red("✖ Установка не удалась — запустите её вручную"))
}

if (!flags.has("--no-git") && run("git", ["--version"], root, true)) {
  if (run("git", ["init", "-q"], root, true)) console.log(`${green("✔")} Git-репозиторий создан`)
}

const cd = relative(process.cwd(), root) || "."
const notInstalled = installed
  ? ""
  : `\n  ${pm} install${cms.name !== "none" ? ` && ${pm} --prefix cms install` : ""}${addons ? ` && ${pm} --prefix cms run generate:types && ${pm} --prefix cms run generate:importmap` : ""}`
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
