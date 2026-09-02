import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogArticlePage } from "../client/src/components/SeoBlocks";
import { blogArticles, calculatorContent } from "../shared/seoContent";

describe("SEO content rendering", () => {
  it("renders the centralized lastUpdated date and parseable Article JSON-LD", () => {
    const article = blogArticles[0];
    Object.defineProperty(globalThis, "window", { value: { location: { origin: "https://moneycalci.test" } }, configurable: true });
    Object.defineProperty(globalThis, "location", { value: { pathname: "/blog/test" }, configurable: true });
    const markup = renderToStaticMarkup(<BlogArticlePage article={article} />);
    const expectedDate = calculatorContent[article.calculatorKind].lastUpdated;
    expect(markup).toContain(`Updated ${expectedDate}`);
    const jsonTexts = markup.split('<script type="application/ld+json">').slice(1).map(part => part.split('</script>')[0]);
    const schema = jsonTexts.map(value => JSON.parse(value ?? "{}")).find(value => value["@type"] === "Article");
    expect(schema).toBeTruthy();
    expect(schema["@type"]).toBe("Article");
    expect(schema.dateModified).toBe(expectedDate);
  });
});
