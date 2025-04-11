import os
from radon.complexity import cc_visit
from radon.metrics import mi_visit
from radon.raw import analyze

def analyze_with_radon(code_path: str):
    """
    Analiza la complejidad ciclomática y el índice de mantenibilidad de un archivo o directorio.
    
    :param code_path: Ruta al archivo o directorio con el código fuente a analizar.
    :return: Diccionario con los resultados de los análisis.
    """
    results = {
        "cyclomatic_complexity": [],
        "maintainability_index": None,
        "raw_metrics": {}
    }
    
    # Si es un directorio, recorrer todos los archivos .py en el directorio y subdirectorios
    if os.path.isdir(code_path):
        for root, dirs, files in os.walk(code_path):
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    # Leer el contenido del archivo antes de pasarlo a Radon
                    with open(file_path, 'r', encoding='utf-8') as f:
                        code = f.read()
                    cc_results = cc_visit(code)
                    mi_score = mi_visit(code, True)
                    
                    # Guardar resultados de complejidad ciclomática
                    for r in cc_results:
                        results["cyclomatic_complexity"].append({
                            "function": r.name,
                            "start_line": r.lineno,
                            "complexity": r.complexity
                        })
                    
                    # Mantener el índice de mantenibilidad para el primer archivo
                    if results["maintainability_index"] is None:
                        results["maintainability_index"] = mi_score
                    
                    # Métricas adicionales
                    raw_metrics = analyze(code)
                    results["raw_metrics"][file_path] = {
                        "loc": raw_metrics.loc,  # Lines of Code
                        "lloc": raw_metrics.lloc,  # Logical Lines of Code
                        "comments": raw_metrics.comments,  # Comentarios
                        "blank": raw_metrics.blank  # Líneas en blanco
                    }

    else:
        # Si es un archivo, leer su contenido y analizarlo
        with open(code_path, 'r', encoding='utf-8') as f:
            code = f.read()
        cc_results = cc_visit(code)
        mi_score = mi_visit(code, True)
        
        # Guardar resultados de complejidad ciclomática
        for r in cc_results:
            results["cyclomatic_complexity"].append({
                "function": r.name,
                "start_line": r.lineno,
                "complexity": r.complexity
            })
        
        results["maintainability_index"] = mi_score
        
        # Métricas adicionales
        raw_metrics = analyze(code)
        results["raw_metrics"]["single_file"] = {
            "loc": raw_metrics.loc,  # Lines of Code
            "lloc": raw_metrics.lloc,  # Logical Lines of Code
            "comments": raw_metrics.comments,  # Comentarios
            "blank": raw_metrics.blank  # Líneas en blanco
        }

    return results
