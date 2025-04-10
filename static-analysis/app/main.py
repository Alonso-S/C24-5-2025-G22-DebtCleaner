from fastapi import FastAPI
from pydantic import BaseModel
from analyzers.bandit_analyzer import analyze_with_bandit

app = FastAPI()

class AnalysisRequest(BaseModel):
    code_path: str  # Ruta al directorio o archivo con el código fuente
    config_file: str = None  # Ruta al archivo de configuración de Bandit (opcional)
    debug: bool = True  # Modo depuración

@app.post("/analyze/")
async def analyze_code(request: AnalysisRequest):
    """
    Ejecuta un análisis de seguridad con Bandit sobre el código fuente proporcionado.
    """
    results = analyze_with_bandit(
        code_path=request.code_path,
        config_file=request.config_file,
        debug=request.debug
    )
    return {"bandit": results}
