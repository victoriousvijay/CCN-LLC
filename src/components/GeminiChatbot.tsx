import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Sparkles, Send, X, Bot, User, Brain, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanFromChat: (planId: string, planName: string) => void;
}

const PRESET_QUESTIONS = [
  "Which CoreConnect plan has the best fiber internet?",
  "What is the cheapest plan for home internet?",
  "Recommend a business plan for WFH remote workers",
  "How can I save money by bundling TV and Internet?"
];

export default function GeminiChatbot({ isOpen, onClose, onSelectPlanFromChat }: GeminiChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "### 👋 Welcome to the CoreConnect Advisory Panel!\n\nI am your **AI Network Advisor**, powered by Gemini. I can help you analyze speed-per-dollar ratios, evaluate different CoreConnect network tiers, and select the optimal technology (Fiber, Cable, or 5G) for your home or office.\n\n*What kind of connectivity needs do you have today?*",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const highThinking = false; // Disable high thinking toggle as requested
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build message payload history for the Express API proxy
      const conversationHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role === "model" ? "assistant" : "user",
        text: msg.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          highThinking: highThinking // Forward the high thinking request toggle!
        })
      });

      if (!res.ok) {
        throw new Error("Failed to receive advice.");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg_model_${Date.now()}`,
        role: "model",
        text: data.text || "I was unable to analyze your query. Please re-phrase.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "model",
        text: `### ⚠️ Connection Interrupted\n\nI encountered an error trying to connect to the Gemini advisory server: *${err.message || "Unknown error"}*. Please try again, or make sure your server is compiling correctly.`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-card/85 backdrop-blur-xl border-l border-border-custom shadow-2xl flex flex-col justify-between animate-fade-in-up">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-border-custom bg-bg/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary text-sm flex items-center gap-1.5">
              <span>CCN advisor</span>
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            </h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-mono">
              Online • Advisor Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Close button */}
          <button
            onClick={onClose}
            className="rounded-lg border border-border-custom p-1.5 hover:bg-card text-text-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message List Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-bg/20 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div
              className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-accent/10 text-accent border border-accent/20"
              }`}
            >
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble Content */}
            <div
              className={`rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-card border border-border-custom text-text-primary shadow-sm"
              }`}
            >
              {/* Markdown Parsing Mock for cleaner visuals */}
              <div className="space-y-2 whitespace-pre-wrap">
                {msg.text.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("###")) {
                    return (
                      <h4 key={pIdx} className="font-display font-bold text-base mt-2 text-primary dark:text-accent">
                        {para.replace("###", "").trim()}
                      </h4>
                    );
                  }
                  if (para.startsWith("-") || para.startsWith("*")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-4 space-y-1 my-2">
                        {para.split("\n").map((li, lIdx) => (
                          <li key={lIdx}>{li.replace(/^[\*\-]\s*/, "").trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  // Handle inline bold text
                  if (para.includes("**")) {
                    const parts = para.split("**");
                    return (
                      <p key={pIdx}>
                        {parts.map((p, pIdxSub) => (pIdxSub % 2 === 1 ? <strong key={pIdxSub} className="text-primary dark:text-accent font-bold">{p}</strong> : p))}
                      </p>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              <span className="block text-[9px] text-text-secondary mt-2 opacity-50 font-mono text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-card border border-border-custom p-4 rounded-2xl text-xs text-text-secondary flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-accent animate-spin" />
              <span>
                {highThinking ? "Analysing latency schemas with High Thinking..." : "Consulting coverage grids..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Presets and Chat input */}
      <div className="p-4 border-t border-border-custom bg-card space-y-4">
        
        {/* Presets questions slider */}
        {messages.length === 1 && !loading && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Suggested questions:
            </span>
            <div className="flex flex-col gap-2">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="flex items-center justify-between text-left text-xs bg-bg hover:bg-primary/5 hover:border-primary/20 border border-border-custom p-2.5 rounded-xl text-text-secondary hover:text-primary transition-all cursor-pointer"
                >
                  <span>{q}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about internet coverage..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 bg-bg border border-border-custom px-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:outline-none"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-primary hover:bg-primary/95 text-white p-3 shadow-md shadow-primary/10 transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-[10px] text-center text-text-secondary font-mono opacity-50">
          CoreConnect Advisory LLC • 2026 Engine
        </p>
      </div>

    </div>
  );
}
