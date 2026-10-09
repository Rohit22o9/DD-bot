import urllib.request, urllib.parse, json

def search_wiki(query):
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=3&prop=pageimages&format=json&pithumbsize=600"
    req = urllib.request.Request(url, headers={'User-Agent': 'DropAIBot/1.0'})
    res = json.loads(urllib.request.urlopen(req).read())
    pages = res.get('query', {}).get('pages', {})
    for p in pages.values():
        thumb = p.get('thumbnail', {}).get('source')
        if thumb:
            print(f"[{query}] -> {p.get('title')}: {thumb}")

for q in ['Teriyaki bowl', 'Donburi', 'Fried rice', 'Thali', 'Chow mein', 'Beef curry', 'Tomato rice', 'Egg noodles']:
    search_wiki(q)
