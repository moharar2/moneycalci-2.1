import type { CalculatorKind } from "./calculators";
import { calculatorContent } from "./seoContent";

const paths: Record<CalculatorKind, string> = {
  loan: "/loan-calculator", mortgage: "/mortgage-calculator", personalLoan: "/personal-loan-calculator", salary: "/salary-calculator", takeHome: "/take-home-pay-calculator", compound: "/compound-interest-calculator", investment: "/investment-calculator", roi: "/roi-calculator", profitMargin: "/profit-margin-calculator", currency: "/currency-converter", savings: "/savings-calculator", simpleInterest: "/simple-interest-calculator", markup: "/markup-calculator", discount: "/discount-calculator", salesTax: "/sales-tax-calculator",
};

const labels: Record<CalculatorKind, string> = { loan: "Loan Calculator", mortgage: "Mortgage Calculator", personalLoan: "Personal Loan Calculator", salary: "Salary Calculator", takeHome: "Take-Home Pay Calculator", compound: "Compound Interest Calculator", investment: "Investment Calculator", roi: "ROI Calculator", profitMargin: "Profit Margin Calculator", currency: "Currency Converter", savings: "Savings Calculator", simpleInterest: "Simple Interest Calculator", markup: "Markup Calculator", discount: "Discount Calculator", salesTax: "Sales Tax Calculator" };
export type CalculatorRegistryEntry = { kind: CalculatorKind; slug: string; path: string; label: string; title: string; category: string; status: "published"; searchable: boolean };
export const calculatorRegistry: Record<CalculatorKind, CalculatorRegistryEntry> = Object.fromEntries(
  (Object.keys(calculatorContent) as CalculatorKind[]).map(kind => [kind, { kind, slug: paths[kind].replace(/^\//, "").replace(/-calculator$/, ""), path: paths[kind], label: labels[kind], title: calculatorContent[kind].seoTitle, category: calculatorContent[kind].category, status: "published", searchable: true }]),
) as Record<CalculatorKind, CalculatorRegistryEntry>;

export const publishedCalculatorKinds = Object.keys(calculatorRegistry) as CalculatorKind[];
export const calculatorPathMap = Object.fromEntries(publishedCalculatorKinds.map(kind => [kind, calculatorRegistry[kind].path])) as Record<CalculatorKind, string>;
export const calculatorLabelMap = Object.fromEntries(publishedCalculatorKinds.map(kind => [kind, calculatorRegistry[kind].label])) as Record<CalculatorKind, string>;
