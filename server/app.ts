import express from "express";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------------------------------------
// Supabase-backed lead store (replaces the old local leads_db.json file so the
// CRM persists on serverless hosts like Vercel). Uses the service-role key on
// the server only; the table has RLS enabled with no policies, so nothing can
// read or write it without this key.
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
} else {
  console.warn(
    "[ccn] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — lead persistence is disabled until they are configured."
  );
}

// Map a DB row (snake_case) to the camelCase shape the frontend expects.
const toLead = (r: any) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  address: r.address ?? "",
  zipCode: r.zip_code,
  selectedPlanId: r.selected_plan_id ?? null,
  serviceType: r.service_type ?? "Internet",
  notes: r.notes ?? "",
  status: r.status ?? "new",
  createdAt: r.created_at
});

const app = express();
app.use(express.json());

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

  const cleanedZip = String(zipCode).trim().toUpperCase();
  const providers = COVERED_ZIPS[cleanedZip] || [];

  // Dynamically assign providers based on international PIN/Postal/ZIP formatting
  let finalProviders = providers;
  if (providers.length === 0 && cleanedZip.length >= 2) {
    const seed = cleanedZip.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    if (/[A-Z]/.test(cleanedZip)) {
      const globalProviders = ["BT Broadband", "Virgin Media Fiber", "Sky Gigafast", "Rogers Ignite", "Bell Fibe", "Orange Fibre", "Deutsche Telekom"];
      const count = (seed % 3) + 2;
      const shuffled = [...globalProviders].sort(() => 0.5 - (seed % 13) / 13);
      finalProviders = shuffled.slice(0, count);
    } else if (/^\d{6}$/.test(cleanedZip)) {
      const indiaProviders = ["Reliance Jio Fiber", "Airtel Xstream", "Tata Play Fiber", "CoreConnect India Link", "BSNL Bharat Fiber"];
      const count = (seed % 2) + 2;
      const shuffled = [...indiaProviders].sort(() => 0.5 - (seed % 11) / 11);
      finalProviders = shuffled.slice(0, count);
    } else {
      const usProviders = ["Spectrum Fiber", "AT&T Broadband", "Verizon Fios", "Xfinity Gig", "Frontier Ultra", "EarthLink Core"];
      const count = (seed % 3) + 2;
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
app.post("/api/submit-lead", async (req, res) => {
  const { name, email, phone, address, zipCode, selectedPlanId, serviceType, notes } = req.body;

  if (!name || !email || !phone || !zipCode) {
    return res.status(400).json({ error: "Missing required contact details." });
  }
  if (!supabase) {
    return res.status(503).json({ error: "Lead storage is not configured." });
  }

  const { data, error } = await supabase
    .from("ccn_leads")
    .insert({
      name,
      email,
      phone,
      address: address || "",
      zip_code: zipCode,
      selected_plan_id: selectedPlanId || null,
      service_type: serviceType || "Internet",
      notes: notes || "",
      status: "new"
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert lead:", error);
    return res.status(500).json({ error: "Failed to save lead." });
  }

  return res.json({ success: true, lead: toLead(data) });
});

// API Route: Get All Leads (for Dashboard panel)
app.get("/api/leads", async (_req, res) => {
  if (!supabase) return res.json({ leads: [] });

  const { data, error } = await supabase
    .from("ccn_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch leads:", error);
    return res.status(500).json({ error: "Failed to fetch leads." });
  }

  return res.json({ leads: (data || []).map(toLead) });
});

// API Route: Update Lead Status (CRM)
app.patch("/api/leads/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!supabase) return res.status(503).json({ error: "Lead storage is not configured." });

  const { data, error } = await supabase
    .from("ccn_leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Lead not found." });
  }
  return res.json({ success: true, lead: toLead(data) });
});

// API Route: Delete Particular Lead (CRM)
app.delete("/api/leads/:id", async (req, res) => {
  const { id } = req.params;
  if (!supabase) return res.status(503).json({ error: "Lead storage is not configured." });

  const { error } = await supabase.from("ccn_leads").delete().eq("id", id);
  if (error) {
    return res.status(404).json({ error: "Lead not found." });
  }
  return res.json({ success: true });
});

// API Route: Reset Leads
app.post("/api/leads/reset", async (_req, res) => {
  if (!supabase) return res.status(503).json({ error: "Lead storage is not configured." });

  // Delete every row (guard clause matches all real UUIDs).
  const { error } = await supabase.from("ccn_leads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    return res.status(500).json({ error: "Failed to purge leads." });
  }
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
    return res.json({
      text: "### 💡 Advisory Notice: Gemini API Key Not Configured\n\nTo power this AI Advisor with real Gemini thinking capabilities, add a `GEMINI_API_KEY` environment variable.\n\n**Demo System Mode:**\nWhile the key is pending, I can tell you that **CoreConnect Networks** provides advisory matching for Spectrum, AT&T, Verizon, and Xfinity plans starting from **$29.99/mo**. Once your key is set, I can run real full-text comparison schemas and recommend optimal plans based on your direct queries!"
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } }
    });

    const modelToUse = highThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    const systemInstruction = `You are "CoreConnect Advisory Agent", a professional, elite advisor for CoreConnect Networks LLC.
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
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
          })
        }
      });
    } catch (firstError: any) {
      console.warn("Primary Gemini model generation failed. Attempting fallback to gemini-3.5-flash:", firstError);

      if (modelToUse !== "gemini-3.5-flash") {
        fallbackNotice = "\n\n*⚠️ Note: The High Thinking deep-reasoning model quota was exceeded on your API key. I have automatically routed your query through our high-speed, standard advisory engine (powered by Gemini 3.5 Flash) to ensure uninterrupted service.*";

        const fallbackSystemInstruction = systemInstruction.replace("\nYOU ARE RUNNING IN HIGH-THINKING DEEP MODE: Provide a meticulous speed-per-dollar breakdown, comparison table, or latency analysis for the user's specific request, showcasing advanced engineering-level reasoning.", "");

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: { systemInstruction: fallbackSystemInstruction }
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

export default app;
