import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Phone, Zap, Shield, ArrowRight } from "lucide-react";

interface NavbarProps {
  onToggleChat: () => void;
  activePage: string;
  onChangePage: (page: string) => void;
}

export default function Navbar({ onToggleChat, activePage, onChangePage }: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Force default light theme to come first when opening the website
    setTheme("light");
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.body.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-custom bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { onChangePage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-accent text-white shadow-md shadow-primary/20">
            <Zap className="h-5 w-5" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-primary to-accent opacity-30 blur-sm animate-pulse" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              Core<span className="text-primary">Connect</span>
            </span>
            <span className="block text-[9px] font-semibold tracking-wider uppercase text-text-secondary">
              Networks LLC
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onChangePage("home")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "home" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onChangePage("plans")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "plans" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => onChangePage("checker")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "checker" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Check Availability
          </button>
          <button
            onClick={() => onChangePage("services")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "services" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onChangePage("how-it-works")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "how-it-works" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onChangePage("faq")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "faq" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => onChangePage("leads")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === "leads" ? "text-primary font-bold underline decoration-2 decoration-primary" : "text-text-secondary hover:text-primary"
            }`}
          >
            Advisory Leads
          </button>
        </nav>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border-custom p-2.5 hover:bg-card text-text-secondary transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Assistant Chat Access */}
          <button
            onClick={onToggleChat}
            className="relative flex items-center gap-2 rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            AI Advisor
          </button>

          {/* Phone Action */}
          <a
            href="tel:+18557443810"
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"
          >
            <Phone className="h-4 w-4" />
            <span>+1-855-744-3810</span>
          </a>
        </div>

        {/* Mobile menu and triggers */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border-custom p-2 hover:bg-card text-text-secondary"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* AI Advisor Mobile Icon */}
          <button
            onClick={onToggleChat}
            className="rounded-xl border border-primary/20 p-2 text-primary"
            title="AI Advisor"
          >
            <Zap className="h-4.5 w-4.5" />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-border-custom p-2 text-text-secondary hover:bg-card"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-custom bg-card px-4 py-6 space-y-4 animate-fade-in-up">
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => { onChangePage("home"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "home" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Home
            </button>
            <button
              onClick={() => { onChangePage("plans"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "plans" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Internet Plans
            </button>
            <button
              onClick={() => { onChangePage("checker"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "checker" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Check Availability
            </button>
            <button
              onClick={() => { onChangePage("services"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "services" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              Services Grid
            </button>
            <button
              onClick={() => { onChangePage("how-it-works"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "how-it-works" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              How It Works
            </button>
            <button
              onClick={() => { onChangePage("faq"); setMobileMenuOpen(false); }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "faq" ? "text-primary font-bold" : "text-text-secondary hover:text-primary"}`}
            >
              FAQ
            </button>
            <button
              onClick={() => {
                onChangePage("leads");
                setMobileMenuOpen(false);
              }}
              className={`text-left text-base font-medium transition-colors cursor-pointer ${activePage === "leads" ? "text-primary font-bold underline decoration-2 decoration-primary" : "text-text-secondary hover:text-primary"}`}
            >
              Advisory Leads Dashboard
            </button>
          </nav>

          <hr className="border-border-custom" />

          <div className="flex flex-col gap-3">
            <a
              href="tel:+18557443810"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-md"
            >
              <Phone className="h-4 w-4" />
              <span>Call +1-855-744-3810</span>
            </a>
            <button
              onClick={() => {
                onToggleChat();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 py-3 text-base font-semibold text-primary"
            >
              <Zap className="h-4.5 w-4.5 text-accent" />
              <span>Launch Gemini Advisor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
