/* Lotus yoga studio: BlockUI in Tailwind + daisyUI mode.
   Design — Tailwind classes and daisyUI components in the HTML;
   behaviour (booking dialog, validation, photos, counters, icons) — BlockUI. */

const CONFIG = {
  name: 'Lotus',
  tailwind: true,           // Tailwind + daisyUI mode
  theme: 'emerald',         // daisyUI theme: cupcake, retro, emerald, valentine, synthwave, corporate, forest…
  darkTheme: 'night',       // theme for the 🌗 toggle
  lang: 'en',
  thanks: "You're booked! Namaste 🧘"
};

BlockUI.start(CONFIG);
