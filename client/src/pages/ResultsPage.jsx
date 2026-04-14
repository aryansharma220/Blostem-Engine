import { lazy, Suspense, useMemo, useState } from "react";
import RecommendationCards from "../components/RecommendationCards";
import { Icon } from "../components/IconSystem";
import ScoreTransparencyPanel from "../components/ScoreTransparencyPanel";
import { humanizeValue, profileFieldLabels } from "../utils/labels";
import TopRecommendationCard from "../components/TopRecommendationCard";
import CompareScenarioPanel from "../components/CompareScenarioPanel";
import TimelinePanel from "../components/TimelinePanel";

const InsightsPanel = lazy(() => import("../components/InsightsPanel"));
const UniversePanel = lazy(() => import("../components/UniversePanel"));
const ComparisonSection = lazy(() => import("../components/ComparisonSection"));

function SurfaceFallback({ compact = false }) {
  return (
    <div className={`surface-soft rounded-[2rem] ${compact ? "h-32" : "h-64"} animate-pulse`} />
  );
}

function getSegmentLabel(userProfile) {
  if (!userProfile) {
    return "General user";
  }

  if (userProfile.riskLevel === "low" && userProfile.liquidityNeed === "high") {
    return "Safety-first saver";
  }

  if (userProfile.riskLevel === "high") {
    return "Return-seeking investor";
  }

  return "Balanced planner";
}

