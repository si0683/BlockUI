# 🧱 BlockUI

**Блоки для красивых сайтов.** Две строки в HTML — и у страницы уже есть стиль и цветовая схема, фото по слову, меню для телефона, тёмная тема, корзина, окно заказа, проверка форм, сообщения, салют, счётчики, таймер акции, слайдеры, карты, иконки и аватары. Всё управляется обычными классами и атрибутами HTML, без сборки.

Любите утилитарный CSS? **Режим Tailwind + daisyUI** сохраняет всё поведение BlockUI, а дизайн вы делаете классами Tailwind.

[Сайт и живые примеры](https://si0683.github.io/LightWebsiteUi/) · [Справочник API](AI.md) · [Шаблон промта для ИИ](PROMPT.ru.md) · [English](README.md)

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.js"></script>
```

или

```bash
npm install blockuijs
```
```js
import BlockUI from 'blockuijs';
import 'blockuijs/blockui.css';
```

## Блок за несколько строк

```html
<section class="bui-hero">
  <div class="bui-container">
    <div>
      <h1 data-name>Маргарита</h1>
      <p>Пицца из дровяной печи с доставкой за 30 минут.</p>
      <button class="bui-btn" data-open="order">Заказать</button>
    </div>
    <div class="bui-hero-picture"><img data-photo="пицца"></div>
  </div>
</section>
<script>BlockUI.start({ name: 'Маргарита', style: 'уютный', color: 'красный', lang: 'ru', rain: '🍕' });</script>
```

Окно заказа, проверка его формы и сообщение «спасибо» появятся сами.

## Возможности

- **5 стилей × 11 цветов** — простой, яркий, тёмный, современный, уютный; у каждого свои шрифты, тени и формы; любой цвет в hex.
- **Блоки:** 3 вида главного экрана, текст с фото, преимущества, карточки, товары, тарифы, отзывы, команда, шаги, цифры, вопросы, галерея, блок действия с таймером, контакты, соцсети, формы.
- **Фото по слову:** `<img data-photo="пицца">` — 68 тем, 270 бесплатных фото Unsplash, русские и английские слова.
- **Поведение атрибутами:** `data-open`, `data-add`, `data-count`, `data-timer`, `data-theme-toggle`… — окно заказа и корзина создаются сами.
- **Иконки, слайдеры, карты, аватары:** `data-icon="mdi:pizza"` (200 000+ иконок Iconify), `.bui-slider` (Swiper), `data-map="адрес"` (Leaflet + OpenStreetMap, без ключей), `data-avatar="Анна"` (DiceBear). Библиотеки грузятся, только если используются.
- **Режим Tailwind + daisyUI** — полная свобода дизайна.
- **Языки:** английский и русский интерфейс (`lang`), любой текст можно заменить (`texts`).
- **Типы TypeScript**, ES-модуль, безопасный импорт на сервере (SSR). Все стили — в слое CSS, поэтому ваш CSS всегда сильнее.

## Сайты с помощью ИИ

BlockUI сделан так, чтобы нейросеть (ChatGPT, Claude, Qwen, GigaChat, DeepSeek…) собирала аккуратный сайт по короткому описанию: [PROMPT.ru.md](PROMPT.ru.md) — готовый шаблон промта, [AI.md](AI.md) — компактный справочник.

## Лицензия

MIT — см. [LICENSE](LICENSE). У фото, иконок, карт и дополнений свои условия: [THIRD_PARTY.md](THIRD_PARTY.md).
