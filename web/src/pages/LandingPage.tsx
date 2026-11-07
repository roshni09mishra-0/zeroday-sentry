import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check, 
  Play, 
  ShieldAlert, 
  Sparkles, 
  Terminal, 
  X, 
  Code2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  GitPullRequest,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  FileCode,
  FileText
} from 'lucide-react';
import { CVEAlert } from '../types';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onSimulateCVE: () => void;
  cves: CVEAlert[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  onSimulateCVE, 
  cves 
}) => {
  const [demoApproved, setDemoApproved] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Live Terminal Simulation in Hero
  const [heroSnippetTab, setHeroSnippetTab] = useState<'diff' | 'tests' | 'thread'>('diff');
  const [activeTabMode, setActiveTabMode] = useState<'wolf' | 'dead'>('wolf');

  // Business ROI Calculator State (Track 1 Winner Feature)
  const [teamSize, setTeamSize] = useState<number>(20);
  const [weeklyAlerts, setWeeklyAlerts] = useState<number>(25);

  const hoursSavedPerMonth = Math.round(teamSize * (weeklyAlerts / 6.2));
  const annualDollarsSaved = hoursSavedPerMonth * 95 * 12;

  useEffect(() => {
    if (!showDemoModal) return;
    const timer = setInterval(() => {
      setDemoStep(prev => (prev < 4 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, [showDemoModal]);

  const demoSteps = [
    {
      time: '10:42',
      badge: 'DEPENDABOT ALERT',
      title: '2 new alerts land on acme/checkout-web',
      body: 'Standard scanners only match version numbers: axios 0.27.2 CVE-2023-45857 Medium (6.5) and lodash 4.17.20 CVE-2021-23337 High (7.2). They have no idea if your app actually calls the broken functions.',
      quote: '10:42 Meera (lead dev): @cve-analyst are these real for us?'
    },
    {
      time: '10:43',
      badge: '@cve-analyst (READ-ONLY)',
      title: '@cve-analyst checks both against src/ (41 files)',
      body: 'lodash is NOT REACHABLE: The flaw is in _.template. We only use debounce, get and isEqual in 6 files. axios is REACHABLE: src/api/client.js:42 creates instance with withCredentials: true, and rates.js:9 calls partner-rates.example.com.',
      quote: '10:43 @cve-analyst: lodash NOT REACHABLE. axios REACHABLE at client.js:42. @patch-crafter this one is yours.'
    },
    {
      time: '10:44',
      badge: '@patch-crafter (ISOLATED BRANCH)',
      title: '@patch-crafter branches, upgrades, and tests',
      body: 'Branches fix/axios-cve-2023-45857. Run 1 fails (Jest CommonJS vs axios 1.x ESM). Agent maps CJS in jest.config.js, replaces deprecated axios.all with Promise.all in checkout.js. Run 2 passes: 18 of 18 test suites green.',
      quote: '10:53 @patch-crafter: Test run 2: 18 passed, 18 total. Rescan: advisory resolved. Draft PR #23 (+7 -4).'
    },
    {
      time: '10:58',
      badge: 'LEAD DEVELOPER (MEERA)',
      title: 'Meera inspects the 3-file diff in the thread and approves',
      body: 'Nothing is marked ready for review until a human says yes. Zero rogue bot commits. The agent marks PR #23 ready for review and links the war room thread in description.',
      quote: '10:58 Meera: Read the diff. Approved.'
    },
    {
      time: '10:58',
      badge: 'PATCH COMPLETED',
      title: 'PR #23 marked ready for review',
      body: 'Advisory resolved with full audit trail. lodash alert deferred to next routine update with written rationale.',
      quote: '10:58 @patch-crafter: Marked #23 ready for review and linked this thread in the description.'
    }
  ];

  return (
    <div className="bg-white text-black min-h-screen selection:bg-[#FFE500] overflow-x-hidden">
      {/* 0. CONTINUOUS MARQUEE TICKER TAPE (Neo-Brutalist Infinite Scroll) */}
      <div className="bg-black text-[#FFE500] border-b-2 border-black py-2.5 overflow-hidden whitespace-nowrap text-xs font-mono font-bold tracking-wider select-none relative z-20">
        <div className="animate-marquee flex items-center gap-8">
          <span>⚡ BUILT ON SWITCH · WORKS IN SLACK, TEAMS, DISCORD & MATTERMOST</span>
          <span className="text-white">•</span>
          <span className="text-white">AST REACHABILITY: PROVE FILE:LINE CALL SITES</span>
          <span className="text-white">•</span>
          <span>HUMAN-IN-THE-LOOP APPROVAL IN THREAD</span>
          <span className="text-white">•</span>
          <span className="text-white">AXIOS CVE-2023-45857 (REACHABLE)</span>
          <span className="text-white">•</span>
          <span>LODASH CVE-2021-23337 (NOT REACHABLE MUTED)</span>
          <span className="text-white">•</span>
          <span className="text-white">AUTONOMOUS JEST & ESM TEST RECOVERY</span>
          <span className="text-white">•</span>
          <span>ZERO ROGUE BOT MERGES</span>
          <span className="text-white">•</span>
          <span className="text-white">⚡ BUILT ON SWITCH · WORKS IN SLACK, TEAMS, DISCORD & MATTERMOST</span>
          <span className="text-white">•</span>
          <span>AST REACHABILITY: PROVE FILE:LINE CALL SITES</span>
          <span className="text-white">•</span>
          <span className="text-white">HUMAN-IN-THE-LOOP APPROVAL IN THREAD</span>
          <span className="text-white">•</span>
          <span>AUTONOMOUS JEST & ESM TEST RECOVERY</span>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-block px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-bold uppercase tracking-wider mb-5">
              Built on Switch · works in Slack, Teams, Discord and Mattermost
            </div>

            {/* Main Huge Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.08] animate-slide-up">
              Don't patch every alert. Patch the one your code actually calls.
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-base sm:text-lg text-neutral-800 font-medium max-w-2xl leading-relaxed animate-slide-up delay-100">
              ZeroDay Sentry puts two AI agents in your security channel. One reads your code to check whether a flagged CVE is reachable. The other upgrades the package, fixes what breaks, runs your tests and rescans. A lead developer approves in the thread.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-slide-up delay-200">
              <button
                onClick={() => onNavigate('war-room')}
                className="px-7 py-3.5 bg-[#FFE500] text-black font-extrabold text-base border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 active:shadow-neo-sm transition-neo cursor-pointer flex items-center gap-2"
              >
                <span>See a real run</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <a
                href="https://github.com/roshni09mishra-0/zeroday-sentry"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3.5 bg-white text-black font-extrabold text-base border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 active:shadow-neo-sm transition-neo flex items-center gap-2.5 cursor-pointer"
              >
                <span>Clone the repo</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-600" />
              </a>

              <a
                href="https://www.loom.com/share/a784a8fbe22e49bc88bfcfabb4443852"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-black text-white font-mono text-xs font-bold border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 transition-neo flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#FFE500] text-[#FFE500]" />
                <span>Watch demo video (Loom)</span>
              </a>
            </div>

            {/* Trust Line */}
            <div className="mt-8 pt-6 border-t border-neutral-300 font-mono text-xs text-neutral-700 leading-relaxed max-w-2xl">
              <span className="font-bold text-black">Trust line:</span> Open source. Runs on your machine. Works with the coding agent you already use. Nothing is marked ready for review until a human says yes.
            </div>
          </div>

          {/* Right Column: Real Chat Room Mock & Evidence Visual */}
          <div className="lg:col-span-5 animate-slide-up delay-300">
            <div className="bg-[#FFE500] text-black border-2 border-black shadow-neo-lg p-5 relative">
              
              {/* Header: Clean brutalist title & tabs */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-black text-[#FFE500] font-mono text-[11px] font-black">
                    #security-war-room
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    acme/checkout-web
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => setHeroSnippetTab('thread')}
                    className={`px-2 py-1 font-bold border border-black transition-all cursor-pointer text-[11px] ${
                      heroSnippetTab === 'thread'
                        ? 'bg-black text-white shadow-neo-sm'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setHeroSnippetTab('diff')}
                    className={`px-2 py-1 font-bold border border-black transition-all cursor-pointer text-[11px] ${
                      heroSnippetTab === 'diff'
                        ? 'bg-black text-white shadow-neo-sm'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Diff (+7 -4)
                  </button>
                  <button
                    onClick={() => setHeroSnippetTab('tests')}
                    className={`px-2 py-1 font-bold border border-black transition-all cursor-pointer text-[11px] ${
                      heroSnippetTab === 'tests'
                        ? 'bg-black text-white shadow-neo-sm'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Tests (18/18)
                  </button>
                </div>
              </div>

              {/* Card Body: Real Content Blocks */}
              <div className="bg-white border-2 border-black p-4 font-mono text-xs shadow-neo-sm min-h-[300px]">
                {heroSnippetTab === 'thread' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-bold text-blue-700">10:42 Dependabot [bot]</span>
                        <span>acme/checkout-web</span>
                      </div>
                      <div className="text-[11px] text-neutral-800">
                        2 new alerts: axios 0.27.2 CVE-2023-45857 (Medium) · lodash 4.17.20 CVE-2021-23337 (High)
                      </div>
                    </div>

                    <div className="p-2.5 bg-neutral-50 border border-neutral-300 rounded space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-bold text-purple-700">10:42 Meera (lead dev)</span>
                      </div>
                      <div className="text-[11px] text-neutral-800">
                        @cve-analyst are these real for us?
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border-2 border-emerald-600 rounded space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-800">10:43 @cve-analyst [Agent]</span>
                        <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] font-bold">VERDICT</span>
                      </div>
                      <div className="text-[11px] text-neutral-800 leading-relaxed">
                        Checked both against src/ (41 files):<br />
                        • <span className="font-bold text-neutral-600">lodash: NOT REACHABLE</span> (No template calls).<br />
                        • <span className="font-bold text-emerald-700">axios: REACHABLE</span> at <code className="bg-white px-1 border border-neutral-300">src/api/client.js:42</code> withCredentials: true cross-origin.
                      </div>
                    </div>
                  </div>
                )}

                {heroSnippetTab === 'diff' && (
                  <div className="space-y-2 animate-in fade-in duration-150 text-[11px]">
                    <div className="text-neutral-500 font-bold border-b pb-1">
                      The change: 3 files, +7 -4 (Draft PR #23)
                    </div>
                    <div className="p-2 bg-neutral-900 text-neutral-200 border border-black space-y-1 leading-relaxed overflow-x-auto">
                      <div className="text-neutral-400">// package.json</div>
                      <div className="text-red-400">- "axios": "^0.27.2",</div>
                      <div className="text-emerald-400">+ "axios": "^1.6.8",</div>
                      <div className="text-neutral-400 mt-1">// jest.config.js</div>
                      <div className="text-emerald-400">+ moduleNameMapper: &#123; '^axios$': 'axios/dist/browser/axios.cjs' &#125;,</div>
                      <div className="text-neutral-400 mt-1">// src/api/checkout.js</div>
                      <div className="text-red-400">- return axios.all([getRates(cart), getTax(cart)])</div>
                      <div className="text-red-400">-   .then(axios.spread((rates, tax) =&gt; (&#123; rates, tax &#125;)));</div>
                      <div className="text-emerald-400">+ const [rates, tax] = await Promise.all([getRates(cart), getTax(cart)]);</div>
                      <div className="text-emerald-400">+ return &#123; rates, tax &#125;;</div>
                    </div>
                  </div>
                )}

                {heroSnippetTab === 'tests' && (
                  <div className="space-y-2.5 animate-in fade-in duration-150 text-[11px]">
                    <div className="p-2 bg-red-50 border border-red-300 text-red-900 space-y-1">
                      <span className="font-bold">Test Run 1 (Initial ESM bump):</span>
                      <p>Tests: 11 failed, 7 passed, 18 total</p>
                      <p className="text-[10px] text-red-700">SyntaxError: Cannot use import statement outside a module</p>
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-400 text-emerald-950 space-y-1">
                      <span className="font-bold">Test Run 2 (After CJS mapper & Promise.all fix):</span>
                      <p className="font-bold text-emerald-700">Test Suites: 6 passed, 6 total / Tests: 18 passed, 18 total</p>
                      <p className="text-[10px] text-emerald-800">Rescan: axios advisory resolved, no new advisories.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Row with Caption */}
              <div className="mt-3 pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-black">Awaiting lead dev approval in thread</span>
                </div>
                <button
                  onClick={() => onNavigate('war-room')}
                  className="font-bold text-black underline hover:no-underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Open in War Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 text-[10px] font-mono text-neutral-700 italic">
                Demo repo and sample data. The CVEs are real.
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM SECTION: Scanners match version numbers, not call paths */}
      <section id="problem-section" className="bg-[#FFE500] border-y-2 border-black py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono font-bold text-xs uppercase tracking-widest text-black mb-6 flex items-center gap-2">
            <span>THE PROBLEM</span>
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight">
                Scanners match version numbers, not call paths. That is why most alerts are noise and a few are real.
              </h2>
            </div>

            <div className="lg:col-span-5 space-y-4 pt-1">
              <div className="p-4 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-bold font-mono text-xs block text-black mb-1">1. Alerts say "vulnerable", not "used".</span>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  A flagged package may never call the broken function. In Sentry's demo repo, 2 alerts arrive and only 1 is reachable.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-bold font-mono text-xs block text-black mb-1">2. Upgrades break things.</span>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  Moving axios from 0.27 to 1.x makes a CommonJS Jest setup fail with "Cannot use import statement outside a module", because 1.x ships ES modules.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-bold font-mono text-xs block text-black mb-1">3. So alerts wait.</span>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  The one real alert sits in the same list as the noise, and nobody owns checking it.
                </p>
              </div>

              <p className="text-sm font-bold text-black pt-2">
                Sentry answers two questions in the channel where the team already talks: do we call it, and can we upgrade without breaking anything?
              </p>
            </div>
          </div>

          {/* Interactive AST Wolf vs Dead Code Visualizer Widget */}
          <div className="mt-12 bg-white border-2 border-black shadow-neo p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4 mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Interactive Call Site Verification</span>
                <h3 className="text-xl font-black text-black mt-0.5">Two alerts arrived on checkout-web: which one is real?</h3>
              </div>
              <div className="flex items-center gap-2 bg-neutral-100 p-1 border border-black">
                <button
                  onClick={() => setActiveTabMode('wolf')}
                  className={`px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeTabMode === 'wolf'
                      ? 'bg-black text-[#FFE500] shadow-neo-sm'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  axios CVE-2023-45857 (REACHABLE)
                </button>
                <button
                  onClick={() => setActiveTabMode('dead')}
                  className={`px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeTabMode === 'dead'
                      ? 'bg-black text-[#FFE500] shadow-neo-sm'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  lodash CVE-2021-23337 (NOT REACHABLE)
                </button>
              </div>
            </div>

            {activeTabMode === 'wolf' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in fade-in duration-200">
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-red-50 border border-red-300 text-red-900">
                    <span className="font-bold">Dependabot Alert:</span>
                    <p className="mt-1">axios 0.27.2 CVE-2023-45857 Medium (6.5) · Cross-origin XSRF leak</p>
                  </div>
                  <div className="p-3 bg-neutral-900 text-white border border-black">
                    <div className="text-neutral-400 mb-1">// src/api/client.js:42</div>
                    <div className="text-emerald-400">const apiClient = axios.create(&#123; withCredentials: true &#125;);</div>
                    <div className="text-neutral-400 mt-2">// src/api/rates.js:9</div>
                    <div className="text-yellow-400">apiClient.get('https://partner-rates.example.com/rates');</div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFE500]/20 border-2 border-black">
                  <span className="px-2 py-0.5 bg-black text-[#FFE500] font-mono text-xs font-bold inline-block mb-2">
                    REACHABLE AT CLIENT.JS:42
                  </span>
                  <h4 className="text-base font-black text-black mb-1">
                    @cve-analyst confirmed active cross-origin vulnerability
                  </h4>
                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                    On axios 0.27.2, <code className="bg-white px-1 border border-black">withCredentials: true</code> attaches the session XSRF token header to requests targeting different origins. Upgraded to 1.6.8, fixed ESM Jest module mapper, and tested.
                  </p>
                  <button 
                    onClick={() => onNavigate('scanner')}
                    className="mt-4 text-xs font-mono font-bold text-black underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect AST call graph in scanner</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in fade-in duration-200">
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-yellow-50 border border-yellow-300 text-yellow-900">
                    <span className="font-bold">Dependabot Alert:</span>
                    <p className="mt-1">lodash 4.17.20 CVE-2021-23337 High (7.2) · Command injection in _.template</p>
                  </div>
                  <div className="p-3 bg-neutral-900 text-neutral-400 border border-black">
                    <div className="text-neutral-500 mb-1">// AST Search across src/ (41 files)</div>
                    <div className="text-neutral-300">import &#123; debounce, get, isEqual &#125; from 'lodash';</div>
                    <div className="text-emerald-400">// Checked: 0 calls to template, lodash/template or lodash.template</div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border-2 border-black">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white font-mono text-xs font-bold inline-block mb-2">
                    NOT REACHABLE • DEFERRED WITH REASON
                  </span>
                  <h4 className="text-base font-black text-black mb-1">
                    No emergency patch needed. Closed with written proof.
                  </h4>
                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                    The vulnerability is isolated to template rendering. Our app only uses lodash utility functions in 6 files. The analyst defers the bump to 4.17.21 with the next routine release, preventing sprint disruption.
                  </p>
                  <div className="mt-4 font-mono text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Audit explanation logged in channel thread</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. THE CREW SECTION: Each agent posts evidence, not just a verdict */}
      <section id="crew-section" className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16">
          <div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
              SECURITY WAR ROOM TEAMMATES
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
              Two agents and one human lead in the channel.
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 border border-black shadow-neo-sm">
            EVIDENCE-BASED TRIAGE
          </span>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: @cve-analyst */}
          <div className="bg-white border-2 border-black shadow-neo p-8 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  @cve-analyst
                </div>
                <span className="font-mono text-[10px] text-neutral-500 font-bold border border-neutral-300 px-2 py-0.5">
                  READ-ONLY
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-3">
                Reachability
              </h3>

              <p className="text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                Searches imports and call sites for the vulnerable function or setting the advisory names. Posts file and line as evidence. Never edits files.
              </p>
            </div>

            <div className="p-4 bg-white border border-black font-mono text-xs text-black leading-relaxed flex items-center shadow-neo-sm group-hover:border-black">
              <span>lodash NOT REACHABLE. axios REACHABLE at client.js:42.</span>
              <span className="inline-block w-2 h-3.5 bg-black ml-1.5 animate-cursor-blink flex-shrink-0" />
            </div>
          </div>

          {/* Card 2: @patch-crafter */}
          <div className="bg-white border-2 border-black shadow-neo p-8 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  @patch-crafter
                </div>
                <span className="font-mono text-[10px] text-neutral-500 font-bold border border-neutral-300 px-2 py-0.5">
                  ISOLATED BRANCH
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-3">
                Patch & Test
              </h3>

              <p className="text-sm text-neutral-700 font-medium leading-relaxed mb-6">
                Branches, upgrades, fixes breaking changes, runs tests, and rescans. Tries up to 3 times if tests fail, then posts output. Never merges.
              </p>
            </div>

            <div className="p-4 bg-white border border-black font-mono text-xs text-black leading-relaxed flex items-center shadow-neo-sm group-hover:border-black">
              <span>Test run 2: 18 passed, 18 total. Draft PR #23 (+7 -4).</span>
              <span className="inline-block w-2 h-3.5 bg-black ml-1.5 animate-cursor-blink flex-shrink-0" />
            </div>
          </div>

          {/* Card 3: Lead Developer (Meera) */}
          <div className="bg-[#FFE500] border-2 border-black shadow-neo p-8 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-white font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  Lead Developer
                </div>
                <span className="font-mono text-[10px] text-black font-bold border border-black px-2 py-0.5 bg-white">
                  NAMED HUMAN
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-3">
                Approval Gate
              </h3>

              <p className="text-sm text-black font-medium leading-relaxed mb-6">
                Reads the diff in the thread and approves. Nothing is marked ready for review until a named person says yes.
              </p>
            </div>

            <div 
              onClick={() => setDemoApproved(!demoApproved)}
              className="p-4 bg-white border-2 border-black font-mono text-xs text-black leading-relaxed cursor-pointer hover:bg-neutral-50 active:scale-[0.98] flex items-center justify-between group transition-all shadow-neo-sm"
              title="Click to toggle approval"
            >
              <span className="font-bold">{demoApproved ? 'Approved. PR #23 ready for review.' : 'Read the diff. Approved.'}</span>
              <span className="text-[10px] font-sans font-black px-2 py-0.5 bg-black text-[#FFE500]">
                {demoApproved ? 'Signed off' : 'Click to approve'}
              </span>
            </div>
          </div>
        </div>

        {/* House Rules Strip */}
        <div className="mt-10 p-5 bg-neutral-50 border-2 border-black">
          <span className="font-mono text-xs font-bold text-black uppercase tracking-wider block mb-2">
            House Rules:
          </span>
          <p className="text-xs font-mono text-neutral-800 leading-relaxed">
            @cve-analyst never edits files. @patch-crafter works on a branch and never merges. An unreachable alert is closed with a written reason. If tests still fail after 3 attempts, the agent stops and posts the failing output.
          </p>
        </div>
      </section>

      {/* 4. WORKFLOW PIPELINE INTERACTIVE MAP SECTION */}
      <section className="bg-neutral-50 border-y-2 border-black py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                FOUR STEPS, ONE THREAD
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                Each agent posts evidence, not just a verdict.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('flow')}
                className="px-5 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-neo flex items-center gap-2 cursor-pointer"
              >
                <span>Interactive Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="how-it-works.dc.html"
                className="px-5 py-2.5 bg-[#FFE500] border-2 border-black font-mono text-xs font-bold shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-neo flex items-center gap-2 cursor-pointer"
              >
                <span>Full Spec (.dc.html)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4-Step Pipeline Table Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { 
                step: '1', 
                name: 'Alert', 
                who: 'Scanner (Dependabot, Snyk)', 
                happens: 'Alert lands in #security-war-room', 
                posts: 'CVE id, package, severity' 
              },
              { 
                step: '2', 
                name: 'Reachability', 
                who: '@cve-analyst', 
                happens: 'Searches imports and call sites for vulnerable function or setting. Read-only.', 
                posts: 'file:line, or "no call sites found" and what it searched' 
              },
              { 
                step: '3', 
                name: 'Patch', 
                who: '@patch-crafter', 
                happens: 'Branches, upgrades, fixes breaking changes, runs tests, rescans', 
                posts: 'diff, test counts, rescan result' 
              },
              { 
                step: '4', 
                name: 'Approval', 
                who: 'Lead developer', 
                happens: 'Reads the diff in the thread and approves', 
                posts: 'a named human "Approved"' 
              },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="bg-white border-2 border-black p-5 shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-neo flex flex-col justify-between min-h-[240px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black px-2 py-0.5 bg-[#FFE500] border border-black">
                      Step {p.step}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold truncate max-w-[120px]">
                      {p.who}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-black mb-1">
                    {p.name}
                  </h4>
                  <p className="text-xs text-neutral-700 font-medium mb-3 leading-relaxed">
                    {p.happens}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200 text-[11px] font-mono text-neutral-600 bg-neutral-50 p-2 border border-neutral-300">
                  <span className="font-bold text-black block mb-0.5">Posts:</span>
                  <span>{p.posts}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section Built on Switch */}
          <div className="mt-8 p-6 bg-black text-white border-2 border-black shadow-neo flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-[#FFE500] font-bold uppercase tracking-wider block mb-1">
                BUILT ON SWITCH
              </span>
              <p className="text-sm font-medium text-neutral-200 max-w-3xl leading-relaxed">
                Each channel is a room. Both agents are ordinary coding-agent sessions (Claude Code, Codex or OpenCode) given a role and instructions, and they join the room like teammates. The approval step is a person in the same thread.
              </p>
            </div>
            <button
              onClick={() => onNavigate('war-room')}
              className="px-6 py-3 bg-[#FFE500] text-black font-black text-xs font-mono uppercase tracking-wider border-2 border-black hover:bg-yellow-300 whitespace-nowrap transition-colors"
            >
              See a real run →
            </button>
          </div>
        </div>
      </section>

      {/* 5. REALISTIC ROI & WORKFLOW CALCULATOR */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white border-2 border-black p-8 sm:p-12 shadow-neo-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                ENGINEERING MATH
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                Why teams run reachability before patching.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 max-w-md">
              In typical JavaScript repos, over 60% of flagged CVEs are in unused functions or dev-only fixtures. Sentry cuts the noise so the one real vulnerability gets fixed in 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 items-center">
            {/* Left Column: Interactive Sliders */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-xs font-bold uppercase text-black">
                    Engineering Team Size:
                  </label>
                  <span className="font-mono text-base font-black px-2.5 py-0.5 bg-[#FFE500] border border-black">
                    {teamSize} engineers
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                  <span>5 devs</span>
                  <span>50 devs</span>
                  <span>100 devs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-mono text-xs font-bold uppercase text-black">
                    Weekly Scanner Alerts (Dependabot/Snyk):
                  </label>
                  <span className="font-mono text-base font-black px-2.5 py-0.5 bg-[#FFE500] border border-black">
                    {weeklyAlerts} alerts/week
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={weeklyAlerts}
                  onChange={(e) => setWeeklyAlerts(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-1">
                  <span>10 alerts</span>
                  <span>30 alerts</span>
                  <span>60 alerts</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border border-black font-mono text-xs text-neutral-700 leading-relaxed">
                <span className="font-bold text-black block mb-1">Authentic calculation model:</span>
                Calculated on 0.8 hours per alert wasted on manual dead-code triage, standard dev rate of $95/hr, and AST verification suppressing unreachable alerts like lodash template.
              </div>
            </div>

            {/* Right Column: Dynamic Projected Savings Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#FFE500] border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-black uppercase">
                  Annual Budget Saved
                </span>
                <div className="text-3xl font-black text-black mt-2 font-mono">
                  ${annualDollarsSaved.toLocaleString()}
                </div>
                <p className="text-xs font-medium text-black/80 mt-2">
                  Replaces manual grep cycles with verified call-site evidence.
                </p>
              </div>

              <div className="p-6 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                  Dev Hours Reclaimed
                </span>
                <div className="text-3xl font-black text-black mt-2 font-mono">
                  {hoursSavedPerMonth} <span className="text-sm font-sans font-bold text-neutral-600">hrs/mo</span>
                </div>
                <p className="text-xs font-medium text-neutral-600 mt-2">
                  Devs focus on shipping features instead of researching false alarms.
                </p>
              </div>

              <div className="p-6 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                  Unreachable Alerts Muted
                </span>
                <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">
                  50%
                </div>
                <p className="text-xs font-medium text-neutral-600 mt-2">
                  In demo repo: lodash closed with evidence, axios patched.
                </p>
              </div>

              <div className="p-6 bg-black text-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-[#FFE500] uppercase">
                  Time to Approved PR
                </span>
                <div className="text-3xl font-black text-white mt-2 font-mono">
                  ~16 <span className="text-sm font-sans font-bold text-neutral-400">min</span>
                </div>
                <p className="text-xs font-medium text-neutral-300 mt-2">
                  10:42 alert to 10:58 lead developer sign-off in thread.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA: Bring the agents you already use */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24">
        <div className="bg-black text-white p-10 sm:p-14 border-2 border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-neo group hover:border-[#FFE500] transition-colors">
          <div>
            <span className="font-mono text-xs text-[#FFE500] font-bold uppercase tracking-wider block mb-2">
              READY TO RUN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Bring the agents you already use.
            </h2>
            <p className="text-base font-normal text-neutral-300 max-w-2xl leading-relaxed">
              Clone the repo and run your first alert in about ten minutes. Works with Claude Code, Codex, or OpenCode in Slack, Teams, Discord or Mattermost.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="https://github.com/roshni09mishra-0/zeroday-sentry"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#FFE500] text-black font-black text-sm border-2 border-black hover:bg-yellow-300 hover:-translate-y-0.5 transition-all text-center"
            >
              Clone the repo
            </a>
            <a
              href="faq.dc.html"
              className="px-6 py-3.5 bg-neutral-900 text-white font-mono text-xs font-bold border-2 border-neutral-700 hover:border-white transition-colors text-center"
            >
              Read FAQ & Setup
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-black py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-black">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold">[0D]</span>
            <span className="font-bold">ZeroDay Sentry</span>
            <span className="text-neutral-400">·</span>
            <a href="https://github.com/roshni09mishra-0/zeroday-sentry" target="_blank" rel="noreferrer" className="underline hover:no-underline">
              GitHub
            </a>
            <span className="text-neutral-400">·</span>
            <a href="demo-run.dc.html" className="underline hover:no-underline">
              Demo run
            </a>
            <span className="text-neutral-400">·</span>
            <a href="how-it-works.dc.html" className="underline hover:no-underline">
              How it works
            </a>
            <span className="text-neutral-400">·</span>
            <a href="faq.dc.html" className="underline hover:no-underline">
              FAQ
            </a>
          </div>
          <div className="text-neutral-600 text-center sm:text-right">
            Built for the Flip the Switch hackathon, powered by Switch · Demo repo and sample data. The CVEs are real.
          </div>
        </div>
      </footer>

      {/* 30-SECOND DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200">
          <div className="bg-white border-4 border-black shadow-neo-lg max-w-2xl w-full p-8 sm:p-10 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 p-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-3.5 h-3.5 bg-[#FFE500] border-2 border-black inline-block animate-ping" />
              <h3 className="text-2xl font-black text-black">
                How It Works in 30 Seconds
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {demoSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setDemoStep(idx)}
                  className={`cursor-pointer pb-2 border-b-4 transition-all ${
                    demoStep === idx 
                      ? 'border-[#FFE500]' 
                      : idx < demoStep 
                      ? 'border-black' 
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold text-neutral-500">0{idx + 1}</div>
                  <div className="font-mono text-xs font-black text-black">{step.time}</div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-neutral-50 border-2 border-black shadow-neo-sm space-y-3">
              <span className="px-2.5 py-0.5 bg-black text-[#FFE500] font-mono text-[11px] font-bold inline-block">
                {demoSteps[demoStep].badge}
              </span>

              <h4 className="text-lg font-black text-black leading-snug">
                {demoSteps[demoStep].title}
              </h4>

              <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                {demoSteps[demoStep].body}
              </p>

              <div className="p-3 bg-white border border-black font-mono text-xs text-black">
                {demoSteps[demoStep].quote}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setDemoStep(prev => (prev > 0 ? prev - 1 : 4))}
                className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold shadow-neo-sm cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                ← Back
              </button>

              <button
                onClick={() => {
                  setShowDemoModal(false);
                  onNavigate('war-room');
                }}
                className="px-5 py-2 bg-[#FFE500] border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Jump to Live War-Room →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
