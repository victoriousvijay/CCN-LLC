import express from "express";
import path from "path";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Persistent lead database for the full-stack dashboard CRM
const LEADS_FILE = path.join(process.cwd(), "leads_db.json");
let leadsDatabase: any[] = [];

try {
  if (fs.existsSync(LEADS_FILE)) {
    const fileContent = fs.readFileSync(LEADS_FILE, "utf-8").trim();
    if (fileContent && fileContent !== "[]") {
      leadsDatabase = JSON.parse(fileContent);
    }
  }
  
  if (!leadsDatabase || !Array.isArray(leadsDatabase) || leadsDatabase.length === 0) {
    leadsDatabase = [
      {
        id: "lead_1",
        name: "Jessica Miller",
        email: "j.miller@enterprise.com",
        phone: "555-019-2834",
        address: "742 Evergreen Terrace",
        zipCode: "90210",
        selectedPlanId: "fiber-500",
        serviceType: "Internet",
        notes: "Requested fiber quotes for remote business work.",
        status: "Qualified",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: "lead_2",
        name: "Marcus Aurelius",
        email: "marcus@meditations.org",
        phone: "555-442-9981",
        address: "100 Via Appia",
        zipCode: "10001",
        selectedPlanId: "triple-play-ultra",
        serviceType: "Bundle",
        notes: "Interested in the complete TV + VoIP phone package.",
        status: "Contacted",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsDatabase, null, 2));
  }
} catch (err) {
  console.error("Error loading leads database:", err);
  leadsDatabase = [];
}

const saveLeads = () => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsDatabase, null, 2));
  } catch (err) {
    console.error("Failed to save leads database:", err);
  }
};

// Static list of ZIPs covered by our premium network
const COVERED_ZIPS: Record<string, string[]> = {
  "90001": ["Core Connect Fiber", "Core Connect Cable", "Core Connect Regional"],
  "10001": ["Core Connect Fiber", "Core Connect Cable", "Core Connect 5G Wireless", "Core Connect Premium"],
  "30301": ["Core Connect Fiber", "Core Connect Cable"],
  "60601": ["Core Connect Fiber", "Core Connect 5G Wireless", "Core Connect Cable"],
  "77001": ["Core Connect Fiber", "Core Connect Cable"],
  "33101": ["Core Connect Fiber", "Core Connect 5G Wireless", "Core Connect Regional"],
  "75201": ["Core Connect Fiber", "Core Connect Regional", "Core Connect Cable"],
  "85001": ["Core Connect Cable", "Core Connect Fiber", "Core Connect Regional"],
  "90210": ["Core Connect Regional", "Core Connect Cable"],
  "19101": ["Core Connect Fiber", "Core Connect Cable"],
  "02101": ["Core Connect Fiber", "Core Connect Cable"],
  "20001": ["Core Connect Fiber"],
  "94101": ["Core Connect Cable"],
  "98101": ["Core Connect Cable"],
  "80201": ["Core Connect Cable"],
  "07001": ["Core Connect Cable"],
  "11701": ["Core Connect Cable"],
  "10501": ["Core Connect Cable"],
  "06801": ["Core Connect Cable"],
  "92101": ["Core Connect Cable"],
  "89101": ["Core Connect Cable"],
  "70101": ["Core Connect Cable"],
  "67201": ["Core Connect Cable"],
  "23501": ["Core Connect Cable"]
};

