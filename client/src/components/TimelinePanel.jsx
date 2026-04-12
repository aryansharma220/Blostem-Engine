import { Icon } from "./IconSystem";

function formatTime(isoValue) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(isoValue));
}

function getTopProduct(recommendations) {
  return recommendations?.[0]?.productName ?? "No result";
}

function getTopScore(recommendations) {
  return recommendations?.[0]?.score ?? 0;
}

export default function TimelinePanel({ snapshots, onRestoreSnapshot, onDeleteSnapshot }) {
  if (!snapshots?.length) {
    return (
      <section className="surface-soft rounded-[2rem] p-5 text-slate-300 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <Icon name="stack" className="h-5 w-5 text-cyan-300" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Scenario timeline</p>
            <p className="mt-1 text-sm text-slate-300">Save compare states to build a decision trail over time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="surface-shell grid gap-4 rounded-[2rem] p-5 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl animate-reveal">
      <div className="flex items-center gap-3">
        <Icon name="stack" className="h-5 w-5 text-cyan-300" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Scenario timeline</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Saved compare states</h2>
        </div>
      </div>

      <div className="grid gap-3">
        {snapshots.map((snapshot, index) => (
          <article
            key={snapshot.id}
            className="surface-soft grid gap-4 rounded-[1.75rem] p-4 md:grid-cols-[1fr_auto] animate-reveal"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Saved {formatTime(snapshot.savedAt)}</p>
                <p className="mt-2 text-lg font-semibold text-white">Baseline vs contrast</p>
                <p className="mt-1 text-sm text-slate-300">
                  {getTopProduct(snapshot.baselineRecommendations)} → {getTopProduct(snapshot.comparisonRecommendations)}
                </p>
              </div>
              <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <div className="surface-soft rounded-2xl p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Baseline score</p>
                  <p className="mt-1 text-white">{getTopScore(snapshot.baselineRecommendations)}</p>
                </div>
                <div className="surface-accent rounded-2xl p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Contrast score</p>
                  <p className="mt-1 text-white">{getTopScore(snapshot.comparisonRecommendations)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:items-start md:justify-end">
              <button
                type="button"
                onClick={() => onRestoreSnapshot(snapshot)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={() => onDeleteSnapshot(snapshot.id)}
                className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}