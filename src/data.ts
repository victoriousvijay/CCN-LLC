import { InternetPlan, Provider, Testimonial, FAQItem } from "./types";

export const PROVIDERS_LIST: Provider[] = [
  {
    name: "Spectrum",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Spectrum_logo.svg",
    rating: 4.2,
    tech: ["Cable", "Fiber"],
    coverageZIPs: ["90001", "10001", "30301", "60601", "77001", "33101", "75201"]
  },
  {
    name: "AT&T",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/AT%26T_logo_2016.svg",
    rating: 4.6,
    tech: ["Fiber", "5G Home", "DSL"],
    coverageZIPs: ["90001", "30301", "77001", "75201", "33101", "60601", "85001"]
  },
  {
    name: "Verizon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Verizon_2015_logo.svg",
    rating: 4.7,
    tech: ["Fiber", "5G Home"],
    coverageZIPs: ["10001", "60601", "19101", "02101", "20001", "33101"]
  },
  {
    name: "Xfinity",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Xfinity_Logo.svg",
    rating: 4.3,
    tech: ["Cable", "Fiber"],
    coverageZIPs: ["10001", "60601", "02101", "94101", "98101", "80201", "19101"]
  },
  {
    name: "Frontier",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Frontier_Communications_logo.svg",
    rating: 4.1,
    tech: ["Fiber", "DSL"],
    coverageZIPs: ["90210", "33101", "75201", "90001", "85001"]
  },
  {
    name: "EarthLink",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Earthlink_Logo_new.png",
    rating: 4.4,
    tech: ["Fiber", "DSL", "Cable"],
    coverageZIPs: ["10001", "90001", "60601", "77001", "30301", "33101"]
  },
  {
    name: "Optimum",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Optimum_logo_current.svg",
    rating: 3.9,
    tech: ["Cable", "Fiber"],
    coverageZIPs: ["10001", "07001", "11701", "10501", "06801"]
  },
  {
    name: "Cox",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cox_Communications_logo.svg",
    rating: 4.0,
    tech: ["Cable", "Fiber"],
    coverageZIPs: ["85001", "92101", "89101", "70101", "67201", "23501"]
  }
];

export const INTERNET_PLANS: InternetPlan[] = [
  // Home Plans
  {
    id: "home-starter-fiber",
    name: "Essential Fiber 300",
    provider: "AT&T",
    speed: "300 Mbps",
    speedMbps: 300,
    price: 55,
    type: "home",
    technology: "Fiber",
    features: [
      "Equal upload & download speeds",
      "No data limits or overage charges",
      "Wi-Fi equipment included",
      "No annual contract required"
    ],
    popular: false,
    contract: "Month-to-month",
    installation: "Free self-install",
    dataLimit: "Unlimited"
  },
  {
    id: "home-value-cable",
    name: "Spectrum Internet 500",
    provider: "Spectrum",
    speed: "500 Mbps",
    speedMbps: 500,
    price: 49.99,
    type: "home",
    technology: "Cable",
    features: [
      "Up to 500 Mbps download speed",
      "Free modem + antivirus software",
      "No contracts or data caps",
      "Free access to nationwide out-of-home Wi-Fi hotspots"
    ],
    popular: true,
    contract: "Month-to-month",
    installation: "Professional or Self-install ($19.99)",
    dataLimit: "Unlimited"
  },
  {
    id: "home-super-fiber",
    name: "Fios Gigabit Plan",
    provider: "Verizon",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 89.99,
    type: "home",
    technology: "Fiber",
    features: [
      "Near-symmetrical gigabit speeds",
      "4-year price guarantee",
      "Premium router with whole-home coverage included",
      "Ideal for 10+ devices, gaming, and 4K streaming"
    ],
    popular: true,
    contract: "Month-to-month",
    installation: "Free setup online",
    dataLimit: "Unlimited"
  },
  {
    id: "home-ultra-fiber",
    name: "Hyper-Gig 2.0",
    provider: "AT&T",
    speed: "2 Gbps",
    speedMbps: 2000,
    price: 110,
    type: "home",
    technology: "Fiber",
    features: [
      "Symmetrical 2 Gbps speeds",
      "Next-gen Wi-Fi 6E gateway included",
      "Low latency for ultra-gaming & large file transfers",
      "Unlimited data on AT&T ActiveArmor security"
    ],
    popular: false,
    contract: "Month-to-month",
    installation: "Free professional install",
    dataLimit: "Unlimited"
  },
  {
    id: "home-basic-cable",
    name: "Connect More 150",
    provider: "Xfinity",
    speed: "150 Mbps",
    speedMbps: 150,
    price: 29.99,
    type: "home",
    technology: "Cable",
    features: [
      "Great for 1-3 devices",
      "12-month promo pricing",
      "Flexible self-install option",
      "Access to millions of Xfinity Wi-Fi hotspots"
    ],
    popular: false,
    contract: "1-Year Agreement",
    installation: "Self-install ($0) or Pro ($39.99)",
    dataLimit: "1.2 TB (Unlimited upgrade available)"
  },
  {
    id: "home-unlimited-5g",
    name: "5G Home Internet Plus",
    provider: "Verizon",
    speed: "300 Mbps",
    speedMbps: 300,
    price: 45,
    type: "home",
    technology: "5G Home",
    features: [
      "No lines to install, instant setup",
      "Consistent 300 Mbps wireless speed",
      "Free 5G receiver and Wi-Fi hub",
      "Discounted with Verizon Mobile Unlimited plans"
    ],
    popular: false,
    contract: "Month-to-month",
    installation: "Self-setup in 5 minutes",
    dataLimit: "Unlimited"
  },

  // Business Plans
  {
    id: "business-starter-fiber",
    name: "Business Fiber 300",
    provider: "Frontier",
    speed: "300 Mbps",
    speedMbps: 300,
    price: 69.99,
    type: "business",
    technology: "Fiber",
    features: [
      "Symmetrical fiber speed",
      "1 Dynamic IP address included",
      "Business-class 24/7 service support",
      "99.9% uptime SLA guarantee"
    ],
    popular: false,
    contract: "1 or 2-Year Contract",
    installation: "Professional business installation",
    dataLimit: "Unlimited"
  },
  {
    id: "business-growth-cable",
    name: "Spectrum Business Internet 1G",
    provider: "Spectrum",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 139.99,
    type: "business",
    technology: "Cable",
    features: [
      "Gigabit download, 35 Mbps upload",
      "Free business router + wireless backup option",
      "No data limits or overages",
      "Dedicated 24/7 commercial tech support"
    ],
    popular: true,
    contract: "Month-to-month",
    installation: "$99.99 setup fee",
    dataLimit: "Unlimited"
  },
  {
    id: "business-enterprise-fiber",
    name: "Elite Business Fiber 1G",
    provider: "AT&T",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 175,
    type: "business",
    technology: "Fiber",
    features: [
      "Symmetrical 1 Gbps fiber lines",
      "5 Static IPs included for server hosting",
      "Premium SLA with guaranteed 4-hour MTTR (Mean Time to Repair)",
      "Cybersecurity threat blocking and DNS shield"
    ],
    popular: true,
    contract: "2-Year Agreement",
    installation: "Free enterprise setup",
    dataLimit: "Unlimited"
  },
  {
    id: "business-premium-fios",
    name: "Fios Business Gigabit",
    provider: "Verizon",
    speed: "940 Mbps",
    speedMbps: 940,
    price: 129.99,
    type: "business",
    technology: "Fiber",
    features: [
      "Symmetrical fiber-optic performance",
      "Optimized for running POS, cloud apps & heavy transfers",
      "Dynamic Wi-Fi range extender included",
      "Exclusive Verizon Business Rewards perks"
    ],
    popular: false,
    contract: "1-Year Agreement",
    installation: "Free setup with online signup",
    dataLimit: "Unlimited"
  }
];

