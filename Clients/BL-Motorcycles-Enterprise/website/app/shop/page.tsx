"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bike, ShoppingCart, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

// Supabase Init (B&L PROJECT)
const supabase = createClient(
  "https://ddjuoeyaoxllockcusgf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
);

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 24;

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .not("image_url", "is", null)
      .neq("image_url", "")
      .order("stock_level", { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      query = query.ilike("title", `%${search}%`);
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
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  }, [search, page]);

  const [buyingId, setBuyingId] = useState<string | null>(null);

  const handleBuy = async (product: any) => {
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
    <main className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter">Parts Catalogue</h1>
            <p className="text-gray-500 text-sm">{total.toLocaleString()} genuine parts in stock, dispatched from Fareham, Hampshire.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search by part name or fitment..."
              className="w-full bg-brand-gray border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-brand-gold outline-none transition-all placeholder:text-gray-600"
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
                <div key={i} className="bg-brand-gray border border-white/5 rounded-3xl h-96 animate-pulse"></div>
              ))
            ) : products.length > 0 ? (
              products.map((p) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="bg-brand-gray border border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/50 transition-all"
                >
                  <div className="relative h-64 bg-black/40 flex items-center justify-center p-8 overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Bike className="w-16 h-16 text-white/10" />
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                      {p.supplier_id === 'LLEXETER' ? 'CMPO' : 'BIKEIT'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 h-10 group-hover:text-brand-gold transition-colors">{p.title}</h3>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <div className="text-2xl font-black text-brand-gold">£{p.selling_price || p.retail_price}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${p.stock_level > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {p.stock_level > 0 ? `${p.stock_level} IN STOCK` : 'OUT OF STOCK'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuy(p)}
                        disabled={buyingId === p.id}
                        className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-brand-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-wait"
                      >
                        <ShoppingCart className={`w-5 h-5 ${buyingId === p.id ? "animate-spin" : ""}`} />
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
            className="p-4 rounded-2xl bg-brand-gray border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-all"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm font-bold font-mono">PAGE {page + 1} OF {Math.ceil(total / ITEMS_PER_PAGE)}</span>
          <button 
            disabled={products.length < ITEMS_PER_PAGE}
            onClick={() => setPage(p => p + 1)}
            className="p-4 rounded-2xl bg-brand-gray border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-all"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </main>
    </>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Loading parts catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
