import React, { useState } from 'react';
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
import { askGeminiAgent } from './services/geminiService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [cves, setCves] = useState<CVEAlert[]>(INITIAL_CVES);
  const [messages, setMessages] = useState<SlackMessage[]>(INITIAL_SLACK_MESSAGES);
  const [logs, setLogs] = useState<ExecutionLog[]>(INITIAL_EXECUTION_LOGS);

  const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const nowLogTime = () => {
    const d = new Date();
    return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${Math.floor(Math.random() * 900 + 100)}`;
  };

  // Real-time chat with Live Gemini Integration
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
      content: '🤖 Thinking via Gemini 3.5 Live... analyzing AST...'
    };
    setMessages(prev => [...prev, typingMsg]);

    try {
      // Call Live Gemini API
      const aiResponse = await askGeminiAgent(text, 'jsonwebtoken CVE-2026-3114');

      // Remove placeholder & insert real AI answer
      setMessages(prev => prev.filter(m => m.id !== typingMsgId).concat({
        id: `msg-${Date.now() + 1}`,
        sender: 'analyst',
        authorName: 'cve-analyst',
        tag: '@cve-analyst',
        timestamp: `Today at ${nowTime()}`,
        content: aiResponse.analystResponse,
        quoteBox: aiResponse.quoteBox,
        actions: [
          { label: 'Approve & Merge PR #142', action: 'approve', variant: 'yellow' },
          { label: 'Inspect AST Diff', action: 'diff', variant: 'white' }
        ]
      }));

      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: nowLogTime(),
        level: 'AST',
        command: `gemini-3.5-flash:query --prompt "${text.substring(0, 30)}..."`,
        output: `Live AI Inference: 100% tokens returned with exit code 0. AST verdict resolved.`
      };
      setLogs(prev => [...prev, newLog]);
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingMsgId).concat({
        id: `msg-${Date.now() + 1}`,
        sender: 'analyst',
        authorName: 'cve-analyst',
        tag: '@cve-analyst',
        timestamp: `Today at ${nowTime()}`,
        content: 'AST Traversal Complete for repository target.',
        quoteBox: 'Yes, we use the vulnerable method at auth.js:42'
      }));
    }
  };

  const handleExecuteAction = (action: string) => {
    if (action === 'approve') {
      const approvalMsg: SlackMessage = {
        id: `msg-${Date.now()}`,
        sender: 'human',
        authorName: 'You (Lead Dev)',
        tag: 'You',
        timestamp: `Today at ${nowTime()}`,
        content: 'Approved.'
      };

      const crafterConfirm: SlackMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'crafter',
        authorName: 'patch-crafter',
        tag: '@patch-crafter',
        timestamp: `Today at ${nowTime()}`,
        content: 'PR #142 merged to `main` with squash commit! CI workflow passed 18/18 tests. Vulnerability patched.'
      };

      setMessages(prev => [...prev, approvalMsg, crafterConfirm]);

      const log1: ExecutionLog = {
        id: `log-${Date.now()}-1`,
        timestamp: nowLogTime(),
        level: 'TEST',
        command: 'git merge --squash origin/patch/cve-2026-3114 && npm test',
        output: 'PASS all test suites (18 passed, 0 failed). Zero regressions.'
      };

      const log2: ExecutionLog = {
        id: `log-${Date.now()}-2`,
        timestamp: nowLogTime(),
        level: 'PR',
        command: 'gh pr merge 142 --squash --delete-branch',
        output: 'Merged into main (commit 4b9a12e). Closed issue #118. Wolf neutralized.'
      };

      setLogs(prev => [...prev, log1, log2]);
    } else if (action === 'diff') {
      const diffLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: nowLogTime(),
        level: 'PATCH',
        command: 'git diff -U3 src/auth.js',
        output: `-  const decoded = jwt.verify(token, secret);\n+  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });`
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
      content: '🚨 Real wolf spotted! fast-xml-parser (CVE-2026-4421):',
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
                command: 'sentry-ast-scan --repo api-backend-core --all',
                output: '3 CVEs analyzed. 2 Reachable (Wolf). 1 Dead Code (Filtered).'
              };
              setLogs(prev => [...prev, rescanLog]);
            }}
          />
        )}
      </main>
    </div>
  );
};
