"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LogOut, Menu, X, TrendingUp, Clock, CheckCircle,
  XCircle, Search, RefreshCw, Package, Activity,
  Truck, Lock, AlertTriangle, ChevronRight, ChevronDown,
  Mail, Send, Users, BarChart3, Eye, Star,
  DollarSign, ShoppingCart, Archive, MapPin, Phone,
  Calendar, Filter, Download, ExternalLink, MessageSquare,
  Zap, Box, Layers, ArrowUpRight, ArrowDownRight,
  Copy, Tag, Hash, MoreHorizontal
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
type Order = {
  id: string;
  ebay_order_id?: string;
  channel_order_id?: string;
  sku: string | null;
  customer_name: string;
  customer_email?: string;
  buyer_username?: string;
  postcode?: string;
  shipping_address?: any;
  status: string;
  error_message?: string;
  trace?: string;
  created_at: string;
  sale_price?: number;
  trade_price?: number;
  qty?: number;
  channel?: string;
  category?: string;
  tracking_number?: string;
  tracking_carrier?: string;
  dispatched_at?: string;
  dispatch_email_sent?: boolean;
  review_email_sent?: boolean;
  escalated?: boolean;
  notes?: string;
  fulfillment_status?: string;
  items?: any[];
};

type Product = {
  id: string;
  sku: string;
  title: string;
  brand?: string;
  supplier_id: string;
  trade_price: number;
  retail_price: number;
  stock_level: number;
  image_url?: string;
  is_active_on_ebay: boolean;
};

type CustomerEmail = {
  id: string;
  order_id?: string;
  email_type: string;
  to_address: string;
  subject: string;
  body_preview?: string;
  sent_at: string;
  sent_by: string;
};

type Tab = "command" | "orders" | "customers" | "stock" | "suppliers" | "summary";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    pending: "PENDING", ordering: "PROCESSING", ordered: "ORDERED",
    dispatched: "DISPATCHED", delivered: "DELIVERED",
    failed: "FAILED", cancelled: "CANCELLED", rejected: "REJECTED",
  };
  return map[s?.toLowerCase()] || s?.toUpperCase() || "UNKNOWN";
};

const statusColor = (s: string) => {
  const lbl = s?.toLowerCase();
  if (lbl === "dispatched" || lbl === "delivered" || lbl === "ordered") return "text-green-400";
  if (lbl === "pending" || lbl === "ordering") return "text-blue-400";
  if (lbl === "failed" || lbl === "rejected" || lbl === "cancelled") return "text-red-500";
  return "text-zinc-500";
};

const statusBg = (s: string) => {
  const lbl = s?.toLowerCase();
  if (lbl === "dispatched" || lbl === "delivered" || lbl === "ordered") return "bg-green-500/10 border-green-500/20";
  if (lbl === "pending" || lbl === "ordering") return "bg-blue-500/10 border-blue-500/20";
  if (lbl === "failed" || lbl === "rejected" || lbl === "cancelled") return "bg-red-500/10 border-red-500/20";
  return "bg-zinc-500/10 border-zinc-500/20";
};

const fmtMoney = (n?: number) => n != null ? `£${n.toFixed(2)}` : "—";
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const daysAgo = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);


