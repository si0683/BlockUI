/* «Мастер в ремонте» — ремонт квартир в Самаре, на LightWebsiteUi.
   Всё поведение (меню, окно заявки, слайдер отзывов, галерея, карта, таймер акции)
   даёт LightWebsiteUi — в этом файле только настройки. */

const CONFIG = {
  name: 'Мастер в ремонте',   // попадает во все [data-name]
  style: 'modern',            // clean, bright, dark, modern, cozy
  color: 'orange',            // red, orange, yellow, green, teal, sky, blue, purple, pink, black, brown или '#hex'
  lang: 'ru',                 // язык интерфейса: 'ru' | 'en'
  orderTitle: 'Вызвать сметчика',
  orderText: 'Замер и смета — бесплатно. Перезвоним и договоримся о времени.',
  thanks: 'Спасибо! Сметчик перезвонит вам в течение дня.'
};

LightWebsiteUi.start(CONFIG);
