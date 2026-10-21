"""Build helper for LightWebsiteUi. Run from the repository root:

    python tools/build.py

What it does:
1. Writes the photo catalogue (tools/photos.json) and topic keywords into lightwebsiteui.js
   between PHOTOS:START and PHOTOS:END.
2. Writes examples/<site>/codepen.html — the part of index.html between the CodePen markers.
3. Writes the topic list into AI.md between TOPICS:START and TOPICS:END.
4. Writes lightwebsiteui.mjs — the ES module entry for npm / bundlers.
"""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
PHOTOS_PER_TOPIC = 4

# Photos rejected after review (too dark, black-and-white, off-topic): index in photos.json
EXCLUDE = {
    'food': [5], 'fruits': [4], 'horse': [4], 'birds': [0], 'lego': [1, 3, 4], 'art': [2, 4, 5],
    'yoga': [1], 'chess': [1], 'hockey': [1], 'phone': [1, 2], 'winter': [1, 5], 'barber': [1, 2],
    'party': [1], 'newyear': [1, 3], 'cinema': [1], 'dinosaur': [4, 5],
}

# Topic → word stems (English and Russian) that select it.
# The longest match wins: 'toys' beats 'games' for «игрушки».
# ~ marks a generic stem (school, sport, kids): any specific stem wins, so 'dance school' → dance.
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

# English topic names for the AI.md topic list
TITLES = {'pizza': 'pizza', 'coffee': 'coffee, cafe', 'cake': 'cakes, desserts', 'bakery': 'bakery, bread', 'burger': 'burgers', 'sushi': 'sushi', 'icecream': 'ice cream', 'fruits': 'fruit, vegetables', 'food': 'food, restaurant', 'candy': 'candy', 'flowers': 'flowers', 'dog': 'dogs', 'cat': 'cats', 'horse': 'horses', 'pets': 'pets, pet shop', 'zoo': 'zoo, animals', 'fish': 'fish, aquarium', 'birds': 'birds', 'books': 'books, library', 'school': 'school, courses', 'kids': 'kids', 'toys': 'toys', 'lego': 'building bricks', 'art': 'art, painting', 'music': 'music, concert', 'guitar': 'guitar', 'piano': 'piano', 'dance': 'dance', 'football': 'football', 'basketball': 'basketball', 'swimming': 'swimming, pool', 'fitness': 'fitness, sport', 'yoga': 'yoga', 'chess': 'chess', 'bike': 'bikes', 'skate': 'skateboard, scooter', 'hockey': 'hockey, skates', 'games': 'video games', 'computer': 'programming, computers', 'robot': 'robots', 'space': 'space', 'science': 'science, lab', 'phone': 'phones, gadgets', 'travel': 'travel, beach', 'mountains': 'mountains', 'camping': 'camping, hiking', 'sea': 'sea', 'forest': 'forest, nature', 'winter': 'winter, snow', 'city': 'city', 'car': 'cars', 'train': 'trains', 'plane': 'planes', 'clothes': 'clothes, fashion', 'shoes': 'shoes, sneakers', 'beauty': 'beauty salon', 'barber': 'barbershop', 'hotel': 'hotel', 'party': 'party, birthday', 'newyear': 'New Year, Christmas', 'doctor': 'doctor, clinic', 'vet': 'vet', 'farm': 'farm', 'garden': 'garden', 'cooking': 'cooking', 'cinema': 'cinema', 'photo': 'photography', 'dinosaur': 'dinosaurs'}


def build_photos():
    raw = json.loads((ROOT / 'tools' / 'photos.json').read_text(encoding='utf-8'))
    photos = {}
    for key, ids in raw.items():
        keep = [pid for i, pid in enumerate(ids) if i not in EXCLUDE.get(key, [])][:PHOTOS_PER_TOPIC]
        photos[key] = keep
    missing = set(photos) ^ set(WORDS)
    if missing:
        raise SystemExit(f'Topics without words or photos: {sorted(missing)}')
    lines = ['  const PHOTOS = {']
    lines += [f"    {k}: [{', '.join(repr(p) for p in v)}]," for k, v in photos.items()]
    lines[-1] = lines[-1].rstrip(',')
    lines += ['  };', '  const PHOTO_WORDS = {']
    lines += [f"    {k}: [{', '.join(repr(w) for w in WORDS[k])}]," for k in photos]
    lines[-1] = lines[-1].rstrip(',')
    lines.append('  };')
    block = '\n'.join(lines).replace("'", "'")
    js_path = ROOT / 'lightwebsiteui.js'
    js = js_path.read_text(encoding='utf-8')
    start, end = '  // PHOTOS:START\n', '  // PHOTOS:END'
    js = js.split(start)[0] + start + block + '\n' + end + js.split(end, 1)[1]
    js_path.write_text(js, encoding='utf-8', newline='\n')
    print(f'lightwebsiteui.js: {len(photos)} topics, {sum(map(len, photos.values()))} photos')
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
    print('AI.md: topic list updated')


def build_codepen():
    for index in sorted((ROOT / 'examples').glob('*/index.html')):
        lines = index.read_text(encoding='utf-8').split('\n')
        s = next(i for i, l in enumerate(lines) if '↓↓↓ CodePen' in l)
        e = next(i for i, l in enumerate(lines) if '↑↑↑ CodePen' in l)
        while '-->' not in lines[s]:
            s += 1
        body = '\n'.join(lines[s + 1:e]).strip('\n')
        if 'script.js' in body or 'style.css' in body:
            raise SystemExit(f'{index}: the CodePen part must not include script.js or style.css')
        (index.parent / 'codepen.html').write_text(body + '\n', encoding='utf-8', newline='\n')
        print(f'{index.parent.name}/codepen.html: ok')


def build_esm():
    """lightwebsiteui.mjs — ES module entry that re-exports window.LightWebsiteUi."""
    version = re.search(r"VERSION = '([\d.]+)'", (ROOT / 'lightwebsiteui.js').read_text(encoding='utf-8')).group(1)
    (ROOT / 'lightwebsiteui.mjs').write_text(
        f"/*! LightWebsiteUi {version} — ES module entry. MIT License. https://github.com/si0683/LightWebsiteUi */\n"
        "// LightWebsiteUi is a browser script that defines window.LightWebsiteUi; this file re-exports it.\n"
        "import './lightwebsiteui.js';\n\n"
        "const LightWebsiteUi = typeof window !== 'undefined' ? window.LightWebsiteUi : undefined;\n"
        "export default LightWebsiteUi;\n"
        "export const start = (options) => LightWebsiteUi.start(options);\n"
        f"export const version = '{version}';\n", encoding='utf-8', newline='\n')
    print('lightwebsiteui.mjs: ok')


if __name__ == '__main__':
    found = build_photos()
    build_topics_doc(found)
    build_codepen()
    build_esm()
