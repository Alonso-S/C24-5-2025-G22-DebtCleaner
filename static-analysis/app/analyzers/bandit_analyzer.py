import os
from bandit.core.manager import BanditManager
from bandit.core.config import BanditConfig
from bandit.core.test_set import BanditTestSet

def analyze_with_bandit(code_path: str, config_file: str = None, debug: bool = False):
    """
    Analiza el código fuente utilizando Bandit para detectar problemas de seguridad.
    
    :param code_path: Ruta al archivo o directorio que contiene el código fuente a analizar.
    :param config_file: Ruta al archivo de configuración de Bandit (opcional).
    :param debug: Modo de depuración.
    :return: Lista de problemas encontrados durante el análisis.
    """
    # Convertir la ruta a absoluta si es relativa
    code_path = os.path.abspath(code_path)
    
    # Cargar la configuración de Bandit desde el archivo de configuración si se pasa
    config = BanditConfig(config_file=config_file)  # BanditConfig maneja la configuración general
    
    # Crear el conjunto de pruebas BanditTestSet
    profile = {}  # Si necesitas un perfil, puedes pasarlo aquí.
    test_set = BanditTestSet(config, profile)  # Esto carga los tests definidos en Bandit
    
    # Inicializar BanditManager con los parámetros adecuados
    manager = BanditManager(
        config=config,
        agg_type="all",  # Tipo de agregación: "all", "file", etc.
        debug=debug,
        verbose=True,  # Activar verbose para obtener más detalles
        quiet=False,
        ignore_nosec=False,
    )
    
    # Si es un directorio, agregar todos los archivos .py a analizar
    if os.path.isdir(code_path):
        for root, dirs, files in os.walk(code_path):
            for file in files:
                if file.endswith('.py'):
                    manager.files_list.append(os.path.join(root, file))
    else:
        # Si es un archivo, solo agregar ese archivo
        manager.files_list.append(code_path)
    
    # Ejecutar el análisis de seguridad
    manager.run_tests()  # Bandit ya tiene los archivos en manager.files_list

    # Filtrar y obtener los resultados
    issues = manager.get_issue_list()

    # Crear un diccionario para almacenar los problemas encontrados
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
                "cwe": issue.cwe if hasattr(issue, 'cwe') else None,
                "test": issue.test,
                "firstlineno": issue.__firstlineno__,
                "end_col_offset": issue.end_col_offset,
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
