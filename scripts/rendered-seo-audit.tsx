import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RouteContent } from "../client/src/pages/Home";
import { blogArticles, calculatorContent } from "../shared/seoContent";
import type { CalculatorKind } from "../shared/calculators";

const routes: Record<CalculatorKind, string> = { loan: "/loan-calculator", mortgage: "/mortgage-calculator", personalLoan: "/personal-loan-calculator", salary: "/salary-calculator", takeHome: "/take-home-pay-calculator", compound: "/compound-interest-calculator", investment: "/investment-calculator", roi: "/roi-calculator", profitMargin: "/profit-margin-calculator", currency: "/currency-converter", savings: "/savings-calculator" };
const labels: Record<CalculatorKind, string> = { loan: "Loan Calculator", mortgage: "Mortgage Calculator", personalLoan: "Personal Loan Calculator", salary: "Salary Calculator", takeHome: "Take-Home Pay Calculator", compound: "Compound Interest Calculator", investment: "Investment Calculator", roi: "ROI Calculator", profitMargin: "Profit Margin Calculator", currency: "Currency Converter", savings: "Savings Calculator" };
const articleRoute = `/blog/${blogArticles[0].slug}`;
const representatives = ["/", "/calculators", "/finance", "/blog", articleRoute, "/does-not-exist"];

function renderRoute(route: string) {
  Object.defineProperty(globalThis, "window", { value: { location: { origin: "https://moneycalci.test", pathname: route } }, configurable: true });
  Object.defineProperty(globalThis, "location", { value: { pathname: route }, configurable: true });
  return renderToStaticMarkup(<RouteContent location={route} />);
}

function schemas(markup: string) {
  return Array.from(markup.matchAll(/<script\b(?=[^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g), match => JSON.parse(match[1]));
}

const failures: string[] = [];
for (const route of representatives) {
  const markup = renderRoute(route);
  if ((markup.match(/<h1\b/g) ?? []).length !== 1) failures.push(`${route}: expected exactly one H1`);
  for (const schema of schemas(markup)) {
    if (schema["@context"] !== "https://schema.org" || typeof schema["@type"] !== "string") failures.push(`${route}: invalid JSON-LD context/type`);
  }
}
for (const [kind, route] of Object.entries(routes) as [CalculatorKind, string][]) {
  const markup = renderRoute(route);
  const parsed = schemas(markup);
  const content = calculatorContent[kind];
  if (!parsed.some(schema => schema["@type"] === "BreadcrumbList")) failures.push(`${route}: missing BreadcrumbList`);
  if (!parsed.some(schema => schema["@type"] === "FAQPage")) failures.push(`${route}: missing FAQPage`);
  const appSchema = parsed.find(schema => schema["@type"] === "SoftwareApplication");
  if (!appSchema || appSchema.applicationCategory !== "FinanceApplication" || appSchema.offers?.price !== "0") failures.push(`${route}: missing valid SoftwareApplication schema`);
  if (!markup.includes(`>${labels[kind]}<`)) failures.push(`${route}: current calculator label is not rendered in the page content`);
}
const articleSchemas = schemas(renderRoute(articleRoute));
if (!articleSchemas.some(schema => schema["@type"] === "Article" && schema.dateModified === calculatorContent[blogArticles[0].calculatorKind].lastUpdated)) failures.push(`${articleRoute}: missing current Article dateModified`);
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Rendered SEO audit passed: ${representatives.length} representative routes, ${Object.keys(routes).length} calculator routes, and parsed JSON-LD payloads.`);
