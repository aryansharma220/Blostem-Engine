import { Icon } from "./IconSystem";

function FlowNode({ label, detail, icon, active = false }) {
  return (
    <div
      className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-cyan-300/35 bg-cyan-300/12 shadow-[0_0_24px_rgba(103,232,249,0.16)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
        <Icon name={icon} className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{detail}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden flex-none items-center justify-center text-cyan-300/70 md:flex">
      <span className="text-xl leading-none">→</span>
    </div>
  );
}

export default function DecisionFlowStrip({ recommendation, segmentLabel }) {
  if (!recommendation) {
    return null;
  }

  return (
    <section className="surface-shell rounded-[2rem] p-5 animate-reveal">
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">[ System Processing ]</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">System reasoning flow</h2>
        </div>
        <p className="text-sm text-slate-300">Segment: {segmentLabel}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
        <FlowNode label="Profile" detail="User inputs captured" icon="stack" />
        <Arrow />
        <FlowNode label="Scoring Engine" detail={`Signals weighted to ${recommendation.score}`} icon="trend" active />
        <Arrow />
        <FlowNode label="Best Match" detail={recommendation.productName} icon="spark" active />
        <Arrow />
        <FlowNode label="Trade-off" detail={(recommendation.tradeoffs?.[0] || recommendation.tradeOff || "Highlighted") } icon="shield" />
      </div>
    </section>
  );
}