const marginColor = (sale?: number, trade?: number) => {
  if (!sale || !trade || trade === 0) return "text-zinc-500";
  const pct = ((sale - trade) / sale) * 100;
  if (pct >= 30) return "text-green-400";
  if (pct >= 15) return "text-yellow-400";
  return "text-red-400";
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, prefix, icon: Icon, color = "text-orange-500", bgColor = "bg-orange-500/5", sub }: {
  label: string; value: string | number; prefix?: string; icon: any; color?: string; bgColor?: string; sub?: string;
}) {
  return (
    <div className={`${bgColor} border border-white/5 rounded-2xl p-5 flex flex-col gap-2 hover:border-white/10 transition-all`}>
      <div className="flex items-center justify-between">
        <Icon size={16} className={color} />
        {sub && <span className="text-[8px] font-mono text-zinc-600">{sub}</span>}
      </div>
      <div className={`text-2xl font-black ${color}`}>{prefix}{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
}

// ─── EmailModal ───────────────────────────────────────────────────────────────
function EmailModal({ order, onClose, onSend }: { order: Order; onClose: () => void; onSend: (type: string, to: string, subject: string, body: string) => void }) {
  const [emailType, setEmailType] = useState("dispatch");
  const [toAddr, setToAddr] = useState(order.customer_email || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const templates: Record<string, { subject: string; body: string }> = {
    dispatch: {
      subject: `Your BL Motorcycles order has been dispatched! 🏍️`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\nGreat news! Your order (${order.channel_order_id || order.id.slice(-8).toUpperCase()}) has been dispatched.\n\n${order.tracking_number ? `📦 Tracking Number: ${order.tracking_number}\n🚚 Carrier: ${order.tracking_carrier || "Royal Mail"}\n\nYou can track your delivery here: https://www.royalmail.com/track-your-item#/tracking-results/${order.tracking_number}` : "We'll send you a tracking number as soon as it's available."}\n\nProduct: ${order.sku || "See order details"}\n\nThanks for choosing BL Motorcycles!\n\nBest regards,\nBrett — BL Motorcycles Ltd`
    },
    delay: {
      subject: `Update on your BL Motorcycles order`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\nJust a quick update on your order (${order.channel_order_id || order.id.slice(-8).toUpperCase()}).\n\nThere's been a slight delay with your item (${order.sku || "see order"}) from our supplier. We're chasing this up and expect it to ship within the next 24-48 hours.\n\nWe apologise for the wait and will send you a tracking number as soon as it's on its way.\n\nIf you have any questions, just reply to this email.\n\nBest regards,\nBrett — BL Motorcycles Ltd`
    },
    review: {
      subject: `How was your BL Motorcycles order? ⭐`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\nHope you're enjoying your new part! We'd really appreciate it if you could leave us a quick review.\n\n⭐ Leave a Google Review: https://g.page/r/blmotorcycles/review\n\nYour feedback helps other riders find quality parts. Takes less than a minute!\n\nThanks again for your order.\n\nBest regards,\nBrett — BL Motorcycles Ltd`
    },
    custom: {
      subject: `Message from BL Motorcycles`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\n\n\nBest regards,\nBrett — BL Motorcycles Ltd`
    },
    return_instructions: {
      subject: `Return Instructions — BL Motorcycles`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\nSorry to hear this part didn't work out. Here are the return instructions:\n\n1. Pack the item securely in its original packaging\n2. Include your order reference: ${order.channel_order_id || order.id.slice(-8).toUpperCase()}\n3. Post to: BL Motorcycles Ltd, Fareham, Hampshire\n4. Send us the return tracking number\n\nOnce received and inspected, we'll process your refund within 3 working days.\n\nBest regards,\nBrett — BL Motorcycles Ltd`
    },
    upsell: {
      subject: `Accessories for your bike — BL Motorcycles 🏍️`,
      body: `Hi ${order.customer_name?.split(" ")[0] || "there"},\n\nHope your ${order.sku || "recent purchase"} is working great!\n\nWe thought you might be interested in some compatible accessories for your bike. Check out our full range:\n\n🔗 https://www.ebay.co.uk/str/blmotorcyclesltd\n\nAs a returning customer, if you need anything specific just reply to this email and we'll sort you out.\n\nRide safe! 🏍️\n\nBrett — BL Motorcycles Ltd`
    }
  };

  useEffect(() => {
    const tmpl = templates[emailType];
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  }, [emailType]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-orange-500" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Email Customer</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-all"><X size={16} className="text-zinc-500" /></button>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2">{order.customer_name} — {order.channel_order_id || order.id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Template selector */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Template</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "dispatch", label: "Dispatch", icon: Truck },
                { id: "delay", label: "Delay", icon: Clock },
                { id: "review", label: "Review", icon: Star },
                { id: "upsell", label: "Upsell", icon: ArrowUpRight },
                { id: "return_instructions", label: "Returns", icon: Archive },
                { id: "custom", label: "Custom", icon: MessageSquare },
              ].map(t => (
                <button key={t.id} onClick={() => setEmailType(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${emailType === t.id ? "bg-orange-500/10 border-orange-500/30 text-orange-500" : "border-white/5 text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                  <t.icon size={12} />{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">To</label>
            <input value={toAddr} onChange={e => setToAddr(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-orange-500/50 transition-all"
              placeholder="customer@email.com" />
          </div>

          {/* Subject */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>

          {/* Body */}
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-orange-500/50 transition-all resize-none leading-relaxed" />
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-[8px] text-zinc-600">Sent from brett@blmotorcycles.co.uk via Resend</p>
          <button onClick={() => { onSend(emailType, toAddr, subject, body); onClose(); }}
            disabled={!toAddr || !subject}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-30">
            <Send size={14} />Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OrderDetailPanel ─────────────────────────────────────────────────────────
function OrderDetailPanel({ order, onEmail, onUpdateStatus, onUpdateTracking }: {
  order: Order;
  onEmail: (o: Order) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateTracking: (id: string, tracking: string, carrier: string) => void;
}) {
  const [trackingInput, setTrackingInput] = useState(order.tracking_number || "");
  const [carrierInput, setCarrierInput] = useState(order.tracking_carrier || "Royal Mail");
  const addr = order.shipping_address;
  const margin = (order.sale_price && order.trade_price) ? order.sale_price - order.trade_price : null;
  const marginPct = (order.sale_price && order.trade_price && order.sale_price > 0) ? ((order.sale_price - order.trade_price) / order.sale_price * 100) : null;

  return (
    <tr>
      <td colSpan={8} className="p-0">
        <div className="bg-white/[0.01] border-t border-b border-orange-500/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><MapPin size={12} />Delivery Address</h4>
              {addr ? (
                <div className="text-xs text-zinc-400 leading-relaxed font-mono">
                  {addr.name && <div>{addr.name}</div>}
                  {addr.line1 && <div>{addr.line1}</div>}
                  {addr.line2 && <div>{addr.line2}</div>}
                  {addr.city && <div>{addr.city}</div>}
                  {addr.county && <div>{addr.county}</div>}
                  {addr.postcode && <div className="font-bold text-white">{addr.postcode}</div>}
                  {addr.phone && <div className="flex items-center gap-1 mt-1 text-zinc-500"><Phone size={10} />{addr.phone}</div>}
                </div>
              ) : <p className="text-[9px] text-zinc-600 font-mono">No address data</p>}
            </div>

            {/* Financials */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><DollarSign size={12} />Financials</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Sale Price</span><span className="text-white font-bold">{fmtMoney(order.sale_price)}</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Trade Price</span><span className="text-zinc-400">{fmtMoney(order.trade_price)}</span></div>
                <div className="border-t border-white/5 pt-2 flex justify-between text-xs">
                  <span className="text-zinc-500">Margin</span>
                  <span className={`font-black ${marginColor(order.sale_price, order.trade_price)}`}>
                    {margin != null ? `${fmtMoney(margin)} (${marginPct?.toFixed(1)}%)` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Qty</span><span className="text-zinc-400">{order.qty || 1}</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Category</span><span className="text-zinc-400">{order.category || "—"}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Zap size={12} />Actions</h4>

              {/* Tracking input */}
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Tracking Number</label>
                <div className="flex gap-2">
                  <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-orange-500/50"
                    placeholder="Tracking #" />
                  <select value={carrierInput} onChange={e => setCarrierInput(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-[10px] focus:outline-none focus:border-orange-500/50">
                    <option value="Royal Mail">Royal Mail</option>
                    <option value="DPD">DPD</option>
                    <option value="Hermes">Evri</option>
                    <option value="DHL">DHL</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="Yodel">Yodel</option>
                    <option value="Parcelforce">Parcelforce</option>
                  </select>
                </div>
                <button onClick={() => onUpdateTracking(order.id, trackingInput, carrierInput)}
                  disabled={!trackingInput}
                  className="w-full py-2 text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all disabled:opacity-30">
                  <Truck size={12} className="inline mr-2" />Save Tracking & Mark Dispatched
                </button>
              </div>

              {/* Status buttons */}
              <div className="flex flex-wrap gap-2">
                {["pending", "dispatched", "delivered", "failed", "cancelled"].map(st => (
                  <button key={st} onClick={() => onUpdateStatus(order.id, st)}
                    className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all ${order.status === st ? "bg-white/10 border-white/20 text-white" : "border-white/5 text-zinc-600 hover:text-white hover:bg-white/5"}`}>
                    {st}
                  </button>
                ))}
              </div>

              {/* Email button */}
              <button onClick={() => onEmail(order)}
                className="w-full py-2 text-[9px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all">
                <Mail size={12} className="inline mr-2" />Email Customer
              </button>

              {/* Error display */}
              {order.error_message && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-1">Error</p>
                  <p className="text-[10px] text-red-400 font-mono">{order.error_message}</p>
                </div>
              )}
              {order.trace && (
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Trace</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{order.trace}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── LoginScreen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin` : "https://blmotorcyclesltd.co.uk/admin" },
    });
    if (authError) { setError("Google auth failed"); setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError("Invalid credentials");
    else onLogin();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-black border border-white/5 p-10 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-black text-black">B</div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-white">
            B&amp;L<span className="text-orange-500 underline decoration-2 underline-offset-4">Operations</span>
          </span>
        </div>
        <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8 text-center">Management Portal</h2>

        <button onClick={handleGoogleLogin} disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-bold text-sm p-4 rounded-xl transition-all disabled:opacity-50 mb-6 shadow-lg">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" /><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
          {loading ? "Redirecting..." : "Sign in with Google"}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" /><span className="text-[8px] text-zinc-600 font-mono uppercase tracking-widest">or</span><div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-orange-500/50" placeholder="Email" required />
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-12 text-xs font-mono focus:outline-none focus:border-orange-500/50" placeholder="••••••••" required />
          </div>
          {error && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] p-3 rounded-xl transition-all disabled:opacity-50">
            {loading ? "Authenticating..." : "Email Login"}
          </button>
        </form>
        <p className="text-[8px] text-zinc-600 text-center mt-6">BL Motorcycles Ltd | Powered by Antigravity AI</p>
      </div>
    </div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [emailLog, setEmailLog] = useState<CustomerEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(new Date());
  const [tab, setTab] = useState<Tab>("command");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [emailModalOrder, setEmailModalOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ─── Data fetching ──────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").neq("channel", "EBAY").order("created_at", { ascending: false }).limit(500);
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from("products").select("*").order("stock_level", { ascending: true }).limit(1000);
    if (data) setProducts(data as Product[]);
  }, []);

  const fetchEmailLog = useCallback(async () => {
    const { data } = await supabase.from("customer_emails").select("*").order("sent_at", { ascending: false }).limit(100);
    if (data) setEmailLog(data as CustomerEmail[]);
  }, []);

  useEffect(() => { fetchOrders(); fetchProducts(); fetchEmailLog(); }, [fetchOrders, fetchProducts, fetchEmailLog]);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  // ─── Toast ──────────────────────────────────────────────────────────────────
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleLogout = async () => { await supabase.auth.signOut(); onLogout(); };

  const updateOrderStatus = async (id: string, status: string) => {
    const update: any = { status };
    if (status === "dispatched") update.dispatched_at = new Date().toISOString();
    await supabase.from("orders").update(update).eq("id", id);
    setToast(`Order updated → ${status.toUpperCase()}`);
    fetchOrders();
  };

  const updateTracking = async (id: string, tracking: string, carrier: string) => {
    await supabase.from("orders").update({
      tracking_number: tracking, tracking_carrier: carrier,
      status: "dispatched", dispatched_at: new Date().toISOString()
    }).eq("id", id);
    setToast(`Tracking saved + marked DISPATCHED`);
    fetchOrders();
  };

  const sendEmail = async (emailType: string, to: string, subject: string, body: string) => {
    setSendingEmail(true);
    try {
      // Call the Next.js API route to send email via Resend
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, emailType, orderId: emailModalOrder?.id })
      });
      if (res.ok) {
        setToast(`✅ Email sent to ${to}`);
        // Log in customer_emails table
        await supabase.from("customer_emails").insert({
          order_id: emailModalOrder?.id,
          email_type: emailType,
          to_address: to,
          subject: subject,
          body_preview: body.substring(0, 200),
          sent_by: "brett"
        });
        // Update order flags
        if (emailType === "dispatch" && emailModalOrder?.id) {
          await supabase.from("orders").update({ dispatch_email_sent: true }).eq("id", emailModalOrder.id);
        }
        if (emailType === "review" && emailModalOrder?.id) {
          await supabase.from("orders").update({ review_email_sent: true }).eq("id", emailModalOrder.id);
        }
        fetchEmailLog();
        fetchOrders();
      } else {
        setToast("❌ Failed to send email");
      }
    } catch { setToast("❌ Email send error"); }
    setSendingEmail(false);
  };

  // ─── Computed stats ─────────────────────────────────────────────────────────
  const now7d = Date.now() - 7 * 86400000;
  const now30d = Date.now() - 30 * 86400000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const ordersToday = orders.filter(o => new Date(o.created_at) >= today);
  const ordersWeek = orders.filter(o => new Date(o.created_at).getTime() >= now7d);
  const ordersMonth = orders.filter(o => new Date(o.created_at).getTime() >= now30d);

  const revenueWeek = ordersWeek.reduce((s, o) => s + (o.sale_price || 0), 0);
  const profitWeek = ordersWeek.reduce((s, o) => s + ((o.sale_price || 0) - (o.trade_price || 0)), 0);
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "ordering");
  const failedOrders = orders.filter(o => o.status === "failed" || o.status === "rejected" || o.status === "cancelled");
  const overdueOrders = pendingOrders.filter(o => daysAgo(o.created_at) >= 3);
  const lowStockProducts = products.filter(p => p.stock_level <= 5 && p.stock_level > 0);
  const outOfStockProducts = products.filter(p => p.stock_level === 0);

  // Customer aggregation
  const customerMap = useMemo(() => {
    const map: Record<string, { name: string; email?: string; orders: Order[]; totalSpend: number; lastOrder: string }> = {};
    orders.forEach(o => {
      const key = o.customer_name?.toLowerCase()?.trim() || "unknown";
      if (!map[key]) map[key] = { name: o.customer_name || "Unknown", email: o.customer_email, orders: [], totalSpend: 0, lastOrder: o.created_at };
      map[key].orders.push(o);
      map[key].totalSpend += o.sale_price || 0;
      if (o.customer_email) map[key].email = o.customer_email;
      if (new Date(o.created_at) > new Date(map[key].lastOrder)) map[key].lastOrder = o.created_at;
    });
    return map;
  }, [orders]);

  const customers = useMemo(() =>
    Object.values(customerMap).sort((a, b) => b.totalSpend - a.totalSpend),
    [customerMap]
  );

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, { count: number; revenue: number }> = {};
    ordersMonth.forEach(o => {
      const cat = o.category || "Uncategorised";
      if (!cats[cat]) cats[cat] = { count: 0, revenue: 0 };
      cats[cat].count++;
      cats[cat].revenue += o.sale_price || 0;
    });
    return Object.entries(cats).sort((a, b) => b[1].revenue - a[1].revenue);
  }, [ordersMonth]);

  // Supplier stats
  const supplierStats = useMemo(() => {
    const bikeit = products.filter(p => p.supplier_id === "BIKEIT");
    const llexeter = products.filter(p => p.supplier_id === "LLEXETER" || p.supplier_id === "CMPO");
    return {
      bikeit: { total: bikeit.length, active: bikeit.filter(p => p.is_active_on_ebay).length, oos: bikeit.filter(p => p.stock_level === 0).length },
      llexeter: { total: llexeter.length, active: llexeter.filter(p => p.is_active_on_ebay).length, oos: llexeter.filter(p => p.stock_level === 0).length },
    };
  }, [products]);

  // ─── Filtered orders ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let f = [...orders];
    if (orderFilter === "pending") f = f.filter(o => o.status === "pending" || o.status === "ordering");
    else if (orderFilter === "dispatched") f = f.filter(o => o.status === "dispatched" || o.status === "delivered" || o.status === "ordered");
    else if (orderFilter === "failed") f = f.filter(o => o.status === "failed" || o.status === "rejected" || o.status === "cancelled");
    else if (orderFilter === "overdue") f = f.filter(o => (o.status === "pending" || o.status === "ordering") && daysAgo(o.created_at) >= 3);
    else if (orderFilter === "week") f = f.filter(o => new Date(o.created_at).getTime() >= now7d);

    if (search) {
      const s = search.toLowerCase();
      f = f.filter(o =>
        o.customer_name?.toLowerCase().includes(s) ||
        o.channel_order_id?.toLowerCase().includes(s) ||
        o.sku?.toLowerCase().includes(s) ||
        o.category?.toLowerCase().includes(s) ||
        o.tracking_number?.toLowerCase().includes(s)
      );
    }
    return f;
  }, [orders, orderFilter, search, now7d]);

  // ─── Filtered products ─────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let f = products;
    if (stockFilter === "low") f = f.filter(p => p.stock_level > 0 && p.stock_level <= 5);
    else if (stockFilter === "out") f = f.filter(p => p.stock_level === 0);
    else if (stockFilter === "bikeit") f = f.filter(p => p.supplier_id === "BIKEIT");
    else if (stockFilter === "llexeter") f = f.filter(p => p.supplier_id === "LLEXETER" || p.supplier_id === "CMPO");
    else if (stockFilter === "active") f = f.filter(p => p.is_active_on_ebay);
    if (search) {
      const s = search.toLowerCase();
      f = f.filter(p => p.sku?.toLowerCase().includes(s) || p.title?.toLowerCase().includes(s) || p.brand?.toLowerCase().includes(s));
    }
    return f;
  }, [products, stockFilter, search]);

  // ─── Nav items ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: "command" as Tab, label: "Command Centre", icon: BarChart3, badge: overdueOrders.length > 0 ? overdueOrders.length : undefined },
    { id: "orders" as Tab, label: "Order Matrix", icon: ShoppingCart, badge: pendingOrders.length > 0 ? pendingOrders.length : undefined },
    { id: "customers" as Tab, label: "Customers", icon: Users },
    { id: "stock" as Tab, label: "Stock & Inventory", icon: Package, badge: outOfStockProducts.length > 0 ? outOfStockProducts.length : undefined },
    { id: "suppliers" as Tab, label: "Supplier Hub", icon: Layers },
    { id: "summary" as Tab, label: "Weekly Summary", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col md:flex-row font-sans overflow-x-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[300] bg-black border border-orange-500/30 rounded-xl px-6 py-3 text-xs font-bold text-orange-500 shadow-2xl animate-pulse">
          {toast}
        </div>
      )}

      {/* Email Modal */}
      {emailModalOrder && <EmailModal order={emailModalOrder} onClose={() => setEmailModalOrder(null)} onSend={sendEmail} />}

      {/* Mobile menu */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-[100] p-3 bg-orange-600 text-black rounded-full shadow-xl">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/5 flex flex-col z-[90] transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-black text-sm">B</div>
            <span className="font-black text-lg tracking-tighter uppercase italic">
              B&amp;L<span className="text-orange-500 underline decoration-2 underline-offset-4">Ops</span>
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => { setTab(id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === id ? "bg-white/5 border border-white/10 text-orange-500" : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                <span className="flex items-center gap-3"><Icon size={14} />{label}</span>
                {badge && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{badge}</span>}
              </button>
            ))}
          </nav>

          {/* Quick stats sidebar */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-[9px]"><span className="text-zinc-600">ORDERS TODAY</span><span className="text-white font-bold">{ordersToday.length}</span></div>
            <div className="flex justify-between text-[9px]"><span className="text-zinc-600">REVENUE (7D)</span><span className="text-green-400 font-bold">£{revenueWeek.toFixed(0)}</span></div>
            <div className="flex justify-between text-[9px]"><span className="text-zinc-600">PRODUCTS</span><span className="text-white font-bold">{products.length.toLocaleString()}</span></div>
            <div className="flex justify-between text-[9px]"><span className="text-zinc-600">EMAILS SENT</span><span className="text-white font-bold">{emailLog.length}</span></div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="m-4 flex items-center gap-2 p-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:bg-white/5 transition-all border border-white/5">
          <LogOut size={14} />Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-lg font-black uppercase tracking-[0.15em] text-white">{navItems.find(n => n.id === tab)?.label || "Dashboard"}</h1>
            <p className="text-[9px] font-mono text-zinc-500 mt-1">
              {now.toLocaleDateString("en-GB")} {now.toLocaleTimeString()} // BL Motorcycles Ops
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, SKUs, customers..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-xs font-mono focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-zinc-600" />
            <button onClick={() => { fetchOrders(); fetchProducts(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-500 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* COMMAND CENTRE TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "command" && (
          <div className="space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Revenue (7 days)" value={revenueWeek.toFixed(0)} prefix="£" icon={DollarSign} color="text-green-400" bgColor="bg-green-500/5" />
              <StatCard label="Profit (7 days)" value={profitWeek.toFixed(0)} prefix="£" icon={TrendingUp} color={profitWeek > 0 ? "text-green-400" : "text-red-400"} bgColor={profitWeek > 0 ? "bg-green-500/5" : "bg-red-500/5"} />
              <StatCard label="Orders This Week" value={ordersWeek.length} icon={ShoppingCart} color="text-orange-500" bgColor="bg-orange-500/5" />
              <StatCard label="Orders This Month" value={ordersMonth.length} icon={Calendar} color="text-blue-400" bgColor="bg-blue-500/5" />
            </div>

            {/* Alert row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Failed orders */}
              <button onClick={() => { setTab("orders"); setOrderFilter("failed"); }}
                className={`p-5 rounded-2xl border transition-all text-left ${failedOrders.length > 0 ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40" : "bg-white/[0.02] border-white/5"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className={failedOrders.length > 0 ? "text-red-500" : "text-zinc-600"} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Failed Orders</span>
                </div>
                <div className={`text-2xl font-black ${failedOrders.length > 0 ? "text-red-500" : "text-zinc-600"}`}>{failedOrders.length}</div>
                {failedOrders.length > 0 && <p className="text-[9px] text-red-400 mt-1">Click to view & resolve →</p>}
              </button>

              {/* Overdue dispatch */}
              <button onClick={() => { setTab("orders"); setOrderFilter("overdue"); }}
                className={`p-5 rounded-2xl border transition-all text-left ${overdueOrders.length > 0 ? "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40" : "bg-white/[0.02] border-white/5"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className={overdueOrders.length > 0 ? "text-yellow-500" : "text-zinc-600"} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Overdue (3+ days)</span>
                </div>
                <div className={`text-2xl font-black ${overdueOrders.length > 0 ? "text-yellow-500" : "text-zinc-600"}`}>{overdueOrders.length}</div>
                {overdueOrders.length > 0 && <p className="text-[9px] text-yellow-400 mt-1">Chase suppliers →</p>}
              </button>

              {/* Low stock */}
              <button onClick={() => { setTab("stock"); setStockFilter("low"); }}
                className={`p-5 rounded-2xl border transition-all text-left ${lowStockProducts.length > 0 ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40" : "bg-white/[0.02] border-white/5"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className={lowStockProducts.length > 0 ? "text-orange-500" : "text-zinc-600"} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Low Stock (&le;5)</span>
                </div>
                <div className={`text-2xl font-black ${lowStockProducts.length > 0 ? "text-orange-500" : "text-zinc-600"}`}>{lowStockProducts.length}</div>
                {outOfStockProducts.length > 0 && <p className="text-[9px] text-red-400 mt-1">{outOfStockProducts.length} completely out of stock</p>}
              </button>
            </div>

            {/* Category breakdown + Recent activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="bg-black border border-white/5 rounded-2xl p-6">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Tag size={12} />Sales by Category (30d)</h3>
                <div className="space-y-3">
                  {categoryBreakdown.slice(0, 8).map(([cat, data]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white">{cat}</span>
                        <span className="text-[9px] text-zinc-600">{data.count} orders</span>
                      </div>
                      <span className="text-xs font-bold text-green-400">£{data.revenue.toFixed(0)}</span>
                    </div>
                  ))}
                  {categoryBreakdown.length === 0 && <p className="text-[9px] text-zinc-600 font-mono">No categorised orders yet</p>}
                </div>
              </div>

              {/* Recent emails sent */}
              <div className="bg-black border border-white/5 rounded-2xl p-6">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Mail size={12} />Recent Emails Sent</h3>
                <div className="space-y-3">
                  {emailLog.slice(0, 8).map(em => (
                    <div key={em.id} className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white">{em.to_address}</span>
                        <span className={`ml-2 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded-full border ${em.email_type === "dispatch" ? "bg-green-500/10 text-green-400 border-green-500/20" : em.email_type === "review" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                          {em.email_type}
                        </span>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-mono">{fmtDate(em.sent_at)}</span>
                    </div>
                  ))}
                  {emailLog.length === 0 && <p className="text-[9px] text-zinc-600 font-mono">No emails sent yet — use the order matrix to email customers</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* ORDER MATRIX TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Orders", count: orders.length },
                { id: "pending", label: "Pending", count: pendingOrders.length },
                { id: "dispatched", label: "Dispatched", count: orders.filter(o => o.status === "dispatched" || o.status === "delivered" || o.status === "ordered").length },
                { id: "failed", label: "Failed", count: failedOrders.length },
                { id: "overdue", label: "Overdue 3d+", count: overdueOrders.length },
                { id: "week", label: "This Week", count: ordersWeek.length },
              ].map(f => (
                <button key={f.id} onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${orderFilter === f.id ? "bg-orange-500/10 border-orange-500/30 text-orange-500" : "border-white/5 text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                  {f.label} <span className="ml-1 opacity-60">{f.count}</span>
                </button>
              ))}
            </div>

            {/* Orders table */}
            <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["", "Order / SKU", "Customer", "Sale", "Trade", "Margin", "Status", "Age"].map(h => (
                        <th key={h} className="p-3 text-[8px] font-black uppercase tracking-widest text-zinc-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="p-8 text-center text-zinc-500 text-xs font-mono animate-pulse">Loading orders...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={8} className="p-8 text-center text-zinc-500 text-xs font-mono">No orders match your filters</td></tr>
                    ) : filtered.slice(0, 100).map(o => {
                      const expanded = expandedOrder === o.id;
                      const age = daysAgo(o.created_at);
                      const margin = (o.sale_price && o.trade_price) ? o.sale_price - o.trade_price : null;
                      const marginPct = (o.sale_price && o.trade_price && o.sale_price > 0) ? ((o.sale_price - o.trade_price) / o.sale_price * 100) : null;
                      return (
                        <>
                          <tr key={o.id} onClick={() => setExpandedOrder(expanded ? null : o.id)}
                            className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${expanded ? "bg-white/[0.02]" : ""} ${age >= 3 && (o.status === "pending" || o.status === "ordering") ? "border-l-2 border-l-yellow-500" : ""}`}>
                            <td className="p-3 w-8">
                              <ChevronRight size={12} className={`text-zinc-600 transition-transform ${expanded ? "rotate-90" : ""}`} />
                            </td>
                            <td className="p-3">
                              <div className="text-[11px] font-mono text-orange-400">{(o.channel_order_id || o.id.slice(-8).toUpperCase())?.substring(0, 20)}</div>
                              <div className="text-[9px] text-zinc-500 flex items-center gap-1 mt-0.5"><Hash size={9} />{o.sku || "N/A"}</div>
                              {o.category && <span className="text-[7px] px-1.5 py-0.5 bg-white/5 text-zinc-500 rounded mt-1 inline-block">{o.category}</span>}
                            </td>
                            <td className="p-3">
                              <div className="text-xs font-bold">{o.customer_name}</div>
                              <div className="text-[9px] text-zinc-500 mt-0.5">{o.shipping_address?.postcode || o.postcode || "—"}</div>
                            </td>
                            <td className="p-3 text-xs font-bold text-white">{fmtMoney(o.sale_price)}</td>
                            <td className="p-3 text-xs text-zinc-500">{fmtMoney(o.trade_price)}</td>
                            <td className="p-3">
                              <span className={`text-xs font-bold ${marginColor(o.sale_price, o.trade_price)}`}>
                                {margin != null ? `£${margin.toFixed(2)}` : "—"}
                              </span>
                              {marginPct != null && <div className="text-[8px] text-zinc-600">{marginPct.toFixed(0)}%</div>}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg border ${statusBg(o.status)} ${statusColor(o.status)}`}>
                                {o.tracking_number && <Truck size={9} />}
                                {statusLabel(o.status)}
                              </span>
                              {o.tracking_number && <div className="text-[8px] text-zinc-600 mt-1 font-mono">{o.tracking_number}</div>}
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-mono ${age >= 3 ? "text-yellow-500" : "text-zinc-500"}`}>
                                {age === 0 ? "Today" : `${age}d ago`}
                              </span>
                              <div className="text-[8px] text-zinc-600">{fmtDate(o.created_at)}</div>
                            </td>
                          </tr>
                          {expanded && (
                            <OrderDetailPanel key={`detail-${o.id}`} order={o}
                              onEmail={setEmailModalOrder}
                              onUpdateStatus={updateOrderStatus}
                              onUpdateTracking={updateTracking}
                            />
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > 100 && (
                <div className="p-4 text-center text-[9px] text-zinc-600 border-t border-white/5">
                  Showing 100 of {filtered.length} orders. Use search or filters to narrow down.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CUSTOMERS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "customers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="Total Customers" value={customers.length} icon={Users} color="text-blue-400" bgColor="bg-blue-500/5" />
              <StatCard label="Repeat Customers" value={customers.filter(c => c.orders.length > 1).length} icon={Star} color="text-purple-400" bgColor="bg-purple-500/5" />
              <StatCard label="Avg Order Value" value={orders.length > 0 ? (orders.reduce((s, o) => s + (o.sale_price || 0), 0) / orders.length).toFixed(0) : "0"} prefix="£" icon={DollarSign} color="text-green-400" bgColor="bg-green-500/5" />
              <StatCard label="Emails Sent" value={emailLog.length} icon={Mail} color="text-orange-500" bgColor="bg-orange-500/5" />
            </div>

            <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Customer", "Orders", "Total Spend", "Last Order", "Email", "Actions"].map(h => (
                        <th key={h} className="p-4 text-[8px] font-black uppercase tracking-widest text-zinc-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.filter(c => {
                      if (!search) return true;
                      const s = search.toLowerCase();
                      return c.name.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s);
                    }).slice(0, 100).map((c, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          {c.orders.length > 1 && <span className="text-[7px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full mt-1 inline-block">Repeat buyer</span>}
                        </td>
                        <td className="p-4 text-xs font-bold text-white">{c.orders.length}</td>
                        <td className="p-4 text-xs font-bold text-green-400">£{c.totalSpend.toFixed(2)}</td>
                        <td className="p-4 text-[10px] text-zinc-400 font-mono">{fmtDate(c.lastOrder)}</td>
                        <td className="p-4 text-[10px] text-zinc-500 font-mono">{c.email || "—"}</td>
                        <td className="p-4">
                          <button onClick={() => setEmailModalOrder(c.orders[0])}
                            className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all" title="Email customer">
                            <Mail size={12} className="text-orange-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-zinc-500 text-xs font-mono">No customer data yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* STOCK & INVENTORY TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "stock" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="Total Products" value={products.length.toLocaleString()} icon={Package} color="text-blue-400" bgColor="bg-blue-500/5" />
              <StatCard label="Active on eBay" value={products.filter(p => p.is_active_on_ebay).length} icon={Zap} color="text-green-400" bgColor="bg-green-500/5" />
              <StatCard label="Out of Stock" value={outOfStockProducts.length} icon={XCircle} color="text-red-400" bgColor="bg-red-500/5" />
              <StatCard label="Low Stock (≤5)" value={lowStockProducts.length} icon={AlertTriangle} color="text-yellow-400" bgColor="bg-yellow-500/5" />
            </div>

            {/* Stock filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Products" },
                { id: "active", label: "Active eBay" },
                { id: "low", label: "Low Stock" },
                { id: "out", label: "Out of Stock" },
                { id: "bikeit", label: "Bike It" },
                { id: "llexeter", label: "LL Exeter" },
              ].map(f => (
                <button key={f.id} onClick={() => setStockFilter(f.id)}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${stockFilter === f.id ? "bg-orange-500/10 border-orange-500/30 text-orange-500" : "border-white/5 text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["SKU", "Product", "Supplier", "Stock", "Trade £", "Retail £", "Margin %", "eBay"].map(h => (
                        <th key={h} className="p-3 text-[8px] font-black uppercase tracking-widest text-zinc-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.slice(0, 100).map(p => {
                      const marginPct = (p.retail_price && p.trade_price && p.retail_price > 0) ? ((p.retail_price - p.trade_price) / p.retail_price * 100) : 0;
                      return (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 text-[10px] font-mono text-orange-400">{p.sku}</td>
                          <td className="p-3">
                            <div className="text-xs text-white max-w-[250px] truncate">{p.title}</div>
                            {p.brand && <div className="text-[9px] text-zinc-600">{p.brand}</div>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full border ${p.supplier_id === "BIKEIT" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"}`}>
                              {p.supplier_id}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs font-bold ${p.stock_level === 0 ? "text-red-500" : p.stock_level <= 5 ? "text-yellow-500" : "text-green-400"}`}>
                              {p.stock_level === 0 ? "🔴" : p.stock_level <= 5 ? "🟡" : "🟢"} {p.stock_level}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-zinc-400">£{p.trade_price?.toFixed(2)}</td>
                          <td className="p-3 text-xs text-white font-bold">£{p.retail_price?.toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`text-xs font-bold ${marginPct >= 30 ? "text-green-400" : marginPct >= 15 ? "text-yellow-400" : "text-red-400"}`}>
                              {marginPct.toFixed(0)}%
                            </span>
                          </td>
                          <td className="p-3">
                            {p.is_active_on_ebay ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-zinc-700" />}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length > 100 && (
                <div className="p-4 text-center text-[9px] text-zinc-600 border-t border-white/5">
                  Showing 100 of {filteredProducts.length} products
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* SUPPLIER HUB TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "suppliers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bike It */}
              <div className="bg-black border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">BI</div>
                    <div>
                      <h3 className="text-sm font-black text-white">Bike It</h3>
                      <p className="text-[9px] text-zinc-500">bikeittrade.com — Trade Portal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-[9px] font-black text-green-500 uppercase">Online</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-white">{supplierStats.bikeit.total.toLocaleString()}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">Products</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-green-400">{supplierStats.bikeit.active}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">On eBay</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-red-400">{supplierStats.bikeit.oos}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">Out/Stock</div>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-600 border-t border-white/5 pt-3">
                  <p>Order method: <span className="text-blue-400">Playwright bot → Trade portal checkout</span></p>
                  <p>Feed sync: <span className="text-zinc-400">CSV ingestion via ingest_bikeit_catalog.py</span></p>
                </div>
              </div>

              {/* LL Exeter / CMPO */}
              <div className="bg-black border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white text-sm">LL</div>
                    <div>
                      <h3 className="text-sm font-black text-white">LL Exeter (CMPO)</h3>
                      <p className="text-[9px] text-zinc-500">llexeter.co.uk — Wholesale</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-[9px] font-black text-green-500 uppercase">Online</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-white">{supplierStats.llexeter.total.toLocaleString()}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">Products</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-green-400">{supplierStats.llexeter.active}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">On eBay</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-red-400">{supplierStats.llexeter.oos}</div>
                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-wider">Out/Stock</div>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-600 border-t border-white/5 pt-3">
                  <p>Order method: <span className="text-purple-400">API / CMPO portal bot</span></p>
                  <p>Feed sync: <span className="text-zinc-400">CSV ingestion via ingest_llexeter_catalog.py</span></p>
                </div>
              </div>
            </div>

            {/* Brett's own stock */}
            <div className="bg-black border border-yellow-500/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center font-black text-black text-sm">BS</div>
                <div>
                  <h3 className="text-sm font-black text-white">Brett&apos;s Own Stock</h3>
                  <p className="text-[9px] text-yellow-500">Manual dispatch — in-house items</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500">Items stored locally at Fareham. Manual pick, pack and dispatch by Brett. Not supplier-fulfilled.</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* WEEKLY SUMMARY TAB */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {tab === "summary" && (
          <div className="space-y-6">
            {/* Revenue overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Revenue (7d)" value={revenueWeek.toFixed(0)} prefix="£" icon={DollarSign} color="text-green-400" bgColor="bg-green-500/5" />
              <StatCard label="Profit (7d)" value={profitWeek.toFixed(0)} prefix="£" icon={TrendingUp} color={profitWeek > 0 ? "text-green-400" : "text-red-400"} bgColor={profitWeek > 0 ? "bg-green-500/5" : "bg-red-500/5"} />
              <StatCard label="Orders (7d)" value={ordersWeek.length} icon={ShoppingCart} />
              <StatCard label="Avg Margin" value={ordersWeek.length > 0 ? (ordersWeek.reduce((s, o) => { const m = (o.sale_price && o.trade_price && o.sale_price > 0) ? ((o.sale_price - o.trade_price) / o.sale_price * 100) : 0; return s + m; }, 0) / ordersWeek.length).toFixed(0) + "%" : "—"} icon={BarChart3} color="text-blue-400" bgColor="bg-blue-500/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top selling SKUs */}
              <div className="bg-black border border-white/5 rounded-2xl p-6">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><TrendingUp size={12} />Top Selling SKUs (30d)</h3>
                <div className="space-y-3">
                  {(() => {
                    const skuCount: Record<string, { count: number; revenue: number }> = {};
                    ordersMonth.forEach(o => {
                      if (o.sku) {
                        if (!skuCount[o.sku]) skuCount[o.sku] = { count: 0, revenue: 0 };
                        skuCount[o.sku].count += o.qty || 1;
                        skuCount[o.sku].revenue += o.sale_price || 0;
                      }
                    });
                    return Object.entries(skuCount).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10).map(([sku, data]) => (
                      <div key={sku} className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-orange-400">{sku}</span>
                          <span className="text-[9px] text-zinc-600 ml-2">×{data.count}</span>
                        </div>
                        <span className="text-xs font-bold text-green-400">£{data.revenue.toFixed(0)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Failed orders breakdown */}
              <div className="bg-black border border-white/5 rounded-2xl p-6">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><XCircle size={12} />Failed Orders Analysis</h3>
                <div className="space-y-3">
                  {failedOrders.length === 0 ? (
                    <p className="text-[9px] text-zinc-600 font-mono">No failed orders — excellent! 🎉</p>
                  ) : (
                    <>
                      <div className="text-xl font-black text-red-500 mb-2">{failedOrders.length} failed</div>
                      {failedOrders.slice(0, 5).map(o => (
                        <div key={o.id} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono text-orange-400">{o.sku || "N/A"}</span>
                              <span className="text-[9px] text-zinc-500 ml-2">{o.customer_name}</span>
                            </div>
                            <span className="text-[8px] text-zinc-600">{fmtDate(o.created_at)}</span>
                          </div>
                          {o.error_message && <p className="text-[9px] text-red-400 font-mono mt-1">{o.error_message}</p>}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Operations summary text */}
            <div className="bg-black border border-white/5 rounded-2xl p-6">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Activity size={12} />Operations Snapshot</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
                <div><span className="text-zinc-500 block text-[9px] mb-1">Pending Orders</span><span className="text-white font-bold text-lg">{pendingOrders.length}</span></div>
                <div><span className="text-zinc-500 block text-[9px] mb-1">Overdue (3d+)</span><span className={`font-bold text-lg ${overdueOrders.length > 0 ? "text-yellow-500" : "text-green-400"}`}>{overdueOrders.length}</span></div>
                <div><span className="text-zinc-500 block text-[9px] mb-1">Low Stock Items</span><span className={`font-bold text-lg ${lowStockProducts.length > 0 ? "text-orange-500" : "text-green-400"}`}>{lowStockProducts.length}</span></div>
                <div><span className="text-zinc-500 block text-[9px] mb-1">Emails This Week</span><span className="text-white font-bold text-lg">{emailLog.filter(e => new Date(e.sent_at).getTime() >= now7d).length}</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Default Export — Auth Gate ───────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => subscription.unsubscribe();
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 font-mono animate-pulse">Authenticating...</div>
      </div>
    );
  }

  return authed ? <AdminDashboard onLogout={() => setAuthed(false)} /> : <LoginScreen onLogin={() => setAuthed(true)} />;
}
