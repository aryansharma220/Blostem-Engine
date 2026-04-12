function VectorOrbit({ className, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      aria-hidden="true"
      style={{ animationDelay: `${delay}ms` }}
    >
      <defs>
        <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,229,255,0.18)" />
          <stop offset="50%" stopColor="rgba(0,229,255,0.42)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0.12)" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="210" rx="168" ry="132" fill="none" stroke="url(#orbitStroke)" strokeWidth="1.6" />
      <ellipse cx="210" cy="210" rx="130" ry="176" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1.2" strokeDasharray="8 14" />
      <path d="M58 248C104 205 154 181 210 181s106 24 152 67" fill="none" stroke="rgba(0,229,255,0.34)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M86 130C126 170 166 188 210 188s84-18 124-58" fill="none" stroke="rgba(0,229,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="210" cy="210" r="4" fill="rgba(0,229,255,0.85)" />
      <circle cx="294" cy="176" r="2.7" fill="rgba(0,229,255,0.7)" />
      <circle cx="130" cy="244" r="2.7" fill="rgba(0,229,255,0.7)" />
    </svg>
  );
}

function VectorGridSweep({ className, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 1200 280"
      className={className}
      aria-hidden="true"
      style={{ animationDelay: `${delay}ms` }}
    >
      <defs>
        <linearGradient id="sweepLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,229,255,0.0)" />
            <stop offset="50%" stopColor="rgba(0,229,255,0.42)" />
          <stop offset="100%" stopColor="rgba(0,229,255,0.0)" />
        </linearGradient>
      </defs>
      <path d="M0 170C170 130 330 110 505 132C650 150 820 196 1000 176C1080 166 1140 144 1200 126" fill="none" stroke="url(#sweepLine)" strokeWidth="2" />
      <path d="M0 210C210 180 370 188 560 214C720 236 890 252 1200 208" fill="none" stroke="rgba(0,229,255,0.18)" strokeWidth="1.4" />
    </svg>
  );
}

function SignalDots({ className }) {
  return (
    <svg viewBox="0 0 420 260" className={className} aria-hidden="true">
      <circle cx="36" cy="88" r="2.6" fill="rgba(0,229,255,0.72)" className="animate-twinkle" />
      <circle cx="114" cy="48" r="3" fill="rgba(0,229,255,0.82)" className="animate-twinkle" />
      <circle cx="182" cy="122" r="2.4" fill="rgba(0,255,159,0.7)" className="animate-twinkle" />
      <circle cx="248" cy="68" r="2.8" fill="rgba(0,229,255,0.68)" className="animate-twinkle" />
      <circle cx="324" cy="140" r="2.5" fill="rgba(0,255,159,0.62)" className="animate-twinkle" />
      <circle cx="386" cy="92" r="3.2" fill="rgba(0,229,255,0.74)" className="animate-twinkle" />
    </svg>
  );
}

function RadarPulse({ className }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <circle cx="150" cy="150" r="30" fill="none" stroke="rgba(0,229,255,0.35)" strokeWidth="1.5" className="animate-ping-ring" />
      <circle cx="150" cy="150" r="56" fill="none" stroke="rgba(0,229,255,0.26)" strokeWidth="1.2" className="animate-ping-ring" style={{ animationDelay: "600ms" }} />
      <circle cx="150" cy="150" r="82" fill="none" stroke="rgba(0,229,255,0.16)" strokeWidth="1" className="animate-ping-ring" style={{ animationDelay: "1200ms" }} />
      <circle cx="150" cy="150" r="4" fill="rgba(0,229,255,0.9)" />
    </svg>
  );
}

