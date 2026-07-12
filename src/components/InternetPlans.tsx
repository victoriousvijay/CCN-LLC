import { useState, useEffect } from "react";
import { INTERNET_PLANS } from "../data";
import { InternetPlan } from "../types";
import { Check, Shield, Wifi, Info, Plus, Trash2, ArrowRight, Star, Building2, Home } from "lucide-react";

interface InternetPlansProps {
  onSelectPlan: (plan: InternetPlan) => void;
}

const PlanSkeleton = () => (
  <div className="flex flex-col justify-between rounded-3xl bg-card p-8 border border-border-custom shadow-sm animate-pulse min-h-[460px]">
    <div>
      {/* Provider & Technology Badge Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-36 bg-border-custom rounded-lg" />
        <div className="h-4 w-20 bg-border-custom rounded-lg" />
      </div>

      {/* Plan Name & Speed Skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-3/4 bg-border-custom rounded-xl" />
        <div className="h-4 w-1/2 bg-border-custom rounded-lg" />
      </div>

      {/* Plan Pricing Skeleton */}
      <div className="flex items-baseline gap-1 mb-8">
        <div className="h-12 w-24 bg-border-custom rounded-xl" />
        <div className="h-4 w-8 bg-border-custom rounded-lg" />
      </div>

      {/* Highlights Bullet List Skeleton */}
      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-border-custom shrink-0" />
            <div className="h-4 w-5/6 bg-border-custom rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Card CTA Actions Skeleton */}
    <div className="space-y-3 pt-6 border-t border-border-custom mt-auto">
      <div className="h-12 w-full bg-border-custom rounded-2xl" />
      <div className="h-10 w-full bg-border-custom rounded-2xl" />
    </div>
  </div>
);

