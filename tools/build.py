"""Собирает служебные части BlockUI.

Запускать из папки BlockUI:

    python tools/build.py

Что делает:
1. Вписывает каталог фото (tools/photos.json) и слова для поиска тем
   в blockui.js между метками PHOTOS:START и PHOTOS:END.
2. Для каждого примера examples/<сайт>/ создаёт codepen.html —
   часть index.html между метками «Для CodePen» (подключение BlockUI + разметка).
3. Пишет список тем фото в AI.md между метками TOPICS:START и TOPICS:END.
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')  # русский текст в консоли Windows

ROOT = Path(__file__).resolve().parent.parent
PHOTOS_PER_TOPIC = 4

# Фото, которые не подошли (тёмные, чёрно-белые, не по теме): номер в списке photos.json
EXCLUDE = {
    'food': [5], 'fruits': [4], 'horse': [4], 'birds': [0], 'lego': [1, 3, 4], 'art': [2, 4, 5],
    'yoga': [1], 'chess': [1], 'hockey': [1], 'phone': [1, 2], 'winter': [1, 5], 'barber': [1, 2],
    'party': [1], 'newyear': [1, 3], 'cinema': [1], 'dinosaur': [4, 5],
}

# Тема → начала слов (русские и английские), по которым она находится.
# Ищется самое длинное совпадение: «игрушки» → toys, а не games.
# ~ — общее слово (школа, спорт, дети): проигрывает любому точному, «школа танцев» → dance.
WORDS = {
    'pizza': ['пицц', 'pizza'], 'coffee': ['коф', 'кафе', 'капуч', 'кофейн', 'coffee', 'cafe'],
    'cake': ['торт', 'кондитер', 'пирожн', 'десерт', 'cake'], 'bakery': ['пекар', 'хлеб', 'булоч', 'выпеч', 'bakery'],
    'burger': ['бургер', 'фастфуд', 'burger'], 'sushi': ['суши', 'ролл', 'японск', 'sushi'],
    'icecream': ['морожен', 'ice cream'], 'fruits': ['фрукт', 'овощ', 'ягод', 'fruit'],
    'food': ['еда', 'ресторан', 'обед', 'столов', 'restaurant', 'food'], 'candy': ['конфет', 'сладост', 'леденц', 'candy', 'sweet'],
    'flowers': ['цветы', 'цветоч', 'цветов', 'букет', 'flower'], 'dog': ['собак', 'пёс', 'щен', 'dog'],
    'cat': ['кошк', 'котик', 'котён', 'котен', 'кошач', 'cat'], 'horse': ['лошад', 'конюш', 'пони', 'конн', 'horse'],
    'pets': ['питом', 'зоомагаз', 'pet'], 'zoo': ['зоопарк', '~животн', 'звер', 'zoo', 'animal'],
    'fish': ['рыб', 'аквариум', 'fish'], 'birds': ['птиц', 'попуга', 'bird'],
    'books': ['книг', 'библиот', 'чтени', 'book'], 'school': ['~школ', '~учёб', '~учеб', '~урок', '~курс', 'school'],
    'kids': ['~дет', '~ребён', '~ребен', 'малыш', 'лагер', 'детский сад', 'kids', 'child'], 'toys': ['игрушк', 'игруш', 'toy'],
    'lego': ['лего', 'конструктор', 'lego'], 'art': ['рисова', 'художе', 'искусств', 'живопис', 'творч', 'art'],
    'music': ['музык', 'концерт', 'music'], 'guitar': ['гитар', 'guitar'], 'piano': ['пианин', 'фортепиан', 'рояль', 'piano'],
    'dance': ['танц', 'балет', 'хореограф', 'dance'], 'football': ['футбол', 'football', 'soccer'],
    'basketball': ['баскетбол', 'basketball'], 'swimming': ['плаван', 'бассейн', 'swim'],
    'fitness': ['фитнес', 'спортзал', 'тренаж', '~трениров', '~спорт', 'gym', 'fitness', 'sport'], 'yoga': ['йог', 'yoga'],
    'chess': ['шахмат', 'chess'], 'bike': ['велосипед', 'вело', 'bike', 'bicycle'], 'skate': ['скейт', 'самокат', 'skate'],
    'hockey': ['хоккей', 'хокке', 'коньк', 'hockey'], 'games': ['игр', 'гейм', 'видеоигр', 'киберспорт', 'приставк', 'game'],
    'computer': ['компьютер', 'программ', 'айти', 'ноутбук', 'код', 'computer', 'coding'], 'robot': ['робот', 'robot'],
    'space': ['космо', 'ракет', 'планет', 'астроном', 'space'], 'science': ['наук', 'научн', 'лаборатор', 'хими', 'физик', 'эксперимент', 'science'],
    'phone': ['телефон', 'смартфон', 'гаджет', 'электрон', 'phone'], 'travel': ['путешеств', 'туризм', 'турист', 'отпуск', 'пляж', 'travel', 'beach'],
    'mountains': ['горы', 'горах', 'горн', 'альпин', 'mountain'], 'camping': ['кемпинг', 'палатк', 'поход', 'костёр', 'camping'],
    'sea': ['море', 'морск', 'океан', 'sea', 'ocean'], 'forest': ['лес', '~природ', 'forest', 'nature'],
    'winter': ['зим', 'снег', 'лыж', 'winter', 'snow'], 'city': ['~город', 'мегапол', 'city'],
    'car': ['автомоб', 'машин', 'авто', 'такси', 'car'], 'train': ['поезд', 'вокзал', 'железн', 'train'],
    'plane': ['самолёт', 'самолет', 'авиа', 'аэропорт', 'plane'], 'clothes': ['одежд', 'мода', 'модн', 'бутик', 'clothes', 'fashion'],
    'shoes': ['обув', 'кроссов', 'кед', 'shoes', 'sneaker'], 'beauty': ['красот', '~салон', 'маникюр', 'косметик', 'спа', 'beauty'],
    'barber': ['барбер', 'стрижк', 'парикмах', 'barber'], 'hotel': ['отел', 'гостиниц', 'хостел', 'hotel'],
    'party': ['праздник', 'день рожден', 'вечерин', 'аниматор', 'party', 'birthday'], 'newyear': ['новый год', 'новогод', 'ёлк', 'елк', 'рождеств', 'christmas'],
    'doctor': ['врач', 'клиник', 'медиц', 'больниц', 'здоров', 'доктор', 'doctor'], 'vet': ['ветеринар', 'vet'],
    'farm': ['ферм', 'деревн', 'farm'], 'garden': ['сад', 'огород', 'растен', 'дача', 'garden'],
    'cooking': ['готовк', 'повар', 'кулинар', 'рецепт', 'cooking'], 'cinema': ['кино', 'фильм', 'cinema', 'movie'],
    'photo': ['фото', 'фотограф', 'камер', 'photo'], 'dinosaur': ['динозавр', 'dinosaur'],
}

# Русское название темы для справочника AI.md
TITLES = {
    'pizza': 'пицца', 'coffee': 'кофе, кафе', 'cake': 'торты, десерты', 'bakery': 'пекарня, хлеб', 'burger': 'бургеры',
    'sushi': 'суши', 'icecream': 'мороженое', 'fruits': 'фрукты, овощи', 'food': 'еда, ресторан', 'candy': 'конфеты',
    'flowers': 'цветы', 'dog': 'собаки', 'cat': 'кошки', 'horse': 'лошади', 'pets': 'питомцы, зоомагазин',
    'zoo': 'зоопарк, животные', 'fish': 'рыбы, аквариум', 'birds': 'птицы', 'books': 'книги, библиотека',
    'school': 'школа, курсы', 'kids': 'дети', 'toys': 'игрушки', 'lego': 'конструктор', 'art': 'рисование, искусство',
    'music': 'музыка, концерт', 'guitar': 'гитара', 'piano': 'пианино', 'dance': 'танцы', 'football': 'футбол',
    'basketball': 'баскетбол', 'swimming': 'плавание, бассейн', 'fitness': 'фитнес, спорт', 'yoga': 'йога',
    'chess': 'шахматы', 'bike': 'велосипеды', 'skate': 'скейт, самокат', 'hockey': 'хоккей, коньки',
    'games': 'видеоигры', 'computer': 'программирование', 'robot': 'роботы', 'space': 'космос', 'science': 'наука',
    'phone': 'телефоны, гаджеты', 'travel': 'путешествия, пляж', 'mountains': 'горы', 'camping': 'поход, кемпинг',
    'sea': 'море', 'forest': 'лес, природа', 'winter': 'зима, снег', 'city': 'город', 'car': 'машины',
    'train': 'поезда', 'plane': 'самолёты', 'clothes': 'одежда, мода', 'shoes': 'обувь, кроссовки',
    'beauty': 'салон красоты', 'barber': 'барбершоп', 'hotel': 'отель', 'party': 'праздник, день рождения',
    'newyear': 'Новый год', 'doctor': 'врач, клиника', 'vet': 'ветеринар', 'farm': 'ферма', 'garden': 'сад, огород',
    'cooking': 'кулинария', 'cinema': 'кино', 'photo': 'фотография', 'dinosaur': 'динозавры',
}


def build_photos():
    raw = json.loads((ROOT / 'tools' / 'photos.json').read_text(encoding='utf-8'))
    photos = {}
    for key, ids in raw.items():
        keep = [pid for i, pid in enumerate(ids) if i not in EXCLUDE.get(key, [])][:PHOTOS_PER_TOPIC]
        photos[key] = keep
    missing = set(photos) ^ set(WORDS)
    if missing:
        raise SystemExit(f'Темы без слов или без фото: {sorted(missing)}')
    lines = ['  const PHOTOS = {']
    lines += [f"    {k}: [{', '.join(repr(p) for p in v)}]," for k, v in photos.items()]
    lines[-1] = lines[-1].rstrip(',')
    lines += ['  };', '  const PHOTO_WORDS = {']
    lines += [f"    {k}: [{', '.join(repr(w) for w in WORDS[k])}]," for k in photos]
    lines[-1] = lines[-1].rstrip(',')
    lines.append('  };')
    block = '\n'.join(lines).replace("'", "'")
    js_path = ROOT / 'blockui.js'
    js = js_path.read_text(encoding='utf-8')
    start, end = '  // PHOTOS:START\n', '  // PHOTOS:END'
    js = js.split(start)[0] + start + block + '\n' + end + js.split(end, 1)[1]
    js_path.write_text(js, encoding='utf-8', newline='\n')
    print(f'blockui.js: {len(photos)} тем, {sum(map(len, photos.values()))} фото')
    return photos


def build_topics_doc(photos):
    ai = ROOT / 'AI.md'
    if not ai.exists():
        return
    text = ai.read_text(encoding='utf-8')
    start, end = '<!-- TOPICS:START -->', '<!-- TOPICS:END -->'
    if start not in text:
        return
    topics = ' · '.join(TITLES[k] for k in photos)
    text = text.split(start)[0] + start + '\n' + topics + '\n' + end + text.split(end, 1)[1]
    ai.write_text(text, encoding='utf-8', newline='\n')
    print('AI.md: список тем обновлён')


def build_codepen():
    for index in sorted((ROOT / 'examples').glob('*/index.html')):
        lines = index.read_text(encoding='utf-8').split('\n')
        s = next(i for i, l in enumerate(lines) if '↓↓↓ Для CodePen' in l)
        e = next(i for i, l in enumerate(lines) if '↑↑↑ Для CodePen' in l)
        while '-->' not in lines[s]:
            s += 1
        body = '\n'.join(lines[s + 1:e]).strip('\n')
        if 'script.js' in body or 'style.css' in body:
            raise SystemExit(f'{index}: в части для CodePen не должно быть script.js и style.css')
        (index.parent / 'codepen.html').write_text(body + '\n', encoding='utf-8', newline='\n')
        print(f'{index.parent.name}/codepen.html: готово')


if __name__ == '__main__':
    found = build_photos()
    build_topics_doc(found)
    build_codepen()
