import httpx
from typing import Dict, Any, Optional

class GitHubFetcher:
    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            self.headers["Authorization"] = f"token {token}"

    async def fetch_repository_info(self, repo_full_name: str, strict: bool = True) -> Dict[str, Any]:
        url = f"https://api.github.com/repos/{repo_full_name}"
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, headers=self.headers, timeout=10.0)
                if resp.status_code in (404, 401, 403):
                    if strict:
                        raise ValueError(f"Repository {repo_full_name} not found or inaccessible (HTTP {resp.status_code})")
                    return {}
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as e:
                if strict:
                    raise ValueError(f"Repository {repo_full_name} not found or inaccessible: {e}")
                return {}
            except httpx.RequestError as e:
                if strict:
                    raise ValueError(f"Network error accessing repository {repo_full_name}: {e}")
                return {}

    def fetch_repository_sync(self, repo_full_name: str, strict: bool = True) -> Dict[str, Any]:
        url = f"https://api.github.com/repos/{repo_full_name}"
        with httpx.Client() as client:
            try:
                resp = client.get(url, headers=self.headers, timeout=10.0)
                if resp.status_code in (404, 401, 403):
                    if strict:
                        raise ValueError(f"Repository {repo_full_name} not found or inaccessible (HTTP {resp.status_code})")
                    return {}
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                if strict:
                    raise ValueError(f"Repository {repo_full_name} not found or inaccessible: {e}")
                return {}

github_fetcher = GitHubFetcher()
