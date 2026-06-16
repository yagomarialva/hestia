import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000/api/v1"

def request(method, url, data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req, data=data) as response:
            res_data = response.read().decode('utf-8')
            return response.status, json.loads(res_data) if res_data else None
    except urllib.error.HTTPError as e:
        res_data = e.read().decode('utf-8')
        return e.code, json.loads(res_data) if res_data else None

def run_test():
    print("1. Creating list...")
    status, data = request('POST', f"{BASE_URL}/shopping-lists", {
        "name": "E2E Test List",
        "description": "Test description"
    })
    print(status, data)
    list_id = data.get("id")

    print("\n2. Getting list details...")
    status, data = request('GET', f"{BASE_URL}/shopping-lists/{list_id}")
    print(status, data)

    print("\n3. Adding item...")
    status, item_data = request('POST', f"{BASE_URL}/shopping-lists/{list_id}/items", {
        "name": "Test Apple",
        "quantity": 5.0,
        "unit": "un",
        "sector": "hortifruti"
    })
    print(status, item_data)
    item_id = item_data.get("id")

    print("\n4. Getting list details again...")
    status, data = request('GET', f"{BASE_URL}/shopping-lists/{list_id}")
    print(status, data)

    print("\n5. Editing item...")
    status, data = request('PUT', f"{BASE_URL}/items/{item_id}", {
        "name": "Test Banana",
        "quantity": 10.0,
        "unit": "kg",
        "sector": "hortifruti",
        "is_purchased": True
    })
    print(status, data)

    print("\n6. Deleting item...")
    status, data = request('DELETE', f"{BASE_URL}/items/{item_id}")
    print(status, data)

    print("\n7. Deleting list...")
    status, data = request('DELETE', f"{BASE_URL}/shopping-lists/{list_id}")
    print(status, data)

run_test()
