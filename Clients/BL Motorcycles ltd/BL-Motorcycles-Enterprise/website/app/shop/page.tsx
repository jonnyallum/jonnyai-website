"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bike, ShoppingCart, Filter, ChevronLeft, ChevronRight, X, Package, Shield, Truck, Image as ImageIcon, Wrench, AlertTriangle, Weight, Info } from "lucide-react";
import Navbar from "@/components/Navbar";

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

// ── Image Gallery Component ──────────────────────────────────────────
function ImageGallery({ mainImage, additionalImages, title }: { mainImage: string; additionalImages: string[]; title: string }) {
  const allImages = [mainImage, ...(additionalImages || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col h-full">
      {/* Main image */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        <img
          src={allImages[activeIndex] || mainImage}
          alt={title}
          className="max-h-full max-w-full object-contain drop-shadow-2xl"
        />
      </div>
      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto border-t border-white/5 bg-black/20">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                i === activeIndex ? "border-brand-gold" : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={img} alt={`${title} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fitment Table Component ──────────────────────────────────────────
function FitmentTable({ fitments }: { fitments: any[] }) {
  if (!fitments || fitments.length === 0) return null;

  // Group fitments by make > model and collapse year ranges
  const grouped: Record<string, { model: string; cc: number | null; yearStart: number; yearEnd: number }[]> = {};

  for (const f of fitments) {
    if (!grouped[f.make]) grouped[f.make] = [];
    grouped[f.make].push({
      model: f.model,
      cc: f.cc,
      yearStart: f.year_start,
      yearEnd: f.year_end,
    });
  }

  // Collapse consecutive years into ranges per make+model+cc
  const collapsed: Record<string, { model: string; cc: number | null; years: string }[]> = {};

  for (const [make, models] of Object.entries(grouped)) {
    const modelMap: Record<string, { cc: number | null; years: number[] }> = {};

    for (const m of models) {
      const key = `${m.model}|${m.cc || ""}`;
      if (!modelMap[key]) modelMap[key] = { cc: m.cc, years: [] };
      if (m.yearStart) modelMap[key].years.push(m.yearStart);
      if (m.yearEnd && m.yearEnd !== m.yearStart) modelMap[key].years.push(m.yearEnd);
    }

    collapsed[make] = Object.entries(modelMap).map(([key, val]) => {
      const model = key.split("|")[0];
      const uniqueYears = [...new Set(val.years)].sort((a, b) => a - b);
      const years = uniqueYears.length > 0
        ? `${uniqueYears[0]}–${uniqueYears[uniqueYears.length - 1]}`
        : "";
      return { model, cc: val.cc, years };
    });
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Wrench size={16} className="text-brand-gold" />
        Fitment — Compatible Bikes
      </h3>
      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">Make</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">Model</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">CC</th>
              <th className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">Years</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(collapsed).flatMap(([make, models]) =>
              models.map((m, i) => (
                <tr key={`${make}-${m.model}-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-bold text-white">{i === 0 ? make : ""}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-300">{m.model}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-400 font-mono">{m.cc || "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-400 font-mono">{m.years || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Structured Description Component ─────────────────────────────────
function RichDescription({ product }: { product: any }) {
  const structured = product.structured_description;
  const hasStructured = structured && typeof structured === "object" && Object.keys(structured).length > 0;

  // If we have structured data from the API, render it nicely
  if (hasStructured) {
    return (
      <div className="mb-8 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Bike size={16} className="text-brand-gold" />
          Product Information
        </h3>

        {/* Title / main description */}
        <div className="text-sm text-zinc-300 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5">
          {product.title}
        </div>

        {/* Box Contents */}
        {structured.Contents && structured.Contents.length > 0 && (
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-3 flex items-center gap-2">
              <Package size={14} />
              Box Contents
            </h4>
            <ul className="space-y-1.5">
              {structured.Contents.map((item: string, i: number) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Important Information */}
        {structured.IMPORTANT_INFORMATION && structured.IMPORTANT_INFORMATION.length > 0 && (
          <div className="bg-orange-500/5 p-5 rounded-2xl border border-orange-500/20">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-orange-400 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} />
              Important Information
            </h4>
            <ul className="space-y-2">
              {structured.IMPORTANT_INFORMATION.map((item: string, i: number) => (
                <li key={i} className="text-sm text-zinc-300 leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Any other dynamic description sections */}
        {Object.entries(structured)
          .filter(([key]) => key !== "Contents" && key !== "IMPORTANT_INFORMATION")
          .map(([key, values]) => {
            if (!Array.isArray(values) || values.length === 0) return null;
            const label = key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
            return (
              <div key={key} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-300 mb-3 flex items-center gap-2">
                  <Info size={14} className="text-brand-gold" />
                  {label}
                </h4>
                <ul className="space-y-1.5">
                  {(values as string[]).map((item: string, i: number) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-brand-gold mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

        {/* Weight & specs row */}
        {(product.weight || product.subcategory) && (
          <div className="flex gap-3 flex-wrap">
            {product.weight && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-400">
                <Weight size={12} className="text-brand-gold" />
                {product.weight} kg
              </span>
            )}
            {product.subcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-400">
                {product.category} › {product.subcategory}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback: plain text description (existing behavior)
  if (product.description) {
    return (
      <div className="mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Bike size={16} className="text-brand-gold" />
          Product Information
        </h3>
        <div className="text-sm text-zinc-400 leading-relaxed font-mono whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
          {cleanDescription(product.description)}
        </div>
      </div>
    );
  }

  return null;
}

// ── Main Shop Component ──────────────────────────────────────────────
function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [fitments, setFitments] = useState<any[]>([]);
  const [loadingFitments, setLoadingFitments] = useState(false);

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

  // Fetch fitment data when a product is selected
  const fetchFitments = useCallback(async (sku: string) => {
    setLoadingFitments(true);
    setFitments([]);
    const { data } = await supabase
      .from("fitment")
      .select("make, model, cc, year_start, year_end")
      .eq("sku", sku)
      .order("make")
      .order("model");

    if (data) setFitments(data);
    setLoadingFitments(false);
  }, []);

  useEffect(() => {
    if (selectedProduct?.sku) {
      fetchFitments(selectedProduct.sku);
    }
  }, [selectedProduct?.sku, fetchFitments]);

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
                  <div key={i} className="bg-brand-gray border border-white/5 rounded-3xl h-[420px] animate-pulse"></div>
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedProduct(p)}
                    className="bg-brand-gray border border-white/5 rounded-3xl overflow-hidden group hover:border-brand-gold/50 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="relative h-64 bg-black/40 flex items-center justify-center p-8 overflow-hidden shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Bike className="w-16 h-16 text-white/10" />
                      )}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 uppercase tracking-widest text-zinc-400">
                        {p.brand || (p.supplier_id === 'LLEXETER' ? 'CMPO' : 'BIKE IT')}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                        {p.supplier_id === 'LLEXETER' ? 'CMPO' : 'BIKEIT'}
                      </div>
                      {/* Additional images indicator */}
                      {p.additional_images && Array.isArray(p.additional_images) && p.additional_images.length > 0 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold border border-white/10 flex items-center gap-1 text-zinc-400">
                          <ImageIcon size={10} />
                          {p.additional_images.length + 1}
                        </div>
                      )}
                      {p.stock_level <= 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm transform -rotate-12 border-2 border-red-400 shadow-2xl">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex justify-between">
                        <span>SKU: {p.sku}</span>
                        {p.category && <span className="text-brand-gold/70">{p.category.split('>').pop()}</span>}
                      </div>
                      <h3 className="font-bold text-sm mb-4 line-clamp-2 min-h-[40px] group-hover:text-brand-gold transition-colors leading-relaxed">{p.title}</h3>

                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <div className="text-2xl font-black text-brand-gold font-mono">&pound;{p.selling_price || p.retail_price}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">+&pound;6.50 P&P</div>
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${p.stock_level > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {p.stock_level > 0 ? `${p.stock_level} Left` : 'OOS'}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleBuy(p, e)}
                          disabled={buyingId === p.id || p.stock_level <= 0}
                          className="w-full bg-orange-600 hover:bg-orange-500 text-black p-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="p-4 rounded-2xl bg-brand-gray border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-all"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-bold font-mono">PAGE {page + 1} OF {Math.ceil(total / ITEMS_PER_PAGE) || 1}</span>
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

      {/* ── Enhanced Product Detail Modal ────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0c] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col sm:flex-row relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-white/10 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10 text-white"
              >
                <X size={20} />
              </button>

              {/* Image Side — now with gallery */}
              <div className="w-full sm:w-1/2 min-h-[300px] sm:min-h-[500px] bg-black/40 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col">
                {selectedProduct.image_url ? (
                  <ImageGallery
                    mainImage={selectedProduct.image_url}
                    additionalImages={selectedProduct.additional_images || []}
                    title={selectedProduct.title}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <Bike className="w-32 h-32 text-white/5" />
                  </div>
                )}
              </div>

              {/* Info Side — now with rich data */}
              <div className="w-full sm:w-1/2 p-8 sm:p-10 overflow-y-auto bg-gradient-to-br from-black to-[#050508] relative">
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {selectedProduct.brand && (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300">
                      {selectedProduct.brand}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                    SKU: {selectedProduct.sku}
                  </span>
                  {selectedProduct.ean && (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">
                      EAN: {selectedProduct.ean}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 leading-tight">{selectedProduct.title}</h2>
                <div className="text-zinc-500 text-sm mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                  Supplied directly by {selectedProduct.supplier_id === 'LLEXETER' ? 'CMPO' : 'Bike It'}
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-4xl sm:text-5xl font-black text-brand-gold font-mono">&pound;{selectedProduct.selling_price || selectedProduct.retail_price}</span>
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">+ &pound;6.50 P&P</span>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest mb-8 ${selectedProduct.stock_level > 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                  <Package size={16} />
                  {selectedProduct.stock_level > 0 ? `${selectedProduct.stock_level} Items In UK Warehouse` : "Currently Out of Stock"}
                </div>

                {/* Rich Description (structured or fallback) */}
                <RichDescription product={selectedProduct} />

                {/* Fitment Table */}
                {loadingFitments ? (
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Wrench size={16} className="text-brand-gold" />
                      Fitment — Compatible Bikes
                    </h3>
                    <div className="bg-white/5 rounded-2xl border border-white/5 p-8 text-center">
                      <div className="animate-pulse text-zinc-500 text-sm">Loading fitment data...</div>
                    </div>
                  </div>
                ) : (
                  <FitmentTable fitments={fitments} />
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
                    <Truck className="text-brand-gold shrink-0" size={20} />
                    <div>
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-white mb-1">Fast Dispatch</h4>
                      <p className="text-[10px] text-zinc-500">Usually dispatched within 24 hours via DPD/Royal Mail.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
                    <Shield className="text-brand-gold shrink-0" size={20} />
                    <div>
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-white mb-1">Fitment Guarantee</h4>
                      <p className="text-[10px] text-zinc-500">100% genuine replacement parts guaranteed.</p>
                    </div>
                  </div>
                </div>

                {/* Buy button (sticky) */}
                <div className="sticky bottom-0 bg-gradient-to-t from-[#050508] pt-8 pb-2">
                  <button
                    onClick={() => handleBuy(selectedProduct)}
                    disabled={buyingId === selectedProduct.id || selectedProduct.stock_level <= 0}
                    className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/20"
                  >
                    <ShoppingCart className={`w-5 h-5 ${buyingId === selectedProduct.id ? "animate-spin" : ""}`} />
                    {buyingId === selectedProduct.id ? 'Starting Secure Checkout...' : 'Buy This Part Now'}
                  </button>
                  <p className="text-center text-[10px] text-zinc-500 mt-4 uppercase tracking-widest">Payments secured by Stripe / Apple Pay</p>
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
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Loading parts catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
