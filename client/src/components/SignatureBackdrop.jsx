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
          <stop offset="0%" stopColor="rgba(103,232,249,0.12)" />
          <stop offset="50%" stopColor="rgba(125,211,252,0.42)" />
          <stop offset="100%" stopColor="rgba(148,163,184,0.05)" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="210" rx="168" ry="132" fill="none" stroke="url(#orbitStroke)" strokeWidth="1.2" />
      <ellipse cx="210" cy="210" rx="130" ry="176" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.9" strokeDasharray="8 14" />
      <path d="M58 248C104 205 154 181 210 181s106 24 152 67" fill="none" stroke="rgba(103,232,249,0.26)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M86 130C126 170 166 188 210 188s84-18 124-58" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="210" cy="210" r="4" fill="rgba(191,219,254,0.9)" />
      <circle cx="294" cy="176" r="2.7" fill="rgba(125,211,252,0.85)" />
      <circle cx="130" cy="244" r="2.7" fill="rgba(125,211,252,0.85)" />
    </svg>
  );
}

export default function SignatureBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8rem] top-[8%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/8 blur-3xl animate-drift-slow" />
      <div className="absolute right-[-10rem] top-[22%] h-[34rem] w-[34rem] rounded-full bg-sky-300/8 blur-3xl animate-drift-reverse" />
      <VectorOrbit className="absolute left-[-6rem] top-20 h-[28rem] w-[28rem] opacity-80 animate-orbit-slow" delay={0} />
      <VectorOrbit className="absolute right-[-5rem] top-48 h-[24rem] w-[24rem] opacity-60 animate-orbit-slow" delay={900} />
      <svg className="absolute bottom-0 left-0 h-[18rem] w-full opacity-35" viewBox="0 0 1440 260" aria-hidden="true">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.0)" />
            <stop offset="40%" stopColor="rgba(56,189,248,0.14)" />
            <stop offset="60%" stopColor="rgba(148,163,184,0.14)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.0)" />
          </linearGradient>
        </defs>
        <path d="M0,200 C160,150 300,120 460,150 C610,178 710,240 860,220 C1010,200 1120,110 1260,126 C1320,134 1380,156 1440,176 L1440,260 L0,260 Z" fill="url(#waveGradient)" />
        <path d="M0,230 C180,190 320,180 470,205 C650,236 730,272 900,248 C1070,224 1170,162 1440,188" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}