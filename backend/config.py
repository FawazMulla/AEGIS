import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    GRAPH_BACKEND: str = "networkx"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]

    THRESHOLD_BLOCK: float = 70.0
    THRESHOLD_WARN: float = 40.0
    ADMIN_SHARED_SECRET: str = "aegis-super-secret-admin-key"
    WEBHOOK_SECRET: str = "aegis-github-webhook-secret"

    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    COHERE_API_KEY: Optional[str] = None

    OCI_CONFIG_FILE: str = os.path.expanduser("~/.oci/config")
    OCI_COMPARTMENT_ID: str = ""
    OCI_REGION: str = "us-chicago-1"
    OCI_GENAI_ENDPOINT: str = "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com"
    COHERE_MODEL_ID: str = "cohere.command-r-plus"

settings = Settings()
