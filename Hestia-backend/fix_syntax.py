import os
import re

routers_dir = "/Volumes/320GB/Documents/Projects/hestia-new/hestia/Hestia-backend/app/routers"
files = ["ai.py", "items.py", "shopping_lists.py"]

for filename in files:
    filepath = os.path.join(routers_dir, filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    # Replace """ followed immediately by a letter or # with """\n    
    new_content = re.sub(r'"""([a-zA-Z#])', r'"""\n    \1', content)
    
    with open(filepath, "w") as f:
        f.write(new_content)
    
    print(f"Fixed syntax in {filename}")
