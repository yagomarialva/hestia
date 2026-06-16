import requests

BASE_URL = "http://localhost:8000/api/v1"

def run_test():
    # 1. Create a new shopping list
    print("1. Creating list...")
    r = requests.post(f"{BASE_URL}/shopping-lists", json={
        "name": "E2E Test List",
        "description": "Test description"
    })
    print(r.status_code, r.text)
    list_id = r.json().get("id")

    # 2. Get the list details
    print("\n2. Getting list details...")
    r = requests.get(f"{BASE_URL}/shopping-lists/{list_id}")
    print(r.status_code, r.text)

    # 3. Add an item
    print("\n3. Adding item...")
    r = requests.post(f"{BASE_URL}/shopping-lists/{list_id}/items", json={
        "name": "Test Apple",
        "quantity": 5.0,
        "unit": "un",
        "sector": "hortifruti"
    })
    print(r.status_code, r.text)
    item_id = r.json().get("id")

    # 4. Get the list details again (should show item)
    print("\n4. Getting list details again...")
    r = requests.get(f"{BASE_URL}/shopping-lists/{list_id}")
    print(r.status_code, r.text)

    # 5. Edit item
    print("\n5. Editing item...")
    r = requests.put(f"{BASE_URL}/items/{item_id}", json={
        "name": "Test Banana",
        "quantity": 10.0,
        "unit": "kg",
        "sector": "hortifruti",
        "is_checked": True
    })
    print(r.status_code, r.text)

    # 6. Delete item
    print("\n6. Deleting item...")
    r = requests.delete(f"{BASE_URL}/items/{item_id}")
    print(r.status_code, r.text)

    # 7. Delete list
    print("\n7. Deleting list...")
    r = requests.delete(f"{BASE_URL}/shopping-lists/{list_id}")
    print(r.status_code, r.text)

run_test()
