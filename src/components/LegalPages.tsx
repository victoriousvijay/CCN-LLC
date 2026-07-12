import { motion } from "motion/react";
import { ArrowLeft, Shield, Scale, FileText, Lock, Globe, CheckCircle } from "lucide-react";

interface LegalPageProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        {/* Header Block */}
        <div className="space-y-4 border-b border-border-custom pb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-secondary">
            Last updated: July 9, 2026 • Core Connect Network LLC
          </p>
        </div>

        {/* Body content */}
        <div className="prose prose-slate max-w-none text-text-secondary space-y-6 leading-relaxed">
          <p className="text-base text-text-primary font-medium">
            At Core Connect Network LLC ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and disclose your personal information when you use our platform to analyze and match telecommunications plans.
          </p>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">1</span>
              Information We Collect
            </h2>
            <p className="text-sm">
              We collect information that you voluntarily provide when checking broadband availability, submitting requests for connection quotes, or communicating with our team:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Contact Information:</strong> Name, physical installation address, email address, and phone number.</li>
              <li><strong>Technical Parameters:</strong> ZIP code, street coordinates, and current telecom carrier speeds or billing ranges.</li>
              <li><strong>Communication Records:</strong> Audio transcriptions, advisor chat logs, and submissions gathered via our AI Advisor chatbot interface.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">2</span>
              How We Use Your Information
            </h2>
            <p className="text-sm">
              We process your personal information based on legitimate business interests, contractual requirements, or your explicit authorization:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>To determine regional broadband plan availability based on your physical address coordinates.</li>
              <li>To connect you with certified advisors representing major national high-speed broadband and fiber networks.</li>
              <li>To evaluate local network metrics, handle technical diagnostics, and improve client lead management systems.</li>
              <li>To personalize interactive AI advisory assistance inside our dynamic chatbot platform.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">3</span>
              Information Sharing and Disclosures
            </h2>
            <p className="text-sm">
              Core Connect Network LLC does not sell your private contact details to independent cold-marketing lists. Your information is only shared under the following strict compliance conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Authorized Carriers:</strong> When you express interest in a plan, we submit details securely to the respective provider to finalize your physical connection eligibility and contract rates.</li>
              <li><strong>Legal Compliance:</strong> If required by state authorities, telecom regulations, or court subpoenas to protect safety or property.</li>
              <li><strong>Acquisition or Merger:</strong> In the event of an asset sale or merger, your profile remains bound by pre-existing protective privacy covenants.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">4</span>
              Data Protection and Retention
            </h2>
            <p className="text-sm">
              We employ military-grade AES-256 local database encryption and industry-standard security firewalls to store leads in our secure environment (`leads_db.json`). Personal data is only retained as long as necessary to complete your regional advisory consultation or satisfy regulatory tax-compliance rules.
            </p>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">5</span>
              Your Privacy Rights
            </h2>
            <p className="text-sm">
              Depending on your regional jurisdiction (such as CCPA/CPRA or equivalent state statutes), you maintain the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Request an audit report of all specific personal details we hold.</li>
              <li>Request immediate correction of inaccurate technical or contact information.</li>
              <li>Request the complete deletion and purging of all historical database submissions.</li>
            </ul>
            <p className="text-sm pt-1">
              To exercise these legal options, please utilize the automated chatbot or submit a direct regulatory query to <span className="text-primary font-semibold font-mono">privacy@coreconnectnetwork.com</span>.
            </p>
          </section>
        </div>

        {/* Closing trust stamp */}
        <div className="bg-card border border-border-custom p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-text-primary text-sm">Secure Advisory Guarantee</h4>
            <p className="text-xs text-text-secondary mt-0.5">
              Your submission data is safe under the Federal Trade Commission (FTC) marketing compliance standards.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function TermsAndConditions({ onBack }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        {/* Header Block */}
        <div className="space-y-4 border-b border-border-custom pb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-text-secondary">
            Last updated: July 9, 2026 • Core Connect Network LLC
          </p>
        </div>

        {/* Body content */}
        <div className="prose prose-slate max-w-none text-text-secondary space-y-6 leading-relaxed">
          <p className="text-base text-text-primary font-medium">
            Welcome to Core Connect Network LLC. By using our website, availability check modules, and interactive AI consultation tools, you agree to comply with and be bound by the following Terms & Conditions. Please read them thoroughly.
          </p>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">1</span>
              Agreement and Scope
            </h2>
            <p className="text-sm">
              These terms constitute a legally binding agreement between you ("User" or "Client") and Core Connect Network LLC ("Company"). If you do not agree with any section of these terms, you are requested to cease using our portal or submitting address availability inquiries.
            </p>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">2</span>
              Advisory Role and Disclaimer of Liability
            </h2>
            <p className="text-sm">
              Core Connect Network LLC operates as an independent, third-party marketing aggregator and telecom consulting platform. 
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>We consolidate national coverage mapping data to give users estimates of available speeds and rates at given addresses.</li>
              <li><strong>No Binding Quotes:</strong> All rates, contract structures, fees, and promotional details displayed are estimations based on regional data feeds and are subject to final carrier confirmation.</li>
              <li><strong>No Carrier Liability:</strong> We do not provide the physical fiber, cable, or mobile network infrastructure ourselves. All physical service performance, billing issues, installation delays, or hardware defects are strictly between you and the physical connection service provider.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">3</span>
              Acceptable Use and Account Security
            </h2>
            <p className="text-sm">
              By inputting information, you warrant that you are at least 18 years of age and that all submission details (such as your address, name, phone, and email) are authentic and belong strictly to you or you maintain direct permission to authorize consultation for that property. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Submit fraudulent contact details, fake addresses, or use automated scraper scripts to crawl our database structure.</li>
              <li>Attempt to reverse-engineer or breach the administrative lead dashboard (`leads_db.json`).</li>
              <li>Use the interactive AI Advisor chat to submit malicious commands, prompt injections, or spam.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">4</span>
              Intellectual Property Rights
            </h2>
            <p className="text-sm">
              The proprietary visual styling, logo combinations, 3D Canvas Globe rendering algorithms, custom comparative specifications logic, and system configurations are protected under domestic copyright, trademark, and patents laws of Core Connect Network LLC. You are prohibited from copying, distributing, or republishing our interactive assets without prior written consent.
            </p>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">5</span>
              Governing Law and Disputes
            </h2>
            <p className="text-sm">
              These Terms & Conditions shall be governed by, and construed in accordance with, the state legislation where Core Connect Network LLC is registered, without reference to conflict-of-law principles. Any legal complaints or arbitration filings relating directly to platform usage must be initiated exclusively in designated courts of proper jurisdiction.
            </p>
          </section>
        </div>

        {/* Closing statement */}
        <div className="bg-card border border-border-custom p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-text-primary text-sm">Regulatory Telecom Framework</h4>
            <p className="text-xs text-text-secondary mt-0.5">
              These conditions comply with FCC guidelines, the Telephone Consumer Protection Act (TCPA), and CAN-SPAM regulations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
