import { motion } from "motion/react";
import { Check, Info, ArrowRight, Zap, Flame, ShieldCheck } from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  speed: string;
  subtitle: string;
  tag?: string;
  originalPrice?: number;
  price: number;
  period: string;
  features: PlanFeature[];
  badgeColor?: string;
  accentColor: string;
  icon: React.ReactNode;
}

export default function FiberPlansHomepage({ onSelectPlan }: { onSelectPlan: (planId: string, planName: string) => void }) {
  const plans: Plan[] = [
    {
      id: "advantage",
      name: "INTERNET ADVANTAGE",
      speed: "100 Mbps Internet",
      subtitle: "Reliable speeds for a smooth online experience.",
      price: 30,
      period: "for 1 year",
      icon: <ShieldCheck className="h-5 w-5 text-sky-400" />,
      accentColor: "from-sky-500 to-blue-600",
      features: [
        { text: "Fiber-Powered Internet", included: true },
        { text: "Unlimited Mobile® included for 1 year", included: true },
        { text: "Add Advanced WiFi for $10/mo", included: true },
        { text: "No contracts", included: true },
      ],
    },
    {
      id: "premier",
      name: "INTERNET PREMIER",
      speed: "500 Mbps Internet",
      subtitle: "Powers seamless work and entertainment across multiple devices.",
      tag: "Online exclusive price",
      originalPrice: 50,
      price: 40,
      period: "for 1 year",
      icon: <Flame className="h-5 w-5 text-amber-500 animate-pulse" />,
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      accentColor: "from-amber-400 to-orange-500",
      features: [
        { text: "Fiber-Powered Internet", included: true },
        { text: "Unlimited Mobile included for 1 year", included: true },
        { text: "Add Advanced WiFi for $10/mo", included: true },
        { text: "No contracts", included: true },
      ],
    },
    {
      id: "gig",
      name: "INTERNET GIG",
      speed: "1 Gig Internet",
      subtitle: "Fuels serious gaming, streaming and working from home for the whole household.",
      tag: "Online exclusive price",
      originalPrice: 70,
      price: 60,
      period: "for 1 year",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
      accentColor: "from-blue-500 to-indigo-600",
      features: [
        { text: "Fiber-Powered Internet", included: true },
        { text: "Unlimited Mobile included for 1 year", included: true },
        { text: "Advanced WiFi included", included: true },
        { text: "No contracts", included: true },
      ],
    },
  ];

  return (
    <section id="fiber-plans-home" className="py-24 bg-bg relative overflow-hidden">
      {/* Background decorations matching the premium 2026 feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-xs font-bold text-sky-400 uppercase tracking-widest mb-4"
          >
            <Zap className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>High-Speed Broadband Specials</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl mb-4"
          >
            Fiber-Powered Internet Plans
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-text-secondary"
          >
            Explore <span className="text-sky-400 font-semibold">Fiber-Powered Internet</span> plans designed for speed, reliability and security.
          </motion.p>
        </div>

        {/* Pricing Grid with Horizontal Scroll on Mobile */}
        {/* We use flex layout on mobile with overflow-x-auto, and grid on md+ screens */}
        <div className="relative">
          {/* Scroll container */}
          <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible pb-10 md:pb-0 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-auto snap-center flex flex-col justify-between rounded-3xl border border-border-custom bg-card shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                style={{
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Decorative border highlight at the top of cards */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${plan.accentColor}`} />

                {/* Card Top / Details */}
                <div className="p-8 pb-4">
                  {/* Tag banner if exists */}
                  {plan.tag ? (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${plan.badgeColor || "bg-sky-500/10 text-sky-400 border border-sky-400/20"}`}>
                        {plan.tag}
                      </span>
                    </div>
                  ) : (
                    // Spacing placeholder to align titles perfectly
                    <div className="h-6" />
                  )}

                  {/* Header info */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15">
                      {plan.icon}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-text-secondary uppercase">
                      {plan.name}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-text-primary mt-3 tracking-tight">
                    {plan.speed}
                  </h3>
                  
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed min-h-[40px]">
                    {plan.subtitle}
                  </p>

                  {/* Pricing block */}
                  <div className="mt-8 flex items-baseline gap-1.5">
                    {plan.originalPrice && (
                      <span className="text-sm font-semibold text-rose-500/80 line-through mr-1 font-number">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl font-extrabold tracking-tight text-text-primary font-number">
                      ${plan.price}
                    </span>
                    <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                      /mo
                    </span>
                  </div>
                  <span className="text-[11px] text-text-secondary/70 font-semibold uppercase tracking-wider block mt-1">
                    {plan.period}
                  </span>

                  {/* Divider */}
                  <div className="h-px bg-border-custom my-6" />

                  {/* Feature Checklist */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <span className="mt-0.5 rounded-full bg-emerald-500/15 p-0.5 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-text-secondary/90 leading-normal font-medium">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action button in footer of card */}
                <div className="p-8 pt-0">
                  <button
                    onClick={() => onSelectPlan(plan.id, `CoreConnect - ${plan.name} (${plan.speed})`)}
                    data-cursor="quote"
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${plan.accentColor} py-4 px-6 font-bold text-white shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.02] active:scale-95 text-xs tracking-wider uppercase cursor-pointer`}
                  >
                    <span>Select Advisor Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swipe indicator visual aid for mobile view */}
          <div className="flex md:hidden justify-center items-center gap-2 mt-4">
            <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest">Swipe for more plans</span>
            <div className="flex gap-1">
              <span className="w-4 h-1 rounded-full bg-primary animate-pulse" />
              <span className="w-1.5 h-1 rounded-full bg-border-custom" />
              <span className="w-1.5 h-1 rounded-full bg-border-custom" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
