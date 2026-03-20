"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { LogOut, ShoppingBag, Clock, CheckCircle, Search, RefreshCw, ChevronDown, ChevronUp, DollarSign, Package, Mail, Phone, MapPin, Tag, Users, ShieldAlert } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ALLOWED_EMAILS = ["blmotorcyclesltd@gmail.com", "info@jonnyai.co.uk"];
const WEBSITE_CHANNELS = ["bikeit", "cmpo"];
const DATE_RANGES = [
  { label: "Today", value: "today" }, { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" }, { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
];
const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];
const CHANNEL_LABELS: Record<string, { label: string; color: string }> = {
  bikeit: { label: "BikeIT", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  cmpo:   { label: "CMPO",   color: "bg-green-500/20 text-green-300 border-green-500/40" },
};
const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  processing: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  completed:  "bg-green-500/20 text-green-300 border-green-500/40",
  cancelled:  "bg-red-500/20 text-red-300 border-red-500/40",
};

type Order = {
  id: string; channel: string; order_reference?: string;
  customer_name: string; customer_email?: string; customer_phone?: string;
  shipping_address?: string; items?: { sku: string; title: string; quantity: number; price: number }[];
  total_amount: number; subtotal?: number; shipping_cost?: number;
  status: string; payment_status?: string; notes?: string;
  created_at: string; updated_at?: string;
};

function getDateFrom(range: string): string | null {
  const now = new Date();
  if (range === "all") return null;
  if (range === "today") { now.setHours(0,0,0,0); return now.toISOString(); }
  now.setDate(now.getDate() - (range === "7d" ? 7 : range === "30d" ? 30 : 90));
  return now.toISOString();
}
const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function ChannelBadge({ channel }: { channel: string }) {
  const cfg = CHANNEL_LABELS[channel] ?? { label: channel.toUpperCase(), color: "bg-gray-500/20 text-gray-300 border-gray-500/40" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${cfg.color}`}>{cfg.label}</span>;
}
function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-gray-500/20 text-gray-300 border-gray-500/40";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border capitalize ${cls}`}>{status}</span>;
}

