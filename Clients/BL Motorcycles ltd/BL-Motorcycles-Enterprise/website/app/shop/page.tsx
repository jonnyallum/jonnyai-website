"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bike, ShoppingCart, Filter, ChevronLeft, ChevronRight, X, Package, Shield, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Supabase Init (B&L PROJECT)
const supabase = createClient(
  "https://ddjuoeyaoxllockcusgf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
);

function cleanDescription(desc: string) {
  if (!desc) return "";
  const cleanText = desc.replace(/<[^>]*>/g, '').trim();
  return cleanText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const ITEMS_PER_PAGE = 24;

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .not("image_url", "is", null)
      .neq("image_url", "")
      .in("supplier_id", ["BIKEIT", "CMPO", "LLEXETER"])
      .order("stock_level", { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      const cleanSearch = search.trim();
      const noSpaceSearch = cleanSearch.replace(/\s+/g, '');

      if (noSpaceSearch !== cleanSearch) {
        query = query.or(`title.ilike.%${cleanSearch}%,sku.ilike.%${cleanSearch}%,sku.ilike.%${noSpaceSearch}%`);
      } else {
        query = query.or(`title.ilike.%${cleanSearch}%,sku.ilike.%${cleanSearch}%`);
      }
    }

    const { data, count } = await query;
    if (data) {
      setProducts(data);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearch(query);
      setPage(0);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, page]);

  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (product: any, e?: any) => {
    if (e) e.stopPropagation();
    setBuyingId(product.id);
    try {
      const res = await fetch(
        "https://lkwydqtfbdjhxaarelaz.supabase.co/functions/v1/stripe-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: product.sku,
            quantity: 1,
            title: product.title,
            price: product.selling_price || product.retail_price,
            image_url: product.image_url,
            success_url: window.location.origin + "/shop?success=1",
            cancel_url: window.location.origin + "/shop",
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Unable to start checkout. Please try again or call us on 07881 274193.");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-white p-8 pt-28">
        {/* Search Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-heading font-bold uppercase tracking-tight mb-2">Parts Catalogue</h1>
              <p className="text-muted text-sm">{total.toLocaleString()} genuine parts in stock, dispatched from Fareham, Hampshire.</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search by part name or fitment..."
                className="w-full bg-card border border-brand-gold/20 py-4 pl-12 pr-6 focus:border-brand-gold outline-none transition-all placeholder:text-gray-600 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card border border-brand-gold/10 h-[420px] animate-pulse"></div>
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedProduct(p)}
                    className="bg-card tech-border overflow-hidden group hover:border-brand-gold/50 hover:shadow-[0_0_20px_rgba(211,192,101,0.1)] transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative h-64 bg-black/40 flex items-center justify-center p-8 overflow-hidden shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Bike className="w-16 h-16 text-white/10" />
                      )}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold border border-brand-gold/20 uppercase tracking-widest text-zinc-400">
                        {p.brand || (p.supplier_id === 'LLEXETER' ? 'CMPO' : 'BIKE IT')}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold border border-brand-gold/20">
                        {p.supplier_id === 'LLEXETER' ? 'CMPO' : 'BIKEIT'}
                      </div>
                      {p.stock_level <= 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white font-black px-4 py-2 text-sm transform -rotate-12 border-2 border-red-400 shadow-2xl">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex justify-between font-mono">
                        <span>SKU: {p.sku}</span>
                        {p.category && <span className="text-brand-gold/70">{p.category.split('>').pop()}</span>}
                      </div>
                      <h3 className="font-bold text-sm mb-4 line-clamp-2 min-h-[40px] group-hover:text-brand-gold transition-colors leading-relaxed">{p.title}</h3>

                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <div className="text-2xl font-black text-brand-gold font-mono">&pound;{p.selling_price || p.retail_price}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">+&pound;6.50 P&P</div>
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${p.stock_level > 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {p.stock_level > 0 ? `${p.stock_level} Left` : 'OOS'}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleBuy(p, e)}
                          disabled={buyingId === p.id || p.stock_level <= 0}
                          className="w-full bg-primary text-primary-foreground p-3 font-heading font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 clip-chamfer hover:bg-primary/90"
                        >
                          <ShoppingCart className={`w-4 h-4 ${buyingId === p.id ? "animate-spin" : ""}`} />
                          {buyingId === p.id ? 'Processing...' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  No parts matching your search criteria.
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center gap-4 items-center">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="p-4 bg-card border border-brand-gold/20 disabled:opacity-30 hover:border-brand-gold/50 transition-all"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-bold font-mono uppercase tracking-wider">Page {page + 1} of {Math.ceil(total / ITEMS_PER_PAGE) || 1}</span>
            <button
              disabled={products.length < ITEMS_PER_PAGE}
              onClick={() => setPage(p => p + 1)}
              className="p-4 bg-card border border-brand-gold/20 disabled:opacity-30 hover:border-brand-gold/50 transition-all"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background border border-brand-gold/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col sm:flex-row relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-white/10 flex items-center justify-center transition-all backdrop-blur-md border border-brand-gold/20 text-white"
              >
                <X size={20} />
              </button>

              {/* Image Side */}
              <div className="w-full sm:w-1/2 min-h-[300px] sm:min-h-[500px] bg-black/40 flex items-center justify-center p-8 border-b sm:border-b-0 sm:border-r border-brand-gold/10">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.title} className="max-h-full object-contain drop-shadow-2xl" />
                ) : (
                  <Bike className="w-32 h-32 text-white/5" />
                )}
              </div>

              {/* Info Side */}
              <div className="w-full sm:w-1/2 p-8 sm:p-12 overflow-y-auto bg-gradient-to-br from-black to-background relative">
                <div className="flex items-center gap-3 mb-6">
                  {selectedProduct.brand && (
                    <span className="px-3 py-1 bg-white/5 border border-brand-gold/20 text-xs font-bold uppercase tracking-wider text-zinc-300">
                      {selectedProduct.brand}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/5 border border-brand-gold/20 text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                    SKU: {selectedProduct.sku}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight mb-2 leading-tight">{selectedProduct.title}</h2>
                <div className="text-zinc-500 text-sm mb-8 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-gold"></span>
                  Supplied directly by {selectedProduct.supplier_id === 'LLEXETER' ? 'CMPO' : 'Bike It'}
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-4xl sm:text-5xl font-black text-brand-gold font-mono">&pound;{selectedProduct.selling_price || selectedProduct.retail_price}</span>
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">+ &pound;6.50 P&P</span>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-black uppercase tracking-widest mb-10 ${selectedProduct.stock_level > 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                  <Package size={16} />
                  {selectedProduct.stock_level > 0 ? `${selectedProduct.stock_level} Items In UK Warehouse` : "Currently Out of Stock"}
                </div>

                {selectedProduct.description && (
                  <div className="mb-10">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Bike size={16} className="text-brand-gold" />
                      Product Information
                    </h3>
                    <div className="text-sm text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap bg-white/5 p-6 border border-brand-gold/10">
                      {cleanDescription(selectedProduct.description)}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 border border-brand-gold/10 p-4 flex gap-3">
                    <Truck className="text-brand-gold shrink-0" size={20} />
                    <div>
                      <h4 className="text-[10px] font-heading font-bold tracking-widest uppercase text-white mb-1">Fast Dispatch</h4>
                      <p className="text-[10px] text-zinc-500">Usually dispatched within 24 hours via DPD/Royal Mail.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-brand-gold/10 p-4 flex gap-3">
                    <Shield className="text-brand-gold shrink-0" size={20} />
                    <div>
                      <h4 className="text-[10px] font-heading font-bold tracking-widest uppercase text-white mb-1">Fitment Guarantee</h4>
                      <p className="text-[10px] text-zinc-500">100% genuine replacement parts guaranteed.</p>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gradient-to-t from-background pt-10 pb-2">
                  <button
                    onClick={() => handleBuy(selectedProduct)}
                    disabled={buyingId === selectedProduct.id || selectedProduct.stock_level <= 0}
                    className="w-full h-14 bg-primary text-primary-foreground font-heading font-bold text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 clip-chamfer hover:bg-primary/90"
                  >
                    <ShoppingCart className={`w-5 h-5 ${buyingId === selectedProduct.id ? "animate-spin" : ""}`} />
                    {buyingId === selectedProduct.id ? 'Starting Secure Checkout...' : 'Buy This Part Now'}
                  </button>
                  <p className="text-center text-[10px] text-zinc-500 mt-4 uppercase tracking-widest font-mono">Payments secured by Stripe / Apple Pay</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-white">Loading parts catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
