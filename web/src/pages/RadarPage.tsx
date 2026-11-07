import React, { useState } from 'react';
import { 
  Radar as RadarIcon, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Filter, 
  Zap, 
  Server, 
  Cpu, 
  HardDrive, 
  Globe, 
  ShieldAlert,
  Search
} from 'lucide-react';
import { CloudResource } from '../types';

interface RadarPageProps {
  resources: CloudResource[];
  onEscalateToWarRoom: (resource: CloudResource) => void;
  onRefresh: () => void;
}

export const RadarPage: React.FC<RadarPageProps> = ({ 
  resources, 
  onEscalateToWarRoom,
  onRefresh 
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = resources.filter(r => {
    if (filterRegion !== 'all' && r.region !== filterRegion) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const zombieCount = resources.filter(r => r.status === 'zombie').length;
  const shieldedCount = resources.filter(r => r.status === 'shielded').length;
  const totalWaste = resources
    .filter(r => r.status === 'zombie')
    .reduce((acc, curr) => acc + curr.monthlyProjectedWaste, 0);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <RadarIcon className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              Live Infrastructure Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
              CloudWatch Stream Active
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Scanning connected AWS & GCP clusters for zombie GPUs, abandoned volumes, and unattached VPC gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Cloud Now</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Zombie Leaks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-400 font-mono">
            {zombieCount} Active
          </div>
          <span className="text-[11px] text-slate-500">Unattended &gt; 8 hours</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Monthly Burn Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-400 font-mono">
            ${totalWaste.toLocaleString()}<span className="text-xs text-slate-400">/mo</span>
          </div>
          <span className="text-[11px] text-slate-500">Projected avoidable spend</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Shielded Assets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
            {shieldedCount} Prod Clusters
          </div>
          <span className="text-[11px] text-slate-500">Protected by guardrails</span>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1422] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Switch Squad</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-cyan-400 font-mono">
            2 Agents
          </div>
          <span className="text-[11px] text-slate-500">@finops-scout & @cloud-operator</span>
        </div>
      </div>

      {/* Visual Radar Scope & Scanning Graphic */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1422] to-slate-950 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Circular Radar Graphic */}
          <div className="relative w-56 h-56 rounded-full border-2 border-cyan-900/60 flex items-center justify-center bg-radial-gradient">
            {/* Concentric rings */}
            <div className="absolute inset-4 rounded-full border border-cyan-800/40" />
            <div className="absolute inset-12 rounded-full border border-cyan-700/30" />
            <div className="absolute inset-20 rounded-full border border-cyan-600/20" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400" />

            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-800/30" />
            <div className="absolute h-full w-[1px] bg-cyan-800/30" />

            {/* Radar sweep beam */}
            <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-transparent origin-bottom-right rounded-tl-full" />
            </div>

            {/* Pinging dots for detected resources */}
            <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500 animate-ping" title="GPU Cluster Zombie" />
            <div className="absolute bottom-16 right-14 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500" title="Orphan EBS Volume" />
            <div className="absolute top-20 right-16 w-2.5 h-2.5 rounded-full bg-emerald-400" title="Shielded Production API" />
          </div>

          {/* Radar Information & Regional Telemetry */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-xs font-mono text-cyan-300">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Region Sweep: us-east-1, eu-west-1, ap-south-1</span>
            </div>
            <h3 className="text-xl font-bold text-white">Live Cloud Asset Discovery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              CloudBuster taps directly into CloudWatch metrics and provider metadata APIs. Any compute workload maintaining <strong className="text-slate-200">&lt; 2% CPU utilization for over 8 hours</strong> is flagged as an abandoned zombie.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">AWS us-east-1: 3 Discovered</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">AWS eu-west-1: 1 Discovered</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">AWS ap-south-1: 1 Discovered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0F1422] border border-slate-800">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by resource ID, name, or git author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Regions</option>
            <option value="us-east-1">us-east-1 (N. Virginia)</option>
            <option value="eu-west-1">eu-west-1 (Ireland)</option>
            <option value="ap-south-1">ap-south-1 (Mumbai)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="zombie">Zombie Leaks Only</option>
            <option value="shielded">Shielded Only</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="rounded-xl bg-[#0F1422] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Resource &amp; Type</th>
                <th className="py-3 px-4">Region &amp; Env</th>
                <th className="py-3 px-4">CPU &amp; Idle Time</th>
                <th className="py-3 px-4">Burn ($/mo)</th>
                <th className="py-3 px-4">Owner / PR</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Switch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((r) => {
                const isZombie = r.status === 'zombie';
                const isShielded = r.status === 'shielded';
                const isTerminated = r.status === 'terminated';

                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          r.type === 'gpu-instance' ? 'bg-rose-950/70 border border-rose-800 text-rose-400' :
                          r.type === 'ebs-volume' ? 'bg-amber-950/70 border border-amber-800 text-amber-400' :
                          'bg-cyan-950/70 border border-cyan-800 text-cyan-400'
                        }`}>
                          {r.type === 'gpu-instance' ? <Cpu className="w-4 h-4" /> :
                           r.type === 'ebs-volume' ? <HardDrive className="w-4 h-4" /> :
                           <Server className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-tight">{r.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{r.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="text-slate-300">{r.region}</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] mt-0.5 ${
                        r.environment === 'production' 
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {r.environment}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${r.cpuUtilization > 50 ? 'bg-emerald-400' : 'bg-rose-500'}`} 
                            style={{ width: `${Math.min(100, r.cpuUtilization)}%` }} 
                          />
                        </div>
                        <span className={r.cpuUtilization < 2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {r.cpuUtilization}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {r.idleHours > 0 ? `${r.idleHours} hrs idle` : 'Active'}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      {isTerminated ? (
                        <span className="text-slate-500 line-through">${r.monthlyProjectedWaste}/mo</span>
                      ) : r.monthlyProjectedWaste > 0 ? (
                        <div className="font-bold text-rose-400">
                          ${r.monthlyProjectedWaste}
                          <span className="text-[10px] text-slate-500">/mo</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">$0 (Protected)</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="text-slate-300">{r.owner}</div>
                      <div className="font-mono text-[11px] text-cyan-400">{r.repo}</div>
                    </td>

                    <td className="py-4 px-4">
                      {isZombie && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                          ZOMBIE
                        </span>
                      )}
                      {isShielded && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          SHIELDED
                        </span>
                      )}
                      {isTerminated && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          CLEANED UP
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {isZombie ? (
                        <button
                          onClick={() => onEscalateToWarRoom(r)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono inline-flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all hover:scale-105"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Escalate in War-Room</span>
                        </button>
                      ) : isShielded ? (
                        <span className="text-xs font-mono text-emerald-400/80">Prod Immunity</span>
                      ) : (
                        <span className="text-xs font-mono text-slate-500">Remediated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
