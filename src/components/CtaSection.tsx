import { ArrowRight, Phone } from "lucide-react";

interface CtaSectionProps {
  onGetStarted: () => void;
}

export default function CtaSection({ onGetStarted }: CtaSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary via-[#1E4F9F] to-accent opacity-90" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl text-white text-balance">
          Ready to Switch?
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Find Your Perfect Internet Plan Today. Enter your ZIP code, match regional lines, and connect with a dedicated advisory specialist instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-primary hover:bg-blue-50 transition-all text-sm cursor-pointer shadow-lg"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="tel:+18557443810"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition-all text-sm whitespace-nowrap"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>Call Advisor +1-855-744-3810</span>
          </a>
        </div>
      </div>
    </section>
  );
}
