import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import InternetPlans from "./components/InternetPlans";
import AvailabilityChecker from "./components/AvailabilityChecker";
import HowItWorks from "./components/HowItWorks";
import GeminiChatbot from "./components/GeminiChatbot";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import AdvantageCard from "./components/AdvantageCard";
import ServiceCard from "./components/ServiceCard";
import Interactive3DCursor from "./components/Interactive3DCursor";
import FiberPlansHomepage from "./components/FiberPlansHomepage";
import { PrivacyPolicy, TermsAndConditions } from "./components/LegalPages";
import InteractiveHeroVisual from "./components/InteractiveHeroVisual";
import { PROVIDERS_LIST } from "./data";
import { InternetPlan } from "./types";
import { motion, useScroll, useTransform } from "motion/react";

import {
  Wifi,
  Tv,
  PhoneCall,
  Layers,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  Phone,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  HelpCircle,
  HelpCircle as QuestionIcon
} from "lucide-react";

export default function App() {
  // App navigation & selection states
  const [activePage, setActivePage] = useState<string>("home");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [leadsRefreshTrigger, setLeadsRefreshTrigger] = useState(0);

  const handlePageChange = (newPage: string) => {
    setIsPageLoading(true);
    setTimeout(() => {
      setActivePage(newPage);
      setIsPageLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600); // 600ms matching transition/animation
  };

  // FAQ accordion open states
  const [faqOpenStates, setFaqOpenStates] = useState<Record<string, boolean>>({
    "faq-1": true, // Default first open
    "faq-2": false,
    "faq-3": false,
    "faq-4": false,
    "faq-5": false
  });

  // Handle plan selection from InternetPlans card
  const handleSelectPlan = (plan: InternetPlan) => {
    setSelectedPlanId(plan.id);
    setSelectedPlanName(`${plan.provider} - ${plan.name}`);
    
    // Route directly to availability checker page
    handlePageChange("checker");
  };

  // Increment trigger to refresh administrative database lists
  const handleLeadSubmitted = () => {
    setLeadsRefreshTrigger((prev) => prev + 1);
  };

  const toggleFaq = (id: string) => {
    setFaqOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg relative overflow-x-hidden w-full max-w-full">
      
      {/* Premium Interactive 3D Cursor for desktop */}
      <Interactive3DCursor />
      
      {/* Loading overlay with high-tech loader */}
      {isPageLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/85 backdrop-blur-md">
          <Loader />
        </div>
      )}
      
      {/* Dynamic theme background nodes */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Top Progress scroll bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary z-50 origin-left" style={{ transform: "scaleX(1)" }} />

      {/* Navigation Header */}
      <Navbar
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        activePage={activePage}
        onChangePage={handlePageChange}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activePage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. HERO SECTION */}
            <section id="hero" className="py-24 md:py-36 relative overflow-hidden bg-gradient-to-br from-[#060D1E] via-[#091B3E] to-[#0D2451] text-white border-b border-blue-900/40 shadow-inner">
              
              {/* Subtle Tech Grid overlay and ambient glowing nodes */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
              <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Headline and Search */}
                <div className="space-y-8 lg:col-span-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 shadow-sm">
                    <Sparkles className="h-4 w-4 animate-pulse text-cyan-300" />
                    <span>Modern 2026 Advisory Platform</span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-tight">
                      Connect Faster.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-300% animate-gradient-shift">
                        Save Smarter.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-2xl font-light">
                      Helping families and businesses discover, analyze, and lock in the best Internet, TV, Mobile, and Business connectivity solutions across America.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+18005550199"
                      data-cursor="call"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <Phone className="h-4 w-4 animate-bounce" />
                      <span>Call Now</span>
                    </a>

                    <button
                      onClick={() => handlePageChange("checker")}
                      data-cursor="verify"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/95 transition-all text-sm cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <span>Check Availability</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handlePageChange("plans")}
                      data-cursor="explore"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                    >
                      <span>Compare Plans</span>
                    </button>
                  </div>

                  {/* Trust Metric line */}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/10 max-w-xl">
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        12,400+
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/60">
                        Matched Homes
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        15 Min
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/60">
                        Average Activation
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <span className="font-number text-2xl font-extrabold text-white block">
                        4.8 / 5
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200/60">
                        Advisor Trust Rating
                      </span>
                    </div>
                  </div>

                </div>

                {/* Interactive Visual Right Column */}
                <div className="hidden lg:flex lg:col-span-4 relative items-center justify-center w-full">
                  <InteractiveHeroVisual />
                </div>

              </div>
            </section>

            {/* 3. FIBER-POWERED PLANS SPECUAL SECTION */}
            <FiberPlansHomepage onSelectPlan={(planId, planName) => {
              setSelectedPlanId(planId);
              setSelectedPlanName(planName);
              handlePageChange("checker");
            }} />

            {/* 4. WHY CHOOSE CORE CONNECT */}
            <motion.section
              id="why-choose"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="py-24 bg-card border-t border-border-custom relative overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                  <span className="inline-block rounded-full bg-accent/5 border border-accent/20 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-wider mb-4">
                    Core Connect Values
                  </span>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    The Advisor Advantage
                  </h2>
                  <p className="text-lg text-text-secondary">
                    Why thousands of residential and commercial subscribers trust Core Connect for comparison management.
                  </p>
                </div>

                {/* Bento Style Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                  
                  {/* Feature Card 1 */}
                  <AdvantageCard
                    title="Best Direct Deals"
                    description="We lock in official wholesale promotions, state-allocated price caps, and limited-time bundling discounts."
                    gradient="linear-gradient(45deg, #1E5FBF 0%, #12B4D9 100%)"
                    shadowColor="rgba(18, 180, 217, 0.45)"
                    icon={<Award className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
                  />

                  {/* Feature Card 2 */}
                  <AdvantageCard
                    title="Quick Installation"
                    description="Receive instant dispatch protocols. Ship 15-minute self-install kits or book professional engineers within 48 hours."
                    gradient="linear-gradient(45deg, #4F46E5 0%, #EC4899 100%)"
                    shadowColor="rgba(236, 72, 153, 0.45)"
                    icon={<Clock className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
                  />

                  {/* Feature Card 3 */}
                  <AdvantageCard
                    title="No Hidden Fees"
                    description="Transparent disclosures as mandated by carrier boards. What we quote matches your monthly billing slip exactly."
                    gradient="linear-gradient(45deg, #10B981 0%, #06B6D4 100%)"
                    shadowColor="rgba(16, 185, 129, 0.45)"
                    icon={<CheckCircle className="h-6 w-6 text-white" />}
                    imageUrl="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                  />

                </div>

              </div>
            </motion.section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3. INTERNET PLANS GRID */}
            <div className="py-8">
              <InternetPlans onSelectPlan={handleSelectPlan} />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "checker" && (
          <motion.div
            key="checker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 5. INSTANT AVAILABILITY CHECKER */}
            <div className="py-8">
              <AvailabilityChecker
                onLeadSubmitted={handleLeadSubmitted}
                selectedPlanId={selectedPlanId}
                onClearSelectedPlan={() => {
                  setSelectedPlanId(null);
                  setSelectedPlanName(null);
                }}
                selectedPlanName={selectedPlanName}
              />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "services" && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 6. SERVICES GRID */}
            <motion.section
              id="services"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="py-24 bg-bg relative overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-block rounded-full bg-primary/5 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
                    Full Connectivity Suite
                  </span>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    Services Managed By Our Advisory
                  </h2>
                  <p className="text-lg text-text-secondary">
                    We manage comparison routing across six primary categories to simplify residential and commercial orders.
                  </p>
                </div>

                {/* Grid 3x2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                  
                  {/* Card 1: Internet */}
                  <ServiceCard
                    title="High-Speed Internet"
                    description="Compare gigabit fiber-optic lines, high-frequency coaxial cable, and fixed wireless 5G receivers."
                    icon={<Wifi className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 2: TV */}
                  <ServiceCard
                    title="Premium Cable TV"
                    description="Compare channel lineups, localized news broadcasts, sports season bundles, and next-gen multi-room DVR recording hubs."
                    icon={<Tv className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 3: Phone */}
                  <ServiceCard
                    title="Digital Voice VoIP"
                    description="Compare unlimited crystal-clear nationwide VoIP lines with integrated Caller ID, spam block, and digital forwarding."
                    icon={<PhoneCall className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 4: Bundles */}
                  <ServiceCard
                    title="Triple Play Bundles"
                    description="Combine Internet, TV, and phone into a single customized subscription to slash monthly expenditure up to 40%."
                    icon={<Layers className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 5: Business */}
                  <ServiceCard
                    title="Commercial Connectivity"
                    description="Enterprise-level dedicated fiber tunnels, static IP blocks, 99.9% uptime SLA guarantees, and priority support dispatch."
                    icon={<Briefcase className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                  {/* Card 6: Security */}
                  <ServiceCard
                    title="Smart Home Protection"
                    description="Monitor premises via cloud-connected smart security cameras, responsive motion triggers, and 24/7 central auditing."
                    icon={<ShieldAlert className="w-8 h-8 text-white filter drop-shadow-lg" />}
                  />

                </div>

              </div>
            </motion.section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "how-it-works" && (
          <motion.div
            key="how-it-works"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 7. HOW IT WORKS */}
            <div className="py-8">
              <HowItWorks onNavigateToChecker={() => handlePageChange("checker")} />
            </div>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "faq" && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 9. FAQ ACCORDION SECTION */}
            <section id="faq" className="py-24 bg-card border-t border-border-custom relative overflow-hidden">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
                    <QuestionIcon className="h-3.5 w-3.5" />
                    <span>Reference FAQ Matrix</span>
                  </div>
                  <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
                    Frequently Answered Advisory Queries
                  </h2>
                </div>

                {/* Interactive Accordion Panel */}
                <div className="space-y-4">
                  {[
                    {
                      id: "faq-1",
                      q: "How does Core Connect Network determine available plans in my area?",
                      a: "We integrate directly with active infrastructure databases to aggregate regional coverage mappings in real-time. When you enter your address or ZIP code, we check active regional cable routes, fiber lines, and wireless transmitter ranges to deliver precise, available offerings at your specific door."
                    },
                    {
                      id: "faq-2",
                      q: "Are the prices shown on Core Connect the same as buying directly from the provider?",
                      a: "Yes, and often lower! Because of our wholesale agreements and advisory partnerships, we present official retail rates alongside exclusive promotions and bundles that you might not find directly on public provider sites. We never add hidden service markups or consulting fees."
                    },
                    {
                      id: "faq-3",
                      q: "What is the difference between Fiber and Cable internet?",
                      a: "Fiber uses glass fibers to transmit data via light, resulting in symmetrical speeds (equal download and upload) and extremely low, stable latency. Cable uses coaxial lines which can deliver high download speeds (up to 1 Gbps), but upload speeds are typically limited to 35-50 Mbps. Fiber is the superior choice for gaming, video calling, and constant cloud backups."
                    },
                    {
                      id: "faq-4",
                      q: "Do I have to sign an annual contract to get these deals?",
                      a: "Many modern network plans have moved to monthly billing with zero contracts (such as Core Connect Fiber). However, some commercial connections still utilize 1-year or 2-year service agreements in exchange for fixed pricing guarantees. We explicitly highlight contract status on every single plan card."
                    },
                    {
                      id: "faq-5",
                      q: "How long does installation take once I request a plan?",
                      a: "If your address already has active lines, many providers can ship a Self-Installation Kit which arrives in 2-3 business days and takes under 15 minutes to configure. If a professional technician is required to run new fiber or coaxial cables, appointments are typically scheduled within 48 to 72 hours of your submission."
                    }
                  ].map((item) => {
                    const isOpen = faqOpenStates[item.id];
                    return (
                      <div
                        key={item.id}
                        className="border border-border-custom bg-bg/40 rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(item.id)}
                          className="w-full flex items-center justify-between p-6 text-left font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer"
                        >
                          <span className="font-display text-base md:text-lg">{item.q}</span>
                          <ChevronDown
                            className={`h-5 w-5 text-text-secondary shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-6 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border-custom bg-card animate-fade-in-up">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 relative overflow-hidden bg-primary text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white">
                  Ready to Switch?
                </h2>
                <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => handlePageChange("checker")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="tel:+18005550199"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Advisor (800) 555-0199</span>
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === "leads" && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-card border border-border-custom rounded-3xl p-6 relative overflow-hidden shadow-2xl min-h-[600px]">
              <Dashboard
                isOpen={true}
                onClose={() => handlePageChange("home")}
                refreshTrigger={leadsRefreshTrigger}
              />
            </div>
          </motion.div>
        )}

        {activePage === "privacy" && (
          <PrivacyPolicy onBack={() => handlePageChange("home")} />
        )}

        {activePage === "terms" && (
          <TermsAndConditions onBack={() => handlePageChange("home")} />
        )}
      </main>

      {/* Footer Section */}
      <Footer onChangePage={handlePageChange} />

      {/* Slide-out Gemini Chatbot Assistant */}
      <GeminiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSelectPlanFromChat={(planId, planName) => {
          setSelectedPlanId(planId);
          setSelectedPlanName(planName);
          handlePageChange("checker");
        }}
      />

    </div>
  );
}
