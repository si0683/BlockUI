# Third-party assets and libraries

BlockUI code is MIT-licensed (see LICENSE). It uses the following — all loaded from public CDNs/APIs, only when the page needs them:

| What | When | Author | License |
|---|---|---|---|
| Photos (`data-photo`) | always available | Photographers on [Unsplash](https://unsplash.com) | [Unsplash License](https://unsplash.com/license) (free, no attribution required) |
| Fallback photos for unknown topics | unknown `data-photo` keyword | [Lorem Picsum](https://picsum.photos) (Unsplash photos) | Unsplash License |
| Icons (`data-icon`) | page uses `data-icon` | [Iconify](https://iconify.design) `iconify-icon` 3.0.3 | MIT; each icon set has its own open license (MDI: Apache 2.0, Lucide: ISC, …) |
| Slider (`.bui-slider`) | page uses `.bui-slider` | [Swiper](https://swiperjs.com) 14.3.0 | MIT |
| Maps (`data-map`) | page uses `data-map` | [Leaflet](https://leafletjs.com) 1.9.4; tiles and geocoding by [OpenStreetMap](https://www.openstreetmap.org/copyright) | BSD-2-Clause; map data © OpenStreetMap contributors (ODbL), attribution shown on the map |
| Avatars (`data-avatar`) | page uses `data-avatar` | [DiceBear](https://www.dicebear.com) HTTP API; default style Lorelei by Lisa Wischofsky | MIT (code); Lorelei CC0 1.0 — other styles have their own licenses |
| Tailwind mode | `tailwind: true` | [Tailwind CSS](https://tailwindcss.com) 4.3.3, [daisyUI](https://daisyui.com) 5.7.47 | MIT |
| Fonts | always | Google Fonts: Comfortaa, Manrope, Montserrat, Nunito, Rubik, Russo One, Unbounded | SIL Open Font License 1.1 |

**Usage policies.** OpenStreetMap tiles and Nominatim geocoding are free for light use; for high-traffic sites use coordinates in `data-map` (no geocoding request) and consider your own tile provider. DiceBear's public API is free; for heavy use self-host it.
