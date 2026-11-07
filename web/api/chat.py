import os
import sys
import json
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
import database
from switch_orchestrator import SwitchOrchestrator

database.init_db()
orchestrator = SwitchOrchestrator()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        message = data.get('message', '')
        sender = data.get('sender', 'You (Lead Dev)')
        cve_context = data.get('cve_context', 'CVE-2023-45857')
        now_str = datetime.now().strftime("%H:%M")

        # 1. Save user msg to DB
        database.add_message({
            "id": f"msg-{uuid.uuid4().hex[:8]}",
            "room_id": "security-war-room",
            "sender_type": "human",
            "author_name": sender,
            "tag": "Lead Dev",
            "content": message,
            "timestamp_str": now_str
        })

        # 2. Get AI Response
        prompt = (
            f"Context: Analyzing {cve_context} in repo acme/checkout-web. "
            f"Developer says: '{message}'. "
            "Answer as the Switch security agent squad (@cve-analyst / @patch-crafter). "
            "Be concise, technical, and human. Ground in real call paths."
        )
        reply = orchestrator.query_gemini(prompt)

        # 3. Save agent response to DB
        agent_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
        database.add_message({
            "id": agent_msg_id,
            "room_id": "security-war-room",
            "sender_type": "patcher",
            "author_name": "patch-crafter",
            "tag": "@patch-crafter",
            "content": reply,
            "timestamp_str": now_str
        })

        response = {
            "sender": "patch-crafter",
            "authorName": "patch-crafter",
            "reply": reply,
            "message_id": agent_msg_id
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
