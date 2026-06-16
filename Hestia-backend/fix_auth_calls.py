import os
import re

routers_dir = "/Volumes/320GB/Documents/Projects/hestia-new/hestia/Hestia-backend/app/routers"

files = ["ai.py", "items.py", "shopping_lists.py"]

for filename in files:
    filepath = os.path.join(routers_dir, filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    # Remove the manual get_current_user call and its validation block
    # This regex matches:
    #     user = get_current_user(db, credentials.credentials)
    #     if not user:
    #         raise HTTPException(...)
    
    # It might have headers={"WWW-Authenticate": "Bearer"} or not.
    pattern = re.compile(
        r'\s*user\s*=\s*get_current_user\(db,\s*credentials\.credentials\)\s*\n'
        r'\s*if\s*not\s*user:\s*\n'
        r'(?:\s*raise\s*HTTPException\s*\(\s*\n.*?\n.*?\n.*?\)\s*|\s*raise\s*HTTPException[^\n]*\s*)',
        re.MULTILINE | re.DOTALL
    )
    
    new_content = pattern.sub('', content)
    
    with open(filepath, "w") as f:
        f.write(new_content)
    
    print(f"Fixed {filename}")
