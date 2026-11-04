import pytest
from backend.sim.contract_diff import diff_schemas
from backend.webhooks.git_diff_analyzer import analyze_git_diff

def test_contract_diff_breaking_and_safe():
    old_schema = {"paths": {"/pets": ["get", "post"]}, "properties": {"id": {"type": "integer"}, "name": {"type": "string"}, "telephone": {"type": "string"}}}
    new_schema_breaking = {"paths": {"/pets": ["get"]}, "properties": {"id": {"type": "integer"}, "name": {"type": "string"}}}
    res_b = diff_schemas(old_schema, new_schema_breaking)
    assert res_b.is_breaking is True
    assert res_b.score == 100.0
    assert len(res_b.breaking_changes) == 2

    new_schema_safe = {"paths": {"/pets": ["get", "post"]}, "properties": {"id": {"type": "integer"}, "name": {"type": "string"}, "telephone": {"type": "string"}, "notes": {"type": "string"}}}
    res_s = diff_schemas(old_schema, new_schema_safe)
    assert res_s.is_breaking is False
    assert res_s.score == 0.0

def test_git_diff_analyzer_spring_boot():
    diff_patch = """
--- a/Owner.java
+++ b/Owner.java
@@ -10,2 +10,1 @@
-    private String telephone;
+    private String notes;
-    @PostMapping("/pets/{petId}/visits")
+    @PostMapping("/pets/{petId}/medical-visits")
"""
    res = analyze_git_diff(diff_patch)
    assert res.is_breaking is True
    assert any("telephone" in b for b in res.breaking_changes)
    assert any("visits" in b for b in res.breaking_changes)
