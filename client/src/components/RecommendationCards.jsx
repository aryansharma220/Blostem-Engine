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
          className={`surface-shell rounded-[2rem] border-l-4 p-5 animate-reveal transition-all duration-300 ease-in-out hover:-translate-y-1 ${index % 2 === 0 ? "tone-neutral border-cyan-400/70" : "tone-cyan border-cyan-500/50"} ${compact ? "lg:max-w-3xl" : ""}`}
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
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              {formatCategory(item.category)}
            </span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <p className={`text-4xl font-semibold ${index % 2 === 0 ? "text-cyan-100" : "text-[#00ff9f]"}`}>{item.score}</p>
            <p className="pb-1 text-xs uppercase tracking-[0.3em] text-[#9fb3c8]">Decision score</p>
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-[#0b1117] p-4 text-sm text-[#e6edf3]">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Reason</p>
            <p className="mt-2">{item.explanation}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-[#ffb020]/20 bg-[#ffb020]/10 p-3 text-xs leading-5 text-[#ffb020]">
            <p className="font-semibold uppercase tracking-[0.25em] text-[#ffb020]">Trade-off</p>
            <p className="mt-1">{item.tradeOff}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
