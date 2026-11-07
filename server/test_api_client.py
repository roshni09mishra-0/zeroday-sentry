import requests

# 1. Health check
r = requests.get("http://127.0.0.1:8787/")
print("1. Root Status:", r.status_code, r.json()["service"])

# 2. AST scan
r_ast = requests.post("http://127.0.0.1:8787/api/ast/scan", json={
    "cve_id": "CVE-2026-3114",
    "file_path": "src/routes/auth.ts",
    "code_content": "import jwt from 'jsonwebtoken';\nconst val = jwt.verify(token, secret, { algorithms: ['none'] });"
})
print("2. AST Scan:", r_ast.status_code, r_ast.json()["verdict"])

# 3. Switch Flow Run
r_flow = requests.post("http://127.0.0.1:8787/api/switch/flow/run", json={
    "cve_id": "CVE-2026-3114"
})
print("3. Switch Flow:", r_flow.status_code, "Steps:", len(r_flow.json()["steps"]))

# 4. PR 1-Click Approve
r_pr = requests.post("http://127.0.0.1:8787/api/github/pr/approve", json={
    "pr_number": 142,
    "approver": "Lead Dev"
})
print("4. PR Approve:", r_pr.status_code, r_pr.json()["status"])
