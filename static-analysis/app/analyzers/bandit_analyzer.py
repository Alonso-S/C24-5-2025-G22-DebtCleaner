import os
from bandit.core.manager import BanditManager
from bandit.core.config import BanditConfig
from bandit.core.test_set import BanditTestSet

def analyze_with_bandit(code_path: str, config_file: str = None, debug: bool = False):
    """
    Ejecuta un análisis de seguridad usando Bandit sobre el código fuente en `code_path`.

    Args:
        code_path (str): Ruta al archivo o directorio de código a analizar.
        config_file (str, optional): Ruta al archivo de configuración de Bandit. Default: None.
        debug (bool, optional): Activa salida de depuración. Default: False.

    Returns:
        list[dict]: Lista de diccionarios con los problemas de seguridad detectados o un mensaje si no se encontraron.
    """
    code_path = os.path.abspath(code_path)
    print(f'CODE_PATH: {code_path}')

    config = BanditConfig(config_file=config_file)
    test_set = BanditTestSet(config, profile={})

    manager = BanditManager(
        config=config,
        agg_type="all",
        debug=debug,
        verbose=True,
        quiet=False,
        ignore_nosec=False,
    )

    manager.b_ts = test_set
    manager.files_list.append(code_path)
    manager.run_tests()

    issues = manager.get_issue_list()
    results = []

    if issues:
        for issue in issues:
            results.append({
                "issue": str(issue),
                "severity": issue.severity,
                "confidence": issue.confidence,
                "col_offset": issue.col_offset,
                "description": issue.text,
                "file": issue.fname,
                "linerange": issue.linerange,
                "lineno": issue.lineno,
                "cwe": getattr(issue, 'cwe', None),
                "test": issue.test,
                "firstlineno": getattr(issue, '__firstlineno__', None),
                "end_col_offset": getattr(issue, 'end_col_offset', None),
                "fdata": issue.fdata,
                "filter": issue.filter,
                "get_code": issue.get_code(),
                "ident": issue.ident,
                "test_id": issue.test_id,
                "as_dict": issue.as_dict(),
            })
    else:
        results.append({"message": "No issues found."})

    return results
