import { describe, expect, it } from "vitest";
import { calculate, type CalculatorKind } from "../shared/calculators";
import { amortizationSchedule, amortizedPayment, formatCurrency, futureValue, profitMargin, roi, salaryBreakdown, takeHomeEstimate } from "../shared/financial";

describe("financial formulas", () => {
  it("calculates standard fixed-rate loan cases", () => {
    expect(amortizedPayment(10000, 0, 5)).toBeCloseTo(166.6667, 4);
    expect(amortizedPayment(20000, 7.5, 5)).toBeCloseTo(400.76, 2);
    expect(amortizedPayment(1000, 10, 1)).toBeCloseTo(87.92, 2);
    expect(amortizedPayment(100000, 6, 30)).toBeCloseTo(599.55, 2);
  });

  it("handles invalid loan inputs without NaN or Infinity", () => {
    const invalidLoanCases: ReadonlyArray<readonly [number, number, number]> = [
      [0, 6, 30],
      [-1200, 6, 1],
      [Number.NaN, Number.POSITIVE_INFINITY, 1],
      [1000, 6, 0],
      [1e15, 99, 40],
    ];
    for (const args of invalidLoanCases) {
      expect(Number.isFinite(amortizedPayment(...args))).toBe(true);
    }
    expect(amortizedPayment(0, 6, 30)).toBe(0);
    expect(amortizedPayment(1200, 0, 1)).toBeCloseTo(100, 2);
  });

  it("produces an amortization schedule with a normalized final balance", () => {
    const rows = amortizationSchedule(10000, 7.5, 5);
    expect(rows).toHaveLength(60);
    expect(rows[0]?.interest).toBeCloseTo(62.5, 2);
    expect(rows[0]?.principal).toBeGreaterThan(0);
    expect(rows.at(-1)?.balance).toBe(0);
    expect(rows.every(row => row.balance >= 0 && Number.isFinite(row.balance))).toBe(true);
  });

  it("calculates future value with explicit monthly end-of-period contributions", () => {
    expect(futureValue(1000, 100, 0, 1)).toBeCloseTo(2200, 2);
    expect(futureValue(1000, 100, 6, 1)).toBeGreaterThan(2200);
    expect(futureValue(0, 0, 6, 20)).toBe(0);
    expect(futureValue(-100, 100, 6, 1)).toBeGreaterThan(0);
    expect(Number.isFinite(futureValue(1e12, 1e9, 12, 50))).toBe(true);
    expect(futureValue(1000, 0, -10, 1)).toBeLessThan(1000);
  });

  it("recalculates when a rate or input changes", () => {
    expect(amortizedPayment(200000, 6, 30)).toBeGreaterThan(amortizedPayment(200000, 4, 30));
    expect(futureValue(1000, 200, 8, 10)).toBeGreaterThan(futureValue(1000, 100, 8, 10));
  });

  it("keeps mortgage optional costs separate from principal and interest", () => {
    const principalAndInterest = amortizedPayment(200000, 6, 30);
    const taxes = 320;
    const insurance = 100;
    expect(principalAndInterest + taxes + insurance).toBeCloseTo(1619.1, 0);
    expect(amortizedPayment(200000, 6, 30)).toBeCloseTo(principalAndInterest, 5);
  });

  it("converts salary using visible period assumptions", () => {
    const breakdown = salaryBreakdown(75000, 40, 52);
    expect(breakdown.monthly).toBeCloseTo(6250, 2);
    expect(breakdown.biweekly).toBeCloseTo(2884.62, 1);
    expect(breakdown.weekly).toBeCloseTo(1442.31, 1);
    expect(breakdown.hourly).toBeCloseTo(36.06, 1);
    expect(salaryBreakdown(75000, 0, 0).hourly).toBeGreaterThan(0);
  });

  it("calculates take-home as a simplified tax estimate", () => {
    const result = takeHomeEstimate(75000, 24);
    expect(result.grossAnnual).toBe(75000);
    expect(result.netAnnual).toBeCloseTo(57000, 2);
    expect(result.annual).toBeCloseTo(57000, 2);
    expect(result.taxes).toBeCloseTo(18000, 2);
    expect(takeHomeEstimate(75000, 110).annual).toBe(0);
  });

  it("protects ROI from zero investment and supports negative returns", () => {
    expect(roi(10000, 13500)).toBe(35);
    expect(roi(10000, 5000)).toBe(-50);
    expect(roi(0, 13500)).toBe(0);
    expect(Number.isFinite(roi(Number.NaN, Number.POSITIVE_INFINITY))).toBe(true);
  });

  it("distinguishes profit, margin, and markup", () => {
    const result = profitMargin(10000, 7000);
    expect(result.profit).toBe(3000);
    expect(result.margin).toBe(30);
    expect(result.markup).toBeCloseTo(42.8571, 3);
    expect(profitMargin(0, 32000).margin).toBe(0);
    expect(profitMargin(0, 32000).markup).toBe(-100);
  });

  it.each(["loan", "mortgage", "personalLoan", "salary", "takeHome", "compound", "investment", "roi", "profitMargin", "currency", "savings"] as CalculatorKind[])("returns finite structured results for %s across safe edge inputs", kind => {
    const values: Record<string, string> = { amount: "100000.25", down: "20000.10", rate: "6.25", term: "5.5", tax: "320.25", insurance: "100.10", pmi: "0", hoa: "0", annual: "75000.75", hours: "40.5", weeks: "52", initial: "1000.25", contribution: "100.50", years: "12.5", target: "25000.75", final: "1350.50", revenue: "10000.25", cost: "7000.10" };
    const result = calculate(kind, values);
    expect(Number.isFinite(result.hero)).toBe(true);
    expect(Number.isFinite(result.chart)).toBe(true);
    expect(result.results.every(item => !/NaN|Infinity/.test(item.formattedValue))).toBe(true);
    const zeroResult = calculate(kind, Object.fromEntries(Object.keys(values).map(key => [key, "0"])));
    expect(Number.isFinite(zeroResult.hero)).toBe(true);
  });

  const edgeCases: Record<CalculatorKind, Record<string, string>[]> = {
    loan: [{ amount: "250000", rate: "6.5", term: "30" }, { amount: "1", rate: "0", term: "0.01" }, { amount: "oops", rate: "NaN", term: "Infinity" }, { amount: "1000.25", rate: "6.25", term: "2.5" }, { amount: "1000000000000", rate: "12", term: "40" }, { amount: "0", rate: "0", term: "0" }],
    mortgage: [{ amount: "400000", down: "80000", rate: "6.5", term: "30", tax: "320", insurance: "100", pmi: "0", hoa: "0" }, { amount: "1", down: "0", rate: "0", term: "0.01", tax: "0", insurance: "0", pmi: "0", hoa: "0" }, { amount: "bad", down: "bad", rate: "bad", term: "bad", tax: "bad", insurance: "bad", pmi: "bad", hoa: "bad" }, { amount: "400000.25", down: "80000.10", rate: "6.25", term: "2.5", tax: "320.25", insurance: "100.10", pmi: "75.50", hoa: "60.25" }, { amount: "1000000000000", down: "1", rate: "12", term: "40", tax: "10000", insurance: "5000", pmi: "1000", hoa: "1000" }, { amount: "0", down: "0", rate: "0", term: "0", tax: "0", insurance: "0", pmi: "0", hoa: "0" }],
    personalLoan: [{ amount: "25000", rate: "9.5", term: "5" }, { amount: "1", rate: "0", term: "0.01" }, { amount: "bad", rate: "bad", term: "bad" }, { amount: "1000.25", rate: "6.25", term: "2.5" }, { amount: "1000000000000", rate: "12", term: "40" }, { amount: "0", rate: "0", term: "0" }],
    salary: [{ annual: "75000", hours: "40", weeks: "52" }, { annual: "1", hours: "1", weeks: "1" }, { annual: "bad", hours: "bad", weeks: "bad" }, { annual: "75000.75", hours: "40.5", weeks: "52.5" }, { annual: "1000000000000", hours: "80", weeks: "52" }, { annual: "0", hours: "0", weeks: "0" }],
    takeHome: [{ annual: "75000", tax: "24" }, { annual: "1", tax: "0" }, { annual: "bad", tax: "bad" }, { annual: "75000.75", tax: "24.5" }, { annual: "1000000000000", tax: "100" }, { annual: "0", tax: "0" }],
    compound: [{ initial: "10000", contribution: "300", rate: "6", years: "20" }, { initial: "1", contribution: "0", rate: "0", years: "0.01" }, { initial: "bad", contribution: "bad", rate: "bad", years: "bad" }, { initial: "1000.25", contribution: "100.50", rate: "6.25", years: "2.5" }, { initial: "1000000000000", contribution: "1000000", rate: "12", years: "40" }, { initial: "0", contribution: "0", rate: "0", years: "0" }, { initial: "1000", contribution: "0", rate: "-10", years: "1" }],
    investment: [{ initial: "10000", contribution: "500", rate: "7", years: "20" }, { initial: "1", contribution: "0", rate: "0", years: "0.01" }, { initial: "bad", contribution: "bad", rate: "bad", years: "bad" }, { initial: "1000.25", contribution: "100.50", rate: "6.25", years: "2.5" }, { initial: "1000000000000", contribution: "1000000", rate: "12", years: "40" }, { initial: "0", contribution: "0", rate: "0", years: "0" }, { initial: "1000", contribution: "0", rate: "-10", years: "1" }],
    roi: [{ initial: "10000", final: "13500" }, { initial: "1", final: "1" }, { initial: "bad", final: "bad" }, { initial: "1000.25", final: "1350.50" }, { initial: "1000000000000", final: "1200000000000" }, { initial: "0", final: "0" }, { initial: "1000", final: "-100" }],
    profitMargin: [{ revenue: "50000", cost: "32000" }, { revenue: "1", cost: "0" }, { revenue: "bad", cost: "bad" }, { revenue: "10000.25", cost: "7000.10" }, { revenue: "1000000000000", cost: "900000000000" }, { revenue: "0", cost: "0" }, { revenue: "1000", cost: "-100" }],
    currency: [{ amount: "1000", rate: "0.92" }, { amount: "1", rate: "0.000001" }, { amount: "bad", rate: "bad" }, { amount: "1000.25", rate: "0.9255" }, { amount: "1000000000000", rate: "1.5" }, { amount: "0", rate: "0" }],
    savings: [{ target: "25000", initial: "1000", contribution: "300", rate: "4", years: "5" }, { target: "1", initial: "0", contribution: "0", rate: "0", years: "0.01" }, { target: "bad", initial: "bad", contribution: "bad", rate: "bad", years: "bad" }, { target: "25000.75", initial: "1000.25", contribution: "100.50", rate: "4.25", years: "2.5" }, { target: "1000000000000", initial: "1000000000", contribution: "1000000", rate: "12", years: "40" }, { target: "0", initial: "0", contribution: "0", rate: "0", years: "0" }, { target: "25000", initial: "1000", contribution: "0", rate: "-10", years: "1" }],
    simpleInterest: [{ principal: "5000", rate: "6", years: "3" }, { principal: "1", rate: "0", years: "0.01" }, { principal: "bad", rate: "bad", years: "bad" }, { principal: "5000.25", rate: "6.25", years: "2.5" }, { principal: "1000000000000", rate: "12", years: "40" }, { principal: "0", rate: "0", years: "0" }, { principal: "5000", rate: "-6", years: "3" }],
    markup: [{ cost: "40", markup: "50" }, { cost: "1", markup: "0" }, { cost: "bad", markup: "bad" }, { cost: "40.25", markup: "50.50" }, { cost: "1000000000000", markup: "900" }, { cost: "0", markup: "0" }, { cost: "40", markup: "-50" }],
    discount: [{ price: "100", discount: "20" }, { price: "1", discount: "0" }, { price: "bad", discount: "bad" }, { price: "100.25", discount: "20.50" }, { price: "1000000000000", discount: "99" }, { price: "0", discount: "0" }, { price: "100", discount: "150" }],
    salesTax: [{ subtotal: "80", rate: "8.5" }, { subtotal: "1", rate: "0" }, { subtotal: "bad", rate: "bad" }, { subtotal: "80.25", rate: "8.25" }, { subtotal: "1000000000000", rate: "25" }, { subtotal: "0", rate: "0" }, { subtotal: "80", rate: "-5" }],
  };

  for (const kind of Object.keys(edgeCases) as CalculatorKind[]) {
    it.each(edgeCases[kind])(`${kind} returns finite, formatted outputs for explicit edge case %#`, values => {
      const result = calculate(kind, values);
      expect(Number.isFinite(result.hero)).toBe(true);
      expect(Number.isFinite(result.chart)).toBe(true);
      expect(result.results.every(item => !/NaN|Infinity/.test(item.formattedValue))).toBe(true);
      expect(result.breakdown.every(item => Number.isFinite(item.value))).toBe(true);
      expect(result.chartData.every(item => Number.isFinite(item.value))).toBe(true);
    });
  }

  it("verifies targeted calculator semantics for trust-sensitive scenarios", () => {
    const zeroInterestLoan = calculate("loan", { amount: "1200", rate: "0", term: "1" });
    expect(zeroInterestLoan.results.find(item => item.label === "Principal & interest")?.formattedValue).toBe("$100.00");
    expect(zeroInterestLoan.results.find(item => item.label === "Total interest")?.formattedValue).toBe("$0");

    const invalidCurrency = calculate("currency", { amount: "not-a-number", rate: "not-a-rate" });
    expect(invalidCurrency.results.find(item => item.label === "Output")?.formattedValue).toBe("$0.00");
    expect(invalidCurrency.results.find(item => item.label === "Rate status")?.formattedValue).toBe("User-provided, not live");

    const negativeInvestment = calculate("investment", { initial: "1000", contribution: "0", rate: "-10", years: "1" });
    expect(negativeInvestment.hero).toBeLessThan(1000);
    expect(negativeInvestment.assumptions).toContain("Monthly compounding frequency is fixed in this version");

    const mortgage = calculate("mortgage", { amount: "400000", down: "80000", rate: "6.5", term: "30", tax: "320", insurance: "100", pmi: "125.50", hoa: "75" });
    expect(mortgage.results.find(item => item.label === "PMI")?.formattedValue).toBe("$125.50");
    expect(mortgage.results.find(item => item.label === "HOA")?.formattedValue).toBe("$75.00");
    expect(mortgage.hero).toBeCloseTo(2642.62, 0);

    const takeHome = calculate("takeHome", { annual: "75000", tax: "24" });
    expect(takeHome.assumptions).toContain("Simplified percentage estimate");
    expect(takeHome.assumptions).toContain("Not official payroll or tax advice");
  });

  it("formats money consistently without floating-point display artifacts", () => {
    expect(formatCurrency(0.1 + 0.2)).toBe("$0.30");
    expect(formatCurrency(1250.5, "USD")).toBe("$1,250.50");
    expect(formatCurrency(1250.5, "GBP")).toBe("£1,250.50");
    expect(formatCurrency(1250.5, "EUR")).toBe("€1,250.50");
  });
});
