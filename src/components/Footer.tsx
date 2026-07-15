import { useState, FormEvent } from "react";
import { Zap, Mail, ArrowRight, Shield, Globe, ExternalLink, MapPin, Phone } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
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
            CoreConnect Networks LLC is a leading independent telecom comparison and consulting platform. We aggregate regional databases to advise home owners and businesses on the best connectivity packages.
          </p>
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

        {/* Column 3: Contact Details */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-text-primary text-xs uppercase tracking-wider">
            Company Contact
          </h4>
          <ul className="space-y-3.5 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                CoreConnect Networks LLC<br />
                68 Harrison Ave Ste 605<br />
                Boston, MA 02111-1929
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href="mailto:info@coreconnectnet.com" className="hover:text-primary transition-colors">
                info@coreconnectnet.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:+18557443810" className="hover:text-primary transition-colors">
                +1-855-744-3810
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Disclaimers & Disclosures */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-border-custom pt-8">
        
        {/* Compliance Boilerplate */}
        <div className="text-[10px] text-text-secondary/60 leading-relaxed space-y-3 mb-8">
          <p>
            <strong>Advisory Disclaimer:</strong> CoreConnect Networks LLC is a privately owned and operated marketing platform. All trademarks, logos, and brand names of national and regional telecom carriers are the exclusive property of their respective owners. Mention of services does not imply direct carrier endorsement, affiliation, or sponsorship. Actual connection speeds, latencies, and promotion availability vary by street address and technical parameters. All prices, terms, contract structures, and promo details listed are subject to final credit approval and carrier policy modifications.
          </p>
          <p>
            © {new Date().getFullYear()} CoreConnect Networks LLC. All rights reserved. Built for authorized marketing deployment.
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