function DataBusLines({ className }) {
  return (
    <svg viewBox="0 0 1400 260" className={className} aria-hidden="true">
      <path d="M0 74H1400" fill="none" stroke="rgba(0,229,255,0.24)" strokeWidth="1.4" strokeDasharray="12 10" className="animate-dash-flow" />
      <path d="M0 120H1400" fill="none" stroke="rgba(0,229,255,0.18)" strokeWidth="1.2" strokeDasharray="10 10" className="animate-dash-flow" style={{ animationDelay: "700ms" }} />
      <path d="M0 166H1400" fill="none" stroke="rgba(0,255,159,0.16)" strokeWidth="1.2" strokeDasharray="8 10" className="animate-dash-flow" style={{ animationDelay: "1300ms" }} />
      <circle cx="180" cy="74" r="2.8" fill="rgba(0,229,255,0.9)" className="animate-twinkle" />
      <circle cx="760" cy="120" r="2.4" fill="rgba(0,229,255,0.85)" className="animate-twinkle" />
      <circle cx="1210" cy="166" r="2.4" fill="rgba(0,255,159,0.8)" className="animate-twinkle" />
    </svg>
  );
}

function GridCorners({ className }) {
  return (
    <svg viewBox="0 0 500 320" className={className} aria-hidden="true">
      <path d="M14 42h54M14 42v54" stroke="rgba(0,229,255,0.4)" strokeWidth="2" fill="none" />
      <path d="M486 42h-54M486 42v54" stroke="rgba(0,229,255,0.34)" strokeWidth="2" fill="none" />
      <path d="M14 278h54M14 278v-54" stroke="rgba(0,255,159,0.32)" strokeWidth="2" fill="none" />
      <path d="M486 278h-54M486 278v-54" stroke="rgba(0,229,255,0.28)" strokeWidth="2" fill="none" />
    </svg>
  );
}

export default function SignatureBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-[-8rem] top-[8%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl animate-drift-slow" />
      <div className="absolute right-[-10rem] top-[22%] h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl animate-drift-reverse" />
      <DataBusLines className="absolute left-0 top-[6%] w-full opacity-80 animate-float-x" />
      <VectorOrbit className="absolute left-[-6rem] top-20 h-[28rem] w-[28rem] opacity-65 animate-orbit-slow" delay={0} />
      <VectorOrbit className="absolute right-[-5rem] top-48 h-[24rem] w-[24rem] opacity-55 animate-orbit-slow" delay={900} />
      <VectorGridSweep className="absolute left-0 top-[14%] w-full opacity-70 animate-sweep" delay={250} />
      <VectorGridSweep className="absolute left-0 top-[34%] w-full opacity-50 animate-sweep" delay={1300} />
      <SignalDots className="absolute left-[8%] top-[16%] h-44 w-72 opacity-95 animate-rotate-soft" />
      <SignalDots className="absolute right-[6%] top-[42%] h-40 w-64 opacity-80 animate-rotate-soft" />
      <RadarPulse className="absolute right-[18%] top-[12%] h-48 w-48 opacity-85" />
      <RadarPulse className="absolute left-[14%] top-[44%] h-40 w-40 opacity-65" />
      <GridCorners className="absolute left-[34%] top-[20%] h-52 w-80 opacity-55 animate-rotate-soft" />
      <svg className="absolute bottom-0 left-0 h-[18rem] w-full opacity-35" viewBox="0 0 1440 260" aria-hidden="true">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,229,255,0.0)" />
            <stop offset="40%" stopColor="rgba(0,229,255,0.18)" />
            <stop offset="60%" stopColor="rgba(0,229,255,0.18)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.0)" />
          </linearGradient>
        </defs>
        <path d="M0,200 C160,150 300,120 460,150 C610,178 710,240 860,220 C1010,200 1120,110 1260,126 C1320,134 1380,156 1440,176 L1440,260 L0,260 Z" fill="url(#waveGradient)" />
        <path d="M0,230 C180,190 320,180 470,205 C650,236 730,272 900,248 C1070,224 1170,162 1440,188" fill="none" stroke="rgba(0,229,255,0.18)" strokeWidth="1.4" />
      </svg>
    </div>
  );
}