/* Bean & Brew coffee shop on BlockUI.
   All behaviour (menu, cart, order dialog, theme, slider, map, animations)
   comes from BlockUI — this file only holds the settings. */

const CONFIG = {
  name: 'Bean & Brew',      // written into every [data-name]
  style: 'cozy',            // clean, bright, dark, modern, cozy
  color: 'brown',           // red, orange, yellow, green, teal, sky, blue, purple, pink, black, brown or '#hex'
  lang: 'en',               // interface language: 'en' | 'ru'
  rain: '',                 // emoji rain in the hero, e.g. '☕'
  dark: false,              // start in dark theme
  thanks: 'Thank you! Your coffee is brewing ☕'
};

BlockUI.start(CONFIG);
