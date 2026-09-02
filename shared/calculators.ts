import { amortizationSchedule, amortizedPayment, discountPrice, formatCurrency, formatPercent, futureValue, markupPrice, profitMargin, roi, salaryBreakdown, salesTax, simpleInterest, takeHomeEstimate } from "./financial";

export type CalculatorKind = "loan" | "mortgage" | "personalLoan" | "salary" | "takeHome" | "compound" | "investment" | "roi" | "profitMargin" | "currency" | "savings" | "simpleInterest" | "markup" | "discount" | "salesTax";
export type ResultType = "currency" | "percent" | "text";
export type ResultTone = "primary" | "positive" | "muted";
export type CalculationBreakdown = { label: string; value: number; formattedValue: string };
export type CalculationChartPoint = { label: string; value: number };
export type CalculationResult = { hero: number; heroLabel: string; results: CalculationResultItem[]; chart: number; assumptions: string[]; breakdown: CalculationBreakdown[]; chartData: CalculationChartPoint[] };
export type CalculationResultItem = { label: string; value: number | string; formattedValue: string; type: ResultType; tone?: ResultTone };

const currencyResult = (label: string, value: number, tone?: ResultTone): CalculationResultItem => ({ label, value, formattedValue: formatCurrency(value, "USD", 2), type: "currency", tone });
const wholeCurrencyResult = (label: string, value: number, tone?: ResultTone): CalculationResultItem => ({ label, value, formattedValue: formatCurrency(value, "USD", 0), type: "currency", tone });
const percentResult = (label: string, value: number, tone?: ResultTone): CalculationResultItem => ({ label, value, formattedValue: formatPercent(value, 1), type: "percent", tone });
const textResult = (label: string, value: string, tone?: ResultTone): CalculationResultItem => ({ label, value, formattedValue: value, type: "text", tone });
const numeric = (values: Record<string, string>, key: string) => { const value = Number(values[key] ?? ""); return Number.isFinite(value) ? value : 0; };

