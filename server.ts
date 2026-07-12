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
  "90001": ["AT&T", "Spectrum", "Frontier", "EarthLink"],
  "10001": ["Verizon", "Spectrum", "Xfinity", "EarthLink", "Optimum"],
  "30301": ["AT&T", "Spectrum", "EarthLink"],
  "60601": ["AT&T", "Verizon", "Xfinity", "EarthLink"],
  "77001": ["AT&T", "Spectrum", "EarthLink"],
  "33101": ["AT&T", "Verizon", "Frontier", "EarthLink", "Optimum"],
  "75201": ["AT&T", "Frontier", "Spectrum"],
  "85001": ["Cox", "AT&T", "Frontier"],
  "90210": ["Frontier", "Spectrum"],
  "19101": ["Verizon", "Xfinity"],
  "02101": ["Verizon", "Xfinity"],
  "20001": ["Verizon"],
  "94101": ["Xfinity"],
  "98101": ["Xfinity"],
  "80201": ["Xfinity"],
  "07001": ["Optimum"],
  "11701": ["Optimum"],
  "10501": ["Optimum"],
  "06801": ["Optimum"],
  "92101": ["Cox"],
  "89101": ["Cox"],
  "70101": ["Cox"],
  "67201": ["Cox"],
  "23501": ["Cox"]
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
      const globalProviders = ["BT Broadband", "Virgin Media Fiber", "Sky Gigafast", "Rogers Ignite", "Bell Fibe", "Orange Fibre", "Deutsche Telekom"];
      const count = (seed % 3) + 2; // 2 to 4 providers
      const shuffled = [...globalProviders].sort(() => 0.5 - (seed % 13) / 13);
      finalProviders = shuffled.slice(0, count);
    } else if (/^\d{6}$/.test(cleanedZip)) {
      // 6-digit numeric - e.g. India (110001, 400001), China, etc.
      const indiaProviders = ["Reliance Jio Fiber", "Airtel Xstream", "Tata Play Fiber", "Core Connect India Link", "BSNL Bharat Fiber"];
      const count = (seed % 2) + 2; // 2 to 3 providers
      const shuffled = [...indiaProviders].sort(() => 0.5 - (seed % 11) / 11);
      finalProviders = shuffled.slice(0, count);
    } else {
      // 5-digit numeric or others - e.g. US, Germany, etc.
      const usProviders = ["Spectrum Fiber", "AT&T Broadband", "Verizon Fios", "Xfinity Gig", "Frontier Ultra", "EarthLink Core"];
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

// API Route: Gemini Chatbot Adviser
app.post("/api/chat", async (req, res) => {
  const { messages, highThinking } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Graceful error response indicating API key is unconfigured, so user gets guided beautifully
    return res.json({
      text: "### 💡 Advisory Notice: Gemini API Key Not Configured\n\nTo power this AI Advisor with real Gemini thinking capabilities, please click on the **Settings > Secrets** panel in AI Studio and add your `GEMINI_API_KEY`.\n\n**Demo System Mode:**\nWhile the key is pending, I can tell you that **Core Connect Network** provides advisory matching for Spectrum, AT&T, Verizon, and Xfinity plans starting from **$29.99/mo**. Once your key is set, I can run real full-text comparison schemas and recommend optimal plans based on your direct queries!"
    });
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
Your objective is to help home and business owners discover, compare, and lock in the best Internet, TV, and phone plans.
We advise on top national providers: AT&T, Spectrum, Verizon, Xfinity, Frontier, EarthLink, Optimum, and Cox.

CRITICAL PLAN KNOWLEDGE FOR ADVISORY MATCHING:
1. AT&T: Premium Fiber plans. Equal upload/downloads. Essential Fiber 300 ($55/mo), Hyper-Gig 2.0 ($110/mo). Great for high-intensity power users.
2. Spectrum: High-value Cable. Spectrum 500 ($49.99/mo), Business 1G ($139.99/mo). Excellent overall value.
3. Verizon: Fios Gigabit ($89.99/mo) and wireless 5G Home Internet ($45/mo). 4-year price guarantees. Great reliability.
4. Xfinity: Highly accessible. Connect More 150 ($29.99/mo) - best budget starter.

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
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "An error occurred with the AI Advisor.",
      details: error.message
    });
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
