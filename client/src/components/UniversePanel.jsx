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
  const maxVisible = 8;

  const filters = useMemo(() => getFilters(products), [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }

    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  const visibleProducts = useMemo(() => filteredProducts.slice(0, maxVisible), [filteredProducts]);

  if (!products?.length) {
    return null;
  }

  return (
    <section className="surface-shell tone-warning section-rail-warning grid gap-4 rounded-[2rem] p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <Icon name="stack" className="h-4 w-4" />
            Product universe
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Browse the full catalog</h2>
          <p className="mt-1 text-sm text-[#9fb3c8]">
            Use the category filters to inspect the raw universe behind the recommendation engine.
          </p>
        </div>
        <p className="text-sm text-[#9fb3c8]">
          Showing {visibleProducts.length} of {filteredProducts.length} products
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter, filterIndex) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-in-out ${
              activeFilter === filter
                ? "border-cyan-400 bg-cyan-400 text-[#05070a]"
                : filterIndex % 2 === 0
                  ? "border-cyan-500/20 bg-[#0b1117] text-[#e6edf3] hover:border-cyan-400/50"
                  : "border-cyan-500/20 bg-[#0f1821] text-[#e6edf3] hover:border-cyan-400/50"
            }`}
          >
            {filter === "all" ? "All categories" : formatCategory(filter)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <article
            key={product.id}
            className={`surface-soft rounded-2xl p-4 transition-all duration-300 ease-in-out hover:-translate-y-1 animate-reveal ${index % 3 === 0 ? "tone-neutral" : index % 3 === 1 ? "tone-cyan" : "tone-green"}`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{product.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
              </div>
              <span className="rounded-full border border-cyan-500/20 bg-[#0b1117] px-3 py-1 text-xs text-[#e6edf3]">
                {formatCategory(product.category)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#9fb3c8]">
              <div className="surface-soft tone-cyan rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Return</p>
                <p className="mt-1 text-white">{product.returnRate}%</p>
              </div>
              <div className="surface-soft tone-green rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Liquidity</p>
                <p className="mt-1 text-white">{product.liquidityScore}/10</p>
              </div>
              <div className="surface-soft tone-neutral rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Tenure</p>
                <p className="mt-1 text-white">{product.tenureMonths} months</p>
              </div>
              <div className="surface-soft tone-warning rounded-xl p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Minimum</p>
                <p className="mt-1 text-white">₹{product.minAmount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length > maxVisible ? (
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/90">
          Refine with category filters to inspect the remaining {filteredProducts.length - maxVisible} products.
        </p>
      ) : null}
    </section>
  );
}