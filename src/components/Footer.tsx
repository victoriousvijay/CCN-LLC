import { useState, FormEvent } from "react";
import { Zap, Mail, ArrowRight, Shield, Globe, ExternalLink } from "lucide-react";

interface FooterProps {
  onChangePage?: (page: string) => void;
}

export default function Footer({ onChangePage }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border-custom pt-20 pb-8 text-sm text-text-secondary relative overflow-hidden">
      
      {/* Footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        
        {/* Column 1: Brand details */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-accent text-white shadow-md">
              <Zap className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              Core<span className="text-primary">Connect</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
            Core Connect Network LLC is a leading independent telecom comparison and consulting platform. We aggregate regional databases to advise home owners and businesses on the best connectivity packages.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Shield className="h-4 w-4 text-primary" />
            <span>Authorized Telecom Advisor ID: CCN-2026-991A</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-text-primary text-xs uppercase tracking-wider">
            Client Links
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <a href="#plans" className="hover:text-primary transition-colors">
                Residential Plans
              </a>
            </li>
            <li>
              <a href="#plans" className="hover:text-primary transition-colors">
                Business Connections
              </a>
            </li>
            <li>
              <a href="#checker" className="hover:text-primary transition-colors">
                ZIP Availability Checker
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-primary transition-colors">
                Advisory Protocol
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Partner Networks */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-text-primary text-xs uppercase tracking-wider">
            Partner Networks
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-1.5">
              <span>AT&T Fiber</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </li>
            <li className="flex items-center gap-1.5">
              <span>Spectrum Cable</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </li>
            <li className="flex items-center gap-1.5">
              <span>Verizon Fios</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </li>
            <li className="flex items-center gap-1.5">
              <span>Xfinity Internet</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter capture */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-text-primary text-xs uppercase tracking-wider">
            Telecom Bulletins
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Get notified of state rate updates, carrier contract purges, and local fiber expansion schedules.
          </p>

          {subscribed ? (
            <div className="p-3 bg-primary/5 rounded-xl text-xs text-primary font-semibold text-center animate-fade-in-up">
              Thanks! You've been subscribed.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="advisor@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-bg border border-border-custom px-3 py-2 text-xs rounded-lg text-text-primary placeholder:text-text-secondary/30 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white p-2 rounded-lg cursor-pointer"
                title="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Disclaimers & Disclosures */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border-custom pt-8">
        
        {/* Compliance Boilerplate */}
        <div className="text-[10px] text-text-secondary/60 leading-relaxed space-y-3 mb-8">
          <p>
            <strong>Advisory Disclaimer:</strong> Core Connect Network LLC is a privately owned and operated marketing platform. All trademarks, logos, and brand names of Spectrum, AT&T, Verizon, Xfinity, Frontier, EarthLink, Optimum, and Cox are the exclusive property of their respective owners. Mention of these services does not imply direct carrier endorsement, affiliation, or sponsorship. Actual connection speeds, latencies, and promotion availability vary by street address and technical parameters. All prices, terms, contract structures, and promo details listed are subject to final credit approval and carrier policy modifications.
          </p>
          <p>
            © {new Date().getFullYear()} Core Connect Network LLC. All rights reserved. Built for authorized marketing deployment.
          </p>
        </div>

        {/* Legal Linkages */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex gap-4">
            <span onClick={() => onChangePage?.("privacy")} className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span onClick={() => onChangePage?.("terms")} className="hover:text-primary cursor-pointer transition-colors">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Carrier Disclosures</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Globe className="h-4 w-4" />
            <span>North America Division (English)</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