function AccessDenied({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-red-500/30 rounded-2xl p-8 space-y-4 text-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto"/>
        <h2 className="text-lg font-bold text-white">Access Denied</h2>
        <p className="text-sm text-gray-400">
          <span className="text-gray-300 font-medium">{email}</span> is not authorised to access this portal.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-sm">
          Sign out and try another account
        </button>
        <p className="text-xs text-gray-700">Contact Antigravity AI to request access.</p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/admin" } });
  }
  async function handleEmail(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user && !ALLOWED_EMAILS.includes(data.user.email ?? "")) {
      await supabase.auth.signOut();
      setError("Access denied. This portal is restricted to authorised users only.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-lg flex items-center justify-center font-black text-white text-lg">B</div>
            <span className="text-xl font-black text-white">B&L <span className="text-[#FF6B00]">OPERATIONS</span></span>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Management Portal</p>
        </div>
        <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 disabled:opacity-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-[#2a2a2a]"/><span className="text-xs text-gray-600">or</span><div className="flex-1 h-px bg-[#2a2a2a]"/></div>
        <form onSubmit={handleEmail} className="space-y-3">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400 flex items-start gap-2"><ShieldAlert className="w-4 h-4 mt-0.5 shrink-0"/><span>{error}</span></div>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"/>
          <button type="submit" disabled={loading} className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 uppercase tracking-wide text-sm">{loading ? "Signing in..." : "Email Login"}</button>
        </form>
        <p className="text-center text-xs text-gray-700">BL Motorcycles Ltd | Powered by Antigravity AI</p>
      </div>
    </div>
  );
}

function OrderRow({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  async function changeStatus(st: string) { setUpdating(true); await onStatusChange(order.id, st); setUpdating(false); }
  return (
    <>
      <tr className="border-b border-[#1a1a1a] hover:bg-[#141414] cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-3 text-sm font-mono text-gray-400">#{order.order_reference ?? order.id.slice(0,8).toUpperCase()}</td>
        <td className="px-4 py-3"><div className="text-sm font-medium text-white">{order.customer_name}</div>{order.customer_email && <div className="text-xs text-gray-500">{order.customer_email}</div>}</td>
        <td className="px-4 py-3"><ChannelBadge channel={order.channel}/></td>
        <td className="px-4 py-3 text-sm font-bold text-white">{fmt(order.total_amount)}</td>
        <td className="px-4 py-3"><StatusBadge status={order.status}/></td>
        <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(order.created_at)}</td>
        <td className="px-4 py-3">{expanded ? <ChevronUp className="w-4 h-4 text-gray-500"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}</td>
      </tr>
      {expanded && (
        <tr className="bg-[#111] border-b border-[#1a1a1a]"><td colSpan={7} className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2"><p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-300"><Users className="w-3.5 h-3.5 text-gray-500"/>{order.customer_name}</div>
                {order.customer_email && <div className="flex items-center gap-2 text-gray-400"><Mail className="w-3.5 h-3.5 text-gray-500"/>{order.customer_email}</div>}
                {order.customer_phone && <div className="flex items-center gap-2 text-gray-400"><Phone className="w-3.5 h-3.5 text-gray-500"/>{order.customer_phone}</div>}
                {order.shipping_address && <div className="flex items-start gap-2 text-gray-400"><MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0"/><span>{order.shipping_address}</span></div>}
              </div>
            </div>
            <div className="space-y-2"><p className="text-xs text-gray-500 uppercase font-semibold">Order</p>
              <div className="space-y-1">
                <div className="flex justify-between text-gray-400"><span>Channel</span><ChannelBadge channel={order.channel}/></div>
                {order.subtotal != null && <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>}
                {order.shipping_cost != null && <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{fmt(order.shipping_cost)}</span></div>}
                <div className="flex justify-between text-white font-bold border-t border-[#2a2a2a] pt-1 mt-1"><span>Total</span><span>{fmt(order.total_amount)}</span></div>
                {order.payment_status && <div className="flex justify-between text-gray-400"><span>Payment</span><span className="capitalize">{order.payment_status}</span></div>}
              </div>
            </div>
            <div className="space-y-2"><p className="text-xs text-gray-500 uppercase font-semibold">Update Status</p>
              <div className="grid grid-cols-2 gap-1.5">
                {STATUS_OPTIONS.map(st => (
                  <button key={st} onClick={e => { e.stopPropagation(); changeStatus(st); }} disabled={updating || order.status === st}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-colors disabled:cursor-not-allowed ${order.status === st ? (STATUS_STYLES[st] ?? "") : "border-[#2a2a2a] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00]"}`}>{st}</button>
                ))}
              </div>
              {order.notes && <div className="mt-2 p-2 bg-[#1a1a1a] rounded-lg text-xs text-gray-400"><span className="text-gray-600 font-medium">Note: </span>{order.notes}</div>}
            </div>
          </div>
        </td></tr>
      )}
    </>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !ALLOWED_EMAILS.includes(session.user.email ?? "")) {
        supabase.auth.signOut();
        setAccessDenied(session.user.email ?? "unknown");
      } else {
        setSession(session);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session && !ALLOWED_EMAILS.includes(session.user.email ?? "")) {
        await supabase.auth.signOut();
        setAccessDenied(session.user.email ?? "unknown");
        setSession(null);
        return;
      }
      setAccessDenied("");
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = useCallback(async () => {
    setFetching(true);
    try {
      let q = supabase.from("orders").select("*").in("channel", WEBSITE_CHANNELS).order("created_at", { ascending: false });
      const from = getDateFrom(dateRange); if (from) q = q.gte("created_at", from);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      if (channelFilter !== "all") q = q.eq("channel", channelFilter);
      const { data, error } = await q; if (!error && data) setOrders(data as Order[]);
    } finally { setFetching(false); }
  }, [dateRange, statusFilter, channelFilter]);

  useEffect(() => { if (session) fetchOrders(); }, [session, fetchOrders]);

  async function handleStatusChange(id: string, status: string) {
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  const filtered = orders.filter(o => {
    if (!search) return true; const q = search.toLowerCase();
    return o.customer_name?.toLowerCase().includes(q) || o.customer_email?.toLowerCase().includes(q) || o.order_reference?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
  });
  const totalRevenue = filtered.reduce((s, o) => s + (o.total_amount ?? 0), 0);
  const pendingCount = filtered.filter(o => o.status === "pending").length;
  const processingCount = filtered.filter(o => o.status === "processing").length;
  const completedCount = filtered.filter(o => o.status === "completed").length;
  const bikeItCount = filtered.filter(o => o.channel === "bikeit").length;
  const cmpoCount = filtered.filter(o => o.channel === "cmpo").length;
  const avgOrder = filtered.length ? totalRevenue / filtered.length : 0;

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin"/></div>;
  if (accessDenied) return <AccessDenied email={accessDenied}/>;
  if (!session) return <LoginScreen/>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#1a1a1a] bg-[#0d0d0d] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center font-black text-sm">B</div>
            <div><h1 className="font-black text-sm tracking-tight">B&L <span className="text-[#FF6B00]">MOTORCYCLES</span></h1><p className="text-xs text-gray-500">Website Sales Dashboard</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 hidden sm:block">{session.user?.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a]"><LogOut className="w-3.5 h-3.5"/>Sign out</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-start gap-4"><div className="p-2 rounded-lg bg-[#2a2a2a] text-[#FF6B00]"><ShoppingBag className="w-5 h-5"/></div><div><p className="text-xs text-gray-500 uppercase tracking-wide">Total Orders</p><p className="text-2xl font-bold">{filtered.length}</p><p className="text-xs text-gray-500">{bikeItCount} BikeIT · {cmpoCount} CMPO</p></div></div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-start gap-4"><div className="p-2 rounded-lg bg-[#2a2a2a] text-green-400"><DollarSign className="w-5 h-5"/></div><div><p className="text-xs text-gray-500 uppercase tracking-wide">Revenue</p><p className="text-2xl font-bold">{fmt(totalRevenue)}</p><p className="text-xs text-gray-500">Avg {fmt(avgOrder)}</p></div></div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-start gap-4"><div className="p-2 rounded-lg bg-[#2a2a2a] text-yellow-400"><Clock className="w-5 h-5"/></div><div><p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-gray-500">{processingCount} processing</p></div></div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-start gap-4"><div className="p-2 rounded-lg bg-[#2a2a2a] text-green-400"><CheckCircle className="w-5 h-5"/></div><div><p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p><p className="text-2xl font-bold">{completedCount}</p><p className="text-xs text-gray-500">{Math.round((completedCount / (filtered.length || 1)) * 100)}% rate</p></div></div>
        </div>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.map(r => (<button key={r.value} onClick={() => setDateRange(r.value)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${dateRange === r.value ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "border-[#2a2a2a] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00]"}`}>{r.label}</button>))}
            <button onClick={fetchOrders} disabled={fetching} className="ml-auto px-3 py-1.5 rounded-lg text-xs border border-[#2a2a2a] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00] flex items-center gap-1.5"><RefreshCw className={`w-3 h-3 ${fetching ? "animate-spin" : ""}`}/>Refresh</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF6B00]"><option value="all">All Statuses</option>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select>
            <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF6B00]"><option value="all">All Channels</option><option value="bikeit">BikeIT</option><option value="cmpo">CMPO</option></select>
            <div className="flex-1 min-w-[200px] relative"><Search className="w-3.5 h-3.5 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2"/><input type="text" placeholder="Search name, email, order ref..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#FF6B00]"/></div>
          </div>
        </div>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2"><Package className="w-4 h-4 text-[#FF6B00]"/>Website Orders <span className="text-xs font-normal text-gray-500">({filtered.length})</span></h2>
            {fetching && <RefreshCw className="w-3.5 h-3.5 text-[#FF6B00] animate-spin"/>}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-600"><ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30"/><p className="text-sm">{fetching ? "Loading orders..." : "No orders found"}</p></div>
          ) : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b border-[#1a1a1a] text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-2.5 text-left">Order</th><th className="px-4 py-2.5 text-left">Customer</th><th className="px-4 py-2.5 text-left">Channel</th><th className="px-4 py-2.5 text-left">Total</th><th className="px-4 py-2.5 text-left">Status</th><th className="px-4 py-2.5 text-left">Date</th><th className="px-4 py-2.5 w-8"/>
              </tr></thead>
              <tbody>{filtered.map(order => (<OrderRow key={order.id} order={order} onStatusChange={handleStatusChange}/>))}</tbody>
            </table></div>
          )}
        </div>
      </main>
    </div>
  );
                                                                                                                                                                }
