import { Icon } from "./IconSystem";

function formatCategory(category) {
  return category.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function RecommendationCards({ recommendations, rankOffset = 0, compact = false }) {
  return (
    <div className={`grid gap-4 ${compact ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
      {recommendations.map((item, index) => (
        <article
          key={item.productId}
          className={`surface-shell rounded-[2rem] border-l-4 border-cyan-300/70 p-5 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl animate-reveal transition-transform duration-300 hover:-translate-y-1 ${compact ? "lg:max-w-3xl" : ""}`}
          style={{ animationDelay: `${index * 110}ms` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
                <Icon name="trend" className="h-4 w-4" />
                Rank #{index + 1 + rankOffset}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{item.productName}</h3>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 backdrop-blur-sm">
              {formatCategory(item.category)}
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <p className="text-4xl font-semibold text-cyan-100">{item.score}</p>
            <p className="pb-1 text-xs uppercase tracking-[0.3em] text-slate-400">Decision score</p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Reason</p>
            <p className="mt-2">{item.explanation}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-amber-400/10 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100 backdrop-blur-sm">
            <p className="font-semibold uppercase tracking-[0.25em] text-amber-200">Trade-off</p>
            <p className="mt-1">{item.tradeOff}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
