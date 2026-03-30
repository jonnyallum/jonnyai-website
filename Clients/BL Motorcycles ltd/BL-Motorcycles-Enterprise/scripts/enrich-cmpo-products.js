/**
 * CMPO Product Enrichment Script
 * ================================
 * Pulls rich product data + fitment/compatibility from the Llexeter API
 * and updates Supabase with:
 *   - Multiple images (up to 9 per product)
 *   - Structured descriptions (contents, important info)
 *   - Weight, EAN, subcategory, part_name
 *   - Fitment/compatibility data (which bikes each part fits)
 *   - Correct brand names
 *
 * Usage: node enrich-cmpo-products.js
 *
 * Rate limiting: The script processes products sequentially with a small
 * delay to avoid overloading the Llexeter API.
 */

const { createClient } = require("@supabase/supabase-js");

// B&L Motorcycles Supabase
const SUPABASE_URL = "https://ddjuoeyaoxllockcusgf.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE";

const LLEXETER_API = "http://api.llexeter.co.uk";
const DELAY_MS = 200; // 200ms between API calls to be respectful

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ── Step 1: Get all CMPO/LLEXETER product SKUs from Supabase ─────────

async function getCMPOProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("sku, title, brand, description, image_url, enriched_at")
    .in("supplier_id", ["CMPO", "LLEXETER"])
    .order("sku");

  if (error) throw error;
  return data;
}

// ── Step 2: Enrich a single product from Llexeter API ────────────────

async function enrichProduct(sku) {
  // Fetch product detail
  let productData;
  try {
    productData = await fetchJSON(`${LLEXETER_API}/code/${sku}`);
  } catch (err) {
    console.warn(`  ⚠ Could not fetch /code/${sku}: ${err.message}`);
    return { product: null, fitment: null };
  }

  // Fetch compatibility/fitment
  let fitmentData = [];
  try {
    fitmentData = await fetchJSON(`${LLEXETER_API}/compatibility/${sku}`);
    if (!Array.isArray(fitmentData)) fitmentData = [];
  } catch (err) {
    console.warn(`  ⚠ Could not fetch /compatibility/${sku}: ${err.message}`);
  }

  return { product: productData, fitment: fitmentData };
}

// ── Step 3: Update Supabase with enriched data ───────────────────────

async function updateProduct(sku, apiData) {
  const updates = {
    additional_images: apiData.images || [],
    structured_description: apiData.desc || {},
    weight: apiData.weight || null,
    subcategory: apiData.subcategory || null,
    ean: apiData.ean || null,
    part_name: apiData.part_name || null,
    is_discontinued: apiData.discontinued === "1",
    enriched_at: new Date().toISOString(),
  };

  // Fix brand name: API returns proper category info we can use
  // The feed CSV has proper brand (Lextek, Cmpo) but DB has internal codes (V5954)
  if (apiData.name) {
    // Extract brand from product name (usually first word: "Lextek", "Cmpo", etc.)
    const nameParts = apiData.name.split(" ");
    if (["Lextek", "CMPO", "Cmpo"].includes(nameParts[0])) {
      updates.brand = nameParts[0] === "Cmpo" ? "CMPO" : nameParts[0];
    }
  }

  // Update image_url to higher resolution if available
  if (apiData.images && apiData.images.length > 0) {
    // Use the first image as the main image (highest quality)
    updates.image_url = apiData.images[0];
  }

  // Build a better description combining API structured data
  if (apiData.desc && Object.keys(apiData.desc).length > 0) {
    let richDesc = apiData.fullname || apiData.name || "";

    if (apiData.desc.Contents && apiData.desc.Contents.length > 0) {
      richDesc += "\n\nBox Contents:\n" + apiData.desc.Contents.map((c) => `• ${c}`).join("\n");
    }

    if (apiData.desc.IMPORTANT_INFORMATION && apiData.desc.IMPORTANT_INFORMATION.length > 0) {
      richDesc += "\n\nImportant Information:\n" + apiData.desc.IMPORTANT_INFORMATION.map((i) => `• ${i}`).join("\n");
    }

    // Add any other desc keys dynamically
    for (const [key, values] of Object.entries(apiData.desc)) {
      if (key === "Contents" || key === "IMPORTANT_INFORMATION") continue;
      if (Array.isArray(values) && values.length > 0) {
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        richDesc += `\n\n${label}:\n` + values.map((v) => `• ${v}`).join("\n");
      }
    }

    updates.description = richDesc;
  }

  const { error } = await supabase.from("products").update(updates).eq("sku", sku);

  if (error) {
    console.error(`  ✗ Failed to update product ${sku}:`, error.message);
    return false;
  }
  return true;
}

async function upsertFitment(sku, fitmentList) {
  if (!fitmentList || fitmentList.length === 0) return 0;

  // First, delete existing fitment for this SKU (to avoid duplicates on re-run)
  await supabase.from("fitment").delete().eq("sku", sku);

  // Map API fitment data to our schema
  const rows = fitmentList.map((f) => ({
    sku,
    make: f.make || f.manufacturer || "",
    model: f.model || "",
    cc: f.cc ? parseInt(f.cc, 10) : null,
    year_start: f.year_start || f.yearStart || f.from_year ? parseInt(f.year_start || f.yearStart || f.from_year, 10) : null,
    year_end: f.year_end || f.yearEnd || f.to_year ? parseInt(f.year_end || f.yearEnd || f.to_year, 10) : null,
    is_verified: true,
  }));

  // Insert in batches of 500
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error } = await supabase.from("fitment").insert(batch);
    if (error) {
      console.error(`  ✗ Fitment insert failed for ${sku} batch ${i}:`, error.message);
    } else {
      inserted += batch.length;
    }
  }
  return inserted;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   BL Motorcycles — CMPO Product Enrichment Script   ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // Get all CMPO products
  const products = await getCMPOProducts();
  console.log(`Found ${products.length} CMPO/LLEXETER products in Supabase.\n`);

  // Filter: only enrich products that haven't been enriched yet (or re-run all with --force)
  const forceAll = process.argv.includes("--force");
  const toEnrich = forceAll
    ? products
    : products.filter((p) => !p.enriched_at);

  console.log(`${toEnrich.length} products to enrich${forceAll ? " (--force mode)" : " (skipping already enriched)"}.\n`);

  if (toEnrich.length === 0) {
    console.log("Nothing to do! Use --force to re-enrich all products.");
    return;
  }

  let stats = { enriched: 0, fitmentAdded: 0, errors: 0 };

  for (let i = 0; i < toEnrich.length; i++) {
    const { sku } = toEnrich[i];
    const progress = `[${i + 1}/${toEnrich.length}]`;

    process.stdout.write(`${progress} ${sku} ... `);

    try {
      const { product, fitment } = await enrichProduct(sku);

      if (product) {
        const updated = await updateProduct(sku, product);
        if (updated) {
          const fitCount = await upsertFitment(sku, fitment);
          stats.enriched++;
          stats.fitmentAdded += fitCount;
          console.log(`✓ enriched (${product.images?.length || 0} images, ${fitCount} fitments)`);
        }
      } else {
        stats.errors++;
        console.log("✗ no API data");
      }
    } catch (err) {
      stats.errors++;
      console.log(`✗ error: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log(`✓ Enriched: ${stats.enriched} products`);
  console.log(`✓ Fitment records added: ${stats.fitmentAdded}`);
  console.log(`✗ Errors: ${stats.errors}`);
  console.log("══════════════════════════════════════════════════════");
}

main().catch(console.error);
