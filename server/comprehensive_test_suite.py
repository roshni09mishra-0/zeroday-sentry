"""
ZeroDay Sentry - Comprehensive Test Suite
Flip the Switch Hackathon (Track 1: Best Business Workflow)
Validates:
1. Frontend HTTP & Bundle Sanity
2. Backend API & Health
3. AST Reachability Engine (Real Wolf vs Dead Code)
4. Switch Declarative 6-Step Workflow Execution
5. Multi-Agent War Room AI Response (Gemini 3.5)
6. PR Human Approval & Squash Merge Gate
7. Declarative YAML Schemas (switch.yaml, zeroday-flow.yaml, agent template)
"""

import os
import sys
import json
import requests

TOTAL_TESTS = 0
PASSED_TESTS = 0
FAILED_TESTS = 0

def run_test(name, func):
    global TOTAL_TESTS, PASSED_TESTS, FAILED_TESTS
    TOTAL_TESTS += 1
    try:
        func()
        print(f"  [PASS] Test {TOTAL_TESTS}: {name}")
        PASSED_TESTS += 1
    except AssertionError as ae:
        print(f"  [FAIL] Test {TOTAL_TESTS}: {name} -> Assertion failed: {ae}")
        FAILED_TESTS += 1
    except Exception as e:
        print(f"  [FAIL] Test {TOTAL_TESTS}: {name} -> Error: {e}")
        FAILED_TESTS += 1

print("\n" + "=" * 65)
print("  ZERODAY SENTRY - END-TO-END AUTOMATED VERIFICATION SUITE")
print("=" * 65 + "\n")

# 1. Frontend Tests
print(">>> SUITE 1: Frontend Web Application")
def test_frontend_status():
    res = requests.get("http://localhost:4173", timeout=5)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert "ZeroDay Sentry" in res.text or "<div id=\"root\">" in res.text, "Index HTML missing root mount"

run_test("Frontend HTTP 200 and Root Mount Verification", test_frontend_status)

# 2. Backend Health
print("\n>>> SUITE 2: Backend Gateway & Health")
def test_backend_health():
    res = requests.get("http://127.0.0.1:8787/", timeout=5)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "online", "Backend status not online"
    assert data["switch_version"] == "v1.0.0", "Switch version mismatch"
    assert "slack" in data["bridges"], "Missing Slack bridge"
    assert "discord" in data["bridges"], "Missing Discord bridge"
    assert "teams" in data["bridges"], "Missing Teams bridge"

run_test("Backend Gateway Online with Multi-Bridge Adapters", test_backend_health)

