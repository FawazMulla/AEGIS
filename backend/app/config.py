import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Oracle Cloud OCI Configuration
    OCI_CONFIG_FILE: str = os.path.expanduser("~/.oci/config")
    OCI_COMPARTMENT_ID: str = ""
    OCI_REGION: str = "us-chicago-1"
    
    # Cohere via OCI Generative AI
    OCI_GENAI_ENDPOINT: str = "https://inference.generativeai.us-chicago-1.oci.oraclecloud.com"
    COHERE_MODEL_ID: str = "cohere.command-r-plus"
    
    # Fallback: Direct Cohere API (if OCI not configured)
    COHERE_API_KEY: str = ""
    
    # Neo4j configuration (optional, in-memory NetworkX active by default)
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "aegispassword"
    
    # App server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
