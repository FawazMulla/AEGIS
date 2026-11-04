import logging
from typing import Dict, Any
from backend.config import settings
from .fallback_rules import RCAResult, get_deterministic_fallback

logger = logging.getLogger(__name__)

async def diagnose_incident(service_id: str, context_str: str, telemetry: Dict[str, Any]) -> RCAResult:
    if settings.GEMINI_API_KEY or settings.GROQ_API_KEY or settings.COHERE_API_KEY:
        try:
            import litellm
            messages = [
                {"role": "system", "content": "You are AEGIS Autonomous SRE. Diagnose root cause and provide remediations."},
                {"role": "user", "content": f"Context:\n{context_str}\nTelemetry:\n{telemetry}"}
            ]
            response = await litellm.acompletion(
                model="groq/llama3-8b-8192" if settings.GROQ_API_KEY else "gemini/gemini-1.5-flash",
                messages=messages,
                timeout=5.0
            )
            content = response.choices[0].message.content
            fallback = get_deterministic_fallback(service_id, telemetry)
            if content:
                fallback.explanation = f"{content[:200]}... (LLM Augmented)"
            return fallback
        except Exception as e:
            logger.warning(f"LiteLLM call failed ({e}); falling back to deterministic expert rules.")

    return get_deterministic_fallback(service_id, telemetry)
