from app.utils.helpers import group_issues_by_file, get_tool_versions

def format_analysis_response(raw_results: dict) -> dict:
    formatted = {
        "tools_used": list(raw_results.keys()),
        "tool_versions": get_tool_versions(),
        "summary": {},
        "issues_by_file": {},
        "raw": raw_results
    }

    # Extraer resumen y agrupar issues por archivo
    for tool, result in raw_results.items():
        if tool == "bandit":
            issues = result if isinstance(result, list) else result.get("results", [])
            formatted["summary"][tool] = {
                "total_issues": len(issues),
                "severities": count_severities(issues)
            }
            formatted["issues_by_file"].setdefault(tool, group_issues_by_file(issues))
        elif tool == "radon":
            formatted["summary"][tool] = {
                "functions_analyzed": len(result.get("cyclomatic_complexity", [])),
                "maintainability_index": result.get("maintainability_index")
            }
            formatted["issues_by_file"].setdefault(tool, result.get("cyclomatic_complexity", []))

    return formatted

def count_severities(issues: list) -> dict:
    counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}
    for issue in issues:
        sev = issue.get("severity", "").upper()
        if sev in counts:
            counts[sev] += 1
    return counts
