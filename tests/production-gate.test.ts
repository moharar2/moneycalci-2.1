import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { calculate } from "../shared/calculators";

const indexHtml = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const robots = readFileSync(new URL("../client/public/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../client/public/sitemap.xml", import.meta.url), "utf8");

describe("production gates", () => {
  it("uses the selected HTTPS production origin and no preview origin", () => {
    expect(indexHtml).toContain("https://moneycalci.online/");
    expect(indexHtml).not.toContain("moneycalc-pqpzjtta.manus.space");
    expect(robots).toContain("Sitemap: https://moneycalci.online/sitemap.xml");
    expect(sitemap).toContain("https://moneycalci.online/simple-interest-calculator");
    expect(sitemap).not.toContain("manus.space");
  });

  it("does not load an unconfigured analytics or debug script by default", () => {
    expect(indexHtml).not.toContain("VITE_ANALYTICS_ENDPOINT");
    expect(indexHtml).not.toContain("/umami");
  });

  it("describes local preferences and shareable URL behavior without claiming active analytics", () => {
    const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    expect(home).toContain("local storage");
    expect(home).toContain("shareable calculator inputs may appear in the page URL");
    expect(home).toContain("not sent to analytics by default");
  });

  it("keeps malformed and extreme calculator values finite", () => {
    for (const value of ["", "NaN", "Infinity", "-1", "999999999999999999999999999999999999"]) {
      const result = calculate("loan", { amount: value, rate: value, term: value });
      expect(Number.isFinite(result.hero), value).toBe(true);
    }
  });
});