export default function InternetPlans({ onSelectPlan }: InternetPlansProps) {
  const [activeTab, setActiveTab] = useState<"home" | "business">("home");
  const [speedFilter, setSpeedFilter] = useState<number>(0); // 0 = All, 500 = 500Mbps+, 1000 = 1Gbps+
  const [compareQueue, setCompareQueue] = useState<InternetPlan[]>([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger simulated latency transition on active filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, [activeTab, speedFilter]);

  const filteredPlans = INTERNET_PLANS.filter((plan) => {
    const typeMatch = plan.type === activeTab;
    const speedMatch = speedFilter === 0 ? true : plan.speedMbps >= speedFilter;
    return typeMatch && speedMatch;
  });

  const toggleCompare = (plan: InternetPlan) => {
    if (compareQueue.some((p) => p.id === plan.id)) {
      setCompareQueue(compareQueue.filter((p) => p.id !== plan.id));
    } else {
      if (compareQueue.length >= 3) {
        alert("You can compare up to 3 plans simultaneously.");
        return;
      }
      setCompareQueue([...compareQueue, plan]);
      setShowCompareDrawer(true);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareQueue(compareQueue.filter((p) => p.id !== id));
  };

  return (
    <section id="plans" className="py-24 relative overflow-hidden bg-bg">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <Wifi className="h-3.5 w-3.5" />
            <span>Advisory Price Engine</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
            Compare Premium Internet Plans
          </h2>
          <p className="text-lg text-text-secondary">
            Lock in direct pricing, high-speed fiber lines, and contract-free options. Zero hidden fees, guaranteed.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-12 bg-card p-4 rounded-2xl border border-border-custom shadow-sm max-w-4xl mx-auto">
          {/* Home/Business Segmented Toggle */}
          <div className="flex bg-bg p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab("home");
                setCompareQueue([]);
              }}
              className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "home"
                  ? "bg-white dark:bg-card text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Residential Plans</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("business");
                setCompareQueue([]);
              }}
              className={`flex items-center justify-center gap-2 flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "business"
                  ? "bg-white dark:bg-card text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Business Enterprise</span>
            </button>
          </div>

          {/* Speed Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider shrink-0 mr-2">
              Filter Speed:
            </span>
            <button
              onClick={() => setSpeedFilter(0)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                speedFilter === 0
                  ? "bg-primary border-primary text-white"
                  : "border-border-custom hover:border-primary/30 text-text-secondary hover:text-text-primary"
              }`}
            >
              All Speeds
            </button>
            <button
              onClick={() => setSpeedFilter(500)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                speedFilter === 500
                  ? "bg-primary border-primary text-white"
                  : "border-border-custom hover:border-primary/30 text-text-secondary hover:text-text-primary"
              }`}
            >
              500+ Mbps
            </button>
            <button
              onClick={() => setSpeedFilter(1000)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                speedFilter === 1000
                  ? "bg-primary border-primary text-white"
                  : "border-border-custom hover:border-primary/30 text-text-secondary hover:text-text-primary"
              }`}
            >
              1+ Gbps
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {isLoading ? (
            <>
              <PlanSkeleton />
              <PlanSkeleton />
              <PlanSkeleton />
            </>
          ) : (
            filteredPlans.map((plan) => {
              const isComparing = compareQueue.some((p) => p.id === plan.id);
              return (
                <div
                  key={plan.id}
                  id={`plan-card-${plan.id}`}
                  className={`group relative flex flex-col justify-between rounded-3xl bg-card p-8 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                      : "border-border-custom"
                  }`}
                >
                  {/* Popular Tag */}
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                      <Star className="h-3 w-3 fill-white" />
                      <span>Highly Recommended</span>
                    </span>
                  )}

                  <div>
                    {/* Technology Badge */}
                    <div className="flex items-center mb-6">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg">
                        {plan.technology} Technology
                      </span>
                    </div>

                    {/* Plan Name & Speed */}
                    <div className="mb-6">
                      <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight mb-1">
                        {plan.name}
                      </h3>
                      <p className="font-mono text-sm text-text-secondary">
                        Max Download: {plan.speed}
                      </p>
                    </div>

                    {/* Plan Pricing */}
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="font-number text-5xl font-extrabold text-text-primary">
                        ${Math.floor(plan.price)}
                      </span>
                      <span className="font-number text-2xl font-bold text-text-primary">
                        .{((plan.price % 1) * 100).toFixed(0).padStart(2, "0") === "00" ? "99" : ((plan.price % 1) * 100).toFixed(0)}
                      </span>
                      <span className="text-sm font-medium text-text-secondary ml-1">
                        /mo
                      </span>
                    </div>

                    {/* Highlights Bullet List */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feat, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                          <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card CTA Actions */}
                  <div className="space-y-3 pt-6 border-t border-border-custom mt-auto">
                    <button
                      onClick={() => onSelectPlan(plan)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
                    >
                      <span>Secure Advisor Quote</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => toggleCompare(plan)}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-bold border transition-all ${
                        isComparing
                          ? "bg-accent/10 border-accent text-accent"
                          : "border-border-custom hover:border-primary/20 text-text-secondary hover:text-text-primary hover:bg-bg"
                      }`}
                    >
                      {isComparing ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added to Compare</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Compare Technical Specs</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State Fallback */}
        {!isLoading && filteredPlans.length === 0 && (
          <div className="text-center py-16 bg-card border border-dashed border-border-custom rounded-3xl max-w-lg mx-auto">
            <Info className="h-10 w-10 text-text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-text-primary mb-2">No Plans Match Speed Tier</h4>
            <p className="text-sm text-text-secondary px-6">
              National fiber and broadband grids do not support {speedFilter} Mbps+ plans in some sub-areas. Try choosing "All Speeds" or checking availability.
            </p>
          </div>
        )}

      </div>

      {/* Floating Compare Drawer */}
      {showCompareDrawer && compareQueue.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border-custom shadow-2xl p-4 sm:p-6 transition-all duration-300 animate-fade-in-up max-h-[85vh] sm:max-h-[60vh] overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-text-primary">
                  Compare Selection ({compareQueue.length} of 3)
                </h3>
                <p className="text-[11px] sm:text-xs text-text-secondary">
                  Side-by-side technical specification breakdown
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCompareQueue([]);
                    setShowCompareDrawer(false);
                  }}
                  className="text-xs font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowCompareDrawer(false)}
                  className="rounded-full bg-bg p-1.5 text-text-secondary hover:text-text-primary hover:bg-border-custom cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {compareQueue.length > 1 && (
              <div className="md:hidden flex justify-center items-center gap-1.5 text-[10px] text-primary font-mono mb-3.5">
                <span>← Swipe horizontally to compare plans →</span>
              </div>
            )}

            {/* Side by side comparison grid */}
            <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-4 md:items-stretch no-scrollbar scroll-smooth snap-x snap-mandatory">
              
              {/* Parameter Titles (hidden on mobile) */}
              <div className="hidden md:flex flex-col justify-around text-xs font-bold text-text-secondary uppercase tracking-widest bg-bg p-4 rounded-2xl border border-border-custom space-y-4">
                <div>Monthly Price</div>
                <div>Speed Tier</div>
                <div>Technology</div>
                <div>Data caps</div>
                <div>Contract term</div>
              </div>

              {/* Selected Plan Columns */}
              {compareQueue.map((qp) => (
                <div key={qp.id} className="relative bg-card p-4 rounded-2xl border border-primary/20 flex flex-col justify-between shadow-sm w-[280px] shrink-0 md:w-auto md:shrink snap-start">
                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCompare(qp.id)}
                    className="absolute top-2 right-2 text-text-secondary hover:text-red-500 p-1 cursor-pointer"
                    title="Remove from comparison"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="space-y-4 text-sm">
                    {/* Header Details */}
                    <div>
                      <h4 className="font-bold text-text-primary text-sm sm:text-base">{qp.name}</h4>
                    </div>

                    <div className="md:hidden border-t border-border-custom pt-3 space-y-2">
                      {/* Mobile Row Detail Blocks */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Price:</span> 
                        <span className="font-bold text-text-primary text-sm">${qp.price}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Speed:</span> 
                        <span className="font-bold text-text-primary">{qp.speed}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Tech:</span> 
                        <span className="font-bold text-text-primary">{qp.technology}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Cap:</span> 
                        <span className="font-bold text-text-primary">{qp.dataLimit}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-secondary">Contract:</span> 
                        <span className="font-bold text-text-primary">{qp.contract}</span>
                      </div>
                    </div>

                    <div className="hidden md:block space-y-4">
                      {/* Desktop Spec Cells */}
                      <div className="font-bold text-text-primary text-lg">${qp.price}</div>
                      <div className="font-semibold text-text-primary">{qp.speed}</div>
                      <div className="text-text-primary">{qp.technology}</div>
                      <div className="text-text-primary">{qp.dataLimit}</div>
                      <div className="text-text-primary">{qp.contract}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPlan(qp);
                      setShowCompareDrawer(false);
                    }}
                    className="w-full mt-4 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all text-center block cursor-pointer"
                  >
                    Select Plan
                  </button>
                </div>
              ))}

              {/* Placeholder Column if < 3 selected */}
              {Array.from({ length: 3 - compareQueue.length }).map((_, idx) => (
                <div key={idx} className="hidden md:flex border border-dashed border-border-custom rounded-2xl items-center justify-center p-8 text-center text-xs text-text-secondary">
                  <div>
                    <Plus className="h-6 w-6 mx-auto mb-2 opacity-40 text-text-secondary animate-pulse" />
                    <span>Select another plan to compare side-by-side</span>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
