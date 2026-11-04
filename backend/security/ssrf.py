import ipaddress
import socket
from urllib.parse import urlparse

BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("224.0.0.0/4"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fe80::/10"),
]

def validate_url_safe(url: str, allow_private: bool = False) -> bool:
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname
        if not hostname:
            raise ValueError(f"Invalid URL: {url}")
        if parsed.scheme not in ("http", "https"):
            raise ValueError(f"Forbidden URL scheme: {parsed.scheme}")

        try:
            ip = ipaddress.ip_address(hostname)
            ips = [ip]
        except ValueError:
            try:
                addr_info = socket.getaddrinfo(hostname, None)
                ips = [ipaddress.ip_address(info[4][0]) for info in addr_info]
            except Exception:
                if hostname in ("localhost", "169.254.169.254", "metadata.google.internal"):
                    raise ValueError(f"Blocked SSRF target: {hostname}")
                return True

        for ip in ips:
            if not allow_private:
                for blocked in BLOCKED_NETWORKS:
                    if ip in blocked:
                        raise ValueError(f"SSRF violation: target IP {ip} is in blocked range {blocked}")
        return True
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"SSRF check failed: {e}")
