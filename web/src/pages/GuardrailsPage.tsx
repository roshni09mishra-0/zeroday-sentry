import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sliders, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Save, 
  RotateCcw,
  Layers,
  Copy
} from 'lucide-react';
import { GuardrailSettings } from '../types';

interface GuardrailsPageProps {
  settings: GuardrailSettings;
  onUpdateSettings: (newSettings: GuardrailSettings) => void;
}

export const GuardrailsPage: React.FC<GuardrailsPageProps> = ({ 
  settings, 
  onUpdateSettings 
}) => {
  const [localSettings, setLocalSettings] = useState<GuardrailSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const switchYamlSample = `# Official Switch Agent Template Definition (version: 1)
# Used by CloudBuster to instantiate FinOps Squad in Slack
version: 1

params:
  team:
    type: string
    default: cloudbuster
  bridge:
    type: bridge
    default: [$first]

agents:
  - name: "{team}-scout"
    description: "Detects idle GPU/EC2 leaks & calculates financial burn"
    addressing: anyone
    provider: "{provider}"
  - name: "{team}-operator"
    description: "Enforces production immunity, creates pre-delete snapshots"
    addressing: owner-agents
    provider: "{provider}"

room:
  name: "{team}-finops-war-room"
  description: "Cost-cutting shared room for FinOps Scout and Cloud Operator"
  bridge: "{bridge}"
  agents: ["{team}-scout", "{team}-operator"]
  users: ["{$creator}"]`;

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(switchYamlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              Safety Guardrails &amp; Switch Policy
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 border border-emerald-800 text-emerald-300">
              Zero-Risk Guarantee
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Define boundary conditions for @finops-scout and @cloud-operator to ensure 100% production immunity.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Policy Saved ✓' : 'Save Active Policy'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Toggles & Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Policy 1: Production Immunity */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Strict Production Immunity</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                    HARD BLOCK
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permanently prohibits @cloud-operator from executing delete/terminate on any resource tagged <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">env: production</code>, <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">tier: critical</code>, or database primary nodes.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.productionImmunity}
                  onChange={(e) => setLocalSettings({...localSettings, productionImmunity: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* Policy 2: Mandatory EBS Snapshot */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Mandatory Pre-Termination Snapshot</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Before any storage volume or instance is terminated, @cloud-operator must create an AWS EBS snapshot and post the rollback ID directly to the Slack channel thread.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.mandatorySnapshot}
                  onChange={(e) => setLocalSettings({...localSettings, mandatorySnapshot: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>

          {/* Policy 3: Human-In-The-Loop Approval */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Require Human Confirmation in Chat</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Agents will never auto-delete unannounced. @cloud-operator requires an explicit message or button press in Slack before executing remediation.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.requireHumanApproval}
                  onChange={(e) => setLocalSettings({...localSettings, requireHumanApproval: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Sliders for Thresholds */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              Scout Detection Thresholds
            </h3>

            {/* Threshold 1: Idle Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Minimum Inactivity Window:</span>
                <span className="font-bold text-cyan-400">{localSettings.minIdleHours} hours</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="48" 
                value={localSettings.minIdleHours}
                onChange={(e) => setLocalSettings({...localSettings, minIdleHours: Number(e.target.value)})}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Flag workloads only when inactive continuously for this duration.</span>
            </div>

            {/* Threshold 2: CPU Utilization */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Maximum CPU Utilization Cap:</span>
                <span className="font-bold text-cyan-400">{localSettings.maxCpuPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="10" 
                step="0.5"
                value={localSettings.maxCpuPercent}
                onChange={(e) => setLocalSettings({...localSettings, maxCpuPercent: Number(e.target.value)})}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Workloads averaging below this percentage are classified as idle.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Switch Bridge & YAML Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bridge Status */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">Switch Bridge Status</span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected</span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Bridge Target:</span>
                <span>Slack (@switch/bridge-slack)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Active Channel:</span>
                <span className="text-cyan-400">{localSettings.slackChannel}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Switch Core Spec:</span>
                <span>version: 1 (Compliant)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Agent Harness:</span>
                <span>BYOA / Gemini Flash &amp; Claude</span>
              </div>
            </div>
          </div>

          {/* Switch YAML Preview */}
          <div className="p-6 rounded-2xl bg-[#0F1422] border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white font-mono">finops-squad.template.yaml</span>
              </div>
              <button 
                onClick={handleCopyYaml}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <pre className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[340px]">
              {switchYamlSample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
