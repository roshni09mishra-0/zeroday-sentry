import React from 'react';
import { ShieldAlert, Zap, ExternalLink, Terminal, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSimulateCVE: () => void;
  vulnerableCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onSimulateCVE, 
  vulnerableCount 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo matching Screenshot 1: [0D] ZeroDay Sentry */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#FFE500] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="font-black text-black text-sm tracking-tighter font-mono">0D</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-black block leading-none">
                ZeroDay Sentry
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-500">
                Powered by Switch
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => {
                setActiveTab('landing');
                setTimeout(() => {
                  document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-bold text-black hover:underline underline-offset-4 transition-all"
            >
              The problem
            </button>
            <button
              onClick={() => {
                setActiveTab('landing');
                setTimeout(() => {
                  document.getElementById('crew-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-bold text-black hover:underline underline-offset-4 transition-all"
            >
              The crew
            </button>
            <button
              onClick={() => setActiveTab('war-room')}
              className={`text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'war-room' ? 'underline underline-offset-4 decoration-2 decoration-black' : 'text-black hover:underline underline-offset-4'
              }`}
            >
              <span>War-Room</span>
              <span className="px-1.5 py-0.2 bg-[#FFE500] border border-black text-[10px] font-mono font-bold">
                LIVE
              </span>
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'flow' ? 'underline underline-offset-4 decoration-2 decoration-black' : 'text-black hover:underline underline-offset-4'
              }`}
            >
              <span>The Flow</span>
              <span className="px-1.5 py-0.2 bg-black text-[#FFE500] text-[10px] font-mono font-bold">
                SWITCH
              </span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`text-sm font-bold transition-all ${
                activeTab === 'scanner' ? 'underline underline-offset-4 decoration-2 decoration-black' : 'text-black hover:underline underline-offset-4'
              }`}
            >
              Reachability
            </button>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateCVE}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#FFE500] border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 text-xs font-bold font-mono transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>Simulate CVE</span>
            </button>

            <a
              href="https://github.com/roshni09mishra-0/zeroday-sentry"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-black text-white text-xs font-bold border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-1.5 font-mono"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-[#FFE500]" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
