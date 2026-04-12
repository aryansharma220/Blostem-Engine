function MetricBar({ label, value, maxValue }) {
  const width = Math.max(8, Math.min(100, (value / maxValue) * 100));

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#0b1117] p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-white">{label}</span>
        <span className="text-cyan-200">{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded bg-gray-800">
        <div className="h-1.5 rounded bg-cyan-400 transition-all duration-300 ease-in-out" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function InsightsPanel({ recommendations }) {
  const topScores = recommendations.slice(0, 3);
  const maxScore = Math.max(...topScores.map((item) => item.score), 100);

  return (
    <section className="grid gap-4">
      <div className="surface-shell tone-cyan section-rail-cyan rounded-[2rem] p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">[ System pulse ]</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Decision intensity</h3>
        <p className="mt-1 text-sm text-[#9fb3c8]">Live readout of the strongest outputs, rendered as bars instead of generic charts.</p>

        <div className="mt-4 grid gap-3">
          {topScores.map((item) => (
            <MetricBar key={item.productId} label={item.productName} value={item.score} maxValue={maxScore} />
          ))}
        </div>
      </div>

      <div className="surface-shell tone-green section-rail-green rounded-[2rem] p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">[ Breakdown ]</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Signal stack</h3>
        <div className="mt-4 grid gap-3">
          {recommendations.map((item, index) => (
            <div key={item.productId} className={`rounded-2xl border border-cyan-500/20 p-4 ${index % 2 === 0 ? "bg-[#0b1117]" : "bg-[#101a23]"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{item.productName}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Score {item.score}</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {Object.entries(item.breakdown || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                      <span>{key}</span>
                      <span>{value.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded bg-gray-800">
                      <div
                        className="h-1.5 rounded bg-cyan-400 transition-all duration-300 ease-in-out"
                        style={{ width: `${Math.max(6, Math.min(100, value * 3))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}