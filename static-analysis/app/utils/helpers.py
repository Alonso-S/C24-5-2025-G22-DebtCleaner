import subprocess

def group_issues_by_file(issues: list) -> dict:
    grouped = {}
    for issue in issues:
        file_path = issue.get("file")
        if file_path not in grouped:
            grouped[file_path] = []
        grouped[file_path].append(issue)
    return grouped

def get_tool_versions() -> dict:
    versions = {}
    try:
        versions["bandit"] = subprocess.check_output(["bandit", "--version"], text=True).strip()
    except Exception:
        versions["bandit"] = "unknown"
    try:
        import radon
        versions["radon"] = radon.__version__
    except Exception:
        versions["radon"] = "unknown"
    return versions