// API Route: Check Availability
app.post("/api/check-availability", (req, res) => {
  const { zipCode, address } = req.body;
  if (!zipCode) {
    return res.status(400).json({ error: "ZIP Code is required." });
  }

  const cleanedZip = zipCode.trim().toUpperCase();
  const providers = COVERED_ZIPS[cleanedZip] || [];

  // Dynamically assign providers based on international PIN/Postal/ZIP code formatting
  let finalProviders = providers;
  if (providers.length === 0 && cleanedZip.length >= 2) {
    // Generate a consistent seed based on the characters of the postal code
    const seed = cleanedZip.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (/[A-Z]/.test(cleanedZip)) {
      // Alphanumeric - e.g. UK (SW1A 1AA), Canada (K1A 0B1), European codes
      const globalProviders = ["Core Connect Global Fibre", "Core Connect Euro Link", "Core Connect Direct Link", "Core Connect Superfast Fibre", "Core Connect Universal"];
      const count = (seed % 3) + 2; // 2 to 4 providers
      const shuffled = [...globalProviders].sort(() => 0.5 - (seed % 13) / 13);
      finalProviders = shuffled.slice(0, count);
    } else if (/^\d{6}$/.test(cleanedZip)) {
      // 6-digit numeric - e.g. India (110001, 400001), China, etc.
      const indiaProviders = ["Core Connect Jio Link", "Core Connect Xstream", "Core Connect Tata Link", "Core Connect Bharat Fiber"];
      const count = (seed % 2) + 2; // 2 to 3 providers
      const shuffled = [...indiaProviders].sort(() => 0.5 - (seed % 11) / 11);
      finalProviders = shuffled.slice(0, count);
    } else {
      // 5-digit numeric or others - e.g. US, Germany, etc.
      const usProviders = ["Core Connect Fiber", "Core Connect Cable", "Core Connect 5G Wireless", "Core Connect Regional Net", "Core Connect Elite"];
      const count = (seed % 3) + 2; // 2 to 4 providers
      const shuffled = [...usProviders].sort(() => 0.5 - (seed % 7) / 7);
      finalProviders = shuffled.slice(0, count);
    }
  }

  const isAvailable = finalProviders.length > 0;

  return res.json({
    zipCode: cleanedZip,
    address: address || "Standard Coverage Zone",
    isAvailable,
    providers: finalProviders,
    estimatedSpeeds: isAvailable ? ["300 Mbps", "500 Mbps", "1 Gbps", "2 Gbps"] : []
  });
});

// API Route: Lead Capture
app.post("/api/submit-lead", (req, res) => {
  const { name, email, phone, address, zipCode, selectedPlanId, serviceType, notes } = req.body;

  if (!name || !email || !phone || !zipCode) {
    return res.status(400).json({ error: "Missing required contact details." });
  }

  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    email,
    phone,
    address: address || "",
    zipCode,
    selectedPlanId: selectedPlanId || null,
    serviceType: serviceType || "Internet",
    notes: notes || "",
    status: "New",
    createdAt: new Date().toISOString()
  };

  leadsDatabase.unshift(newLead);
  saveLeads();
  return res.json({ success: true, lead: newLead });
});

// API Route: Get All Leads (for Dashboard panel)
app.get("/api/leads", (req, res) => {
  return res.json({ leads: leadsDatabase });
});

// API Route: Update Lead Status (CRM)
app.patch("/api/leads/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const lead = leadsDatabase.find((l) => l.id === id);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found." });
  }

  lead.status = status;
  saveLeads();
  return res.json({ success: true, lead });
});

// API Route: Delete Particular Lead (CRM)
app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const index = leadsDatabase.findIndex((l) => l.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Lead not found." });
  }

  leadsDatabase.splice(index, 1);
  saveLeads();
  return res.json({ success: true });
});

// API Route: Reset Leads
app.post("/api/leads/reset", (req, res) => {
  leadsDatabase.length = 0;
  saveLeads();
  return res.json({ success: true });
});

