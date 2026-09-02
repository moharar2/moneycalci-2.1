import { describe, expect, it } from "vitest";
import { searchCalculatorKinds } from "../shared/search";

describe("calculator search aliases", () => {
  it("maps home loan to the mortgage calculator", () => {
    expect(searchCalculatorKinds("home loan")).toContain("mortgage");
  });
  it("maps paycheck and net pay to take-home pay", () => {
    expect(searchCalculatorKinds("paycheck")).toContain("takeHome");
    expect(searchCalculatorKinds("net pay")).toContain("takeHome");
  });
  it("finds business metrics by profit and markup", () => {
    expect(searchCalculatorKinds("markup")).toContain("profitMargin");
    expect(searchCalculatorKinds("profit")).toContain("profitMargin");
  });
  it("returns no results for an empty query", () => {
    expect(searchCalculatorKinds("   ")).toEqual([]);
  });
});
