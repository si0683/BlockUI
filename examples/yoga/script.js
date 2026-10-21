/* Студия йоги «Лотос»: BlockUI в режиме Tailwind + daisyUI.
   Оформление — классы Tailwind и компоненты daisyUI в HTML,
   поведение (окно записи, проверка формы, фото, счётчики) — BlockUI. */

// ===== 0. ЛАБОРАТОРИЯ САЙТА 🧪 =====
const LAB = {
  name: 'Лотос',              // название
  tailwind: true,             // режим Tailwind + daisyUI
  theme: 'emerald',           // тема daisyUI: cupcake, retro, emerald, valentine, synthwave, corporate, forest…
  darkTheme: 'night',         // тема для кнопки 🌗
  thanks: 'Вы записаны! Намасте 🧘'
};

BlockUI.start(LAB);
