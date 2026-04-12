import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import ProfileForm from "./components/ProfileForm";
import { Icon } from "./components/IconSystem";
import SignatureBackdrop from "./components/SignatureBackdrop";
import { EmptyExperienceState, LoadingOracleState } from "./components/ExperienceStates";
import DecisionFlowStrip from "./components/DecisionFlowStrip";
import { getProducts, getRecommendations } from "./services/api";

const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const TIMELINE_KEY = "blostem.compare.timeline";

function shiftChoice(value, values, direction = 1) {
  const currentIndex = values.indexOf(value);
  const nextIndex = (currentIndex + direction + values.length) % values.length;
  return values[nextIndex];
}

function createContrastProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    riskLevel: shiftChoice(profile.riskLevel, ["low", "medium", "high"], 1),
    liquidityNeed: shiftChoice(profile.liquidityNeed, ["high", "medium", "low"], 1),
    horizon: shiftChoice(profile.horizon, ["0-6 months", "6-12 months", "12-24 months", "24+ months"], 1),
  };
}

function buildHeroStats(products, recommendations) {
  return [
    {
      icon: "stack",
      label: "Instruments",
      value: products.length || 9,
    },
    {
      icon: "compare",
      label: "Categories",
      value: new Set(products.map((product) => product.category)).size || 3,
    },
    {
      icon: "trend",
      label: "Top score",
      value: recommendations[0]?.score ?? "--",
    },
  ];
}

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [submittedProfile, setSubmittedProfile] = useState(null);
  const [comparisonProfile, setComparisonProfile] = useState(null);
  const [comparisonRecommendations, setComparisonRecommendations] = useState([]);
  const [comparisonMetadata, setComparisonMetadata] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const result = await getProducts();

        if (active) {
          setProducts(result.products || []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setCatalogLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const storedTimeline = window.localStorage.getItem(TIMELINE_KEY);

      if (storedTimeline) {
        setTimeline(JSON.parse(storedTimeline));
      }
    } catch {
      setTimeline([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TIMELINE_KEY, JSON.stringify(timeline.slice(0, 5)));
  }, [timeline]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setComparisonError("");

    try {
      const contrastProfile = createContrastProfile(formData);
      const [result, contrastResult] = await Promise.all([
        getRecommendations(formData),
        contrastProfile ? getRecommendations(contrastProfile) : Promise.resolve(null),
      ]);

      setSubmittedProfile(formData);
      setComparisonProfile(contrastProfile);
      setRecommendations(result.recommendations || []);
      setMetadata(result.metadata || null);
      setComparisonRecommendations(contrastResult?.recommendations || []);
      setComparisonMetadata(contrastResult?.metadata || null);
    } catch (requestError) {
      setError(requestError.message);
      setRecommendations([]);
      setMetadata(null);
      setSubmittedProfile(null);
      setComparisonProfile(null);
      setComparisonRecommendations([]);
      setComparisonMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  const handleComparisonChange = (field, value) => {
    setComparisonProfile((previousProfile) => {
      if (!previousProfile) {
        return previousProfile;
      }

      return {
        ...previousProfile,
        [field]: value,
      };
    });
  };

  const handleRunComparison = async () => {
    if (!comparisonProfile) {
      return;
    }

    setComparisonLoading(true);
    setComparisonError("");

    try {
      const result = await getRecommendations(comparisonProfile);
      setComparisonRecommendations(result.recommendations || []);
      setComparisonMetadata(result.metadata || null);
    } catch (requestError) {
      setComparisonError(requestError.message);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleSaveSnapshot = () => {
    if (!submittedProfile || !comparisonProfile || !recommendations.length || !comparisonRecommendations.length) {
      return;
    }

    const snapshot = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      baseProfile: submittedProfile,
      comparisonProfile,
      baselineRecommendations: recommendations,
      comparisonRecommendations,
      baselineMetadata: metadata,
      comparisonMetadata,
    };

    setTimeline((previousTimeline) => [snapshot, ...previousTimeline].slice(0, 5));
  };

  const handleRestoreSnapshot = (snapshot) => {
    setSubmittedProfile(snapshot.baseProfile);
    setComparisonProfile(snapshot.comparisonProfile);
    setRecommendations(snapshot.baselineRecommendations);
    setMetadata(snapshot.baselineMetadata);
    setComparisonRecommendations(snapshot.comparisonRecommendations);
    setComparisonMetadata(snapshot.comparisonMetadata);
    setError("");
    setComparisonError("");
  };

  const handleDeleteSnapshot = (snapshotId) => {
    setTimeline((previousTimeline) => previousTimeline.filter((snapshot) => snapshot.id !== snapshotId));
  };

  const heroStats = useMemo(() => buildHeroStats(products, recommendations), [products, recommendations]);

  return (
    <div className="relative min-h-screen">
      <SignatureBackdrop />

      <main className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 py-8 text-[#e6edf3] md:px-8">
        <div className="grid gap-6">
        <header className="surface-shell relative grid gap-6 rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-cyan-400 animate-reveal">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                Blostem Insight Engine
              </div>
              <h1
                className="brand-display max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl animate-reveal"
              >
                A premium decision oracle for financial products.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#9fb3c8] md:text-base animate-reveal" style={{ animationDelay: "120ms" }}>
                Enter your profile and the engine scores a curated product universe, surfaces the best matches, and explains the trade-offs with clarity.
              </p>
              <p className="max-w-3xl text-xs uppercase tracking-[0.18em] text-cyan-400/90 animate-reveal" style={{ animationDelay: "180ms" }}>
                This system evaluates financial instruments using a weighted decision model to generate optimal matches for user profiles.
              </p>
            </div>
            <div className="surface-accent rounded-3xl p-4 animate-reveal">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-400">
                <Icon name="spark" className="h-4 w-4" />
                Live system state
              </p>
              <p className="mt-2 text-lg font-medium text-white animate-pulse">
                {catalogLoading ? "Loading product universe..." : "Product universe ready."}
              </p>
              <p className="mt-2 text-sm text-[#9fb3c8]">
                Deterministic scoring, explainable ranking, and premium presentation in one flow.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-400/90">
                Designed as a decision layer for fintech platforms to convert product data into actionable recommendations.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((item, index) => (
              <div
                key={item.label}
                className="surface-soft rounded-2xl p-4 animate-reveal transition-all duration-300 ease-in-out hover:-translate-y-1"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-400">
                  <Icon name={item.icon} className="h-4 w-4 text-cyan-300" />
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-6">
          <ProfileForm onSubmit={handleSubmit} loading={loading} />
          {error ? (
            <p className="rounded-2xl border border-[#ffb020]/20 bg-[#ffb020]/10 p-4 text-sm text-[#ffb020]">
              {error}
            </p>
          ) : null}
          {loading ? <LoadingOracleState /> : null}
          {!loading && !submittedProfile ? <EmptyExperienceState /> : null}
          {submittedProfile ? (
            <DecisionFlowStrip
              recommendation={recommendations[0]}
              segmentLabel={recommendations.length ? "Live decision path" : "Waiting for output"}
            />
          ) : null}
          {submittedProfile ? (
            <Suspense
              fallback={
                <div className="grid gap-4 rounded-[2rem] border border-cyan-500/20 bg-[#0b1117] p-6">
                  <div className="h-10 w-56 animate-pulse rounded-full bg-white/10" />
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-64 animate-pulse rounded-[2rem] bg-[#0f1a22]" />
                    <div className="h-64 animate-pulse rounded-[2rem] bg-[#0f1a22]" />
                    <div className="h-64 animate-pulse rounded-[2rem] bg-[#0f1a22]" />
                  </div>
                </div>
              }
            >
              <ResultsPage
                recommendations={recommendations}
                metadata={metadata}
                userProfile={submittedProfile}
                products={products}
                comparisonRecommendations={comparisonRecommendations}
                comparisonMetadata={comparisonMetadata}
                comparisonProfile={comparisonProfile}
                timeline={timeline}
                onComparisonChange={handleComparisonChange}
                onRunComparison={handleRunComparison}
                onSaveSnapshot={handleSaveSnapshot}
                comparisonLoading={comparisonLoading}
                comparisonError={comparisonError}
                onRestoreSnapshot={handleRestoreSnapshot}
                onDeleteSnapshot={handleDeleteSnapshot}
              />
            </Suspense>
          ) : null}
        </section>
        </div>
      </main>
    </div>
  );
}
