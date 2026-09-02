import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RouteContent } from "../client/src/pages/Home";
import { calculatorContent, categoryContent, publishedCategoryOrder, blogArticles } from "../shared/seoContent";
import type { CalculatorKind } from "../shared/calculators";

const routes: Record<CalculatorKind, string> = { loan: "/loan-calculator", mortgage: "/mortgage-calculator", personalLoan: "/personal-loan-calculator", salary: "/salary-calculator", takeHome: "/take-home-pay-calculator", compound: "/compound-interest-calculator", investment: "/investment-calculator", roi: "/roi-calculator", profitMargin: "/profit-margin-calculator", currency: "/currency-converter", savings: "/savings-calculator", simpleInterest: "/simple-interest-calculator", markup: "/markup-calculator", discount: "/discount-calculator", salesTax: "/sales-tax-calculator" };
const labels: Record<CalculatorKind, string> = { loan: "Loan Calculator", mortgage: "Mortgage Calculator", personalLoan: "Personal Loan Calculator", salary: "Salary Calculator", takeHome: "Take-Home Pay Calculator", compound: "Compound Interest Calculator", investment: "Investment Calculator", roi: "ROI Calculator", profitMargin: "Profit Margin Calculator", currency: "Currency Converter", savings: "Savings Calculator", simpleInterest: "Simple Interest Calculator", markup: "Markup Calculator", discount: "Discount Calculator", salesTax: "Sales Tax Calculator" };

function renderRoute(location: string) {
  Object.defineProperty(globalThis, "window", { value: { location: { origin: "https://moneycalci.test", pathname: location } }, configurable: true });
  Object.defineProperty(globalThis, "location", { value: { pathname: location }, configurable: true });
  return renderToStaticMarkup(<RouteContent location={location} />);
}

describe("SEO route coverage", () => {
  it("renders one H1 and real breadcrumb/related links for every calculator route", () => {
    const categoryKinds = publishedCategoryOrder.flatMap(slug => categoryContent[slug].calculatorKinds);
    for (const [kind, route] of Object.entries(routes) as [CalculatorKind, string][]) {
      const content = calculatorContent[kind];
      const markup = renderRoute(route);
      expect((markup.match(/<h1\b/g) ?? []).length, route).toBe(1);
      expect(markup).toContain(`href=\"/${content.category}\"`);
      expect(markup).toContain(`Updated ${content.lastUpdated}`);
      expect(markup).toMatch(new RegExp(`aria-current=\"page\"[^>]*>${labels[kind]}<`));
      expect(categoryKinds).toContain(kind);
      for (const relatedKind of content.relatedCalculators) expect(markup).toContain(`href=\"${routes[relatedKind]}\"`);
    }
  });

  it("keeps representative public routes at one H1 and preserves real JSON-LD payloads", () => {
    const articleRoute = `/blog/${blogArticles[0].slug}`;
    for (const route of ["/", "/calculators", "/finance", "/blog", articleRoute, "/does-not-exist"]) {
      const markup = renderRoute(route);
      expect((markup.match(/<h1\b/g) ?? []).length, route).toBe(1);
    }
    const articleMarkup = renderRoute(articleRoute);
    const jsonTexts = articleMarkup.split('<script type="application/ld+json">').slice(1).map(part => part.split("</script>")[0]);
    const schemas = jsonTexts.map(value => JSON.parse(value));
    expect(schemas.some(schema => schema["@type"] === "Article" && schema.dateModified === calculatorContent[blogArticles[0].calculatorKind].lastUpdated)).toBe(true);
  });

  it("keeps the reserved shipping hub unpublished and out of sitemap", () => {
    const sitemap = readFileSync(new URL("../client/public/sitemap.xml", import.meta.url), "utf8");
    expect(publishedCategoryOrder).not.toContain("shipping");
    expect(sitemap).not.toContain("/shipping");
  });
});