export const TESTIMONIALS_LIST: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "Freelance Creative Director",
    content: "Core Connect Network helped me compare 4 different fiber providers in my neighborhood. I selected AT&T Fiber 1G, and their comparison tool saved me at least $30 a month while getting twice the speed I had before. Genuinely outstanding advisor!",
    rating: 5,
    verified: true,
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t2",
    name: "Michael Chen",
    role: "Co-Founder, Slate Studio",
    content: "We needed dedicated enterprise connection with reliable static IPs for our small design agency. Core Connect's business advisors laid out all options side-by-side and secured us an exclusive rate with Verizon Business Fios. 10/10 experience.",
    rating: 5,
    verified: true,
    location: "Boston, MA",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t3",
    name: "Elena Rodriguez",
    role: "WFH Financial Analyst",
    content: "As someone working with large data models from home, stable latency is critical. I used the ZIP checker and found Xfinity Cable wasn't my only option—Spectrum had Fiber nearby! The installation was set up in minutes. Highly recommend checking before buying.",
    rating: 5,
    verified: true,
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t4",
    name: "David Vance",
    role: "Father of Three & Streamer",
    content: "Our household streams in 4K on multiple screens while I stream gaming on Twitch. Core Connect advised us on Cox's Gigabit Bundle. Savings are real, and no hidden fees cropped up. It was exactly as quoted.",
    rating: 4,
    verified: true,
    location: "Phoenix, AZ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
];

export const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does Core Connect Network determine available plans in my area?",
    answer: "We partner directly with leading national telecom carriers (including AT&T, Spectrum, Verizon, and Xfinity) to aggregate real-time coverage databases. When you enter your address or ZIP code, we check active cable routes, fiber lines, and wireless transmitter ranges to deliver precise, available offerings at your specific door.",
    category: "plans"
  },
  {
    id: "faq-2",
    question: "Are the prices shown on Core Connect the same as buying directly from the provider?",
    answer: "Yes, and often lower! Because of our wholesale agreements and advisory partnerships, we present official retail rates alongside exclusive promotions and bundles that you might not find directly on public provider sites. We never add hidden service markups or consulting fees.",
    category: "pricing"
  },
  {
    id: "faq-3",
    question: "What is the difference between Fiber and Cable internet?",
    answer: "Fiber uses glass fibers to transmit data via light, resulting in symmetrical speeds (equal download and upload) and extremely low, stable latency. Cable uses coaxial lines which can deliver high download speeds (up to 1 Gbps), but upload speeds are typically limited to 35-50 Mbps. Fiber is the superior choice for gaming, video calling, and constant cloud backups.",
    category: "tech"
  },
  {
    id: "faq-4",
    question: "Do I have to sign an annual contract to get these deals?",
    answer: "Many modern providers have moved to monthly billing with zero contracts (like Spectrum and AT&T Fiber). However, some promotions from Xfinity or business connections from Frontier still utilize 1-year or 2-year service agreements in exchange for fixed pricing guarantees. We explicitly highlight contract status on every single plan card.",
    category: "plans"
  },
  {
    id: "faq-5",
    question: "How long does installation take once I request a plan?",
    answer: "If your address already has active lines, many providers can ship a Self-Installation Kit which arrives in 2-3 business days and takes under 15 minutes to configure. If a professional technician is required to run new fiber or coaxial cables, appointments are typically scheduled within 48 to 72 hours of your submission.",
    category: "installation"
  }
];