# 3. AST Reachability Engine Tests
print("\n>>> SUITE 3: AST Reachability Analysis Engine")
def test_ast_reachable_production():
    payload = {
        "cve_id": "CVE-2026-3114",
        "file_path": "src/routes/auth.ts",
        "code_content": "import jwt from 'jsonwebtoken';\nexport function verify(t, s) { return jwt.verify(t, s, { algorithms: ['none'] }); }"
    }
    res = requests.post("http://127.0.0.1:8787/api/ast/scan", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["is_reachable"] is True, "Production vulnerability should be reachable"
    assert data["verdict"] == "REACHABLE_PRODUCTION", f"Unexpected verdict: {data['verdict']}"
    assert data["match_count"] >= 1, "Should find at least 1 dangerous method call"
    assert data["suggested_fix"] is not None, "Missing suggested fix for reachable CVE"

run_test("AST Engine: Real Wolf in Production Route (Flagged & Fix Proposed)", test_ast_reachable_production)

def test_ast_dead_test_code():
    payload = {
        "cve_id": "CVE-2026-3114",
        "file_path": "tests/unit/legacy_fixture.spec.ts",
        "code_content": "import jwt from 'jsonwebtoken';\nconst mock = jwt.verify(t, s, { algorithms: ['none'] });"
    }
    res = requests.post("http://127.0.0.1:8787/api/ast/scan", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["is_reachable"] is False, "Test fixture CVE must NOT be marked reachable"
    assert data["verdict"] == "DEAD_TEST_CODE", f"Expected DEAD_TEST_CODE, got {data['verdict']}"
    assert data["is_test_file"] is True

run_test("AST Engine: Dead Test Code Crying Wolf (Filtered & Muted)", test_ast_dead_test_code)

def test_ast_unreachable_no_call():
    payload = {
        "cve_id": "CVE-2026-3114",
        "file_path": "src/utils/helpers.ts",
        "code_content": "export function add(a: number, b: number) { return a + b; }"
    }
    res = requests.post("http://127.0.0.1:8787/api/ast/scan", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["is_reachable"] is False
    assert data["verdict"] == "UNREACHABLE"

run_test("AST Engine: Package Unused in File (Zero False Positives)", test_ast_unreachable_no_call)

# 4. Switch Declarative 6-Step Workflow Execution
print("\n>>> SUITE 4: Switch Declarative Flow Orchestrator")
def test_switch_flow_execution():
    payload = {
        "cve_id": "CVE-2026-3114",
        "repo_target": "api-backend-core"
    }
    res = requests.post("http://127.0.0.1:8787/api/switch/flow/run", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["all_steps_passed"] is True, "Flow failed step execution"
    assert len(data["steps"]) == 6, f"Expected 6 pipeline steps, got {len(data['steps'])}"
    
    step_names = [s["id"] for s in data["steps"]]
    assert "ingest_advisory" in step_names
    assert "ast_reachability_filter" in step_names
    assert "patch_synthesis" in step_names
    assert "sandbox_verification" in step_names
    assert "dispatch_bridges" in step_names
    assert "human_signoff_gate" in step_names
    
    # Check sandbox test passed 18/18
    sandbox_step = next(s for s in data["steps"] if s["id"] == "sandbox_verification")
    assert sandbox_step["payload"]["passed"] == 18
    assert sandbox_step["payload"]["failed"] == 0

run_test("Switch Flow: 6-Step Deterministic Pipeline Execution", test_switch_flow_execution)

# 5. Multi-Agent Chat AI Inference
print("\n>>> SUITE 5: Switch War Room Multi-Agent Chat (Gemini 3.5)")
def test_switch_chat():
    payload = {
        "message": "is CVE-2026-3114 reachable in auth.ts?",
        "cve_context": "CVE-2026-3114"
    }
    res = requests.post("http://127.0.0.1:8787/api/switch/chat", json=payload, timeout=15)
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data and len(data["reply"]) > 10, "Empty response from agent"
    assert data["sender"] == "patch-crafter"

run_test("Switch War Room: Multi-Agent AI Response Streaming", test_switch_chat)

# 6. PR Human Approval Gate
print("\n>>> SUITE 6: GitHub 1-Click Human Approval Gate")
def test_pr_approve():
    payload = {
        "pr_number": 142,
        "approver": "Lead Dev (roshu)"
    }
    res = requests.post("http://127.0.0.1:8787/api/github/pr/approve", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "MERGED"
    assert data["commit_hash"] == "4b9a12e"
    assert data["tests_passed"] == "18/18"

run_test("GitHub PR Gate: Human-in-the-Loop 1-Click Squash Merge", test_pr_approve)

# 7. Declarative YAML Schemas Validation
print("\n>>> SUITE 7: Switch Declarative YAML Architecture")
def test_yaml_files_exist():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    switch_yaml = os.path.join(base_dir, "switch", "switch.yaml")
    flow_yaml = os.path.join(base_dir, "switch", "workflows", "zeroday-flow.yaml")
    template_yaml = os.path.join(base_dir, "switch", "examples", "agent-templates", "security-war-room.template.yaml")
    readme_md = os.path.join(base_dir, "README.md")
    
    assert os.path.exists(switch_yaml), "Missing switch/switch.yaml"
    assert os.path.exists(flow_yaml), "Missing switch/workflows/zeroday-flow.yaml"
    assert os.path.exists(template_yaml), "Missing agent template YAML"
    assert os.path.exists(readme_md), "Missing README.md"
    
    with open(flow_yaml, "r", encoding="utf-8") as f:
        content = f.read()
        assert "version: 1" in content, "Flow missing version: 1"
        assert "steps:" in content, "Flow missing steps declaration"
        assert "cve-analyst" in content, "Flow missing cve-analyst"
        assert "patch-crafter" in content, "Flow missing patch-crafter"

run_test("Switch YAML Specifications & Official Template Schemas", test_yaml_files_exist)

# 8. Persistent SQLite Database Integration
print("\n>>> SUITE 8: Persistent SQLite Database Ledger")
def test_database_ledger():
    # 1. Verify DB file exists on disk
    db_file = os.path.join(os.path.dirname(__file__), "zeroday_sentry.db")
    assert os.path.exists(db_file), "Database file zeroday_sentry.db does not exist"

    # 2. Query CVEs from API
    res = requests.get("http://127.0.0.1:8787/api/cves", timeout=5)
    assert res.status_code == 200, f"Failed to list CVEs: {res.status_code}"
    cves = res.json()
    assert len(cves) >= 2, "Expected at least 2 CVEs in database"
    cve_ids = [c["cve_id"] for c in cves]
    assert "CVE-2023-45857" in cve_ids, "Missing axios CVE-2023-45857"
    assert "CVE-2021-23337" in cve_ids, "Missing lodash CVE-2021-23337"

    # 3. Query Messages from API
    msg_res = requests.get("http://127.0.0.1:8787/api/messages", timeout=5)
    assert msg_res.status_code == 200, f"Failed to get messages: {msg_res.status_code}"
    messages = msg_res.json()
    assert len(messages) >= 5, "Expected at least 5 seeded war-room messages"

    # 4. Insert New Message into DB
    new_msg = {
        "id": f"test-msg-{os.getpid()}",
        "room_id": "security-war-room",
        "sender_type": "human",
        "author_name": "Meera (lead dev)",
        "tag": "Lead Dev",
        "content": "Automated verification test audit ping",
        "timestamp_str": "11:15"
    }
    post_res = requests.post("http://127.0.0.1:8787/api/messages", json=new_msg, timeout=5)
    assert post_res.status_code == 200, "Failed to persist message to database"

run_test("SQLite Ledger: CVEs, Audit Trail & War Room History", test_database_ledger)

# Summary
print("\n" + "=" * 65)
print(f"  TOTAL TESTS RUN: {TOTAL_TESTS} | PASSED: {PASSED_TESTS} | FAILED: {FAILED_TESTS}")
print("=" * 65 + "\n")

if FAILED_TESTS > 0:
    sys.exit(1)
sys.exit(0)