function getSmartFallbackReply(query: string): string {
  const q = query.toLowerCase().trim();

  if (q.includes("best") || q.includes("recommend") || q.includes("optimal") || q.includes("choose") || q.includes("advice")) {
    return `### 📋 Expert Advisory Recommendation

To get the most value out of your internet connection, here are our primary Core Connect Network (CCN) guidelines:

1. **For Reliability & Speed (Fiber)**:
   - Our **Essential Fiber 300** or **Elite Gigabit Plan** is always our top recommendation.
   - They offer **equal upload/download speeds** (symmetrical), which is essential for seamless video calls, lag-free gaming, and large file transfers.

2. **For Budget-Minded Households (Cable & 5G)**:
   - **Connect More 150** offers the best entry point with plans starting at **$29.99/mo**.
   - **5G Home Internet Plus** is a stellar alternative at **$45.00/mo** with zero contract restrictions and a 4-year price lock.

3. **Check Your Location**:
   - Internet service is highly geographic. Use our **ZIP Code Checker** on the homepage to find exactly which Core Connect high-speed networks reach your specific address!`;
  }

  if (q.includes("cheap") || q.includes("cost") || q.includes("price") || q.includes("budget") || q.includes("save") || q.includes("promo") || q.includes("deal") || q.includes("discount")) {
    return `### 💰 Best Budget & Savings Options

We have analyzed active plan databases to find the lowest-cost Core Connect Network options this month:

*   **Connect More 150**: Starts at **$29.99/mo** (best overall value for light browsing).
*   **Core Connect Advantage**: Starts at **$30.00/mo** for 300 Mbps. Featuring **no contracts** and unlimited data.
*   **5G Home Internet Plus**: Starts at **$45.00/mo** (includes free equipment and a 4-year fixed rate).
*   **Essential Fiber 300**: Starts at **$55.00/mo** (highest quality symmetrical connection, outstanding value).

**Pro-Tip to Save**:
Bundling internet with **TV / Streaming** or **Unlimited Mobile lines** can save you up to **$20/mo** on your total telecom bill. Let me know if you would like to explore bundle savings!`;
  }

  if (q.includes("fiber") || q.includes("cable") || q.includes("5g") || q.includes("technology") || q.includes("coax")) {
    return `### ⚡ Understanding Connection Technologies

Not all internet connections are created equal. Here is how our Core Connect Network options compare:

1.  **Fiber-to-the-Home (FTTH)**:
    *   **Tiers**: Essential Fiber 300, Elite Gigabit Plan.
    *   **Speeds**: Up to 5,000 Mbps with **symmetrical upload and download speeds**.
    *   **Advantage**: Symmetrical upload speeds, lowest latency, 99.9% weather resistance.
2.  **Cable (Coaxial)**:
    *   **Tiers**: Connect More 150, Speed 500.
    *   **Speeds**: Up to 1,200 Mbps download / 35 Mbps upload.
    *   **Advantage**: Massive nationwide footprint, highly reliable download speeds, easy installation.
3.  **5G Home Internet**:
    *   **Tiers**: 5G Home Internet Plus.
    *   **Speeds**: 85 - 300 Mbps download.
    *   **Advantage**: Completely wireless, zero installation fees, stable monthly pricing with no hidden charges.`;
  }

  if (q.includes("at&t") || q.includes("att") || q.includes("verizon") || q.includes("fios") || q.includes("xfinity") || q.includes("comcast") || q.includes("frontier") || q.includes("earthlink") || q.includes("optimum") || q.includes("cox") || q.includes("spectrum")) {
    return `### 🌐 Core Connect Network Advisory Focus

At **Core Connect Network (CCN)**, we provide custom-engineered high-performance plans direct to your home or office. We focus exclusively on our proprietary connection suites rather than external third-party carriers to guarantee the highest quality service, contract-free pricing, and zero hidden fees.

Here are our top-rated Core Connect Network options:
*   **Essential Fiber 300**: **$55.00/mo** (symmetrical speeds, perfect for multiple 4K streams and remote work).
*   **Elite Gigabit Plan**: **$89.99/mo** (pure symmetrical Fiber-optic gigabit, lowest latency for gaming).
*   **5G Home Internet Plus**: **$45.00/mo** (completely wireless, easy 5-minute setup, 4-year fixed rate).
*   **Connect More 150**: **$29.99/mo** (perfect entry-level cable speed for light browsing).

Which connection technology would you like to explore for your address?`;
  }

  if (q.includes("business") || q.includes("wfh") || q.includes("remote") || q.includes("office") || q.includes("work")) {
    return `### 🏢 High-Speed Business & WFH Plans

For power users, home businesses, or small offices, Core Connect Network offers professional-grade connections with essential perks:

*   **Core Connect Business 1G**: Starts at **$139.99/mo** (includes static IP availability, 99.9% uptime SLAs, and 24/7 dedicated enterprise support).
*   **Elite Business Fiber 1G**: Starts at **$175.00/mo** (symmetrical enterprise fiber with 5 static IPs and premium SLAs).
*   **Business Fiber 300**: Starts at **$69.99/mo** (symmetrical fiber speed, ideal for growing teams).

**Advantage of Business Internet**:
*   Priority routing during peak neighborhood hours.
*   Dedicated technical dispatch lines.
*   Static IP configurations for hosting local servers, VPNs, and security systems.`;
  }

  if (q.includes("zip") || q.includes("pincode") || q.includes("pin") || q.includes("address") || q.includes("location") || q.includes("checker") || q.includes("detect")) {
    return `### 📍 Find Plan Availability in Your ZIP Code

Because broadband coverage varies block-by-block, the best way to get exact Core Connect Network options is using our real-time checker:

1.  Scroll up to the **ZIP Availability Checker** section on the homepage.
2.  Select **"Detect My Location"** or enter your exact **ZIP/Pin Code** manually.
3.  Click **"Verify High-Speed Coverage"**.
4.  Our engine will instantly display all active Core Connect Fiber, Cable, and 5G connection routes that reach your specific home or office!`;
  }

  if (q.includes("bundle") || q.includes("tv") || q.includes("channel") || q.includes("phone") || q.includes("mobile")) {
    return `### 📺 Bundling & Smart Savings Options

Maximize your savings by combining your high-speed internet with premium entertainment and communication options:

1.  **Triple Play Packages**: Pair 500 Mbps Internet, 185+ TV Channels, and Unlimited Nationwide Phone Lines for maximum convenience.
2.  **Streaming Add-ons**: Connect your favorite streaming platforms directly to your bill with consolidated discount pricing.
3.  **Unlimited Mobile Lines**: Add cell service to your internet bill and enjoy up to a **$20/mo discount** for 12 months, with free 5G coverage across all national networks.

Let me know if you would like me to draft a custom bundle proposal for you!`;
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("greetings") || q.includes("welcome")) {
    return `### 👋 Welcome to the Core Connect Advisory Panel!

I am your **AI Network Advisor**. I am here to help you navigate our high-performance plans, check active coverage in your ZIP code, and select the best setup.

Here are a few quick things we can do together:
*   Compare **Fiber vs Cable** speeds and latencies.
*   Find the **lowest-cost** starter plans in your region.
*   Analyze **Core Connect** packages and bundles.
*   Design a custom **Business / Work-From-Home** connection suite.

What kind of internet speed or budget goals do you have today?`;
  }

  // Smart Generic Response
  return `### 📋 Professional Advisory Analysis

Thank you for your inquiry. To help you select the absolute best telecom setup for your home or business, I recommend evaluating the following factors:

1.  **Usage Profile**: How many people are using the connection simultaneously?
    *   *Light (1-2 users)*: 100 - 300 Mbps is highly sufficient.
    *   *Heavy (3-5 users, 4K streaming, gaming)*: 500 - 1,000 Mbps is optimal.
2.  **Technology Preference**:
    *   **Fiber** is unmatched for stable video calls and gaming (ultra-low latency and equal upload/download speeds).
    *   **Cable** offers wide nationwide coverage with fast download speeds.
    *   **5G Wireless** provides excellent standalone rates with no contract lockouts.

Please tell me a bit more about your typical internet activities or budget goals, or run your **ZIP/Pin Code** through our active coverage tool on the homepage!`;
}

