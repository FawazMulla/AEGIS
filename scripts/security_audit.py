import os, re, sys

FORBIDDEN_SECRET_PATTERNS = [
    re.compile(r'(?i)(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36}'),
    re.compile(r'(?i)(?:sk-live|sk-ant|sk-proj)-[A-Za-z0-9_-]{32,}'),
    re.compile(r'AKIA[0-9A-Z]{16}'),
]
ALLOWED_FILES = {".env.example", "secrets.enc", "security_audit.py"}

def scan_file(filepath: str) -> list:
    leaks = []
    if os.path.basename(filepath) in ALLOWED_FILES:
        return leaks
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            for line_no, line in enumerate(f, 1):
                for pat in FORBIDDEN_SECRET_PATTERNS:
                    if pat.search(line):
                        leaks.append((filepath, line_no, line.strip()))
    except Exception:
        pass
    return leaks

def run_security_audit():
    print("[*] Running AEGIS Security Audit...")
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    all_leaks = []
    for root, dirs, files in os.walk(root_dir):
        if any(ignored in root for ignored in (".git", "node_modules", ".venv", "dist", ".pytest_cache")):
            continue
        for file in files:
            all_leaks.extend(scan_file(os.path.join(root, file)))

    if all_leaks:
        print(f"[!] Found {len(all_leaks)} unmitigated secret leaks:")
        sys.exit(1)
    else:
        print("[+] Secret scan complete: 0 unmitigated leaks found.")
        sys.exit(0)

if __name__ == "__main__":
    run_security_audit()
