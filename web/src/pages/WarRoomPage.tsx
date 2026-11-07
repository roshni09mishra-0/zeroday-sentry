import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  GitPullRequest, 
  Code2, 
  ExternalLink,
  Zap,
  Play,
  Layers,
  MessageSquare,
  Bot,
  Copy,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { SlackMessage, ExecutionLog, CVEAlert } from '../types';

interface WarRoomPageProps {
  messages: SlackMessage[];
  logs: ExecutionLog[];
  onSendMessage: (text: string) => void;
  onExecuteAction: (action: string) => void;
  cves: CVEAlert[];
}

export const WarRoomPage: React.FC<WarRoomPageProps> = ({ 
  messages, 
  logs, 
  onSendMessage, 
  onExecuteAction,
  cves 
}) => {
  const [inputText, setInputText] = useState('');
  const [activeBridge, setActiveBridge] = useState<'slack' | 'discord' | 'teams'>('slack');
  const [copiedLog, setCopiedLog] = useState(false);
  const [showPRModal, setShowPRModal] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleApprove = () => {
    onExecuteAction('approve');
    setIsMerged(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 6000);
  };

  const copyTerminalLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] $ ${l.command}\n${l.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] py-10 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Celebratory Banner on PR Approval */}
        {showCelebration && (
          <div className="p-4 bg-[#FFE500] border-2 border-black shadow-neo flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-3">
              <span className="text-xl">🎉</span>
              <div>
                <span className="font-mono text-xs font-black uppercase text-black block">
                  Wolf Neutralized • PR #142 Merged to Main
                </span>
                <span className="text-xs text-black font-medium">
                  Squash commit 4b9a12e verified with 18/18 passing tests. Security advisory CVE-2026-3114 closed.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="px-2 py-1 bg-black text-white text-xs font-bold font-mono hover:bg-neutral-800 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Channel Header + MULTI-BRIDGE SWITCHER */}
        <div className="p-8 bg-white border-2 border-black shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 border-2 border-black flex items-center justify-center font-black text-2xl font-mono shadow-neo-sm ${
              activeBridge === 'slack' ? 'bg-[#FFE500]' :
              activeBridge === 'discord' ? 'bg-[#5865F2] text-white' :
              'bg-[#464EB8] text-white'
            }`}>
              {activeBridge === 'slack' ? '#' : activeBridge === 'discord' ? '💬' : '👥'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  {activeBridge === 'slack' ? 'security-war-room' :
                   activeBridge === 'discord' ? 'cve-triage-squad' :
                   'Incident #SEC-2026-3114'}
                </h1>
                <span className="px-2.5 py-0.5 bg-black text-[#FFE500] text-xs font-mono font-bold">
                  SWITCH ADAPTER: {activeBridge.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-600 mt-1">
                Target: api-backend-core • Active Agents: @cve-analyst, @patch-crafter
              </p>
            </div>
          </div>

          {/* Multi-Bridge Switch Buttons & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center p-1.5 bg-neutral-100 border-2 border-black">
              <span className="text-[10px] font-mono font-bold px-2.5 text-neutral-500 uppercase">
                Bridge:
              </span>
              <button
                onClick={() => setActiveBridge('slack')}
                className={`px-3.5 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeBridge === 'slack' ? 'bg-[#FFE500] text-black border border-black font-black' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Slack
              </button>
              <button
                onClick={() => setActiveBridge('discord')}
                className={`px-3.5 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeBridge === 'discord' ? 'bg-[#5865F2] text-white border border-black font-black' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Discord
              </button>
              <button
                onClick={() => setActiveBridge('teams')}
                className={`px-3.5 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeBridge === 'teams' ? 'bg-[#464EB8] text-white border border-black font-black' : 'text-neutral-600 hover:text-black'
                }`}
              >
                MS Teams
              </button>
            </div>

            <button
              onClick={() => setShowPRModal(true)}
              className="px-4 py-2.5 bg-white border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              <span>Inspect PR #142</span>
            </button>

            <button
              onClick={handleApprove}
              className={`px-5 py-2.5 border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                isMerged 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-[#FFE500] text-black'
              }`}
            >
              {isMerged ? '✓ Merged to Main' : '✓ 1-Click Approve PR #142'}
            </button>
          </div>
        </div>

        {/* Split Screen Workspace with refined padding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[660px]">
          {/* Left Column: Slack Chat Stream (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white border-2 border-black shadow-neo overflow-hidden">
            {/* Header bar */}
            <div className="px-6 py-4 bg-neutral-100 border-b-2 border-black flex items-center justify-between font-mono text-xs font-bold">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black inline-block animate-pulse" />
                <span>
                  {activeBridge === 'slack' ? '#security-war-room (Slack SocketMode Bridge)' :
                   activeBridge === 'discord' ? '#cve-triage-squad (Discord Gateway Bot)' :
                   'MS Teams Incident Channel'}
                </span>
              </div>
              <span className="text-neutral-500">Switch Core v1</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white max-h-[500px]">
              {messages.map((msg) => {
                const isAnalyst = msg.sender === 'analyst';
                const isCrafter = msg.sender === 'crafter';
                const isHuman = msg.sender === 'human';
                const isSystem = msg.sender === 'system';

                return (
                  <div key={msg.id} className="flex items-start gap-4 animate-in fade-in duration-200">
                    {/* Avatar */}
                    <div className={`w-10 h-10 border-2 border-black flex items-center justify-center font-mono font-black text-sm flex-shrink-0 shadow-neo-sm ${
                      isAnalyst ? 'bg-black text-[#FFE500]' :
                      isCrafter ? 'bg-[#FFE500] text-black' :
                      isHuman ? 'bg-emerald-500 text-white' :
                      'bg-neutral-200 text-neutral-800'
                    }`}>
                      {isAnalyst ? 'CA' : isCrafter ? 'PC' : isHuman ? 'YOU' : 'SYS'}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-black">
                          {msg.authorName}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500 font-bold">
                          {msg.tag}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div className="text-sm text-neutral-800 leading-relaxed font-normal">
                        {msg.content}
                      </div>

                      {msg.quoteBox && (
                        <div className="mt-2.5 p-3.5 bg-neutral-50 border-2 border-black font-mono text-xs text-black shadow-neo-sm">
                          {msg.quoteBox}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Prompt Pills */}
            <div className="px-5 py-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2 overflow-x-auto text-xs font-mono">
              <span className="text-[11px] text-neutral-400 font-bold flex-shrink-0">Quick prompts:</span>
              <button
                type="button"
                onClick={() => handleQuickPrompt("Is CVE-2026-3114 reachable in auth.ts?")}
                className="px-2.5 py-1 bg-white border border-black hover:bg-[#FFE500] transition-colors whitespace-nowrap cursor-pointer"
              >
                🐺 Is auth.ts reachable?
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt("Show me the exact 3-line patch diff")}
                className="px-2.5 py-1 bg-white border border-black hover:bg-[#FFE500] transition-colors whitespace-nowrap cursor-pointer"
              >
                📄 Show patch diff
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt("What tests were executed in the sandbox?")}
                className="px-2.5 py-1 bg-white border border-black hover:bg-[#FFE500] transition-colors whitespace-nowrap cursor-pointer"
              >
                🧪 Test status
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-5 bg-neutral-100 border-t-2 border-black flex gap-3">
              <input
                type="text"
                placeholder={`Ask @cve-analyst or @patch-crafter anything...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border-2 border-black font-sans text-sm font-medium text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#FFE500] text-black font-black text-xs border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Sandbox Execution Terminal (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-black text-white border-2 border-black shadow-neo overflow-hidden">
            {/* Terminal Header */}
            <div className="px-6 py-4 bg-neutral-900 border-b-2 border-neutral-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#FFE500]" />
                <span className="font-bold text-white">Execution Sandbox Terminal</span>
              </div>
              <button
                onClick={copyTerminalLogs}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 font-mono transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLog ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Terminal Logs with clean monospace padding */}
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-5 bg-black max-h-[500px]">
              {logs.map((log) => (
                <div key={log.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>{log.timestamp}</span>
                    <span className="px-1.5 py-0.2 bg-[#FFE500] text-black font-bold">
                      {log.level}
                    </span>
                  </div>
                  <div className="text-[#FFE500] font-bold">
                    $ {log.command}
                  </div>
                  <div className="text-neutral-300 whitespace-pre-wrap pl-3 border-l-2 border-neutral-700 leading-relaxed text-[11px]">
                    {log.output}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Terminal Footer */}
            <div className="px-6 py-3.5 bg-neutral-900 border-t-2 border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AST Parser: Ready</span>
              </div>
              <span className="text-[#FFE500] font-bold">Tests: 18 PASS</span>
            </div>
          </div>
        </div>

        {/* GitHub Pull Request Review Modal */}
        {showPRModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-neo-lg max-w-3xl w-full p-8 relative animate-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowPRModal(false)}
                className="absolute top-6 right-6 p-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black cursor-pointer"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 font-mono text-xs font-black border-2 border-black ${
                  isMerged ? 'bg-purple-600 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {isMerged ? '✓ Merged' : 'Open'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-black">
                  Pull Request #142: Fix CVE-2026-3114 algorithm spoofing
                </h3>
              </div>

              <div className="font-mono text-xs text-neutral-600 mb-6 flex flex-wrap gap-4 pb-4 border-b-2 border-neutral-200">
                <span>Branch: <code className="bg-neutral-100 px-1 border border-neutral-300">switch/patch-cve-2026-3114</code> ➔ <code className="bg-neutral-100 px-1 border border-neutral-300">main</code></span>
                <span>•</span>
                <span>Author: @patch-crafter</span>
                <span>•</span>
                <span>Commits: 1</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 border-2 border-black font-mono text-xs space-y-2">
                  <div className="font-bold text-neutral-700">// diff -u src/routes/auth.ts</div>
                  <div className="text-neutral-500">@@ -40,3 +40,3 @@ export async function verifySession(token: string) &#123;</div>
                  <div className="text-red-700 bg-red-100 px-2 py-0.5 border-l-4 border-red-600">
                    - return jwt.verify(token, secret, &#123; algorithms: ['none'] &#125;);
                  </div>
                  <div className="text-emerald-700 bg-emerald-100 px-2 py-0.5 border-l-4 border-emerald-600">
                    + return jwt.verify(token, secret, &#123; algorithms: ['HS256'] &#125;);
                  </div>
                  <div className="text-neutral-500">42 &#125;</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-neutral-100 border border-black">
                    <span className="text-[10px] text-neutral-500 block">AST VERIFICATION</span>
                    <span className="font-bold text-emerald-600">✓ Path Confirmed</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border border-black">
                    <span className="text-[10px] text-neutral-500 block">DOCKER SANDBOX</span>
                    <span className="font-bold text-emerald-600">✓ 18/18 Tests Passing</span>
                  </div>
                  <div className="p-3 bg-neutral-100 border border-black">
                    <span className="text-[10px] text-neutral-500 block">GUARDRAIL STATUS</span>
                    <span className="font-bold text-emerald-600">✓ Zero Regressions</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black flex items-center justify-between">
                <button
                  onClick={() => setShowPRModal(false)}
                  className="px-5 py-2.5 bg-neutral-100 border-2 border-black font-mono text-xs font-bold cursor-pointer hover:bg-neutral-200"
                >
                  Close
                </button>

                {!isMerged ? (
                  <button
                    onClick={() => {
                      handleApprove();
                      setShowPRModal(false);
                    }}
                    className="px-6 py-2.5 bg-[#FFE500] border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Confirm Squash &amp; Merge</span>
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="font-mono text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Merged as commit 4b9a12e</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
