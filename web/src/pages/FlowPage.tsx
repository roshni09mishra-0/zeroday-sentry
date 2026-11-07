import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Bot, 
  ShieldCheck, 
  GitPullRequest, 
  Zap, 
  FileCode,
  Sliders,
  Check
} from 'lucide-react';

export const FlowPage: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2000);

  const flowSteps = [
    {
      id: 'step-1',
      title: '1. Ingest Advisory',
      actor: 'Switch Ingestion Gateway',
      icon: Zap,
      badge: 'EVENT TRIGGER',
      desc: 'Dependabot webhook dumps CVE-2026-3114 (jsonwebtoken < 9.0.0) into the Switch event queue.',
      payload: {
        event: 'security_alert.created',
        cve_id: 'CVE-2026-3114',
        package: 'jsonwebtoken',
        current_version: '8.5.1',
        vulnerable_sink: 'jwt.verify()'
      }
    },
    {
      id: 'step-2',
      title: '2. Route to Room',
      actor: 'Switch Room Controller',
      icon: Sliders,
      badge: 'ROOM PROTOCOL',
      desc: 'Switch mirrors the advisory to #security-war-room and brings both agents into the active thread.',
      payload: {
        room: 'security-war-room',
        bridge: '@switch/bridge-slack',
        active_agents: ['sentry-cve-analyst', 'sentry-patch-crafter']
      }
    },
    {
      id: 'step-3',
      title: '3. AST Reachability',
      actor: '@cve-analyst (Switch Agent)',
      icon: Code2,
      badge: 'REACHABILITY ENGINE',
      desc: '@cve-analyst parses the repo AST. If it finds jwt.verify() in live HTTP routes, it confirms the wolf is real.',
      payload: {
        ast_match: 'src/auth.js:42:12',
        entrypoint: 'GET /api/v1/auth (src/routes/api.ts:18)',
        is_reachable: true,
        verdict: 'WOLF FOUND (Live in production)'
      }
    },
    {
      id: 'step-4',
      title: '4. Codemod & Test',
      actor: '@patch-crafter (Switch Agent)',
      icon: Bot,
      badge: 'SANDBOX REPAIR',
      desc: '@patch-crafter upgrades the package, writes the 3-line codemod for v9 breaking changes, and runs tests.',
      payload: {
        target_version: '9.0.2',
        lines_modified: 3,
        test_command: 'npm test -- --coverage',
        tests_passed: '18/18',
        regressions: 0
      }
    },
    {
      id: 'step-5',
      title: '5. Human Sign-Off',
      actor: 'Lead Developer (Human)',
      icon: ShieldCheck,
      badge: 'HUMAN IN THE LOOP',
      desc: 'You inspect the 3-line diff in Slack and click "Approved." Zero rogue bot commits.',
      payload: {
        approver: 'lead-dev@company.co',
        decision: 'APPROVED',
        method: '1-Click Slack Thread Action'
      }
    },
    {
      id: 'step-6',
      title: '6. PR Merge',
      actor: 'Switch GitHub Dispatcher',
      icon: GitPullRequest,
      badge: 'DEPLOYED TO MAIN',
      desc: 'PR #142 is squash-merged into main. The security alert is closed automatically.',
      payload: {
        pr_number: 142,
        commit_hash: '4b9a12e',
        status: 'MERGED_TO_MAIN',
        vulnerability_status: 'RESOLVED'
      }
    }
  ];

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < flowSteps.length - 1) {
          return prev + 1;
        } else {
          setIsRunning(false);
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const handleStartSimulation = () => {
    setActiveStepIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStepIndex(0);
  };

  const currentStep = flowSteps[activeStepIndex];

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-black tracking-tight">
                Switch Autonomous Workflow ("The Flow")
              </h1>
              <span className="px-2.5 py-0.5 bg-[#FFE500] border-2 border-black text-xs font-mono font-bold">
                100% SWITCH POWERED
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-600 mt-1 max-w-2xl">
              Declarative multi-agent execution pipeline defined under <code className="text-black bg-neutral-100 px-1 py-0.5 border border-black font-mono">switch/workflows/zeroday-flow.yaml</code>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartSimulation}
              disabled={isRunning}
              className={`px-5 py-2.5 bg-[#FFE500] border-2 border-black shadow-neo-sm font-mono text-xs font-black flex items-center gap-2 transition-all ${
                isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-0.5 hover:translate-y-0.5'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isRunning ? 'Running Flow...' : 'Run Live Flow'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-white border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 font-mono text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>

        {/* Workflow Node Pipeline Visualization */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.id}
                onClick={() => {
                  setIsRunning(false);
                  setActiveStepIndex(idx);
                }}
                className={`p-4 border-2 border-black cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-[#FFE500] shadow-neo scale-105 z-10' 
                    : isCompleted 
                    ? 'bg-neutral-100 hover:bg-neutral-200' 
                    : 'bg-white opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold">0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-black" />
                  )}
                </div>
                <div className="font-black text-xs text-black leading-tight">
                  {step.title}
                </div>
                <div className="text-[10px] font-mono text-neutral-600 mt-1 truncate">
                  {step.actor}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspection of Active Step */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Step Description (7 Cols) */}
          <div className="lg:col-span-7 p-8 bg-white border-2 border-black shadow-neo space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-black text-[#FFE500] font-mono text-xs font-black">
                {currentStep.badge}
              </span>
              <span className="font-mono text-xs text-neutral-500">
                Step {activeStepIndex + 1} of {flowSteps.length}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-black">
                {currentStep.title}: {currentStep.actor}
              </h3>
              <p className="text-base text-neutral-800 font-medium mt-2 leading-relaxed">
                {currentStep.desc}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border-2 border-black">
              <div className="font-mono text-xs font-black text-black mb-1 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>WHY THIS MATTERS</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                Engineers stay inside Slack. The agents handle the tedious AST parsing, syntax refactoring, and sandbox test execution. You just review and approve.
              </p>
            </div>
          </div>

          {/* Right: Switch Real-Time Payload JSON (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-black text-white border-2 border-black shadow-neo">
            <div className="px-4 py-3 bg-neutral-900 border-b-2 border-neutral-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#FFE500]" />
                <span className="font-bold text-white">Switch Event Bus Payload</span>
              </div>
              <span className="text-[#FFE500]">LIVE JSON</span>
            </div>

            <pre className="flex-1 p-5 font-mono text-xs text-[#FFE500] overflow-x-auto bg-black leading-relaxed">
              {JSON.stringify(currentStep.payload, null, 2)}
            </pre>

            <div className="px-4 py-2.5 bg-neutral-900 border-t-2 border-neutral-800 font-mono text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Status: EXECUTED</span>
              <span className="text-emerald-400 font-bold">Latency: ~12ms</span>
            </div>
          </div>
        </div>

        {/* Declarative Flow YAML Inspector Box */}
        <div className="p-6 bg-neutral-100 border-2 border-black shadow-neo">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-black" />
              <span className="font-mono text-xs font-black text-black">
                switch/workflows/zeroday-flow.yaml
              </span>
            </div>
            <span className="font-mono text-[11px] text-neutral-600">
              Run locally: <code className="bg-white px-1.5 py-0.5 border border-black font-bold text-black">switch run --flow zeroday-flow.yaml</code>
            </span>
          </div>

          <p className="text-xs font-mono text-neutral-700 leading-relaxed">
            The entire workflow is 100% reproducible by any developer or judge using the standard Switch CLI.
          </p>
        </div>
      </div>
    </div>
  );
};
