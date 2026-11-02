import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://www.dawacoffeemachienesandaccessories.com";
const API_URL = (process.env.VITE_API_URL || "https://api.dawacoffeemachienesandaccessories.com/api").replace(/\/$/, "");
const DIST = path.resolve("dist");

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const slugify = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const productId = (product) => String(product._id || product.id || "");
const productUrl = (id) => `${SITE_URL}/product/${encodeURIComponent(id)}`;
const categoryUrl = (category) => `${SITE_URL}/category/${slugify(category)}`;
const priceValue = (price) => {
  const value = Number(String(price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
};

const response = await fetch(`${API_URL}/products`);
if (!response.ok) throw new Error(`SEO build could not fetch the product catalog (${response.status})`);
const products = (await response.json()).filter((product) => productId(product) && product.title && product.category);
const categories = [...new Set(products.map((product) => product.category))].sort();
const baseHtml = await readFile(path.join(DIST, "index.html"), "utf8");

function makePage({ title, description, url, content, schema }) {
  let html = baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escapeHtml(url)}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${escapeHtml(url)}" />`)
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  if (schema) {
    const marker = schema["@type"] === "Product" ? ' data-page-product-schema="true"' : "";
    html = html.replace("</head>", `<script type="application/ld+json"${marker}>${JSON.stringify(schema).replace(/</g, "\\u003c")}</script></head>`);
  }
  return html;
}

for (const product of products) {
  const id = productId(product);
  const url = productUrl(id);
  const title = `${product.title} | Dawa Coffee Machines Kenya`;
  const description = `${product.title} from Dawa Coffee Machines in Nairobi, Kenya. ${product.category}. ${String(product.description || "Contact us for details.").slice(0, 180)}`;
  const image = product.image || "";
  const itemCondition = product.condition === "New" ? "NewCondition" : "UsedCondition";
  const amount = priceValue(product.price);
  const schema = amount ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image,
    category: product.category,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "KES",
      price: amount,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: `https://schema.org/${itemCondition}`,
    },
  } : null;
  const content = `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products">Products</a> / ${escapeHtml(product.category)}</nav><article><p>${escapeHtml(product.category)} · ${escapeHtml(product.condition || "")}</p><h1>${escapeHtml(product.title)}</h1>${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.title)}" width="640" />` : ""}${product.price ? `<p>KES ${escapeHtml(product.price)}</p>` : ""}<p>${escapeHtml(product.description)}</p><p>Availability: ${product.stock > 0 ? "In stock" : "Contact us to confirm availability"}</p><p><a href="tel:+254114100019">Call Dawa</a> · <a href="https://wa.me/254114100019?text=${encodeURIComponent(`Hi, I'm interested in: ${product.title}`)}">Ask about this product on WhatsApp</a></p></article></main>`;
  const output = path.join(DIST, "product", id, "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, makePage({ title, description, url, content, schema }));
}

for (const category of categories) {
  const url = categoryUrl(category);
  const items = products.filter((product) => product.category === category);
  const title = `${category} in Kenya | Dawa Coffee Machines`;
  const description = `Browse ${category.toLowerCase()} available from Dawa Coffee Machines in Nairobi, Kenya. Contact us to confirm current stock and pricing.`;
  const links = items.map((product) => `<li><a href="/product/${encodeURIComponent(productId(product))}">${escapeHtml(product.title)}</a>${product.price ? ` — KES ${escapeHtml(product.price)}` : ""}</li>`).join("");
  const content = `<main><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/products">Products</a> / ${escapeHtml(category)}</nav><h1>${escapeHtml(category)} in Kenya</h1><p>Explore ${escapeHtml(category.toLowerCase())} from Dawa Coffee Machines in Nairobi. Contact us to confirm current availability, pricing and support for your business.</p><ul>${links}</ul><p><a href="/contact">Contact Dawa about ${escapeHtml(category.toLowerCase())}</a></p></main>`;
  const output = path.join(DIST, "category", slugify(category), "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, makePage({ title, description, url, content }));
}

