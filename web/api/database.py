"""
ZeroDay Sentry - Serverless Database Module (SQLite)
Compatible with local execution and Vercel Serverless environment.
"""

import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

# On Vercel serverless functions, only /tmp is writable
if os.name != 'nt' and os.path.exists('/tmp'):
    DB_PATH = '/tmp/zeroday_sentry.db'
else:
    DB_PATH = os.path.join(os.path.dirname(__file__), 'zeroday_sentry.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cve_id TEXT UNIQUE NOT NULL,
            package_name TEXT NOT NULL,
            current_version TEXT NOT NULL,
            patched_version TEXT,
            severity TEXT NOT NULL,
            cvss_score REAL NOT NULL,
            reachable BOOLEAN NOT NULL DEFAULT 0,
            evidence_file_line TEXT,
            call_context TEXT,
            action_taken TEXT,
            status TEXT NOT NULL DEFAULT 'INGESTED',
            pr_number INTEGER,
            pr_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            room_id TEXT NOT NULL DEFAULT 'security-war-room',
            sender_type TEXT NOT NULL,
            author_name TEXT NOT NULL,
            tag TEXT,
            content TEXT NOT NULL,
            timestamp_str TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pr_number INTEGER NOT NULL,
            cve_id TEXT,
            approver TEXT NOT NULL,
            commit_hash TEXT NOT NULL,
            notes TEXT,
            approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM cves")
    if cursor.fetchone()[0] == 0:
        seed_default_data(conn)

    conn.close()

def seed_default_data(conn):
    cursor = conn.cursor()
    cves_data = [
        (
            "CVE-2023-45857",
            "axios",
            "0.27.2",
            "1.6.8",
            "Medium",
            6.5,
            1,
            "src/api/client.js:42",
            "client.js creates shared instance with withCredentials: true; rates.js:9 calls partner-rates.example.com cross-origin",
            "Patched to 1.6.8 in PR #23 with Jest CommonJS mapping and Promise.all refactor",
            "READY_FOR_REVIEW",
            23,
            "https://github.com/acme/checkout-web/pull/23"
        ),
        (
            "CVE-2021-23337",
            "lodash",
            "4.17.20",
            "4.17.21",
            "High",
            7.2,
            0,
            "No template call sites in 41 files",
            "Flaw is in _.template. lodash is imported in 6 files and we use debounce, get and isEqual only.",
            "Deferred; bump to 4.17.21 with next routine update",
            "DEFERRED",
            None,
            None
        ),
        (
            "CVE-2026-3114",
            "jsonwebtoken",
            "8.5.1",
            "9.0.2",
            "Critical",
            9.8,
            1,
            "server/src/routes/auth.ts:42",
            "jwt.verify called with algorithms: ['none'] in POST /api/login endpoint",
            "Patched to 9.0.2 with HS256 whitelist; 18 of 18 test suites green",
            "MERGED",
            142,
            "https://github.com/acme/api-backend-core/pull/142"
        )
    ]

    cursor.executemany("""
        INSERT INTO cves (
            cve_id, package_name, current_version, patched_version, severity,
            cvss_score, reachable, evidence_file_line, call_context,
            action_taken, status, pr_number, pr_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, cves_data)

    messages_data = [
        (
            "msg-1",
            "security-war-room",
            "bot",
            "Dependabot",
            "[Bot]",
            "2 new alerts on acme/checkout-web:\n• axios 0.27.2 CVE-2023-45857 Medium (6.5)\n• lodash 4.17.20 CVE-2021-23337 High (7.2)",
            "10:42"
        ),
        (
            "msg-2",
            "security-war-room",
            "human",
            "Meera (lead dev)",
            "Lead Dev",
            "@cve-analyst are these real for us?",
            "10:42"
        ),
        (
            "msg-3",
            "security-war-room",
            "analyst",
            "cve-analyst",
            "@cve-analyst",
            "Checked both against src/ (41 files).\n• lodash CVE-2021-23337: NOT REACHABLE. The flaw is in _.template. We only use debounce, get and isEqual in 6 files.\n• axios CVE-2023-45857: REACHABLE. src/api/client.js:42 creates shared instance with withCredentials: true, and src/api/rates.js:9 calls partner-rates.example.com cross-origin. @patch-crafter this one is yours.",
            "10:43"
        ),
        (
            "msg-4",
            "security-war-room",
            "patcher",
            "patch-crafter",
            "@patch-crafter",
            "On it. Branch fix/axios-cve-2023-45857, bumping axios 0.27.2 -> 1.6.8.",
            "10:44"
        ),
        (
            "msg-5",
            "security-war-room",
            "patcher",
            "patch-crafter",
            "@patch-crafter",
            "Test run 1: 11 failed, 7 passed. SyntaxError: Cannot use import statement outside a module (axios 1.x ships ESM, our Jest is CommonJS).\nFix: mapped axios to its CJS build in jest.config.js. Replaced deprecated axios.all with Promise.all in checkout.js.\nTest run 2: 18 passed, 18 total. Rescan: advisory resolved.\nDraft PR #23 ready (3 files, +7 -4). @meera I need your sign-off before I mark it ready for review.",
            "10:53"
        ),
        (
            "msg-6",
            "security-war-room",
            "human",
            "Meera (lead dev)",
            "Lead Dev",
            "Read the diff. Approved.",
            "10:58"
        ),
        (
            "msg-7",
            "security-war-room",
            "patcher",
            "patch-crafter",
            "@patch-crafter",
            "Marked #23 ready for review and linked this thread in the description.",
            "10:58"
        )
    ]

    cursor.executemany("""
        INSERT INTO messages (id, room_id, sender_type, author_name, tag, content, timestamp_str)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, messages_data)

    cursor.execute("""
        INSERT INTO approvals (pr_number, cve_id, approver, commit_hash, notes)
        VALUES (23, 'CVE-2023-45857', 'Meera (lead dev)', '4b9a12e', 'Approved after reviewing 3-file diff and 18/18 green test suite')
    """)

    conn.commit()

def get_all_cves() -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cves ORDER BY cvss_score DESC")
    rows = cursor.fetchall()
    result = [dict(row) for row in rows]
    conn.close()
    return result

def get_cve_by_id(cve_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cves WHERE cve_id = ?", (cve_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def upsert_cve(data: Dict[str, Any]) -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO cves (
            cve_id, package_name, current_version, patched_version, severity,
            cvss_score, reachable, evidence_file_line, call_context,
            action_taken, status, pr_number, pr_url, updated_at
        ) VALUES (
            :cve_id, :package_name, :current_version, :patched_version, :severity,
            :cvss_score, :reachable, :evidence_file_line, :call_context,
            :action_taken, :status, :pr_number, :pr_url, CURRENT_TIMESTAMP
        )
        ON CONFLICT(cve_id) DO UPDATE SET
            patched_version = excluded.patched_version,
            reachable = excluded.reachable,
            evidence_file_line = excluded.evidence_file_line,
            call_context = excluded.call_context,
            action_taken = excluded.action_taken,
            status = excluded.status,
            pr_number = excluded.pr_number,
            pr_url = excluded.pr_url,
            updated_at = CURRENT_TIMESTAMP
    """, data)
    conn.commit()
    conn.close()
    return get_cve_by_id(data["cve_id"])

def get_messages(room_id: str = "security-war-room") -> List[Dict[str, Any]]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC", (room_id,))
    rows = cursor.fetchall()
    result = [dict(row) for row in rows]
    conn.close()
    return result

def add_message(msg: Dict[str, Any]) -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO messages (id, room_id, sender_type, author_name, tag, content, timestamp_str)
        VALUES (:id, :room_id, :sender_type, :author_name, :tag, :content, :timestamp_str)
    """, msg)
    conn.commit()
    conn.close()
    return msg

def record_approval(pr_number: int, cve_id: Optional[str], approver: str, commit_hash: str, notes: str = "") -> Dict[str, Any]:
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO approvals (pr_number, cve_id, approver, commit_hash, notes)
        VALUES (?, ?, ?, ?, ?)
    """, (pr_number, cve_id, approver, commit_hash, notes))

    cursor.execute("""
        UPDATE cves SET status = 'MERGED', updated_at = CURRENT_TIMESTAMP WHERE pr_number = ?
    """, (pr_number,))

    conn.commit()
    conn.close()
    return {
        "pr_number": pr_number,
        "cve_id": cve_id,
        "approver": approver,
        "commit_hash": commit_hash,
        "status": "MERGED",
        "approved_at": datetime.utcnow().isoformat()
    }
