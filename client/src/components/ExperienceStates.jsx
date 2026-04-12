import { Icon } from "./IconSystem";

export function LoadingOracleState() {
  return (
    <section className="state-shell relative grid gap-4 p-5 animate-reveal">
      <div className="relative z-10 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 animate-breath">
          <Icon name="spark" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Oracle processing</p>
          <p className="mt-1 text-sm text-slate-300">Calibrating product fit, score drivers, and recommendation deltas.</p>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-cyan-300/60 animate-shimmer" />
      </div>
    </section>
  );
}

export function EmptyExperienceState() {
  return (
    <section className="state-shell relative grid gap-4 p-6 animate-reveal">
      <div className="relative z-10 flex items-start gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 animate-breath">
          <Icon name="trend" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Awaiting your first run</p>
          <h3 className="brand-display mt-2 text-3xl font-semibold text-white">The stage is ready for your decision story.</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Submit a profile to generate ranked recommendations, compare scenarios, and build a saved timeline of decisions.
          </p>
        </div>
      </div>
      <div className="relative z-10 grid gap-3 md:grid-cols-3">
        <div className="surface-soft rounded-2xl p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Step 1</p>
          <p className="mt-1 text-sm text-white">Shape preferences in the lens form.</p>
        </div>
        <div className="surface-soft rounded-2xl p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Step 2</p>
          <p className="mt-1 text-sm text-white">Compare baseline and scenario B outcomes.</p>
        </div>
        <div className="surface-soft rounded-2xl p-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Step 3</p>
          <p className="mt-1 text-sm text-white">Save timeline snapshots for your final recommendation narrative.</p>
        </div>
      </div>
    </section>
  );
}