export function calculate(kind: CalculatorKind, values: Record<string, string>): CalculationResult {
  const v = (key: string) => numeric(values, key);
  if (kind === "salary") { const b = salaryBreakdown(v("annual"), v("hours"), v("weeks")); return { hero: b.monthly, heroLabel: "Estimated monthly gross", results: [wholeCurrencyResult("Annual", b.annual), currencyResult("Biweekly", b.biweekly), currencyResult("Weekly", b.weekly), currencyResult("Hourly", b.hourly)], chart: 70, assumptions: ["Gross pay before deductions", `${v("hours")} hours/week and ${v("weeks")} working weeks/year`], breakdown: [], chartData: [] }; }
  if (kind === "takeHome") { const b = takeHomeEstimate(v("annual"), v("tax")); return { hero: b.monthly, heroLabel: "Estimated monthly take-home", results: [wholeCurrencyResult("Annual take-home", b.netAnnual, "positive"), wholeCurrencyResult("Estimated taxes", b.taxes, "muted"), percentResult("Assumed tax rate", b.taxRate), wholeCurrencyResult("Gross annual", b.grossAnnual)], chart: Math.max(8, 100 - Math.min(92, b.taxRate)), assumptions: ["Simplified percentage estimate", "Not official payroll or tax advice"], breakdown: [], chartData: [] }; }
  if (kind === "roi") { const value = roi(v("initial"), v("final")); return { hero: value, heroLabel: "Return on investment", results: [currencyResult("Profit / loss", v("final") - v("initial"), value >= 0 ? "positive" : "muted"), wholeCurrencyResult("Initial investment", v("initial")), wholeCurrencyResult("Final value", v("final")), textResult("Result", value >= 0 ? "Positive return" : "Negative return")], chart: Math.min(100, Math.max(8, 50 + value / 2)), assumptions: ["ROI does not include timing, financing, or taxes"], breakdown: [], chartData: [] }; }
  if (kind === "profitMargin") { const b = profitMargin(v("revenue"), v("cost")); return { hero: b.margin, heroLabel: "Profit margin", results: [currencyResult("Profit", b.profit, b.profit >= 0 ? "positive" : "muted"), wholeCurrencyResult("Revenue", b.revenue), wholeCurrencyResult("Cost", b.cost), percentResult("Markup", b.markup)], chart: Math.min(100, Math.max(8, b.margin)), assumptions: ["Margin uses revenue as denominator", "Markup uses cost as denominator"], breakdown: [], chartData: [] }; }
  if (kind === "simpleInterest") { const b = simpleInterest(v("principal"), v("rate"), v("years")); return { hero: b.total, heroLabel: "Total amount", results: [wholeCurrencyResult("Principal", b.principal), currencyResult("Interest earned", b.interest, "positive"), wholeCurrencyResult("Total", b.total, "positive")], chart: 65, assumptions: ["Simple interest does not compound", "Rate and time are user-provided assumptions"], breakdown: [{ label: "Principal", value: b.principal, formattedValue: formatCurrency(b.principal, "USD", 2) }, { label: "Interest", value: b.interest, formattedValue: formatCurrency(b.interest, "USD", 2) }], chartData: [] }; }
  if (kind === "markup") { const b = markupPrice(v("cost"), v("markup")); return { hero: b.price, heroLabel: "Suggested selling price", results: [wholeCurrencyResult("Cost", b.cost), percentResult("Markup", b.markup), currencyResult("Markup amount", b.amount, "positive"), wholeCurrencyResult("Selling price", b.price, "positive")], chart: Math.min(100, Math.max(8, b.markup)), assumptions: ["Markup is calculated as a percentage of cost", "This does not calculate profit after operating expenses"], breakdown: [], chartData: [] }; }
  if (kind === "discount") { const b = discountPrice(v("price"), v("discount")); return { hero: b.finalPrice, heroLabel: "Price after discount", results: [wholeCurrencyResult("Original price", b.price), percentResult("Discount", b.discount), currencyResult("You save", b.savings, "positive"), wholeCurrencyResult("Final price", b.finalPrice, "positive")], chart: Math.max(8, 100 - b.discount), assumptions: ["Discount is applied once to the original price", "Taxes, shipping, and fees are not included"], breakdown: [], chartData: [] }; }
  if (kind === "salesTax") { const b = salesTax(v("subtotal"), v("rate")); return { hero: b.total, heroLabel: "Total with sales tax", results: [wholeCurrencyResult("Subtotal", b.subtotal), percentResult("Tax rate", b.rate), currencyResult("Sales tax", b.tax, "muted"), wholeCurrencyResult("Total", b.total, "positive")], chart: Math.min(100, Math.max(8, b.rate * 4)), assumptions: ["One tax rate is applied to the subtotal", "Local rules, exemptions, and shipping treatment may differ"], breakdown: [], chartData: [] }; }
  if (kind === "currency") {
    const amount = Math.max(0, v("amount"));
    const fromCurrency = String(values.fromCurrency || "USD");
    const toCurrency = String(values.toCurrency || "SAR");
    const rateValue = Number(values.rate ?? "");
    const sameCurrency = fromCurrency === toCurrency;
    const validRate = Number.isFinite(rateValue) && rateValue > 0;
    const effectiveRate = sameCurrency ? 1 : validRate ? rateValue : 0;
    const converted = amount * effectiveRate;
    const status = sameCurrency ? "Same currency" : validRate ? `Live rate: ${rateValue.toFixed(4)}` : "User-provided, not live";
    const rateText = sameCurrency ? "1.0000" : validRate ? rateValue.toFixed(4) : "Unavailable";
    const displayCurrency = validRate ? toCurrency : fromCurrency;
    return {
      hero: converted,
      heroLabel: "Converted amount",
      results: [
        { label: "Input amount", value: amount, formattedValue: formatCurrency(amount, fromCurrency, 2), type: "currency" },
        { label: "Exchange rate", value: effectiveRate, formattedValue: `${fromCurrency} → ${toCurrency} = ${rateText}`, type: "text", tone: "muted" },
        { label: "Output", value: converted, formattedValue: formatCurrency(converted, displayCurrency, 2), type: "currency", tone: "positive" },
        { label: "Rate status", value: status, formattedValue: status, type: "text", tone: sameCurrency ? "positive" : validRate ? "positive" : "muted" },
      ],
      chart: 65,
      assumptions: [
        sameCurrency ? "From and To are the same currency, so the rate is 1." : "Uses the selected currency pair and most recent valid rate.",
        "The rate is refreshed for each active From/To selection."
      ],
      breakdown: [],
      chartData: []
    };
  }
  if (kind === "loan" || kind === "mortgage" || kind === "personalLoan") { const principal = kind === "mortgage" ? Math.max(0, v("amount") - v("down")) : Math.max(0, v("amount")); const payment = amortizedPayment(principal, v("rate"), v("term")); const schedule = amortizationSchedule(principal, v("rate"), v("term")); const extras = kind === "mortgage" ? Math.max(0, v("tax")) + Math.max(0, v("insurance")) + Math.max(0, v("pmi")) + Math.max(0, v("hoa")) : 0; const interest = schedule.reduce((sum, row) => sum + row.interest, 0); const coreRepayment = schedule.reduce((sum, row) => sum + row.payment, 0); const optionalResults = kind === "mortgage" ? [currencyResult("Property tax", v("tax"), "muted"), currencyResult("Insurance", v("insurance"), "muted"), currencyResult("PMI", v("pmi"), "muted"), currencyResult("HOA", v("hoa"), "muted")] : []; return { hero: payment + extras, heroLabel: kind === "mortgage" ? "Estimated monthly housing payment" : "Estimated monthly payment", results: [currencyResult("Principal & interest", payment), ...optionalResults, wholeCurrencyResult("Total interest", interest, "positive"), wholeCurrencyResult("Loan repayment (P&I)", coreRepayment, "muted")], chart: Math.min(88, Math.max(8, interest / Math.max(1, coreRepayment) * 100)), assumptions: ["Fixed-rate amortization", ...(kind === "mortgage" ? ["Optional housing costs are shown separately"] : [])], breakdown: schedule.slice(0, 12).map(row => ({ label: `Payment ${row.paymentNumber}`, value: row.payment, formattedValue: formatCurrency(row.payment, "USD", 2) })), chartData: schedule.slice(0, 12).map(row => ({ label: `${row.paymentNumber}`, value: row.balance })) }; }
  const initial = Math.max(0, v("initial")); const contribution = Math.max(0, v("contribution")); const years = Math.max(0, v("years")); const periods = Math.max(0, Math.round(years * 12)); const balance = futureValue(initial, contribution, v("rate"), years); const deposited = initial + contribution * periods; const target = Math.max(0, v("target")); const progress = target ? Math.min(100, balance / target * 100) : 65; return { hero: balance, heroLabel: kind === "savings" ? "Projected balance" : "Future value", results: [wholeCurrencyResult("Projected balance", balance, "positive"), wholeCurrencyResult("Total contributions", deposited, "muted"), wholeCurrencyResult("Estimated growth", balance - deposited, "positive"), kind === "savings" ? percentResult("Target progress", progress) : textResult("Growth multiple", `${(balance / Math.max(1, deposited)).toFixed(2)}×`)], chart: Math.min(100, Math.max(8, progress)), assumptions: ["Monthly contributions are modeled at the end of each month", "Monthly compounding frequency is fixed in this version", "Return is an estimate and is not guaranteed"], breakdown: [{ label: "Starting balance", value: initial, formattedValue: formatCurrency(initial, "USD", 0) }, { label: "Recurring contributions", value: contribution, formattedValue: formatCurrency(contribution, "USD", 0) }], chartData: Array.from({ length: 5 }, (_, index) => { const year = years * index / 4; return { label: `${year.toFixed(year % 1 === 0 ? 0 : 1)}y`, value: futureValue(initial, contribution, v("rate"), year) }; }) };
}