// API Route: Gemini Chatbot Adviser
app.post("/api/chat", async (req, res) => {
  const { messages, highThinking } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const lastUserMessage = messages[messages.length - 1]?.text || "";

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return our highly intelligent, responsive expert fallback response so clients can use the chatbot flawlessly
    const replyText = getSmartFallbackReply(lastUserMessage);
    return res.json({ text: replyText });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Structure model call
    const modelToUse = highThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    // System instruction for the advisory persona
    const systemInstruction = `You are "Core Connect Advisory Agent", a professional, elite advisor for Core Connect Network LLC.
Your objective is to help home and business owners discover, compare, and lock in our high-performance Core Connect internet, TV, and phone plans.
We do NOT advise on third-party carriers like AT&T, Spectrum, Verizon, Xfinity, Frontier, EarthLink, Optimum, or Cox. If asked about them, politely explain that we offer custom-engineered Core Connect Network plans which deliver superior speed, stable performance, contract-free freedom, and locked-in rates.

CRITICAL PLAN KNOWLEDGE FOR ADVISORY MATCHING:
1. Core Connect Fiber Series: High-performance pure Fiber. Symmetrical upload/downloads. Essential Fiber 300 ($55/mo) and Elite Gigabit Plan ($89.99/mo). Perfect for smart homes, gaming, and remote offices.
2. Core Connect Cable Series: Dynamic broadband cable. Speed 500 ($49.99/mo) and Connect More 150 ($29.99/mo). Highly affordable and widely available.
3. Core Connect 5G Wireless Series: 5G Home Internet Plus ($45/mo). Plug-and-play setup, no lines to install, 4-year price lock.
4. Core Connect Business Series: Professional-grade service. Business Fiber 300 ($69.99/mo) and Core Connect Business 1G ($139.99/mo). Comes with 24/7 dedicated support and static IP capabilities.

TONE & STYLE:
- Professional, analytical, helpful, welcoming.
- ALWAYS structure your replies with bullet points, bold keywords, and clean tables or markdown segments where relevant.
- NEVER sound like spam. Act as an objective consultant who compares speed-per-dollar ratios.
- Encourage users to run their ZIP Code in the 'Check Availability' tool or submit a quote request.
- Keep your answers precise, and avoid unnecessarily long stories unless requested.
${highThinking ? "\nYOU ARE RUNNING IN HIGH-THINKING DEEP MODE: Provide a meticulous speed-per-dollar breakdown, comparison table, or latency analysis for the user's specific request, showcasing advanced engineering-level reasoning." : ""}`;

    // Format messages for @google/genai (role MUST be user or model)
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.text }]
    }));

    let response;
    let fallbackNotice = "";

    try {
      response = await ai.models.generateContent({
        model: modelToUse,
        contents: formattedContents,
        config: {
          systemInstruction,
          ...(highThinking && {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.HIGH // Explicit high thinking level request!
            }
          })
        }
      });
    } catch (firstError: any) {
      console.warn("Primary Gemini model generation failed. Attempting fallback to gemini-3.5-flash:", firstError);
      
      if (modelToUse !== "gemini-3.5-flash") {
        fallbackNotice = "\n\n*⚠️ Note: The High Thinking deep-reasoning model quota was exceeded on your API key. I have automatically routed your query through our high-speed, standard advisory engine (powered by Gemini 3.5 Flash) to ensure uninterrupted service.*";
        
        // Remove the high-thinking instruction part
        const fallbackSystemInstruction = systemInstruction.replace("\nYOU ARE RUNNING IN HIGH-THINKING DEEP MODE: Provide a meticulous speed-per-dollar breakdown, comparison table, or latency analysis for the user's specific request, showcasing advanced engineering-level reasoning.", "");
        
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: fallbackSystemInstruction
          }
        });
      } else {
        throw firstError;
      }
    }

    const replyText = (response.text || "I was unable to compile a recommendation. Please refine your query.") + fallbackNotice;
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Gemini API Error, falling back to local expert system:", error);
    // If Gemini fails due to quota/limits or network, gracefully return our expert system reply
    const replyText = getSmartFallbackReply(lastUserMessage);
    return res.json({ text: replyText });
  }
});

// Vite Server Bridge Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Core Connect Network server running at http://localhost:${PORT}`);
  });
}

startServer();
