from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from analyzers.bandit_analyzer import analyze_with_bandit
from analyzers.radon_analyzer import analyze_with_radon
import os

app = FastAPI()

class AnalysisRequest(BaseModel):
    code_path: str  # Ruta al directorio o archivo con el código fuente
    config_file: str = None  # Ruta al archivo de configuración de Bandit (opcional)
    debug: bool = True  # Modo depuración
    analysis_types: list = ["bandit", "radon"]  # Análisis a ejecutar: Bandit, Radon

@app.post("/analyze/")
async def analyze_code(request: AnalysisRequest):
    """
    Ejecuta análisis estático del código fuente proporcionado, utilizando Bandit y Radon.
    """
    code_path = request.code_path

    # Verificar si la ruta es válida
    if not os.path.exists(code_path):
        raise HTTPException(status_code=400, detail="La ruta proporcionada no existe.")
    
    results = {}

    # Analizar con Bandit si está en la lista de análisis
    if "bandit" in request.analysis_types:
        results["bandit"] = analyze_with_bandit(
            code_path=code_path,
            config_file=request.config_file,
            debug=request.debug
        )

    # Analizar con Radon si está en la lista de análisis
    if "radon" in request.analysis_types:
        results["radon"] = analyze_with_radon(code_path=code_path)

    return results
