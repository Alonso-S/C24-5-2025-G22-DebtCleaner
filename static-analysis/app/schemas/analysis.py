from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequest(BaseModel):
    code_path: str
    config_file: Optional[str] = None
    debug: bool = True
    analysis_types: List[str] = ["bandit", "radon"]
