import { describe, expect, it } from "vitest";
import { calculate } from "../shared/calculators";
import { discountPrice, markupPrice, salesTax, simpleInterest } from "../shared/financial";
import { calculatorRegistry, publishedCalculatorKinds } from "../shared/calculatorRegistry";
import { searchCalculatorKinds } from "../shared/search";

describe("Round 4 expansion", () => {
  it("keeps the scalable registry complete", () => {
    expect(publishedCalculatorKinds).toHaveLength(15);
    expect(calculatorRegistry.simpleInterest.path).toBe("/simple-interest-calculator");
  });
  it("calculates the new financial scenarios safely", () => {
    expect(simpleInterest(5000, 6, 3)).toMatchObject({ interest: 900, total: 5900 });
    expect(markupPrice(40, 50).price).toBe(60);
    expect(discountPrice(100, 20).finalPrice).toBe(80);
    expect(salesTax(200, 7.5).total).toBe(215);
    expect(calculate("salesTax", { subtotal: "200", rate: "7.5" }).hero).toBe(215);
  });
  it("supports discovery aliases for the new tools", () => {
    expect(searchCalculatorKinds("percentage off")).toContain("discount");
    expect(searchCalculatorKinds("tax calculator")).toContain("salesTax");
    expect(searchCalculatorKinds("flat interest")).toContain("simpleInterest");
  });
});
