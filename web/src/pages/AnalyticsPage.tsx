import React from 'react';
import { 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  Award, 
  Leaf, 
  BarChart, 
  PieChart, 
  Cpu, 
  HardDrive, 
  ArrowUpRight 
} from 'lucide-react';
import { CloudResource } from '../types';

interface AnalyticsPageProps {
  resources: CloudResource[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ resources }) => {
  const terminated = resources.filter(r => r.status === 'terminated');
  const savedMonthly = 3456 + 201 + 324; // sum of resolved leaks
  const annualProjectedSavings = savedMonthly * 12;

  const leaderboard = [
    { team: 'Machine Learning & AI', lead: 'Rahul S.', saved: '$4,140/mo', status: 'Top Saver 🏆', reduction: '92%' },
    { team: 'Backend & Data Infra', lead: 'Alex C.', saved: '$2,850/mo', status: 'Optimized', reduction: '78%' },
    { team: 'DevOps & Tooling', lead: 'Priya N.', saved: '$1,920/mo', status: 'Active', reduction: '64%' },
    { team: 'Mobile App Engine', lead: 'David K.', saved: '$840/mo', status: 'Clean', reduction: '85%' },
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            FinOps Recovery &amp; ROI Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 border border-emerald-800 text-emerald-300">
            Switch ROI Ledger
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Quantified financial waste eliminated, cloud carbon offset metrics, and team-level FinOps velocity.
        </p>
      </div>

      {/* Top 4 Big Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#0F1422] to-emerald-950/20 border border-emerald-900/40">
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Total Waste Recovered</span>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            ${savedMonthly.toLocaleString()}<span className="text-xs text-slate-400">/mo</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>${annualProjectedSavings.toLocaleString()} annualized</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Compute Hours Saved</span>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            1,840 <span className="text-xs text-slate-400">hrs</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            GPU/EC2 idle time halted
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <span className="text-xs font-mono text-amber-400 uppercase font-bold">Carbon Offset</span>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <span>420 <span className="text-xs text-slate-400">kg CO2</span></span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            Clean green cloud computing
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <span className="text-xs font-mono text-purple-400 uppercase font-bold">Switch Agent Uptime</span>
          <div className="mt-2 text-3xl font-extrabold text-white font-mono">
            99.98%
          </div>
          <div className="mt-2 text-xs text-purple-300 font-mono">
            Average triage speed: 1.2s
          </div>
        </div>
      </div>

      {/* Visual Charts Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Reduction Trajectory (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0F1422] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Cloud Spend Trajectory</h3>
                <p className="text-xs text-slate-400">Before vs. After CloudBuster Autonomous Remediation</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                -34% Net Waste
              </span>
            </div>

            {/* Simulated Visual Graph Bars */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>July (Unmanaged)</span>
                  <span className="text-rose-400">$18,420</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500/80 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>August (Manual DevOps Audits)</span>
                  <span className="text-amber-400">$16,900</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500/80 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>September (Switch Initial Pilot)</span>
                  <span className="text-cyan-400">$14,200</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500/80 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span className="font-bold text-emerald-400">November (CloudBuster Full Squad Active)</span>
                  <span className="font-bold text-emerald-400">$11,200 (Clean)</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full glow-emerald" style={{ width: '42%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Audit Trail: 100% Verified in Slack Threads</span>
            <span className="text-emerald-400 font-bold">$7,220 Total Saved in Q4</span>
          </div>
        </div>

        {/* Breakdown by Resource Type (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0F1422] border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white pb-4 border-b border-slate-800">
              Recovered Spend by Type
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Idle GPUs</div>
                    <div className="text-[11px] text-slate-400">A100/H100/L4 instances</div>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-rose-400">62%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Unattached EBS</div>
                    <div className="text-[11px] text-slate-400">Orphan gp3 volumes</div>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-amber-400">22%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Idle NAT Gateways</div>
                    <div className="text-[11px] text-slate-400">Dev VPC endpoints</div>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-cyan-400">16%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-500 font-mono text-center">
            Updated via Switch API Stream
          </div>
        </div>
      </div>

      {/* Engineering FinOps Leaderboard */}
      <div className="rounded-2xl bg-[#0F1422] border border-slate-800 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Green Ops Engineering Leaderboard
            </h3>
            <p className="text-xs text-slate-400">Teams taking fastest action on Switch @finops-scout alerts</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Month of November 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Engineering Squad</th>
                <th className="py-3 px-4">Tech Lead</th>
                <th className="py-3 px-4">Monthly Budget Saved</th>
                <th className="py-3 px-4">Waste Reduction</th>
                <th className="py-3 px-4 text-right">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {leaderboard.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20">
                  <td className="py-3.5 px-4 font-bold text-white">{item.team}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{item.lead}</td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-400">{item.saved}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-cyan-300">{item.reduction}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
