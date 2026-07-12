import { useState } from "react";
import { Search, MapPin, CheckCircle, Wifi, Compass, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Choose Location",
    desc: "Input your ZIP code or street address to ping nearby regional connection lines instantly.",
    icon: MapPin,
    color: "from-blue-500 to-indigo-500"
  },
  {
    num: "02",
    title: "Compare Providers",
    desc: "Inspect Spectrum, AT&T, Verizon, and Xfinity side-by-side using our transparent pricing matrices.",
    icon: Search,
    color: "from-cyan-500 to-teal-500"
  },
  {
    num: "03",
    title: "Select Perfect Plan",
    desc: "Choose a matching Home or Business connectivity tier that fits your speed and pricing budget perfectly.",
    icon: Wifi,
    color: "from-emerald-500 to-green-500"
  },
  {
    num: "04",
    title: "Get Connected",
    desc: "Lock in your elite advisor quote to arrange express delivery or free professional setup within 48 hours.",
    icon: CheckCircle,
    color: "from-purple-500 to-pink-500"
  }
];

interface HowItWorksProps {
  onNavigateToChecker?: () => void;
}

export default function HowItWorks({ onNavigateToChecker }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-card border-y border-border-custom relative overflow-hidden">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>Deployment Protocol</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
            How Advisory Matching Works
          </h2>
          <p className="text-lg text-text-secondary">
            Get activated in four intuitive stages. Our automated platform does the heavy research lifting for you.
          </p>
        </div>

        {/* Timeline Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Timeline connecting bar (drawn horizontally across desktop, hidden on mobile) */}
          <div className="hidden md:block absolute top-16 left-1/8 right-1/8 h-[1.5px] bg-border-custom z-0" />

          {STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            const isActive = activeStep === idx;
            
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                onClick={() => setActiveStep(idx)}
              >
                
                {/* Number Bullet Node */}
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center border font-display font-extrabold text-base transition-all duration-300 mb-6 ${
                    isActive
                      ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20"
                      : "bg-bg border-border-custom text-text-secondary group-hover:border-primary/40 group-hover:text-text-primary"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Info block */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-text-secondary font-bold uppercase tracking-widest block">
                    STAGE {step.num}
                  </span>
                  <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>

                {/* Progress bar inside matching step */}
                {isActive && (
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 animate-pulse" />
                )}

              </div>
            );
          })}

        </div>

        {/* CTA underneath the stepper */}
        <div className="mt-16 text-center">
          <button
            onClick={onNavigateToChecker}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all text-sm cursor-pointer border-0"
          >
            <span>Launch Checker Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
