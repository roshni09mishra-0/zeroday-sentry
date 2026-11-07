import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  GitBranch, 
  ArrowRight, 
  Search, 
  RefreshCw,
  Zap,
  Filter,
  Play
} from 'lucide-react';
import { CVEAlert } from '../types';
import { runBackendASTScan } from '../services/geminiService';

interface ScannerPageProps {
  cves: CVEAlert[];
  onEscalateToWarRoom: (cve: CVEAlert) => void;
  onRefresh: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ 
  cves, 
  onEscalateToWarRoom,
  onRefresh 
}) => {
  const [filter, setFilter] = useState<'all' | 'reachable' | 'unreachable'>('all');
  const [search, setSearch] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<'jwt' | 'axios' | 'lodash'>('jwt');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('Click "Run AST Inspection" to trace call graph');
  const [isScanning, setIsScanning] = useState(false);

  const snippets = {
    jwt: {
      title: 'jsonwebtoken (CVE-2026-3114)',
      vulnerableCode: `// src/auth/verify.ts:42\nimport jwt from 'jsonwebtoken';\n\nexport function authMiddleware(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  // VULNERABLE: No algorithm whitelist specified\n  const user = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = user;\n  next();\n}`,
      patch: `// src/auth/verify.ts:42 (Patched by @patch-crafter)\nimport jwt from 'jsonwebtoken';\n\nexport function authMiddleware(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  // SAFE: Strict algorithm whitelist rejects alg:none spoofing\n  const user = jwt.verify(token, process.env.JWT_SECRET, {\n    algorithms: ['HS256', 'RS256']\n  });\n  req.user = user;\n  next();\n}`,
      isReachable: true,
      verdict: '🐺 THE WOLF: Called in authMiddleware on all /api/* routes. Exploit vector: token forgery.'
    },
    axios: {
      title: 'axios (CVE-2026-1980)',
      vulnerableCode: `// src/services/webhook.ts:88\nimport axios from 'axios';\n\nexport async function forwardWebhook(userUrl, payload) {\n  // VULNERABLE: Follows redirects to internal metadata IP (169.254.169.254)\n  return axios.post(userUrl, payload, { maxRedirects: 5 });\n}`,
      patch: `// src/services/webhook.ts:88 (Patched by @patch-crafter)\nimport axios from 'axios';\n\nexport async function forwardWebhook(userUrl, payload) {\n  // SAFE: Disallow automatic redirects on user-supplied endpoints\n  return axios.post(userUrl, payload, { maxRedirects: 0 });\n}`,
      isReachable: true,
      verdict: '🐺 THE WOLF: Called in forwardWebhook. Exploit vector: AWS metadata SSRF.'
    },
    lodash: {
      title: 'lodash (CVE-2026-0812)',
      vulnerableCode: `// scripts/legacy/archived-builder.js:12\nconst _ = require('lodash');\n// Unused script last committed 3 years ago\nfunction legacyTemplate(str) {\n  return _.template(str)({ name: 'legacy' });\n}`,
      patch: `// Not needed — file is never packaged into production bundle.`,
      isReachable: false,
      verdict: '🐑 CRYING WOLF: Dead code in archived builder script. Never imported in production runtime.'
    }
  };

  const runPlaygroundScan = async () => {
    setIsScanning(true);
    setPlaygroundOutput('Traversing AST syntax tree & require() graph via Switch backend...');
    
    const current = snippets[selectedSnippet];
    const cveId = selectedSnippet === 'jwt' ? 'CVE-2026-3114' : selectedSnippet === 'axios' ? 'CVE-2026-4482' : 'CVE-2026-7819';
    const filePath = selectedSnippet === 'jwt' ? 'src/auth/verify.ts' : selectedSnippet === 'axios' ? 'src/services/webhook.ts' : 'scripts/legacy/archived-builder.js';
    
    try {
      const backendRes = await runBackendASTScan(cveId, filePath, current.vulnerableCode);
      if (backendRes) {
        setIsScanning(false);
        setPlaygroundOutput(backendRes.is_reachable 
          ? `🐺 THE WOLF: Reachable in ${backendRes.file_path} (${backendRes.match_count} calls detected). Exploitable in production.`
          : `🐑 CRYING WOLF: Muted. ${backendRes.file_path} is an unreachable test/dead code file.`);
        return;
      }
    } catch (e) {
      // Fallback to local
    }

    setTimeout(() => {
      setIsScanning(false);
      setPlaygroundOutput(snippets[selectedSnippet].verdict);
    }, 600);
  };

  const filtered = cves.filter(c => {
    if (filter === 'reachable' && !c.isReachable) return false;
    if (filter === 'unreachable' && c.isReachable) return false;
    if (search && !c.library.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const reachableCount = cves.filter(c => c.isReachable).length;
  const falsePositiveCount = cves.filter(c => !c.isReachable).length;

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header with clean spacious layout */}
        <div className="pb-8 border-b-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                AST Reachability Scanner
              </h1>
              <span className="px-2.5 py-0.5 bg-[#FFE500] border-2 border-black text-xs font-mono font-bold">
                PROVE THE WOLF
              </span>
            </div>
            <p className="text-base font-medium text-neutral-700 mt-2 max-w-2xl">
              Generic scanners match version numbers against a CVE list and page on-call devs for dead code. ZeroDay Sentry traces your real AST call paths to see if the vulnerable function is actually executed.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="px-5 py-3 bg-white border-2 border-black shadow-neo-sm hover:-translate-y-0.5 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-scan AST Call Graph</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-8 bg-white border-2 border-black shadow-neo hover:-translate-y-1 transition-all">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider">Wolf Found (Reachable)</span>
            <div className="text-4xl font-black text-black font-mono mt-3">
              {reachableCount} Active
            </div>
            <p className="text-xs text-neutral-600 mt-3 font-medium">
              Real vulnerability executed on production HTTP endpoints.
            </p>
          </div>

          <div className="p-8 bg-[#FFE500] border-2 border-black shadow-neo hover:-translate-y-1 transition-all">
            <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">False Alarms Silenced</span>
            <div className="text-4xl font-black text-black font-mono mt-3">
              {falsePositiveCount} Ignored
            </div>
            <p className="text-xs text-black/90 mt-3 font-medium">
              Dead code in unused scripts or build tools. Zero dev hours wasted.
            </p>
          </div>

          <div className="p-8 bg-white border-2 border-black shadow-neo hover:-translate-y-1 transition-all">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider">Switch AI Squad</span>
            <div className="text-4xl font-black text-black font-mono mt-3">
              2 Agents
            </div>
            <p className="text-xs text-neutral-600 mt-3 font-mono">
              @cve-analyst + @patch-crafter
            </p>
          </div>
        </div>

        {/* INTERACTIVE AST CODE SANDBOX IN SCANNER */}
        <div className="p-8 sm:p-10 bg-neutral-50 border-2 border-black shadow-neo">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs font-bold bg-[#FFE500] border border-black px-2.5 py-1 uppercase">
                Interactive Code Sandbox
              </span>
              <h3 className="text-2xl font-black text-black mt-2">
                AST Reachability Playground
              </h3>
              <p className="text-xs font-mono text-neutral-600 mt-1">
                Select a package to see how @cve-analyst inspects your source code syntax tree.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['jwt', 'axios', 'lodash'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedSnippet(key);
                    setPlaygroundOutput('Click "Run AST Inspection" to trace call graph');
                  }}
                  className={`px-3.5 py-1.5 border-2 border-black font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedSnippet === key 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                <span className="text-neutral-600">SOURCE CODE FILE</span>
                <span className="text-red-600">Unpatched Target</span>
              </div>
              <pre className="p-4 bg-neutral-900 text-neutral-200 border-2 border-black font-mono text-xs overflow-x-auto leading-relaxed h-[200px]">
                {snippets[selectedSnippet].vulnerableCode}
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                <span className="text-neutral-600">AUTO-GENERATED CODEMOD</span>
                <span className="text-emerald-700">@patch-crafter Fix</span>
              </div>
              <pre className="p-4 bg-neutral-900 text-emerald-300 border-2 border-black font-mono text-xs overflow-x-auto leading-relaxed h-[200px]">
                {snippets[selectedSnippet].patch}
              </pre>
            </div>
          </div>

          {/* AST Call Path Visualizer */}
          <div className="mt-6 p-4 bg-neutral-900 text-white border-2 border-black font-mono text-xs">
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider mb-2.5 font-bold flex items-center justify-between">
              <span>AST Call Path Graph</span>
              <span className="text-[#FFE500]">Parsed in 12ms</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-200">
                HTTP POST /api/login
              </span>
              <span className="text-neutral-500">➔</span>
              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-200">
                authMiddleware (verify.ts)
              </span>
              <span className="text-neutral-500">➔</span>
              <span className={`px-2.5 py-1 border font-bold ${snippets[selectedSnippet].isReachable ? 'bg-red-950 border-red-500 text-red-300' : 'bg-neutral-800 border-neutral-700 text-neutral-500'}`}>
                {selectedSnippet === 'jwt' ? 'jwt.verify(token, secret, { algorithms: ["none"] })' : selectedSnippet === 'axios' ? 'axios.post(userUrl, { maxRedirects: 5 })' : '_.template(str)'}
              </span>
              <span className="text-neutral-500">➔</span>
              <span className={`px-2 py-1 font-bold ${snippets[selectedSnippet].isReachable ? 'bg-[#FFE500] text-black border border-black' : 'bg-emerald-900 text-emerald-300 border border-emerald-700'}`}>
                {snippets[selectedSnippet].isReachable ? '🚨 REACHABLE PRODUCTION SINK' : '✓ MUTED DEAD TEST CODE'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-mono text-xs text-black font-bold flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-500 animate-spin' : 'bg-black'}`} />
              <span>{playgroundOutput}</span>
            </div>

            <button
              onClick={runPlaygroundScan}
              disabled={isScanning}
              className="px-5 py-2.5 bg-[#FFE500] border-2 border-black font-mono text-xs font-black shadow-neo-sm hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              {isScanning ? 'Analyzing AST...' : 'Run AST Inspection →'}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-2 border-black shadow-neo-sm">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search library, CVE ID, or file location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-2 border-black text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer ${
                filter === 'all' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter('reachable')}
              className={`px-3.5 py-1.5 border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer ${
                filter === 'reachable' ? 'bg-[#FFE500] text-black' : 'bg-white text-black'
              }`}
            >
              Real Wolves Only
            </button>
            <button
              onClick={() => setFilter('unreachable')}
              className={`px-3.5 py-1.5 border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer ${
                filter === 'unreachable' ? 'bg-neutral-200 text-black' : 'bg-white text-black'
              }`}
            >
              Crying Wolf
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-white font-mono text-xs uppercase">
                <tr>
                  <th className="py-3.5 px-4">CVE &amp; Library</th>
                  <th className="py-3.5 px-4">Versions</th>
                  <th className="py-3.5 px-4">Reachability Proof</th>
                  <th className="py-3.5 px-4">Patch Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-sans">
                {filtered.map((cve) => (
                  <tr key={cve.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-black text-black">{cve.library}</div>
                      <div className="font-mono text-xs text-neutral-600">{cve.id}</div>
                      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold mt-1 ${
                        cve.severity === 'CRITICAL' ? 'bg-black text-[#FFE500]' : 'bg-neutral-200 text-black'
                      }`}>
                        {cve.severity}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <div>Current: <span className="font-bold text-red-600">{cve.currentVersion}</span></div>
                      <div>Patched: <span className="font-bold text-emerald-600">{cve.patchedVersion}</span></div>
                    </td>

                    <td className="py-4 px-4">
                      {cve.isReachable ? (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-[#FFE500] border border-black font-mono text-xs font-bold inline-block">
                            🐺 REAL WOLF (REACHABLE)
                          </span>
                          <div className="font-mono text-xs text-black font-bold">
                            {cve.reachableLocation}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {cve.exploitVector}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-neutral-200 border border-neutral-400 font-mono text-xs text-neutral-600 inline-block">
                            🐑 FALSE ALARM (DEAD CODE)
                          </span>
                          <div className="text-xs text-neutral-500 font-mono">
                            {cve.reachableLocation}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      {cve.isReachable ? (
                        <div>
                          <div className="font-bold text-black">{cve.testSuiteResult}</div>
                          <div className="text-neutral-500">{cve.linesRewritten} lines adapted</div>
                        </div>
                      ) : (
                        <span className="text-neutral-400">Silenced</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {cve.isReachable ? (
                        <button
                          onClick={() => onEscalateToWarRoom(cve)}
                          className="px-3.5 py-2 bg-[#FFE500] border-2 border-black shadow-neo-sm hover:-translate-y-0.5 font-mono text-xs font-black transition-all cursor-pointer"
                        >
                          Open in War-Room →
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-neutral-400">Silenced safely</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
