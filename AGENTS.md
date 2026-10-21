# AGENTS.md — rules for AI coding agents

LightWebsiteUi is a general-purpose website building-block library, distributed via jsDelivr (git tags) and npm (`lightwebsiteui`).

- **Never change a published version.** Projects pin `@x.y.z`; tags are immutable. Changes go into a new version: `VERSION` in lightwebsiteui.js, `version` in package.json, `@x.y.z` links (README*, AI.md, PROMPT*.md, examples), CHANGELOG.md, tag `vX.Y.Z`.
- Any change to classes, attributes or options must be reflected in **AI.md**, **lightwebsiteui.d.ts**, both READMEs and the cheat sheets in **PROMPT.md / PROMPT.ru.md**.
- Code: plain browser JavaScript, no build step, **English comments**. The only global is `window.LightWebsiteUi`. Interface strings live in `I18N` (en, ru) — never hard-code UI text.
- Photo catalogue: `tools/photos.json` + `EXCLUDE` / `WORDS` / `TITLES` in `tools/build.py`; run `python tools/build.py` afterwards (it also writes `codepen.html` files, the AI.md topic list and `lightwebsiteui.mjs`). Only `images.unsplash.com` photos under the Unsplash License.
- All styles stay inside `@layer bui` (lightwebsiteui.js declares the layer first in `<head>`), so Tailwind classes and user CSS always win. Third-party styles (Swiper, Leaflet) are outside the layer — override them with `!important`.
- External libraries load on demand with exact versions: Tailwind 4.3.3 + daisyUI 5.7.47, iconify-icon 3.0.3, Swiper 14.3.0, Leaflet 1.9.4. Record every source in THIRD_PARTY.md.
- Testing: serve the folder (`python -m http.server`), test copies of the examples with local lightwebsiteui.*; widths 320–1280 without horizontal scroll; no console errors. Types: compile a sample with `tsc --strict --noEmit`.
- Classroom repos (CreateSite01PROMT, lesson sites) pin BlockUI 1.1.0 (the former name) — do not migrate them without the owner's request.
