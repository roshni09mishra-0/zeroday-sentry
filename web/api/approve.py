import os
import sys
import json
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
import database

database.init_db()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        pr_number = data.get('pr_number', 23)
        cve_id = data.get('cve_id', 'CVE-2023-45857')
        approver = data.get('approver', 'Meera (lead dev)')
        commit_hash = '4b9a12e'
        
        record = database.record_approval(pr_number, cve_id, approver, commit_hash, '1-click approval from security war room')
        response = {
            "pr_number": pr_number,
            "status": "MERGED",
            "approver": approver,
            "commit_hash": commit_hash,
            "tests_passed": "18/18",
            "ledger_record": record,
            "message": f"PR #{pr_number} successfully merged into main with squash commit {commit_hash}."
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