export default function ResultsPage({
  recommendations,
  metadata,
  userProfile,
  products,
  comparisonRecommendations,
  comparisonMetadata,
  comparisonProfile,
  timeline,
  onComparisonChange,
  onRunComparison,
  onSaveSnapshot,
  comparisonLoading,
  comparisonError,
  onRestoreSnapshot,
  onDeleteSnapshot,
}) {
  const [showInsights, setShowInsights] = useState(false);

  if (!recommendations?.length) {
    return null;
  }

  const segmentLabel = getSegmentLabel(userProfile);
  const topResult = recommendations[0];
  const alternatives = recommendations.slice(1);

  const changedFields = useMemo(() => {
    if (!userProfile || !comparisonProfile) {
      return [];
    }

    return ["riskLevel", "liquidityNeed", "horizon"].filter(
      (field) => userProfile[field] !== comparisonProfile[field],
    );
  }, [comparisonProfile, userProfile]);

  const handleDownloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    let y = 14;

    const line = (text, spacing = 7) => {
      doc.text(text, 12, y);
      y += spacing;
      if (y > 276) {
        doc.addPage();
        y = 14;
      }
    };

    doc.setFontSize(16);
    line("Deciora - Recommendation Report", 9);
    doc.setFontSize(11);
    line(`Segment: ${segmentLabel}`);
    line(`Products evaluated: ${metadata?.totalProductsEvaluated ?? 0}`);
    line(" ");

    line("User Profile", 6);
    Object.entries(userProfile || {}).forEach(([key, value]) => {
      line(`- ${profileFieldLabels[key] || humanizeValue(key)}: ${humanizeValue(String(value))}`, 6);
    });

    line(" ");
    line("Top 3 Recommendations", 6);
    recommendations.forEach((item, index) => {
      line(`${index + 1}. ${item.productName} (${item.score})`, 6);
      line(`   ${item.explanation}`, 6);
    });

    if (comparisonRecommendations?.length) {
      line(" ");
      line("Scenario Comparison", 6);
      line(`Baseline Top: ${recommendations[0]?.productName} (${recommendations[0]?.score})`, 6);
      line(`Scenario B Top: ${comparisonRecommendations[0]?.productName} (${comparisonRecommendations[0]?.score})`, 6);

      if (changedFields.length) {
        line("Changed Inputs", 6);
        changedFields.forEach((field) => {
          line(`- ${profileFieldLabels[field]}: ${humanizeValue(userProfile[field])} -> ${humanizeValue(comparisonProfile[field])}`, 6);
        });
      }
    }

    if (timeline?.length) {
      line(" ");
      line("Saved Timeline Snapshots", 6);
      timeline.forEach((snapshot, index) => {
        line(`${index + 1}. ${snapshot.baselineRecommendations?.[0]?.productName} -> ${snapshot.comparisonRecommendations?.[0]?.productName}`, 6);
      });
    }

    doc.save("deciora-report.pdf");
  };

  return (
    <section className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <TopRecommendationCard recommendation={topResult} alternatives={alternatives} userProfile={userProfile} products={products} />

        <aside className="surface-accent tone-cyan section-rail-cyan relative rounded-[2rem] p-5 text-white animate-reveal lg:sticky lg:top-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">[ Decision Signal ]</p>
            <h2 className="mt-2 text-4xl font-semibold">{metadata?.topScore ?? recommendations[0].score}</h2>
            <p className="mt-1 text-sm text-[#9fb3c8]">Products evaluated: {metadata?.totalProductsEvaluated}</p>
            <p className="text-sm text-[#9fb3c8]">Segment: {segmentLabel}</p>
          </div>

          <p className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
            The decision engine favors strongest weighted alignment, not just maximum return.
          </p>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="mt-4 w-full rounded-full border border-cyan-500/20 bg-[#0b1117] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:border-cyan-400/40"
            aria-label="Export recommendation report as PDF"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="download" className="h-4 w-4" />
              Export PDF Report
            </span>
          </button>
        </aside>
      </div>

      <section className="section-rail-cyan rounded-[2rem] px-3 py-2">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">[ DECISION RATIONALE ]</p>
        <p className="mt-2 text-sm text-[#9fb3c8]">
          This system ranks financial products using a weighted scoring model based on user intent.
        </p>
        <p className="mt-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 font-mono text-xs text-cyan-100">
          Decision Model: Score = (Goal 35%) + (Liquidity 25%) + (Return 20%) + (Risk 10%) + (Tenure 10%)
        </p>
        <div className="mt-4">
          <ScoreTransparencyPanel
            baseline={recommendations[0]}
            comparison={comparisonRecommendations?.[0]}
            weights={metadata?.weights}
          />
        </div>
      </section>

      <section className="surface-soft tone-green section-rail-green rounded-[2rem] p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">[ Alternative Options ]</p>
        <p className="mt-2 text-sm text-[#9fb3c8]">Second and third best options for comparison.</p>
        <div className="mt-4">
          <RecommendationCards recommendations={alternatives} rankOffset={1} compact />
        </div>
      </section>

      <details className="surface-shell tone-cyan section-rail-cyan rounded-[2rem] p-5" open>
        <summary className="cursor-pointer text-white font-semibold">[ What If Scenario ]</summary>
        <div className="mt-4 grid gap-4">
          <CompareScenarioPanel
            baseProfile={userProfile}
            comparisonProfile={comparisonProfile}
            onFieldChange={onComparisonChange}
            onRunComparison={onRunComparison}
            onSaveSnapshot={onSaveSnapshot}
            loading={comparisonLoading}
            error={comparisonError}
            comparisonReady={(comparisonRecommendations?.length ?? 0) > 0}
          />

          <Suspense fallback={<SurfaceFallback compact />}>
            <ComparisonSection
              baselineRecommendations={recommendations}
              comparisonRecommendations={comparisonRecommendations}
              baselineMetadata={metadata}
              comparisonMetadata={comparisonMetadata}
              baselineProfile={userProfile}
              comparisonProfile={comparisonProfile}
            />
          </Suspense>

          <TimelinePanel
            snapshots={timeline}
            onRestoreSnapshot={onRestoreSnapshot}
            onDeleteSnapshot={onDeleteSnapshot}
          />
        </div>
      </details>

      <details className="section-rail-warning rounded-[2rem] p-3">
        <summary className="cursor-pointer text-white font-semibold">[ Dataset / Product List ]</summary>
        <div className="mt-4">
          <Suspense fallback={<SurfaceFallback />}>
            <UniversePanel products={products} />
          </Suspense>
        </div>
      </details>

      <details className="surface-shell tone-green section-rail-green rounded-[2rem] p-5">
        <summary className="cursor-pointer text-white font-semibold">[ System Analysis ]</summary>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowInsights((prev) => !prev)}
            className="rounded-full border border-cyan-500/20 bg-[#0b1117] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:border-cyan-400/40"
            aria-label="Toggle insights analytics section"
          >
            {showInsights ? "Hide Insights" : "Load Insights Analytics"}
          </button>
          {showInsights ? (
            <div className="mt-4">
              <Suspense fallback={<SurfaceFallback />}>
                <InsightsPanel recommendations={recommendations} />
              </Suspense>
            </div>
          ) : null}
        </div>
      </details>
    </section>
  );
}
