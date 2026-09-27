from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import graph, simulation, chaos, healing, actuator, memory

app = FastAPI(
    title="AEGIS Autonomous Mission Control API",
    description="Backend API powering Knowledge Graph, Pre-Ship Simulation, Chaos Fault Injection, and Autonomous Healing via Cohere on OCI",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(graph.router)
app.include_router(simulation.router)
app.include_router(chaos.router)
app.include_router(healing.router)
app.include_router(actuator.router)
app.include_router(memory.router)

@app.get("/")
async def root():
    return {
        "system": "AEGIS — Autonomous Engineering Graph & Intelligence System",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "ai_provider": "Cohere Command R+ on Oracle Cloud Infrastructure (OCI)"
    }

@app.get("/healthz")
async def health_check():
    return {
        "status": "HEALTHY",
        "graph_engine": "NetworkX In-Memory (Active)",
        "cohere_status": "Ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
