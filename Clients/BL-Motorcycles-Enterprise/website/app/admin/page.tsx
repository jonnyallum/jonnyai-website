"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth ─────────────────────────────────────────────────────────────────────
const ALLOWED_EMAILS = ["blmotorcyclesltd@gmail.com", "info@jonnyai.co.uk"];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  created_at: string;
  updated_at?: string;
  channel?: string;
  order_reference?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  items?: OrderItem[] | string;
  total_amount?: number;
  total?: number;
  total_price?: string;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  payment_status?: string;
  notes?: string;
  tracking_number?: string;
  supplier?: string;
}

interface OrderItem {
  sku?: string;
  title?: string;
  name?: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  created_at: string;
  name?: string;
  customer_name?: string;
  email?: string;
  customer_email?: string;
  phone?: string;
  customer_phone?: string;
  address?: string;
  order_count?: number;
  total_spent?: number;
}

interface Product {
  id: string;
  created_at?: string;
  sku?: string;
  title?: string;
  name?: string;
  price?: number;
  stock_qty?: number;
  quantity?: number;
  supplier?: string;
  category?: string;
  status?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const daysSince = (date: string) => {
  const ms = Date.now() - new Date(date).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

const orderTotal = (o: Order): number => {
  if (o.total_amount) return o.total_amount;
  if (o.total) return o.total;
  if (o.total_price) return parseFloat(o.total_price) || 0;
  return 0;
};

const statusColor = (s: string) => {
  switch (s?.toLowerCase()) {
    case "pending":    return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ordering":   return "bg-blue-100 text-blue-800 border-blue-200";
    case "ordered":    return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "dispatched": return "bg-teal-100 text-teal-800 border-teal-200";
    case "delivered":  return "bg-green-100 text-green-800 border-green-200";
    case "failed":     return "bg-red-100 text-red-800 border-red-200";
    case "rejected":   return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":  return "bg-zinc-100 text-zinc-600 border-zinc-200";
    default:           return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
};

const channelBadge = (ch?: string) => {
  const c = ch?.toLowerCase();
  if (c === "ebay")   return "bg-yellow-400 text-black";
  if (c === "bikeit") return "bg-blue-600 text-white";
  if (c === "cmpo")   return "bg-green-600 text-white";
  return "bg-zinc-700 text-zinc-100";
};

const fmt = (n: number) => `£${n.toFixed(2)}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setError("Access denied. This portal is restricted.");
      setLoading(false);
      return;
    }
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authErr) {
      setError("Invalid credentials. Please try again.");
    } else {
      onLogin(email.trim());
    }
    setLoading(false);
  };>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-500 mb-4">
            <span className="text-2xl font-black text-white">B&amp;L</span>
          </div>
          <h1 className="text-2xl font-bold text-white">B&amp;LOPS</h1>
          <p className="text-zinc-400 text-sm mt-1">Operations Portal — Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 text-sm transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminPage() {
  // Auth
  const [authed, setAuthed]     = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Nav
  const [tab, setTab] = useState<"command" | "orders" | "customers" | "stock" | "suppliers" | "weekly">("command");

  // Data
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Order Matrix filters
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [search,      setSearch]      = useState<string>("");tLastRefresh(new Date());
    setLoading(false);
  }, [loadOrders, loadCustomers, loadProducts]);

  useEffect(() => {
    if (authed) refreshAll();
  }, [authed, refreshAll]);

  // ── Pre-computed counts (case-insensitive) ─────────────────────────────────
  const now7d = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.getTime();
  }, []);

  const pendingOrders  = useMemo(() => orders.filter(o => ["pending","ordering"].includes(o.status?.toLowerCase())), [orders]);
  const failedOrders   = useMemo(() => orders.filter(o => ["failed","rejected","cancelled"].includes(o.status?.toLowerCase())), [orders]);
  const dispatchedOrds = useMemo(() => orders.filter(o => ["dispatched","delivered","ordered"].includes(o.status?.toLowerCase())), [orders]);
  const overdueOrders  = useMemo(() => orders.filter(o => ["pending","ordering"].includes(o.status?.toLowerCase()) && daysSince(o.created_at) >= 3), [orders]);
  const ebayOrders     = useMemo(() => orders.filter(o => o.channel?.toLowerCase() === "ebay"), [orders]);
  const weekOrders     = useMemo(() => orders.filter(o => new Date(o.created_at).getTime() >= now7d), [orders, now7d]);

  // ── Filtered orders for the Order Matrix table ─────────────────────────────
  // BUG FIX: all status comparisons are case-insensitive (.toLowerCase())
  const filtered = useMemo(() => {
    let f: Order[] = orders;

    // Status / channel filter
    if (orderFilter === "pending") {
      f = f.filter(o => ["pending","ordering"].includes(o.status?.toLowerCase()));
    } else if (orderFilter === "dispatched") {
      f = f.filter(o => ["dispatched","delivered","ordered"].includes(o.status?.toLowerCase()));
    } else if (orderFilter === "failed") {
      f = f.filter(o => ["failed","rejected","cancelled"].includes(o.status?.toLowerCase()));
    } else if (orderFilter === "ebay") {
      f = f.filter(o => o.channel?.toLowerCase() === "ebay");
    } else if (orderFilter === "overdue") {
      f = f.filter(o => ["pending","ordering"].includes(o.status?.toLowerCase()) && daysSince(o.created_at) >= 3);
    } else if (orderFilter === "week") {
      f = f.filter(o => new Date(o.created_at).getTime() >= now7d);
    }
    // orderFilter === "all" → keep everything

    // Search filter (only applied when search is non-empty)
    const q = search.trim().toLowerCase();
    if (q) {
      f = f.filter(o =>
        (o.customer_name?.toLowerCase().includes(q)) ||
        (o.customer_email?.toLowerCase().includes(q)) ||
        (o.order_reference?.toLowerCase().includes(q)) ||
        (o.id?.toLowerCase().includes(q)) ||
        (o.channel?.toLowerCase().includes(q)) ||
        (o.status?.toLowerCase().includes(q))
      );
    }

    return f;
  }, [orders, orderFilter, search, now7d]);

  // ── Revenue stats ──────────────────────────────────────────────────────────
  const totalRevenue   = useMemo(() => orders.reduce((s, o) => s + orderTotal(o), 0), [orders]);
  const weekRevenue    = useMemo(() => weekOrders.reduce((s, o) => s + orderTotal(o), 0), [weekOrders]);

  // ─── Sign out ─────────────────────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setUserEmail("");
    setOrders([]); setCustomers([]); setProducts([]);
  };

  // ─── Render gates ──────────────────────────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-sm animate-pulse">Initialising B&amp;LOPS…</div>
      </div>
    );
  }
  if (!authed) {
    return <LoginScreen onLogin={(email) => { setAuthed(true); setUserEmail(email); }} />;
  }

  // ─── Tab definitions ───────────────────────────────────────────────────────
  const orderTabs = [
    { id: "all",        label: "All Orders",    count: orders.length },
    { id: "pending",    label: "Pending",       count: pendingOrders.length },
    { id: "dispatched", label: "Dispatched",    count: dispatchedOrds.length },
    { id: "failed",     label: "Failed",        count: failedOrders.length },
    { id: "overdue",    label: "Overdue 3d+",   count: overdueOrders.length },
    { id: "ebay",       label: "eBay",          count: ebayOrders.length },
    { id: "week",       label: "This Week",     count: weekOrders.length },
  ];

  // ─── Sidebar nav ───────────────────────────────────────────────────────────
  const navItems = [
    { id: "command",   icon: "⚡", label: "Command Centre" },
    { id: "orders",    icon: "📦", label: "Order Matrix" },
    { id: "customers", icon: "👥", label: "Customers" },
    { id: "stock",     icon: "🏭", label: "Stock & Inventory" },
    { id: "suppliers", icon: "🔗", label: "Supplier Hub" },
    { id: "weekly",    icon: "📊", label: "Weekly Summary" },
  ] as const;

  // ─── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-xs font-black text-white">B&amp;L</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-none">B&amp;LOPS</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Operations Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                tab === item.id
                  ? "bg-orange-500/20 text-orange-400 font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <div className="px-2 mb-2">
            <div className="text-[10px] text-zinc-500 truncate">{userEmail}</div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <span>⏻</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">

        {/* ── Header bar ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-white">
              {navItems.find(n => n.id === tab)?.icon}{" "}
              {navItems.find(n => n.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-[10px] text-zinc-600">
                Updated {lastRefresh.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={refreshAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors disabled:opacity-50"
            >
              <span className={loading ? "animate-spin inline-block" : ""}>↻</span>
              Refresh
            </button>
          </div>
        </div>

        <div className="px-6 py-6">& (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Orders",    value: orders.length,           sub: "all time",          color: "text-white" },
                  { label: "Pending",         value: pendingOrders.length,    sub: "awaiting action",   color: "text-yellow-400",
                    action: () => { setTab("orders"); setOrderFilter("pending"); } },
                  { label: "Failed / Cancel", value: failedOrders.length,     sub: "need attention",    color: "text-red-400",
                    action: () => { setTab("orders"); setOrderFilter("failed"); } },
                  { label: "Overdue 3d+",     value: overdueOrders.length,    sub: "urgent",            color: "text-orange-400",
                    action: () => { setTab("orders"); setOrderFilter("overdue"); } },
                ].map(card => (
                  <div
                    key={card.label}
                    onClick={card.action}
                    className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${card.action ? "cursor-pointer hover:border-zinc-600 transition-colors" : ""}`}
                  >
                    <div className="text-xs text-zinc-500 mb-1">{card.label}</div>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                    <div className="text-[10px] text-zinc-600 mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Revenue row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">Total Revenue</div>
                  <div className="text-3xl font-bold text-green-400">{fmt(totalRevenue)}</div>
                  <div className="text-[10px] text-zinc-600 mt-1">all time</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">This Week Revenue</div>
                  <div className="text-3xl font-bold text-teal-400">{fmt(weekRevenue)}</div>
                  <div className="text-[10px] text-zinc-600 mt-1">last 7 days ({weekOrders.length} orders)</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-zinc-200">Recent Orders</h2>
                  <button
                    onClick={() => { setTab("orders"); setOrderFilter("all"); }}
                    className="text-xs text-orange-400 hover:text-orange-300"
                  >
                    View all →
                  </button>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Channel</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Total</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map(o => (
                        <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="px-4 py-3 text-zinc-200">{o.customer_name || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${channelBadge(o.channel)}`}>
                              {o.channel || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-green-400 font-mono">{fmt(orderTotal(o))}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${statusColor(o.status)}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-500">{fmtDate(o.created_at)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-xs">
                            {loading ? "Loading…" : "No orders found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <h2 className="text-sm font-semibold text-zinc-200 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Pending Orders",  icon: "⏳", action: () => { setTab("orders"); setOrderFilter("pending"); } },
                    { label: "Failed Orders",   icon: "❌", action: () => { setTab("orders"); setOrderFilter("failed"); } },
                    { label: "eBay Orders",     icon: "🛒", action: () => { setTab("orders"); setOrderFilter("ebay"); } },
                    { label: "Overdue Orders",  icon: "🔥", action: () => { setTab("orders"); setOrderFilter("overdue"); } },
                  ].map(q => (
                    <button
                      key={q.label}
                      onClick={q.action}
                      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 text-left transition-colors"
                    >
                      <div className="text-xl mb-2">{q.icon}</div>
                      <div className="text-xs text-zinc-300 font-medium">{q.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ORDER MATRIX                                                     */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {tab === "orders" && (
            <div className="space-y-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {orderTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setOrderFilter(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      orderFilter === t.id
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {t.label}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      orderFilter === t.id ? "bg-white/20" : "bg-zinc-800"
                    }`}>
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, order ref, status…"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-orange-500 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Results summary */}
              <div className="text-xs text-zinc-500">
                Showing {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                {orderFilter !== "all" && ` · filter: ${orderTabs.find(t => t.id === orderFilter)?.label}`}
                {search.trim() && ` · search: "${search.trim()}"`}
              </div>

              {/* Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Order</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Channel</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Items</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Total</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Age</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(o => {
                        const age = daysSince(o.created_at);
                        const isOverdue = ["pending","ordering"].includes(o.status?.toLowerCase()) && age >= 3;
                        return (
                          <tr
                            key={o.id}
                            className={`border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors ${isOverdue ? "bg-red-900/10" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <div className="font-mono text-zinc-300 text-[10px]">
                                {o.order_reference || o.id.slice(0, 8)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-zinc-200">{o.customer_name || "—"}</div>
                              {o.customer_email && (
                                <div className="text-[10px] text-zinc-500">{o.customer_email}</div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${channelBadge(o.channel)}`}>
                                {o.channel || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                              {Array.isArray(o.items) ? o.items.length : (typeof o.items === "string" ? "—" : "—")}
                            </td>
                            <td className="px-4 py-3 font-mono text-green-400">{fmt(orderTotal(o))}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${statusColor(o.status)}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className={`px-4 py-3 font-mono text-[10px] ${isOverdue ? "text-orange-400 font-bold" : "text-zinc-500"}`}>
                              {age}d{isOverdue ? " ⚠" : ""}
                            </td>
                            <td className="px-4 py-3 text-zinc-500">{fmtDate(o.created_at)}</td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-zinc-600 font-mono text-xs">
                            {loading ? "Loading orders…" : "No orders match your filters"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* CUSTOMERS                                                        */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {tab === "customers" && (
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">Customers ({customers.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Name</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Email</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Phone</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="px-4 py-3 text-zinc-200">{c.name || c.customer_name || "—"}</td>
                          <td className="px-4 py-3 text-zinc-400">{c.email || c.customer_email || "—"}</td>
                          <td className="px-4 py-3 text-zinc-400">{c.phone || c.customer_phone || "—"}</td>
                          <td className="px-4 py-3 text-zinc-500">{fmtDate(c.created_at)}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-zinc-600 text-xs">
                            {loading ? "Loading…" : "No customers found. Data may be in the orders table."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* If no separate customers table, derive from orders */}
              {customers.length === 0 && orders.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <span className="text-sm font-medium text-zinc-200">Customers from Orders</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                          <th className="text-left px-4 py-3 text-zinc-500 font-medium">Email</th>
                          <th className="text-left px-4 py-3 text-zinc-500 font-medium">Channel</th>
                          <th className="text-left px-4 py-3 text-zinc-500 font-medium">Orders</th>
                          <th className="text-left px-4 py-3 text-zinc-500 font-medium">Last Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(
                          orders.reduce((acc, o) => {
                            const key = o.customer_email || o.customer_name || o.id;
                            if (!acc[key]) acc[key] = { name: o.customer_name, email: o.customer_email, channel: o.channel, count: 0, last: o.created_at };
                            acc[key].count++;
                            if (o.created_at > acc[key].last) acc[key].last = o.created_at;
                            return acc;
                          }, {} as Record<string, { name?: string; email?: string; channel?: string; count: number; last: string }>)
                        ).sort((a, b) => b.last.localeCompare(a.last)).map((c, i) => (
                          <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                            <td className="px-4 py-3 text-zinc-200">{c.name || "—"}</td>
                            <td className="px-4 py-3 text-zinc-400">{c.email || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${channelBadge(c.channel)}`}>
                                {c.channel || "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-300">{c.count}</td>
                            <td className="px-4 py-3 text-zinc-500">{fmtDate(c.last)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STOCK & INVENTORY                                                */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {tab === "stock" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">Total SKUs</div>
                  <div className="text-3xl font-bold text-white">{products.length}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">In Stock</div>
                  <div className="text-3xl font-bold text-green-400">
                    {products.filter(p => (p.stock_qty ?? p.quantity ?? 1) > 0).length}
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">Out of Stock</div>
                  <div className="text-3xl font-bold text-red-400">
                    {products.filter(p => (p.stock_qty ?? p.quantity ?? 1) <= 0).length}
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="text-xs text-zinc-500 mb-1">Avg Price</div>
                  <div className="text-3xl font-bold text-teal-400">
                    {fmt(products.length ? products.reduce((s, p) => s + (p.price || 0), 0) / products.length : 0)}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">SKU</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Product</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Category</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Price</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Stock</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Supplier</th>
                        <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => {
                        const qty = p.stock_qty ?? p.quantity ?? null;
                        return (
                          <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                            <td className="px-4 py-3 font-mono text-zinc-400 text-[10px]">{p.sku || "—"}</td>
                            <td className="px-4 py-3 text-zinc-200">{p.title || p.name || "—"}</td>
                            <td className="px-4 py-3 text-zinc-500">{p.category || "—"}</td>
                            <td className="px-4 py-3 font-mono text-green-400">{p.price ? fmt(p.price) : "—"}</td>
                            <td className={`px-4 py-3 font-mono font-bold ${qty === null ? "text-zinc-500" : qty <= 0 ? "text-red-400" : qty <= 3 ? "text-orange-400" : "text-green-400"}`}>
                              {qty ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-zinc-500">{p.supplier || "—"}</td>
                            <td className="px-4 py-3">
                              {p.status && (
                                <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${statusColor(p.status)}`}>
                                  {p.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 text-xs">
                            {loading ? "Loading…" : "No products found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SUPPLIER HUB                                                     */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {tab === "suppliers" && (
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-zinc-200 mb-4">Supplier Overview</h2>
                {(() => {
                  const supplierMap: Record<string, { orders: number; revenue: number }> = {};
                  orders.forEach(o => {
                    const s = o.supplier || o.channel || "Unknown";
                    if (!supplierMap[s]) supplierMap[s] = { orders: 0, revenue: 0 };
                    supplierMap[s].orders++;
                    supplierMap[s].revenue += orderTotal(o);
                  });
                  const suppliers = Object.entries(supplierMap).sort((a, b) => b[1].revenue - a[1].revenue);
                  return suppliers.length > 0 ? (
                    <div className="space-y-3">
                      {suppliers.map(([name, stats]) => (
                        <div key={name} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                          <div>
                            <div className="text-sm text-zinc-200 font-medium capitalize">{name}</div>
                            <div className="text-xs text-zinc-500">{stats.orders} orders</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-green-400">{fmt(stats.revenue)}</div>
                            <div className="text-xs text-zinc-600">revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-xs">No supplier data available. Add a supplier field to your orders table.</p>
                  );
                })()}
              </div>

              {/* Pending supplier orders */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm font-medium text-zinc-200">
                    Orders Awaiting Supplier Action ({pendingOrders.length})
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Order Ref</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map(o => {
                      const age = daysSince(o.created_at);
                      return (
                        <tr key={o.id} className={`border-b border-zinc-800/50 ${age >= 3 ? "bg-red-900/10" : ""}`}>
                          <td className="px-4 py-3 font-mono text-zinc-300 text-[10px]">{o.order_reference || o.id.slice(0,8)}</td>
                          <td className="px-4 py-3 text-zinc-200">{o.customer_name || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${statusColor(o.status)}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className={`px-4 py-3 font-mono text-[10px] font-bold ${age >= 3 ? "text-orange-400" : "text-zinc-500"}`}>
                            {age}d{age >= 3 ? " ⚠" : ""}
                          </td>
                        </tr>
                      );
                    })}
                    {pendingOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-green-600 text-xs">
                          ✓ All clear — no pending supplier orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* WEEKLY SUMMARY                                                   */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {tab === "weekly" && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-zinc-200 mb-1">Weekly Summary</h2>
                <p className="text-xs text-zinc-500 mb-5">Last 7 days ending {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" })}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Orders This Week",   value: weekOrders.length,       unit: "orders",  color: "text-white" },
                    { label: "Revenue This Week",   value: fmt(weekRevenue),        unit: "",         color: "text-green-400" },
                    { label: "Avg Order Value",     value: weekOrders.length ? fmt(weekRevenue/weekOrders.length) : "£0.00",  unit: "", color: "text-teal-400" },
                    { label: "Pending (all time)",  value: pendingOrders.length,    unit: "orders",  color: "text-yellow-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="text-[10px] text-zinc-500 mb-1">{s.label}</div>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      {s.unit && <div className="text-[10px] text-zinc-600">{s.unit}</div>}
                    </div>
                  ))}
                </div>

                {/* Status breakdown */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Order Status Breakdown (All Time)</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Pending / Ordering",        count: pendingOrders.length,    color: "bg-yellow-500" },
                      { label: "Dispatched / Delivered",    count: dispatchedOrds.length,   color: "bg-teal-500" },
                      { label: "Failed / Cancelled",        count: failedOrders.length,     color: "bg-red-500" },
                      { label: "Overdue (3d+)",             count: overdueOrders.length,    color: "bg-orange-500" },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3">
                        <div className="w-28 text-[10px] text-zinc-500 shrink-0">{row.label}</div>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${row.color}`}
                            style={{ width: orders.length ? `${(row.count / orders.length) * 100}%` : "0%" }}
                          />
                        </div>
                        <div className="text-xs text-zinc-300 font-mono w-8 text-right shrink-0">{row.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel breakdown */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Channel Breakdown (All Time)</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      orders.reduce((acc, o) => {
                        const ch = (o.channel || "unknown").toLowerCase();
                        acc[ch] = (acc[ch] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1]).map(([ch, count]) => (
                      <div key={ch} className="flex items-center gap-3">
                        <span className={`w-16 text-center px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${channelBadge(ch)}`}>{ch}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }}
                          />
                        </div>
                        <div className="text-xs text-zinc-300 font-mono w-8 text-right shrink-0">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* This week's orders */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm font-medium text-zinc-200">Orders This Week ({weekOrders.length})</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Channel</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Total</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekOrders.map(o => (
                      <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="px-4 py-3 text-zinc-200">{o.customer_name || "—"          { label: "Revenue This Week",   value: fmt(weekRevenue),        unit: "",         color: "text-green-400" },
                    { label: "Avg Order Value",     value: weekOrders.length ? fmt(weekRevenue/weekOrders.length) : "£0.00",  unit: "", color: "text-teal-400" },
                    { label: "Pending (all time)",  value: pendingOrders.length,    unit: "orders",  color: "text-yellow-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="text-[10px] text-zinc-500 mb-1">{s.label}</div>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      {s.unit && <div className="text-[10px] text-zinc-600">{s.unit}</div>}
                    </div>
                  ))}
                </div>

                {/* Status breakdown */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Order Status Breakdown (All Time)</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Pending / Ordering",        count: pendingOrders.length,    color: "bg-yellow-500" },
                      { label: "Dispatched / Delivered",    count: dispatchedOrds.length,   color: "bg-teal-500" },
                      { label: "Failed / Cancelled",        count: failedOrders.length,     color: "bg-red-500" },
                      { label: "Overdue (3d+)",             count: overdueOrders.length,    color: "bg-orange-500" },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3">
                        <div className="w-28 text-[10px] text-zinc-500 shrink-0">{row.label}</div>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${row.color}`}
                            style={{ width: orders.length ? `${(row.count / orders.length) * 100}%` : "0%" }}
                          />
                        </div>
                        <div className="text-xs text-zinc-300 font-mono w-8 text-right shrink-0">{row.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel breakdown */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Channel Breakdown (All Time)</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      orders.reduce((acc, o) => {
                        const ch = (o.channel || "unknown").toLowerCase();
                        acc[ch] = (acc[ch] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1]).map(([ch, count]) => (
                      <div key={ch} className="flex items-center gap-3">
                        <span className={`w-16 text-center px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${channelBadge(ch)}`}>{ch}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }}
                          />
                        </div>
                        <div className="text-xs text-zinc-300 font-mono w-8 text-right shrink-0">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* This week's orders */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-sm font-medium text-zinc-200">Orders This Week ({weekOrders.length})</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Customer</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Channel</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Total</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-zinc-500 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekOrders.map(o => (
                      <tr key={o.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="px-4 py-3 text-zinc-200">{o.customer_name || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${channelBadge(o.channel)}`}>
                            {o.channel || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-green-400">{fmt(orderTotal(o))}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-medium capitalize ${statusColor(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{fmtDate(o.created_at)}</td>
                      </tr>
                    ))}
                    {weekOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-xs">
                          No orders in the last 7 days
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
