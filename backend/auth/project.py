from fastapi import Header, HTTPException
from typing import Optional

def get_project_id(x_project_id: Optional[str] = Header(default="demo")) -> str:
    if not x_project_id or not x_project_id.strip():
        raise HTTPException(status_code=400, detail="Missing X-Project-ID header")
    return x_project_id.strip()

def verify_api_key(x_api_key: Optional[str] = Header(default=None)) -> None:
    if x_api_key is not None and not x_api_key.startswith("agk_"):
        raise HTTPException(status_code=401, detail="Invalid API key format")
