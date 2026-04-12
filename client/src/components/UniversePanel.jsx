import { useMemo, useState } from "react";
import { Icon } from "./IconSystem";

function formatCategory(category) {
  return category.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFilters(products) {
  return ["all", ...new Set(products.map((product) => product.category))];
}

export default function UniversePanel({ products }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = useMemo(() => getFilters(products), [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }

    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  if (!products?.length) {
    return null;
  }

  return (
    <section className="surface-shell grid gap-4 rounded-[2rem] p-5 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <Icon name="stack" className="h-4 w-4" />
            Product universe
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Browse the full catalog</h2>
          <p className="mt-1 text-sm text-slate-300">
            Use the category filters to inspect the raw universe behind the recommendation engine.
          </p>
        </div>
        <p className="text-sm text-slate-300">{filteredProducts.length} products visible</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? "border-cyan-300 bg-cyan-300 text-slate-950"
                : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/50 hover:text-white"
            }`}
          >
            {filter === "all" ? "All categories" : formatCategory(filter)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <article
            key={product.id}
            className="surface-soft rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1 animate-reveal"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{product.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200 backdrop-blur-sm">
                {formatCategory(product.category)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="surface-soft rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Return</p>
                <p className="mt-1 text-white">{product.returnRate}%</p>
              </div>
              <div className="surface-soft rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Liquidity</p>
                <p className="mt-1 text-white">{product.liquidityScore}/10</p>
              </div>
              <div className="surface-soft rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Tenure</p>
                <p className="mt-1 text-white">{product.tenureMonths} months</p>
              </div>
              <div className="surface-soft rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Minimum</p>
                <p className="mt-1 text-white">₹{product.minAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}