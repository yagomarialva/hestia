import os
import re

routers_dir = "/Volumes/320GB/Documents/Projects/hestia-new/hestia/Hestia-backend/app/routers"
files = ["ai.py", "items.py", "shopping_lists.py"]

for filename in files:
    filepath = os.path.join(routers_dir, filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    # 1. Replace the parameter:
    # credentials: HTTPAuthorizationCredentials = Depends(security),
    # with
    # user: User = Depends(get_current_user),
    content = re.sub(
        r'credentials:\s*HTTPAuthorizationCredentials\s*=\s*Depends\(security\)',
        r'user: User = Depends(get_current_user)',
        content
    )
    
    # 2. Remove the security import
    content = re.sub(r'from fastapi\.security import HTTPBearer, HTTPAuthorizationCredentials\n', '', content)
    content = re.sub(r'security = HTTPBearer\(\)\n', '', content)
    
    # 3. Add User model import if not present
    if 'from ..models.user import User' not in content:
        content = content.replace('from ..database import get_db\n', 'from ..database import get_db\nfrom ..models.user import User\n')
    
    # 4. Remove the manual checks
    #   user = get_current_user(db, credentials.credentials)
    #   if not user:
    #       raise HTTPException(
    #           status_code=status.HTTP_401_UNAUTHORIZED,
    #           detail="Invalid authentication credentials",
    #           headers={"WWW-Authenticate": "Bearer"},
    #       )
    #
    # We use a non-greedy match that stops at the closing parenthesis of HTTPException.
    pattern = re.compile(
        r'([ \t]*)user\s*=\s*get_current_user\(db,\s*credentials\.credentials\)\s*\n'
        r'\s*if\s*not\s*user:\s*\n'
        r'\s*raise\s*HTTPException\s*\([^)]+\)\s*\n',
        re.MULTILINE
    )
    content = pattern.sub(r'', content)
    
    # Note: there is one case in ai.py where there is a try: block directly under the HTTPException.
    # The regex above matches up to the closing `)` of the HTTPException and the newline.
    
    with open(filepath, "w") as f:
        f.write(content)
    
    print(f"Patched {filename}")
