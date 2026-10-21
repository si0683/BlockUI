/* Paws animal shelter on BlockUI.
   Gallery, meet-a-pet dialog, counters, icons and map come from BlockUI. */

const CONFIG = {
  name: 'Paws',
  style: 'bright',          // clean, bright, dark, modern, cozy
  color: 'green',
  lang: 'en',
  rain: '🐾',               // emoji rain in the hero ('' = none)
  thanks: 'Thank you! We will call you to arrange a visit 🐾',
  orderTitle: 'Meet a pet',
  orderText: 'Leave your name and phone — we will arrange a meeting.'
};

BlockUI.start(CONFIG);
