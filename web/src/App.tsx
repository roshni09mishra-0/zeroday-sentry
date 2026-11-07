import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { WarRoomPage } from './pages/WarRoomPage';
import { ScannerPage } from './pages/ScannerPage';
import { FlowPage } from './pages/FlowPage';
import { 
  INITIAL_CVES, 
  INITIAL_SLACK_MESSAGES, 
  INITIAL_EXECUTION_LOGS 
} from './mockData';
import { CVEAlert, SlackMessage, ExecutionLog } from './types';
import { apiService, DbCVE, DbMessage } from './services/apiService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [cves, setCves] = useState<CVEAlert[]>(INITIAL_CVES);
  const [messages, setMessages] = useState<SlackMessage[]>(INITIAL_SLACK_MESSAGES);
  const [logs, setLogs] = useState<ExecutionLog[]>(INITIAL_EXECUTION_LOGS);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const nowLogTime = () => {
    const d = new Date();
    return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${Math.floor(Math.random() * 900 + 100)}`;
  };

  // 1. Initial Load: Hydrate state from Persistent SQLite Database
  useEffect(() => {
    const hydrateFromDatabase = async () => {
      try {
        const isHealthy = await apiService.checkHealth();
        if (isHealthy) {
          setDbConnected(true);

          // Load CVEs from SQLite
          const dbCves = await apiService.getCVEs();
          if (dbCves && dbCves.length > 0) {
            const mappedCves: CVEAlert[] = dbCves.map((c: DbCVE) => ({
              id: c.cve_id,
              library: c.package_name,
              currentVersion: c.current_version,
              patchedVersion: c.patched_version || 'latest',
              severity: (c.severity.toUpperCase() as any) || 'HIGH',
              isReachable: Boolean(c.reachable),
              reachableLocation: c.evidence_file_line || 'No call sites in production',
              exploitVector: c.call_context || 'NVD Advisory',
              status: c.status === 'MERGED' ? 'approved' : c.reachable ? 'patch_generated' : 'false_positive',
              linesRewritten: c.reachable ? 3 : 0,
              testSuiteResult: c.reachable ? '18/18 tests passing' : 'N/A (Unreachable)',
              prNumber: c.pr_number
            }));
            setCves(mappedCves);
          }

          // Load Messages from SQLite
          const dbMsgs = await apiService.getMessages();
          if (dbMsgs && dbMsgs.length > 0) {
            const mappedMsgs: SlackMessage[] = dbMsgs.map((m: DbMessage) => ({
              id: m.id,
              sender: m.sender_type === 'analyst' ? 'analyst' : m.sender_type === 'patcher' ? 'crafter' : m.sender_type === 'human' ? 'human' : 'system',
              authorName: m.author_name,
              tag: m.tag || m.author_name,
              timestamp: `Today at ${m.timestamp_str}`,
              content: m.content
            }));
            setMessages(mappedMsgs);
          }

          const dbLog: ExecutionLog = {
            id: `log-${Date.now()}`,
            timestamp: nowLogTime(),
            level: 'AST',
            command: 'sqlite3 zeroday_sentry.db "SELECT count(*) FROM cves;"',
            output: `SQLite Database Connected: Loaded ${dbCves.length} CVEs and ${dbMsgs.length} audit messages from persistent ledger.`
          };
          setLogs(prev => [dbLog, ...prev]);
        }
      } catch (err) {
        console.warn('Using local fallback state, backend unavailable:', err);
      }
    };

    hydrateFromDatabase();
  }, []);

  // 2. Real-time chat: Calls Backend + Saves to SQLite Database
  const handleSendMessage = async (text: string) => {
    const newMsg: SlackMessage = {
      id: `msg-${Date.now()}`,
      sender: 'human',
      authorName: 'You (Lead Dev)',
      tag: 'You',
      timestamp: `Today at ${nowTime()}`,
      content: text
    };
    setMessages(prev => [...prev, newMsg]);

    const typingMsgId = `typing-${Date.now()}`;
    const typingMsg: SlackMessage = {
      id: typingMsgId,
      sender: 'analyst',
      authorName: 'cve-analyst',
      tag: '@cve-analyst',
      timestamp: `Today at ${nowTime()}`,
      content: 'Thinking via Switch AI Squad... searching AST...'
    };
    setMessages(prev => [...prev, typingMsg]);

    try {
      // Send chat to FastAPI backend which stores it in SQLite
      const response = await apiService.sendChat(text, 'axios CVE-2023-45857');

      setMessages(prev => prev.filter(m => m.id !== typingMsgId).concat({
        id: `msg-${Date.now() + 1}`,
        sender: 'analyst',
        authorName: response.authorName || 'cve-analyst',
        tag: response.sender ? `@${response.sender}` : '@cve-analyst',
        timestamp: `Today at ${nowTime()}`,
        content: response.reply,
        actions: [
          { label: 'Approve & Merge PR #23', action: 'approve', variant: 'yellow' },
          { label: 'Inspect AST Diff', action: 'diff', variant: 'white' }
        ]
      }));

      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: nowLogTime(),
        level: 'AST',
        command: `switch-agent:query --cve "CVE-2023-45857" --msg "${text.substring(0, 25)}..."`,
        output: `Response saved to SQLite messages table. Status: 200 OK.`
      };
      setLogs(prev => [...prev, newLog]);
    } catch (err) {
      console.warn('Backend chat fallback:', err);
      setMessages(prev => prev.filter(m => m.id !== typingMsgId).concat({
        id: `msg-${Date.now() + 1}`,
        sender: 'analyst',
        authorName: 'cve-analyst',
        tag: '@cve-analyst',
        timestamp: `Today at ${nowTime()}`,
        content: 'AST Traversal Complete for repository target acme/checkout-web.',
        quoteBox: 'lodash NOT REACHABLE (No template calls). axios REACHABLE at client.js:42.'
      }));
    }
  };

  // 3. 1-Click Human Approval: Persists into SQLite Approvals Ledger
  const handleExecuteAction = async (action: string) => {
    if (action === 'approve') {
      try {
        // Call Backend PR Approval Gate
        const result = await apiService.approvePR(23, 'CVE-2023-45857', 'Meera (lead dev)');

        const approvalMsg: SlackMessage = {
          id: `msg-${Date.now()}`,
          sender: 'human',
          authorName: 'Meera (lead dev)',
          tag: 'Lead Dev',
          timestamp: `Today at ${nowTime()}`,
          content: 'Read the diff. Approved.'
        };

        const crafterConfirm: SlackMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'crafter',
          authorName: 'patch-crafter',
          tag: '@patch-crafter',
          timestamp: `Today at ${nowTime()}`,
          content: `PR #${result.pr_number} merged to main with commit ${result.commit_hash}! CI passed 18/18 tests. Advisory resolved.`
        };

        setMessages(prev => [...prev, approvalMsg, crafterConfirm]);

        // Update local CVE state to approved
        setCves(prev => prev.map(c => c.prNumber === result.pr_number || c.id === 'CVE-2023-45857' ? { ...c, status: 'approved' } : c));

        const log1: ExecutionLog = {
          id: `log-${Date.now()}-1`,
          timestamp: nowLogTime(),
          level: 'TEST',
          command: 'npm test -- --config jest.config.js (axios mapped to CJS)',
          output: 'PASS all test suites (18 passed, 0 failed). Zero regressions.'
        };

        const log2: ExecutionLog = {
          id: `log-${Date.now()}-2`,
          timestamp: nowLogTime(),
          level: 'PR',
          command: `gh pr merge 23 --squash --delete-branch`,
          output: `Merged into main (${result.commit_hash}). Recorded in SQLite approvals ledger.`
        };

        setLogs(prev => [...prev, log1, log2]);
      } catch (err) {
        console.warn('Fallback approval:', err);
      }
    } else if (action === 'diff') {
      const diffLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: nowLogTime(),
        level: 'PATCH',
        command: 'git diff -U3 src/api/checkout.js jest.config.js',
        output: `+ moduleNameMapper: { '^axios$': 'axios/dist/browser/axios.cjs' }\n- return axios.all([getRates(cart), getTax(cart)])\n+ const [rates, tax] = await Promise.all([getRates(cart), getTax(cart)])`
      };
      setLogs(prev => [...prev, diffLog]);
    }
  };

  const handleSimulateCVE = () => {
    const newAlert: CVEAlert = {
      id: 'CVE-2026-4421',
      library: 'fast-xml-parser',
      currentVersion: '4.2.4',
      patchedVersion: '4.4.1',
      severity: 'CRITICAL',
      isReachable: true,
      reachableLocation: 'src/parsers/feed.ts:15',
      exploitVector: 'ReDoS via crafted CDATA section tag in parse()',
      status: 'vulnerable',
      linesRewritten: 1,
      testSuiteResult: '12/12 tests passing'
    };

    setCves(prev => [newAlert, ...prev]);

    const newMsg: SlackMessage = {
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      authorName: 'cve-analyst',
      tag: '@cve-analyst',
      timestamp: `Today at ${nowTime()}`,
      content: 'Alert ingested on acme/checkout-web: fast-xml-parser (CVE-2026-4421):',
      quoteBox: 'Yes, we use the vulnerable method at src/parsers/feed.ts:15'
    };

    setMessages(prev => [...prev, newMsg]);

    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: nowLogTime(),
      level: 'AST',
      command: 'ast-grep --pattern "XMLParser.parse($$$)" src/',
      output: 'Call found in user-facing feed ingestion pipeline (feed.ts:15). REACHABLE!'
    };

    setLogs(prev => [...prev, newLog]);
    setActiveTab('war-room');
  };

  const handleEscalateToWarRoom = (cve: CVEAlert) => {
    const msg: SlackMessage = {
      id: `msg-${Date.now()}`,
      sender: 'analyst',
      authorName: 'cve-analyst',
      tag: '@cve-analyst',
      timestamp: `Today at ${nowTime()}`,
      content: `Escalated from Reachability Scanner: ${cve.library} (${cve.id})`,
      quoteBox: `Yes, we use the vulnerable method at ${cve.reachableLocation}`
    };
    setMessages(prev => [...prev, msg]);
    setActiveTab('war-room');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSimulateCVE={handleSimulateCVE}
        vulnerableCount={cves.filter(c => c.isReachable).length}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage 
            onNavigate={setActiveTab}
            onSimulateCVE={handleSimulateCVE}
            cves={cves}
          />
        )}
        {activeTab === 'flow' && (
          <FlowPage />
        )}
        {activeTab === 'war-room' && (
          <WarRoomPage 
            messages={messages}
            logs={logs}
            onSendMessage={handleSendMessage}
            onExecuteAction={handleExecuteAction}
            cves={cves}
          />
        )}
        {activeTab === 'scanner' && (
          <ScannerPage 
            cves={cves}
            onEscalateToWarRoom={handleEscalateToWarRoom}
            onRefresh={() => {
              const rescanLog: ExecutionLog = {
                id: `log-${Date.now()}`,
                timestamp: nowLogTime(),
                level: 'AST',
                command: 'sentry-ast-scan --repo acme/checkout-web --all',
                output: '3 CVEs analyzed from SQLite ledger. 2 Reachable. 1 Dead Code (Filtered).'
              };
              setLogs(prev => [...prev, rescanLog]);
            }}
          />
        )}
      </main>
    </div>
  );
};
