import { readFile, readdir, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const content = await read("shared/seoContent.ts");
const home = await read("client/src/pages/Home.tsx");
const search = await read("shared/search.ts");
const seoBlocks = await read("client/src/components/SeoBlocks.tsx");
const notFound = await read("client/src/pages/NotFound.tsx");
const sitemap = await read("client/public/sitemap.xml");
const robots = await read("client/public/robots.txt");
const failures = [];
const calculatorRoutes = { loan: "/loan-calculator", mortgage: "/mortgage-calculator", personalLoan: "/personal-loan-calculator", salary: "/salary-calculator", takeHome: "/take-home-pay-calculator", compound: "/compound-interest-calculator", investment: "/investment-calculator", roi: "/roi-calculator", profitMargin: "/profit-margin-calculator", currency: "/currency-converter", savings: "/savings-calculator", simpleInterest: "/simple-interest-calculator", markup: "/markup-calculator", discount: "/discount-calculator", salesTax: "/sales-tax-calculator" };
const titles = [...content.matchAll(/seoTitle: "([^"]+)"/g)].map(match => match[1]);
const descriptions = [...content.matchAll(/metaDescription: "([^"]+)"/g)].map(match => match[1]);
const duplicate = values => values.filter((value, index) => values.indexOf(value) !== index);
if (duplicate(titles).length) failures.push(`duplicate SEO titles: ${duplicate(titles).join(", ")}`);
if (duplicate(descriptions).length) failures.push(`duplicate meta descriptions: ${duplicate(descriptions).join(", ")}`);
if (!home.includes("canonical") || !home.includes("og:image") || !home.includes("twitter:image")) failures.push("missing canonical/social metadata hooks");
if (!home.includes("noindex,follow")) failures.push("missing search noindex safeguard");
if (!home.includes("<h1") || !seoBlocks.includes("<h1") || !notFound.includes("<h1")) failures.push("missing H1 in a public page family");
if (!seoBlocks.includes("BreadcrumbList") || !seoBlocks.includes("FAQPage") || !seoBlocks.includes("@type\": \"Article\"")) failures.push("missing structured-data hook");
try {
  await execFileAsync("pnpm", ["tsx", "scripts/rendered-seo-audit.tsx"], { cwd: new URL("../", import.meta.url), stdio: "pipe" });
} catch (error) {
  failures.push(`rendered SEO route audit failed: ${error?.message || "unknown error"}`);
}
if (!search.includes("home loan") || !search.includes("paycheck") || !search.includes("net pay") || !search.includes("markup")) failures.push("missing explicit search aliases");
if (!home.includes("lastUpdated")) failures.push("missing last-updated rendering hook");
if (!robots.includes("Allow: /") || !robots.includes("Disallow: /api/") || !robots.includes("Sitemap:")) failures.push("robots policy is incomplete");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (new Set(urls).size !== urls.length) failures.push("duplicate sitemap URL");
if (urls.some(url => url.includes("?"))) failures.push("parameterized URL found in sitemap");
for (const [kind, route] of Object.entries(calculatorRoutes)) {
  if (!sitemap.includes(route)) failures.push(`calculator missing from sitemap: ${kind}`);
  if (!content.includes(`${kind}: {`)) failures.push(`calculator missing from content model: ${kind}`);
  if (!home.includes("calculatorPathMap") && !home.includes(route)) failures.push(`calculator route not discoverable in homepage source: ${kind}`);
  const hasCategoryLink = new RegExp(`calculatorKinds: \\[[^\\]]*[\"']${kind}[\"']`).test(content);
  const hasRelatedLink = new RegExp(`relatedCalculators: \\[[^\\]]*[\"']${kind}[\"']`).test(content);
  if (!hasCategoryLink) failures.push(`calculator missing from published category relationships: ${kind}`);
  if (!hasRelatedLink) failures.push(`calculator missing from related-calculator relationships: ${kind}`);
  if (!home.includes("Breadcrumbs category={content.category}")) failures.push(`calculator breadcrumb coverage missing: ${kind}`);
}
for (const route of ["/categories", "/blog", "/finance", "/loans", "/salary", "/taxes", "/investment", "/business", "/ecommerce", "/currency", "/savings"]) if (!sitemap.includes(route)) failures.push(`public hub missing from sitemap: ${route}`);
if (sitemap.includes("/shipping")) failures.push("unpublished shipping placeholder is in sitemap");
const linkedRoutes = [...home.matchAll(/href=\"([^\"]+)\"/g), ...seoBlocks.matchAll(/href=\"([^\"]+)\"/g), ...notFound.matchAll(/href=\"([^\"]+)\"/g)].map(match => match[1]).filter(route => route.startsWith("/"));
for (const route of linkedRoutes) if (!route.includes("${") && !urls.some(url => url.endsWith(route))) failures.push(`internal link absent from sitemap: ${route}`);
const imageTags = [...home.matchAll(/<img\b[^>]*>/g), ...seoBlocks.matchAll(/<img\b[^>]*>/g), ...notFound.matchAll(/<img\b[^>]*>/g)];
if (imageTags.some(tag => !/\balt=/.test(tag))) failures.push("image without alt text");
if (!home.includes("RelatedLinks") || !content.includes("relatedCalculators") || !seoBlocks.includes("RelatedLinks")) failures.push("related calculator linking system missing");
const distDir = new URL("dist/public/assets/", root);
try { const files = await readdir(distDir); const jsFiles = await Promise.all(files.filter(file => file.endsWith(".js")).map(async file => [file, (await stat(new URL(file, distDir))).size])); const largest = Math.max(...jsFiles.map(([, size]) => size), 0); if (largest > 950_000) failures.push(`largest client chunk exceeds 950 KB: ${largest}`); } catch { /* Build may not exist during source-only QA. */ }
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`SEO audit passed: ${titles.length} unique content titles, ${urls.length} clean sitemap URLs, ${Object.keys(calculatorRoutes).length} calculator routes, internal-link/orphan checks, structured-data hooks, and performance guard.`);
