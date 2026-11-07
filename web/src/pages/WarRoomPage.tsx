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
  Check
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

  const copyTerminalLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] $ ${l.command}\n${l.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] py-10 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Channel Header + MULTI-BRIDGE SWITCHER with balanced padding */}
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

          {/* Multi-Bridge Switch Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              onClick={() => onExecuteAction('approve')}
              className="px-5 py-2.5 bg-[#FFE500] border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap"
            >
              ✓ 1-Click Approve PR #142
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

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-3.5 bg-neutral-50 border border-black font-mono text-xs text-neutral-600">
                      ⚡ {msg.content}
                    </div>
                  );
                }

                return (
                  <div 
                    key={msg.id} 
                    className={`p-6 border-2 border-black shadow-neo-sm ${
                      isHuman ? 'bg-[#FFE500]/20' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 font-mono text-xs font-bold ${
                          activeBridge === 'discord' && (isAnalyst || isCrafter) 
                            ? 'bg-[#5865F2] text-white' 
                            : 'bg-black text-[#FFE500]'
                        }`}>
                          {msg.tag}
                        </span>
                        <span className="font-extrabold text-sm text-black">{msg.authorName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500">{msg.timestamp}</span>
                    </div>

                    <p className="text-sm font-medium text-black leading-relaxed">
                      {msg.content}
                    </p>

                    {msg.quoteBox && (
                      <div className="mt-4 p-4 bg-white border border-black font-mono text-xs text-black leading-relaxed">
                        {msg.quoteBox}
                      </div>
                    )}

                    {msg.actions && (
                      <div className="mt-5 flex flex-wrap gap-2.5 pt-3 border-t border-black">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => onExecuteAction(act.action)}
                            className={`px-4 py-2 border-2 border-black font-mono text-xs font-bold transition-all cursor-pointer ${
                              act.variant === 'yellow' 
                                ? 'bg-[#FFE500] hover:bg-[#eed500] shadow-neo-sm' 
                                : 'bg-white hover:bg-neutral-100 shadow-neo-sm'
                            }`}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-5 bg-neutral-100 border-t-2 border-black flex gap-3">
              <input
                type="text"
                placeholder={`Ask @cve-analyst about any package or file path...`}
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
      </div>
    </div>
  );
};
