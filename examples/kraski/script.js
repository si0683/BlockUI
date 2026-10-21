/* Завод «КРОН»: LightWebsiteUi в режиме Tailwind + daisyUI.
   Дизайн — классы Tailwind и компоненты daisyUI в HTML;
   поведение (окно заявки, проверка формы, счётчики, иконки, карта) — LightWebsiteUi. */

const CONFIG = {
  name: 'КРОН',
  tailwind: true,             // режим Tailwind + daisyUI
  theme: 'corporate',         // тема daisyUI: corporate, cupcake, emerald, retro, synthwave, forest…
  darkTheme: 'business',      // тема для кнопки 🌗
  color: '#1d6fd1',           // фирменный синий вместо цвета темы
  lang: 'ru',
  thanks: 'Спасибо! Менеджер свяжется с вами в рабочее время.'
};

LightWebsiteUi.start(CONFIG);
