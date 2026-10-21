/* Шашлычная КАРС на LightWebsiteUi.
   Корзина, окно заказа, тёмная тема, иконки и карта — от LightWebsiteUi,
   в этом файле только настройки. */

const CONFIG = {
  name: 'Шашлычная КАРС',     // попадает во все [data-name]
  style: 'dark',              // clean, bright, dark, modern, cozy
  color: 'orange',            // цвет кнопок и акцентов
  lang: 'ru',                 // язык интерфейса: 'ru' | 'en'
  rain: '🔥',                 // «дождь» из эмодзи на главном экране
  orderTitle: 'Оформить заказ',
  orderText: 'Оставьте телефон — перезвоним, подтвердим заказ и время.',
  emptyCart: 'Корзина пуста — выберите шашлык в меню',
  thanks: 'Спасибо! Перезвоним в течение 10 минут 🔥'
};

LightWebsiteUi.start(CONFIG);