const categoryLinks = categories.map((category) => `<li><a href="/category/${slugify(category)}">${escapeHtml(category)} in Kenya</a></li>`).join("");
const productLinks = products.map((product) => `<li><a href="/product/${encodeURIComponent(productId(product))}">${escapeHtml(product.title)}</a></li>`).join("");
const staticPages = [
  {
    route: "products",
    title: "Coffee Machines, Spare Parts & Equipment | Dawa Kenya",
    description: "Browse available coffee machines, spare parts and commercial equipment from Dawa in Nairobi, Kenya. Contact us to confirm stock and pricing.",
    content: `<main><h1>Coffee machines and commercial equipment in Kenya</h1><p>Browse current coffee machines, spare parts and business equipment available from Dawa in Nairobi. Contact us to confirm stock, pricing and support.</p><h2>Shop by category</h2><ul>${categoryLinks}</ul><h2>Current products</h2><ul>${productLinks}</ul></main>`,
  },
  {
    route: "about",
    title: "About Dawa Coffee Machines | Nairobi, Kenya",
    description: "Learn about Dawa Coffee Machines and Accessories, a Nairobi supplier of tested coffee machines, genuine spare parts and commercial business equipment.",
    content: `<main><h1>About Dawa Coffee Machines and Business Equipment</h1><p>Dawa supplies coffee machines, genuine spare parts and commercial equipment to cafes, restaurants and businesses in Nairobi and across Kenya.</p><p>Our team helps customers choose suitable equipment and confirm condition, availability and pricing before purchase.</p><p><a href="/products">Browse current products</a> or <a href="/contact">contact Dawa</a> for assistance.</p></main>`,
  },
  {
    route: "contact",
    title: "Contact Dawa Coffee Machines | Eastleigh, Nairobi",
    description: "Contact Dawa in Eastleigh, Nairobi for coffee machine sales, spare parts and commercial equipment enquiries. Call, WhatsApp or visit by appointment.",
    content: `<main><h1>Contact Dawa Coffee Machines in Nairobi</h1><p>Ask about coffee machines, spare parts and commercial equipment at our Eastleigh, Nairobi location.</p><p>Call <a href="tel:+254114100019">+254 114 100 019</a> or <a href="https://wa.me/254114100019">message us on WhatsApp</a>.</p><address>1st Avenue, Melawa Road, near Bustan Tower, Eastleigh, Nairobi, Kenya.</address><p>Monday–Friday: 10:00–17:00. Saturday: 09:00–12:00. Visits by appointment.</p></main>`,
  },
];
for (const page of staticPages) {
  const url = `${SITE_URL}/${page.route}`;
  const output = path.join(DIST, page.route, "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, makePage({ title: page.title, description: page.description, url, content: page.content }));
}
const homeContent = `<main><h1>Coffee machines and commercial equipment in Kenya</h1><p>Dawa Coffee Machines supplies tested coffee machines, genuine spare parts and business equipment in Nairobi, Kenya. Contact us for current stock and expert support.</p><h2>Browse equipment</h2><ul>${categoryLinks}</ul><p><a href="/products">View all current products</a> · <a href="/contact">Contact Dawa in Nairobi</a></p><h2>Why choose Dawa?</h2><p>Get help selecting equipment for your cafe, restaurant or business. Ask us about condition, availability, pricing and support before you buy.</p></main>`;
await writeFile(path.join(DIST, "index.html"), makePage({
  title: "Coffee Machines & Commercial Equipment in Kenya | Dawa",
  description: "Shop tested coffee machines, genuine spare parts and commercial catering equipment in Nairobi, Kenya. Contact Dawa for current stock and expert support.",
  url: `${SITE_URL}/`,
  content: homeContent,
}));

const staticUrls = ["/", "/products", "/about", "/contact"];
const urls = [
  ...staticUrls.map((url) => `<url><loc>${SITE_URL}${url}</loc></url>`),
  ...categories.map((category) => `<url><loc>${categoryUrl(category)}</loc></url>`),
  ...products.map((product) => `<url><loc>${productUrl(productId(product))}</loc>${product.updatedAt ? `<lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>` : ""}</url>`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
await writeFile(path.join(DIST, "sitemap.xml"), sitemap);
await writeFile(path.resolve("public/sitemap.xml"), sitemap);
console.log(`Generated ${products.length} product pages, ${categories.length} category pages and sitemap entries.`);
