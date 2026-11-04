import pytest
from backend.ingestion.compose_parser import parse_docker_compose

COMPOSE_FIXTURE = """
version: 3.8
services:
  gateway:
    image: kong:latest
    ports:
      - "8000:8000"
    environment:
      - PAYMENT_URL=http://payment:8002
      - LEDGER_URL=http://ledger:8003
    depends_on:
      - payment
  payment:
    image: payment:v1
    ports:
      - "8002:8002"
    environment:
      - LEDGER_URL=http://ledger:8003
    depends_on:
      - ledger
  ledger:
    image: ledger:v1
    ports:
      - "8003:8003"
"""

def test_parse_docker_compose():
    result = parse_docker_compose(COMPOSE_FIXTURE)
    assert result["metadata"]["totalNodes"] == 3
    node_ids = {n["id"] for n in result["nodes"]}
    assert node_ids == {"gateway", "payment", "ledger"}
    assert any(e["source"] == "gateway" and e["target"] == "payment" for e in result["edges"])
    assert any(e["source"] == "payment" and e["target"] == "ledger" for e in result["edges"])
