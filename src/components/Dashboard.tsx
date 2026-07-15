import { useEffect, useState, FormEvent } from "react";
import { LeadSubmission } from "../types";
import { Shield, RefreshCw, Trash2, Calendar, Mail, Phone, MapPin, Database, Server, UserCheck, Lock, Unlock, AlertCircle } from "lucide-react";

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: number;
}

export default function Dashboard({ isOpen, onClose, refreshTrigger }: DashboardProps) {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Security / Admin Passcode access control
  const [passcodeInput, setPasscodeInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  // Inline confirmation states to prevent iframe confirm() blocks
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPurgingConfirmed, setIsPurgingConfirmed] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanCode = passcodeInput.trim().toUpperCase();
    if (cleanCode === "CCN-2026" || cleanCode === "ADMIN") {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Security Clearance Code. Please check the authorization credentials.");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchLeads();
      } else {
        console.error("Failed to update lead status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchLeads();
      } else {
        console.error("Failed to delete lead");
      }
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  const resetLeads = async () => {
    try {
      await fetch(RouteResetLeads, { method: "POST" });
      setIsPurgingConfirmed(false);
      fetchLeads();
    } catch (err) {
      console.error("Purging failed", err);
    }
  };

  // Defined routes constants for compiler cleanliness
  const RouteResetLeads = "/api/leads/reset";

  useEffect(() => {
    if (isOpen && isAuthorized) {
      fetchLeads();
    }
  }, [isOpen, isAuthorized, refreshTrigger]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl h-full max-h-[92vh] sm:h-auto bg-card border border-border-custom rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
        
        {/* LOCK SCREEN VIEW (If not authorized) */}
        {!isAuthorized ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center text-center p-6 sm:p-8 space-y-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
              <Lock className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
                Secure Administrative Clearance Required
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                To access the real-time CRM dashboard, client submissions, and network diagnostics, enter the advisor authorization code below.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Advisor Passcode"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border-custom rounded-xl text-center font-mono font-bold text-text-primary tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm sm:text-base"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-500 font-semibold justify-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-border-custom hover:bg-bg rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Verify Credentials</span>
                </button>
              </div>
            </form>

            <div className="text-[10px] text-text-secondary font-mono pt-4 border-t border-border-custom/50 w-full max-w-sm">
              Strictly Confidential • CoreConnect Networks Security Group
            </div>
          </div>
        ) : (
          /* CRM ACTIVE VIEW (If authorized) */
          <>
            {/* Header Block */}
            <div className="p-4 sm:p-6 border-b border-border-custom bg-bg/50 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div className="flex items-start sm:items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-1 sm:mt-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                    Advisory Lead Administration (CRM)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-text-secondary">
                    Manage client submissions, update follow-up status, and purge records securely
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto md:justify-end">
                <button
                  onClick={fetchLeads}
                  className="rounded-xl border border-border-custom p-2.5 hover:bg-bg text-text-secondary hover:text-primary transition-all cursor-pointer bg-card shrink-0"
                  title="Reload database"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`} />
                </button>
                {isPurgingConfirmed ? (
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 p-1 rounded-xl shrink-0">
                    <button
                      onClick={resetLeads}
                      className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Confirm Purge
                    </button>
                    <button
                      onClick={() => setIsPurgingConfirmed(false)}
                      className="px-2 py-1 bg-bg border border-border-custom hover:bg-card text-text-secondary rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsPurgingConfirmed(true)}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 p-2.5 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                    title="Purge all leads"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto md:ml-0 text-sm font-semibold text-white bg-primary hover:bg-primary/95 px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Database Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-6 bg-bg/30 border-b border-border-custom shrink-0">
              <div className="bg-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-custom">
                <span className="text-[9px] sm:text-[10px] font-mono text-text-secondary uppercase tracking-widest block">
                  Total Submissions
                </span>
                <span className="font-number text-2xl sm:text-3xl font-extrabold text-text-primary mt-1 block">
                  {leads.length}
                </span>
              </div>
              <div className="bg-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-custom">
                <span className="text-[9px] sm:text-[10px] font-mono text-text-secondary uppercase tracking-widest block">
                  DB Target Engine
                </span>
                <span className="font-bold text-primary flex items-center gap-1.5 mt-2 text-xs sm:text-sm">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Local Filesystem</span>
                </span>
              </div>
              <div className="bg-card p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-custom col-span-2 sm:col-span-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-text-secondary uppercase tracking-widest block">
                  Server Storage
                </span>
                <span className="font-bold text-emerald-500 flex items-center gap-1.5 mt-2 text-xs sm:text-sm">
                  <Server className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">leads_db.json (Persistent)</span>
                </span>
              </div>
            </div>

            {/* Lead Table List */}
            <div className="p-4 sm:p-6 flex-1 sm:flex-initial sm:max-h-[420px] overflow-y-auto space-y-4 no-scrollbar bg-bg/10">
              
              {leads.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Database className="h-10 w-10 text-text-secondary/40 mx-auto" />
                  <h4 className="font-bold text-text-primary">No submissions detected</h4>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    Go back, enter a ZIP code, check availability, and submit the advisory form to see records populate here in real-time.
                  </p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-card rounded-2xl border border-border-custom p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/20 transition-all shadow-sm"
                  >
                    {/* Contact Column */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          lead.status === "completed" ? "bg-emerald-500" :
                          lead.status === "contacted" ? "bg-blue-500" : "bg-amber-500 animate-pulse"
                        }`} />
                        <h4 className="font-bold text-text-primary text-sm">{lead.name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[9px] font-bold text-accent uppercase">
                          {lead.serviceType}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{lead.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{lead.phone}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-text-secondary font-mono">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>ZIP: {lead.zipCode} | {lead.address}</span>
                      </div>
                    </div>

                    {/* Meta & CRM Control Column */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0 w-full sm:w-auto">
                      <div className="text-[10px] text-text-secondary font-mono flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {lead.notes && (
                        <span className="px-2.5 py-1 rounded-lg bg-primary/5 text-[10px] font-semibold text-primary max-w-[200px] truncate">
                          {lead.notes}
                        </span>
                      )}

                      {/* CRM Actions */}
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={lead.status || "new"}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                          className="text-xs bg-bg border border-border-custom text-text-primary px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-primary font-bold cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>

                        {deleteConfirmId === lead.id ? (
                          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 p-1 rounded-xl">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-bg border border-border-custom hover:bg-card text-text-secondary rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="p-2 border border-red-500/10 bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                            title="Delete specific lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border-custom bg-bg/50 text-center text-[10px] text-text-secondary font-mono flex justify-between px-6">
              <span>Strictly Confidential • CoreConnect Security Group</span>
              <button
                onClick={() => setIsAuthorized(false)}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Lock Terminal
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
