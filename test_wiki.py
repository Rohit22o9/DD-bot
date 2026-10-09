import urllib.request, json

titles = [
    'Okra', 'Mapo_doufu', 'Kimchi-buchimgae', 'Kadhi', 'Japchae', 
    'Tteokbokki', 'Gulab_jamun', 'Ras_malai', 'Butter_chicken', 
    'Biryani', 'Bulgogi', 'Jajangmyeon', 'Ramen', 'Teriyaki', 
    'Aloo_gobi', 'Baingan_bharta', 'Chana_masala', 'Rajma',
    'Dal_makhani', 'Stir-fried_tomato_and_scrambled_eggs',
    'Pakora', 'Samosa', 'Aloo_tikki', 'Lassi', 'Nasi_lemak',
    'Tonkotsu_ramen', 'Bibimbap', 'Budae-jjigae', 'Pajeon'
]

title_str = '|'.join(titles)
url = f'https://en.wikipedia.org/w/api.php?action=query&titles={title_str}&prop=pageimages&format=json&pithumbsize=600'
req = urllib.request.Request(url, headers={'User-Agent': 'DropAIBot/1.0'})
res = json.loads(urllib.request.urlopen(req).read())
pages = res['query']['pages']
for v in pages.values():
    print(f"{v.get('title')}: {v.get('thumbnail', {}).get('source')}")
