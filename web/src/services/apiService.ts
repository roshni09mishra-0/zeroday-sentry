/**
 * ZeroDay Sentry - Live Backend & SQLite Database API Client
 * Connects the React Web Application to the FastAPI backend and persistent SQLite ledger.
 * Seamlessly switches between local FastAPI server and Vercel Serverless environment.
 */

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL !== undefined && import.meta.env.VITE_BACKEND_URL !== ''
  ? import.meta.env.VITE_BACKEND_URL
  : isLocalhost
    ? 'http://127.0.0.1:8787'
    : '';

export interface DbCVE {
  id?: number;
  cve_id: string;
  package_name: string;
  current_version: string;
  patched_version?: string;
  severity: string;
  cvss_score: number;
  reachable: number | boolean;
  evidence_file_line?: string;
  call_context?: string;
  action_taken?: string;
  status: string;
  pr_number?: number;
  pr_url?: string;
}

export interface DbMessage {
  id: string;
  room_id: string;
  sender_type: string;
  author_name: string;
  tag?: string;
  content: string;
  timestamp_str: string;
}

export interface ApprovalResponse {
  pr_number: number;
  status: string;
  approver: string;
  commit_hash: string;
  tests_passed: string;
  message: string;
}

export const apiService = {
  /**
   * Health check to confirm backend gateway is reachable.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_BASE}/api`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Fetch all CVE records from SQLite database.
   */
  async getCVEs(): Promise<DbCVE[]> {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/cves`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/cves unreachable, using local fallback:', err);
      return [];
    }
  },

  /**
   * Fetch war room message history from SQLite database.
   */
  async getMessages(roomId: string = 'security-war-room'): Promise<DbMessage[]> {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/messages?room_id=${encodeURIComponent(roomId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend /api/messages unreachable, using local fallback:', err);
      return [];
    }
  },

  /**
   * Query the Switch AI squad (@cve-analyst & @patch-crafter) and save exchange into DB.
   */
  async sendChat(message: string, cveContext: string = 'CVE-2023-45857'): Promise<{ reply: string; sender: string; authorName: string }> {
    const payload = JSON.stringify({
      message,
      sender: 'You (Lead Dev)',
      cve_context: cveContext
    });

    try {
      const res = await fetch(`${BACKEND_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    // Fallback to /api/switch/chat for local uvicorn
    const res2 = await fetch(`${BACKEND_BASE}/api/switch/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    if (!res2.ok) throw new Error(`Chat error HTTP ${res2.status}`);
    return await res2.json();
  },

  /**
   * 1-Click human sign-off: marks PR as merged in the database ledger.
   */
  async approvePR(prNumber: number = 23, cveId: string = 'CVE-2023-45857', approver: string = 'Meera (lead dev)'): Promise<ApprovalResponse> {
    const payload = JSON.stringify({
      pr_number: prNumber,
      cve_id: cveId,
      approver: approver,
      notes: '1-click human approval from Switch War Room'
    });

    try {
      const res = await fetch(`${BACKEND_BASE}/api/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    const res2 = await fetch(`${BACKEND_BASE}/api/github/pr/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    if (!res2.ok) throw new Error(`Approval error HTTP ${res2.status}`);
    return await res2.json();
  },

  /**
   * Run AST reachability analysis on a specific code file.
   */
  async scanAST(cveId: string, filePath: string, codeContent: string) {
    const res = await fetch(`${BACKEND_BASE}/api/ast/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cve_id: cveId,
        file_path: filePath,
        code_content: codeContent
      })
    });
    if (!res.ok) throw new Error(`Scan error HTTP ${res.status}`);
    return await res.json();
  }
};
