import { describe, expect, it } from "vitest";

describe("production site URL configuration", () => {
  it("uses the configured HTTPS canonical origin", () => {
    const siteUrl = process.env.VITE_SITE_URL;
    expect(siteUrl).toBeTruthy();
    const parsed = new URL(siteUrl!);
    expect(parsed.protocol).toBe("https:");
    expect(parsed.origin).toBe("https://moneycalci.online");
  });
});
