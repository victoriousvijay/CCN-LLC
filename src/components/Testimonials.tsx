import { useState, useEffect } from "react";
import { TESTIMONIALS_LIST } from "../data";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from "lucide-react";

const TestimonialSkeleton = () => (
  <div className="relative rounded-3xl bg-card border border-border-custom p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 items-center min-h-[300px] w-full animate-pulse">
    {/* Background glowing ring */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

    {/* Avatar Block */}
    <div className="relative shrink-0">
      <div className="h-24 w-24 rounded-2xl bg-border-custom" />
      <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-border-custom rounded-xl" />
    </div>

    {/* Content Info Block */}
    <div className="space-y-4 flex-1 text-center md:text-left w-full">
      {/* Star rating */}
      <div className="flex items-center justify-center md:justify-start gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4.5 w-4.5 bg-border-custom rounded-full" />
        ))}
      </div>

      {/* Verified Badge */}
      <div className="h-4 w-40 bg-border-custom rounded-md mx-auto md:mx-0" />

      {/* Quote blocks */}
      <div className="space-y-2">
        <div className="h-5 w-full bg-border-custom rounded-lg" />
        <div className="h-5 w-5/6 bg-border-custom rounded-lg mx-auto md:mx-0" />
        <div className="h-5 w-4/6 bg-border-custom rounded-lg mx-auto md:mx-0" />
      </div>

      {/* Author name & title */}
      <div className="pt-2 space-y-1.5">
        <div className="h-4.5 w-28 bg-border-custom rounded-lg mx-auto md:mx-0" />
        <div className="h-3.5 w-20 bg-border-custom rounded-md mx-auto md:mx-0" />
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_LIST.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_LIST.length) % TESTIMONIALS_LIST.length);
  };

  // Initial loading delay for testimonial audit verification check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide carousel every 6s for dynamic premium feel
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const active = TESTIMONIALS_LIST[activeIndex];

  return (
    <section className="py-24 relative overflow-hidden bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Advisory Auditing</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
            Audited Client Feedback
          </h2>
          <p className="text-lg text-text-secondary">
            Read transparent reviews from small businesses, families, and high-intensity streamers who connected smarter.
          </p>
        </div>

        {/* Carousel Card Container */}
        <div className="relative max-w-4xl mx-auto">
          
          {isLoading ? (
            <TestimonialSkeleton />
          ) : (
            <div className="relative rounded-3xl bg-card border border-border-custom p-8 md:p-12 shadow-md flex flex-col md:flex-row gap-8 items-center min-h-[300px]">
              {/* Background glowing ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Client Avatar Grid */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 rounded-2xl overflow-hidden border border-border-custom shadow-sm bg-bg">
                  <img
                    src={active.avatar}
                    alt={active.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-primary to-accent p-1.5 rounded-xl text-white shadow-md">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>

              {/* Testimonial Quote & Info */}
              <div className="space-y-4 flex-1 text-center md:text-left">
                {/* Star rating */}
                <div className="flex items-center justify-center md:justify-start gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4.5 w-4.5 ${
                        i < active.rating ? "text-amber-500 fill-amber-500" : "text-text-secondary/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Verified Badge */}
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Match • {active.location}</span>
                </div>

                {/* Content body */}
                <blockquote className="text-lg md:text-xl font-medium text-text-primary tracking-tight leading-relaxed italic">
                  "{active.content}"
                </blockquote>

                {/* Client Name & Role */}
                <div>
                  <h4 className="font-display font-bold text-text-primary text-base">
                    {active.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {active.role}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Interactive controls */}
          <div className="flex justify-between items-center mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS_LIST.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex ? "w-6 bg-primary" : "w-2 bg-border-custom hover:bg-text-secondary/40"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <div className="flex gap-3">
              <button
                onClick={prevTestimonial}
                className="rounded-xl border border-border-custom p-2.5 hover:bg-card text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                title="Previous feedback"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="rounded-xl border border-border-custom p-2.5 hover:bg-card text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                title="Next feedback"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
