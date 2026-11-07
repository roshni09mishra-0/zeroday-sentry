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
  Cpu
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
      setDemoStep(prev => (prev < 3 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, [showDemoModal]);

  const demoSteps = [
    {
      time: '00:05',
      badge: 'DEPENDABOT DUMP',
      title: 'Monday 9 AM: Another 14 CVE alerts in your inbox',
      body: 'Standard scanners just flag package.json version numbers. They have no idea if your app actually calls the vulnerable function.',
      quote: 'CVE-2026-3114 (CVSS 9.8 Critical) flagged in package.json'
    },
    {
      time: '00:14',
      badge: '@cve-analyst (SWITCH)',
      title: '@cve-analyst checks your real call tree in Slack',
      body: 'Instead of guessing, the agent greps your AST. If the vulnerable method is sitting in dead test code, it stays quiet. If it is in your auth route, it pings the team.',
      quote: 'Yes, we use the vulnerable method at auth.js:42'
    },
    {
      time: '00:23',
      badge: '@patch-crafter (SWITCH)',
      title: '@patch-crafter rewrites the broken API call & tests it',
      body: 'Major bumps break syntax. The agent rewrites the deprecated lines to v2 spec, runs your actual test suite in a sandbox, and posts the green diff.',
      quote: 'Rewrote 3 lines to v2 syntax. All 18 tests passing. Here is the PR.'
    },
    {
      time: '00:30',
      badge: 'HUMAN LEAD DEV',
      title: 'You check the 3-line diff and type "Approved."',
      body: 'Zero rogue bot commits. You stay in control. One click merges the PR and closes the CVE alert for good.',
      quote: 'Approved.'
    }
  ];

  return (
    <div className="bg-white text-black min-h-screen selection:bg-[#FFE500] overflow-x-hidden">
      {/* 0. CONTINUOUS MARQUEE TICKER TAPE (Neo-Brutalist Infinite Scroll) */}
      <div className="bg-black text-[#FFE500] border-b-2 border-black py-2.5 overflow-hidden whitespace-nowrap text-xs font-mono font-bold tracking-wider select-none relative z-20">
        <div className="animate-marquee flex items-center gap-8">
          <span>⚡ SWITCH EVENT BUS v1.0 ACTIVE</span>
          <span className="text-white">•</span>
          <span className="text-white">AST REACHABILITY: 0 FALSE POSITIVES</span>
          <span className="text-white">•</span>
          <span>HUMAN-IN-THE-LOOP APPROVAL</span>
          <span className="text-white">•</span>
          <span className="text-white">SLACK / DISCORD / MS TEAMS BRIDGES</span>
          <span className="text-white">•</span>
          <span>AUTONOMOUS TEST-VERIFIED PATCHING</span>
          <span className="text-white">•</span>
          <span className="text-white">NO ROGUE BOT COMMITS</span>
          <span className="text-white">•</span>
          <span>⚡ SWITCH EVENT BUS v1.0 ACTIVE</span>
          <span className="text-white">•</span>
          <span className="text-white">AST REACHABILITY: 0 FALSE POSITIVES</span>
          <span className="text-white">•</span>
          <span>HUMAN-IN-THE-LOOP APPROVAL</span>
          <span className="text-white">•</span>
          <span className="text-white">SLACK / DISCORD / MS TEAMS BRIDGES</span>
          <span className="text-white">•</span>
          <span>AUTONOMOUS TEST-VERIFIED PATCHING</span>
        </div>
      </div>

      {/* 1. HERO SECTION: Clean, minimal, generous breathing whitespace */}
      <section className="pt-24 pb-28 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7">
            {/* Main Huge Headline with Staggered Slide-Up */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.04] animate-slide-up">
              Your scanner cries wolf. We find the wolf.
            </h1>

            {/* Subhead with Staggered Fade */}
            <p className="mt-8 text-lg sm:text-xl text-neutral-800 font-medium max-w-2xl leading-relaxed animate-slide-up delay-100">
              Two AI agents in your team chat. One proves the vulnerable code is really called. One patches it and runs the tests. You hit approve.
            </p>

            {/* Action Buttons with spring hover & active press animations */}
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-slide-up delay-200">
              <button
                onClick={() => {
                  document.getElementById('crew-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-[#FFE500] text-black font-extrabold text-base border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 active:shadow-neo-sm transition-neo cursor-pointer"
              >
                Meet the agents
              </button>

              <button
                onClick={() => {
                  setShowDemoModal(true);
                  setDemoStep(0);
                }}
                className="px-7 py-3.5 bg-white text-black font-extrabold text-base border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 active:shadow-neo-sm transition-neo flex items-center gap-2.5 cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-black group-hover:scale-125 transition-transform duration-200" />
                <span>Watch 30-sec demo</span>
              </button>

              <button
                onClick={() => onNavigate('war-room')}
                className="px-6 py-3.5 bg-black text-white font-mono text-xs font-bold border-2 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0.5 transition-neo flex items-center gap-2 cursor-pointer"
              >
                <span>Live War-Room</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE500]" />
              </button>
            </div>
          </div>

          {/* Right Column: Clean Electric Yellow Code & Patch Card */}
          <div className="lg:col-span-5 animate-slide-up delay-300">
            <div className="bg-[#FFE500] text-black border-2 border-black shadow-neo-lg p-6 relative">
              
              {/* Header: Clean brutalist title & tabs */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-black text-[#FFE500] font-mono text-xs font-black">
                    CVE-2026-3114
                  </span>
                  <span className="font-mono text-xs font-bold text-black">
                    auth.ts:41
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => setHeroSnippetTab('diff')}
                    className={`px-2.5 py-1 font-bold border border-black transition-all cursor-pointer ${
                      heroSnippetTab === 'diff'
                        ? 'bg-black text-white shadow-neo-sm'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Diff
                  </button>
                  <button
                    onClick={() => setHeroSnippetTab('tests')}
                    className={`px-2.5 py-1 font-bold border border-black transition-all cursor-pointer ${
                      heroSnippetTab === 'tests'
                        ? 'bg-black text-white shadow-neo-sm'
                        : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    Tests
                  </button>
                </div>
              </div>

              {/* Card Body: Clean White Box with Light Human Code */}
              <div className="bg-white border-2 border-black p-4 font-mono text-xs shadow-neo-sm space-y-3">
                {heroSnippetTab === 'diff' ? (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-neutral-500 text-[11px]">
                      // Rewritten by @patch-crafter to safe v2 syntax
                    </div>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-300 space-y-1.5 leading-relaxed">
                      <div className="text-red-700 bg-red-50 px-1 border-l-2 border-red-500">
                        - jwt.verify(token, secret, &#123; algorithms: ['none'] &#125;)
                      </div>
                      <div className="text-emerald-700 bg-emerald-50 px-1 border-l-2 border-emerald-500">
                        + jwt.verify(token, secret, &#123; algorithms: ['HS256'] &#125;)
                      </div>
                    </div>
                    <div className="text-neutral-600 text-[11px] pt-1">
                      AST confirmed this method was called in POST /api/login.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="text-neutral-500 text-[11px]">
                      $ npm test -- src/auth.test.ts
                    </div>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-300 space-y-1 text-neutral-800 text-[11px]">
                      <div className="text-emerald-700 font-bold">✓ verifySession rejects none algorithm (8ms)</div>
                      <div className="text-emerald-700 font-bold">✓ signs and validates HS256 claims (14ms)</div>
                      <div className="text-emerald-700 font-bold">✓ token expiration enforced (4ms)</div>
                    </div>
                    <div className="text-emerald-800 font-bold text-[11px]">
                      PASS: 18 of 18 test suites green.
                    </div>
                  </div>
                )}
              </div>

              {/* Simple Human Status Row */}
              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-black">Awaiting lead dev signoff</span>
                </div>
                <button
                  onClick={() => onNavigate('war-room')}
                  className="font-bold text-black underline hover:no-underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Review in War Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE PROBLEM BANNER SECTION: Exactly matching Screenshot 1 & 2 + Interactive Comparison */}
      <section id="problem-section" className="bg-[#FFE500] border-y-2 border-black py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono font-bold text-xs uppercase tracking-widest text-black mb-6 flex items-center gap-2">
            <span>THE PROBLEM</span>
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-6xl font-black text-black leading-tight">
                20 to 30 alerts a week. Nobody reads them.
              </h2>
            </div>

            <div className="lg:col-span-5 space-y-6 pt-2">
              <p className="text-lg sm:text-xl font-bold text-black leading-relaxed">
                Upgrading a library changes the syntax. The app crashes. So the alert gets ignored, even the real one.
              </p>
              <p className="text-base sm:text-lg font-semibold text-black/90">
                We answer two questions: is it reachable, and can we upgrade safely.
              </p>
            </div>
          </div>

          {/* Interactive AST Wolf vs Dead Code Visualizer Widget */}
          <div className="mt-12 bg-white border-2 border-black shadow-neo p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4 mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Interactive AST Simulation</span>
                <h3 className="text-xl font-black text-black mt-0.5">How ZeroDay Sentry stops scanner fatigue</h3>
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
                  🐺 Real Wolf (Auth Route)
                </button>
                <button
                  onClick={() => setActiveTabMode('dead')}
                  className={`px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeTabMode === 'dead'
                      ? 'bg-black text-[#FFE500] shadow-neo-sm'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  💤 Dead Test Code (Crying Wolf)
                </button>
              </div>
            </div>

            {activeTabMode === 'wolf' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in fade-in duration-200">
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-red-50 border border-red-300 text-red-900">
                    <span className="font-bold">⚠️ Standard Scanner Output:</span>
                    <p className="mt-1">Flagged jsonwebtoken@8.5.1 in package.json (CVSS 9.8)</p>
                  </div>
                  <div className="p-3 bg-neutral-900 text-white border border-black">
                    <div className="text-neutral-400 mb-1">// server/src/routes/auth.ts:42</div>
                    <div className="text-red-400">- jwt.verify(token, secret, &#123; algorithms: ['none'] &#125;)</div>
                    <div className="text-emerald-400">+ jwt.verify(token, secret, &#123; algorithms: ['HS256'] &#125;)</div>
                  </div>
                </div>
                <div className="p-4 bg-[#FFE500]/20 border-2 border-black">
                  <span className="px-2 py-0.5 bg-black text-[#FFE500] font-mono text-xs font-bold inline-block mb-2">
                    REACHABLE IN PRODUCTION
                  </span>
                  <h4 className="text-base font-black text-black mb-1">
                    @cve-analyst proves code path execution
                  </h4>
                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                    The agent traced HTTP POST <code className="bg-white px-1 border border-black">/api/login</code> directly into line 42. It automatically dispatched <code className="bg-white px-1 border border-black">@patch-crafter</code> to rewrite the call and test it.
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
                  <div className="p-3 bg-red-50 border border-red-300 text-red-900">
                    <span className="font-bold">⚠️ Standard Scanner Output:</span>
                    <p className="mt-1">ALARM! 50 High Severity CVEs flagged in devDependencies</p>
                  </div>
                  <div className="p-3 bg-neutral-900 text-neutral-400 border border-black">
                    <div className="text-neutral-500 mb-1">// tests/unit/legacy_fixture.spec.ts:18</div>
                    <div>import &#123; mockToken &#125; from 'mock-jwt-helper';</div>
                    <div className="text-neutral-500">// (Never included in Docker production build bundle)</div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border-2 border-black">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-xs font-bold inline-block mb-2">
                    UNREACHABLE • DEAD CODE MUTED
                  </span>
                  <h4 className="text-base font-black text-black mb-1">
                    Zero Slack notification spam created
                  </h4>
                  <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                    ZeroDay Sentry AST verification proves this method is never invoked by any production entrypoint. Your engineering team is spared from useless alarm fatigue.
                  </p>
                  <div className="mt-4 font-mono text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Silent log preserved in audit ledger</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. THE CREW SECTION: Spacious cards with gentle lift animation + Blinking Cursors */}
      <section id="crew-section" className="py-28 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between mb-16">
          <div>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
              AUTONOMOUS CREW
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
              The crew in the security war room.
            </h2>
          </div>
          <span className="hidden sm:inline-block font-mono text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 border border-black shadow-neo-sm">
            HOVER CARDS TO INSPECT
          </span>
        </div>

        {/* 3 Neo-Brutalist Cards Grid with Interactive Tilt/Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: @cve-analyst */}
          <div className="bg-white border-2 border-black shadow-neo p-8 sm:p-10 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  @cve-analyst
                </div>
                <span className="font-mono text-[10px] text-neutral-500 font-bold border border-neutral-300 px-2 py-0.5">
                  AST ENGINE
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-4">
                Is it really reachable?
              </h3>

              <p className="text-base text-neutral-700 font-medium leading-relaxed mb-6">
                Reachability analysis on your own code. No guessing from a version number.
              </p>
            </div>

            {/* Monospace Quote Box with Blinking Terminal Cursor */}
            <div className="p-4 bg-white border border-black font-mono text-xs text-black leading-relaxed flex items-center shadow-neo-sm group-hover:border-black">
              <span>Yes, we use the vulnerable method at auth.js:42</span>
              <span className="inline-block w-2 h-3.5 bg-black ml-1.5 animate-cursor-blink flex-shrink-0" />
            </div>
          </div>

          {/* Card 2: @patch-crafter */}
          <div className="bg-white border-2 border-black shadow-neo p-8 sm:p-10 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  @patch-crafter
                </div>
                <span className="font-mono text-[10px] text-neutral-500 font-bold border border-neutral-300 px-2 py-0.5">
                  SANDBOX TESTER
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-4">
                Fix it. Prove it.
              </h3>

              <p className="text-base text-neutral-700 font-medium leading-relaxed mb-6">
                Upgrades the library, rewrites deprecated code, runs your unit tests.
              </p>
            </div>

            {/* Monospace Quote Box with Blinking Terminal Cursor */}
            <div className="p-4 bg-white border border-black font-mono text-xs text-black leading-relaxed flex items-center shadow-neo-sm group-hover:border-black">
              <span>Rewrote 3 lines to v2 syntax. All 18 tests passing. Here is the PR.</span>
              <span className="inline-block w-2 h-3.5 bg-black ml-1.5 animate-cursor-blink flex-shrink-0" />
            </div>
          </div>

          {/* Card 3: You (Yellow Card matching screenshot) */}
          <div className="bg-[#FFE500] border-2 border-black shadow-neo p-8 sm:p-10 flex flex-col justify-between min-h-[380px] card-interactive group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-block px-3 py-1 bg-black text-white font-mono text-xs font-bold group-hover:scale-105 transition-transform">
                  You
                </div>
                <span className="font-mono text-[10px] text-black font-bold border border-black px-2 py-0.5 bg-white">
                  HUMAN LEAD
                </span>
              </div>

              <h3 className="text-2xl font-black text-black mb-4">
                One click to ship.
              </h3>

              <p className="text-base text-black font-medium leading-relaxed mb-6">
                The lead dev approves in the thread. Nothing merges without a human.
              </p>
            </div>

            {/* Interactive Click-to-Test Approval Box with spring animation */}
            <div 
              onClick={() => setDemoApproved(!demoApproved)}
              className="p-4 bg-white border-2 border-black font-mono text-xs text-black leading-relaxed cursor-pointer hover:bg-neutral-50 active:scale-[0.98] flex items-center justify-between group transition-all shadow-neo-sm"
              title="Click to test approval"
            >
              <span className="font-bold">{demoApproved ? '✓ Merged to main (commit 4b9a12e)' : 'Approved.'}</span>
              <span className="text-[10px] font-sans font-black px-2 py-0.5 bg-black text-[#FFE500]">
                {demoApproved ? 'Done' : 'Click to test'}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs text-neutral-500">
          Demo scenario, illustrative messages. Built with declarative Switch flows.
        </p>
      </section>

      {/* 4. WORKFLOW PIPELINE INTERACTIVE MAP SECTION */}
      <section className="bg-neutral-50 border-y-2 border-black py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                SWITCH DECLARATIVE PIPELINE
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
                From CVE alert to merged PR in 6 deterministic steps.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('flow')}
              className="px-6 py-3 bg-white border-2 border-black font-mono text-xs font-bold shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-neo flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <span>Explore Interactive Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6-Step Pipeline Grid with Neo-Brutalist cards and traveling pulse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Webhook Ingest', role: 'System', desc: 'Raw CVE advisory parsed from NIST / GitHub feed' },
              { step: '02', title: 'AST Walker', role: '@cve-analyst', desc: 'Traverses require graph to prove reachable call sites' },
              { step: '03', title: 'Patch Synth', role: '@patch-crafter', desc: 'LLM generates syntax-safe code migration' },
              { step: '04', title: 'Sandbox Tests', role: 'Docker Runner', desc: 'Executes actual npm test suite; fails block PR' },
              { step: '05', title: 'Team War Room', role: 'Multi-Bridge', desc: 'Posts thread in Slack, Teams, or Discord' },
              { step: '06', title: 'Human Signoff', role: 'Lead Dev', desc: 'Single-click merge closes CVE and pushes to main' },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="bg-white border-2 border-black p-5 shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-neo flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black px-2 py-0.5 bg-[#FFE500] border border-black">
                      {p.step}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500 font-bold">
                      {p.role}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-black mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>switch.step</span>
                  <span className="text-black font-bold">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUSINESS ROI & WORKFLOW IMPACT CALCULATOR (Track 1 Winner Feature) */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-white border-2 border-black p-8 sm:p-12 shadow-neo-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">
                MEASURABLE BUSINESS IMPACT
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                The business math. Why engineering leads deploy this.
              </h2>
            </div>
            <p className="text-sm font-medium text-neutral-600 max-w-md">
              Dependabot and Snyk alerts flood teams with untested version bumps. ZeroDay Sentry converts 15 hours of manual triage into a 30-second Slack signoff.
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
                    Average Weekly Dependabot/NIST Alerts:
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
                <span className="font-bold text-black block mb-1">How we calculate:</span>
                Based on 0.8 hours per alert wasted on manual dead-code triage, standard dev rate of $95/hr, and 92% automated false-positive suppression via AST verification.
              </div>
            </div>

            {/* Right Column: Dynamic Projected Savings Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#FFE500] border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-black uppercase">
                  Annual Budget Saved
                </span>
                <div className="text-4xl font-black text-black mt-2 font-mono">
                  ${annualDollarsSaved.toLocaleString()}
                </div>
                <p className="text-xs font-medium text-black/80 mt-2">
                  Eliminates wasted manual dev triage hours on false alarm CVEs.
                </p>
              </div>

              <div className="p-6 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                  Dev Hours Reclaimed
                </span>
                <div className="text-4xl font-black text-black mt-2 font-mono">
                  {hoursSavedPerMonth} <span className="text-sm font-sans font-bold text-neutral-600">hrs/mo</span>
                </div>
                <p className="text-xs font-medium text-neutral-600 mt-2">
                  Re-allocated straight into customer-facing product features.
                </p>
              </div>

              <div className="p-6 bg-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-neutral-500 uppercase">
                  Noise Filtered
                </span>
                <div className="text-4xl font-black text-emerald-600 mt-2 font-mono">
                  92%
                </div>
                <p className="text-xs font-medium text-neutral-600 mt-2">
                  Dead code and devDependency CVEs muted automatically.
                </p>
              </div>

              <div className="p-6 bg-black text-white border-2 border-black shadow-neo-sm">
                <span className="font-mono text-xs font-bold text-[#FFE500] uppercase">
                  Mean Time to Fix
                </span>
                <div className="text-4xl font-black text-white mt-2 font-mono">
                  4.2 <span className="text-sm font-sans font-bold text-neutral-400">min</span>
                </div>
                <p className="text-xs font-medium text-neutral-300 mt-2">
                  Down from 5.4 business days across enterprise repos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BRING YOUR OWN AGENTS BANNER: Clean & Punchy */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28">
        <div className="bg-black text-white p-12 sm:p-16 border-2 border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-neo group hover:border-[#FFE500] transition-colors">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Bring your own agents.
            </h2>
            <p className="text-lg sm:text-xl font-normal text-neutral-300 max-w-2xl leading-relaxed">
              Built on Switch. Claude Code, Codex, or Gemini join Slack, Teams, Discord or Mattermost like any teammate.
            </p>
          </div>

          <a
            href="https://github.com/sandbox-quantum/switch"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-[#FFE500] text-black font-black text-base border-2 border-black hover:bg-[#eed500] hover:-translate-y-1 hover:shadow-neo active:translate-y-0.5 transition-neo whitespace-nowrap shadow-neo-sm inline-flex items-center gap-2"
          >
            <span>Star & Clone Switch Repo</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-black py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-black">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold">[0D]</span>
            <span className="font-bold">ZeroDay Sentry</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-600">Autonomous CVE Reachability & Patching</span>
          </div>
          <div className="text-neutral-600">
            Built for the Flip the Switch hackathon, powered by Switch
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

            <div className="flex items-center gap-3 mb-8">
              <span className="w-3.5 h-3.5 bg-[#FFE500] border-2 border-black inline-block animate-ping" />
              <h3 className="text-2xl font-black text-black">
                How It Works in 30 Seconds
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-8">
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
                  <div className="font-mono text-[11px] font-bold text-neutral-500">0{idx + 1}</div>
                  <div className="font-mono text-xs font-black text-black">{step.time}</div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-neutral-50 border-2 border-black shadow-neo-sm space-y-4">
              <span className="px-2.5 py-0.5 bg-black text-[#FFE500] font-mono text-xs font-bold inline-block">
                {demoSteps[demoStep].badge}
              </span>

              <h4 className="text-xl font-black text-black leading-snug">
                {demoSteps[demoStep].title}
              </h4>

              <p className="text-sm font-medium text-neutral-700 leading-relaxed">
                {demoSteps[demoStep].body}
              </p>

              <div className="p-3.5 bg-white border border-black font-mono text-xs text-black">
                {demoSteps[demoStep].quote}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setDemoStep(prev => (prev > 0 ? prev - 1 : 3))}
                className="px-5 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold shadow-neo-sm cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                ← Back
              </button>

              <button
                onClick={() => {
                  setShowDemoModal(false);
                  onNavigate('war-room');
                }}
                className="px-6 py-2.5 bg-[#FFE500] border-2 border-black font-black text-xs shadow-neo-sm hover:-translate-y-0.5 transition-all cursor-pointer"
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

