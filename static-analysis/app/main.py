from fastapi import FastAPI, HTTPException
from app.schemas.analysis import AnalysisRequest
from app.analyzers.bandit_analyzer import analyze_with_bandit
from app.analyzers.radon_analyzer import analyze_with_radon
from app.analyzers.formatter import format_analysis_response
from app.config.settings import settings
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)


@app.get("/")
def root():
    return {
        "message": "Bienvenido a DebtCleaner - Módulo de Análisis Estático",
        "available_endpoints": ["/analyze/", "/health", "/versions"]
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/versions")
def tool_versions():
    from app.utils.helpers import get_tool_versions
    return get_tool_versions()

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

    if "bandit" in request.analysis_types:
        results["bandit"] = analyze_with_bandit(
            code_path=code_path,
            config_file=request.config_file,
            debug=request.debug
        )

    if "radon" in request.analysis_types:
        results["radon"] = analyze_with_radon(code_path=code_path)

    return format_analysis_response(results)
