import urllib.request, json

titles2 = [
    'Bhindi_masala', 'Mapo_tofu', 'Jajangmyeon', 'Aloo_gobi',
    'Paneer_tikka', 'Paneer_makhani', 'Chicken_tikka', 'Kati_roll',
    'Carbonara', 'Bolognese_sauce', 'Pesto', 'Neapolitan_sauce',
    'Egg_drop_soup', 'Corn_soup', 'Teriyaki', 'Beef_curry',
    'Jjamppong', 'Tangsuyuk', 'Yangnyeom_chicken', 'Samgyetang',
    'Kalguksu', 'Makguksu', 'Sundubu-jjigae', 'Gamjatang', 'Galbi-tang'
]

title_str = '|'.join(titles2)
url = f'https://en.wikipedia.org/w/api.php?action=query&titles={title_str}&prop=pageimages&format=json&pithumbsize=600'
req = urllib.request.Request(url, headers={'User-Agent': 'DropAIBot/1.0'})
res = json.loads(urllib.request.urlopen(req).read())
pages = res['query']['pages']
for v in pages.values():
    print(f"{v.get('title')}: {v.get('thumbnail', {}).get('source')}")
