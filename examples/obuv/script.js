/* PUFF — ремонт, реставрация и химчистка обуви, на LightWebsiteUi.
   Окно заявки, проверка формы, галерея «до и после», счётчики и карта — от LightWebsiteUi,
   в этом файле только настройки. */

const CONFIG = {
  name: 'PUFF',               // попадает во все [data-name]
  style: 'clean',             // clean, bright, dark, modern, cozy
  color: 'teal',              // цвет кнопок и акцентов
  lang: 'ru',                 // язык интерфейса: 'ru' | 'en'
  orderTitle: 'Рассчитать стоимость',
  orderText: 'Оставьте телефон — назовём цену и скидку 300 ₽ на первый заказ.',
  thanks: 'Спасибо! Менеджер перезвонит в течение 5 минут.'
};

LightWebsiteUi.start(CONFIG);
