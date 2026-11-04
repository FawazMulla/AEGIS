import time
from typing import Dict, Any
import httpx
from backend.security.ssrf import validate_url_safe

class HealthChecker:
    def __init__(self, timeout: float = 3.0):
        self.timeout = timeout

    async def probe(self, url: str, allow_private: bool = False) -> Dict[str, Any]:
        validate_url_safe(url, allow_private=allow_private)
        start = time.time()
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, timeout=self.timeout)
                latency = round((time.time() - start) * 1000.0, 2)
                is_healthy = 200 <= resp.status_code < 300
                return {"url": url, "is_healthy": is_healthy, "status_code": resp.status_code, "latency_ms": latency, "error": None}
            except Exception as e:
                latency = round((time.time() - start) * 1000.0, 2)
                return {"url": url, "is_healthy": False, "status_code": 0, "latency_ms": latency, "error": str(e)}

health_checker = HealthChecker()
