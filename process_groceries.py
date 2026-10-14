import openpyxl, json

wb = openpyxl.load_workbook('Groceries list.xlsx', data_only=True)
sheet = wb.active
rows = list(sheet.iter_rows(values_only=True))
headers = [str(h).strip() for h in rows[0]]
items = []
for r in rows[1:]:
    if not any(r): continue
    d = dict(zip(headers, r))
    items.append({
        "id": str(d.get("Product ID", "")).strip(),
        "name": str(d.get("Product Name", "")).strip(),
        "category": str(d.get("Category", "")).strip(),
        "brand": str(d.get("Brand", "")).strip(),
        "packSize": str(d.get("Pack Size", "")).strip(),
        "price": round(float(d.get("Price (AUD $)", 0.0)), 2),
    })

print(f"Total parsed: {len(items)}")
print(f"Sample 1: {items[0]}")
print(f"Sample 400: {items[-1]}")
prices = [it["price"] for it in items]
print(f"Min price: {min(prices)}, Max price: {max(prices)}, Average: {round(sum(prices)/len(prices), 2)}")
