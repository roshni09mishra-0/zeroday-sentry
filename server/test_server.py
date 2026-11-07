import main
print("FastAPI app initialized successfully:", main.app.title)

# Test AST Engine
res = main.ast_engine.scan_code(
    "CVE-2026-3114",
    "src/routes/auth.ts",
    "import jwt from 'jsonwebtoken';\nconst val = jwt.verify(token, secret, { algorithms: ['none'] });"
)
print("AST Engine Result:", res["verdict"], "Reachable:", res["is_reachable"])

# Test Orchestrator flow
flow_res = main.orchestrator.execute_flow("CVE-2026-3114")
print("Switch Flow Steps:", len(flow_res["steps"]), "All passed:", flow_res["all_steps_passed"])
