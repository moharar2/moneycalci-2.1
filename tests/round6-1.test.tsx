// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RouteContent } from "@/pages/Home";

describe("Round 6.1 targeted regressions", () => {
  it.each(["/loan-calculator", "/mortgage-calculator", "/salary-calculator"])("renders one calculator schema for %s", (route) => {
    const markup = renderToStaticMarkup(<RouteContent location={route} />);
    const matches = markup.match(/id="calculator-schema"/g) ?? [];
    expect(matches).toHaveLength(1);
    const schema = markup.match(/<script id="calculator-schema"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    expect(schema).toBeTruthy();
    expect(JSON.parse(schema!)["@type"]).toBe("SoftwareApplication");
  });

  it("does not invent a contact address when no channel is configured", () => {
    const markup = renderToStaticMarkup(<RouteContent location="/contact" />);
    expect(markup).toContain("support@moneycalci.online");
    expect(markup).toMatch(/mailto:support@moneycalci\.online/i);
    expect(markup).not.toContain("No public contact channel is configured yet");
  });
});
