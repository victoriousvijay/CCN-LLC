export interface InternetPlan {
  id: string;
  name: string;
  provider: string;
  speed: string; // e.g., "300 Mbps" or "1 Gbps"
  speedMbps: number; // For filtering
  price: number;
  type: "home" | "business";
  technology: "Fiber" | "Cable" | "DSL" | "5G Home";
  features: string[];
  popular?: boolean;
  contract?: string;
  installation?: string;
  dataLimit?: string;
}

export interface Provider {
  name: string;
  logo: string;
  rating: number;
  tech: string[];
  coverageZIPs: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  verified: boolean;
  location: string;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "plans" | "installation" | "pricing" | "tech";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  zipCode: string;
  selectedPlanId?: string;
  serviceType: "Internet" | "TV" | "Phone" | "Bundle" | "Business";
  status: "new" | "contacted" | "completed";
  createdAt: string;
  notes?: string;
}
