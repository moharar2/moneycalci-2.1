import type { CalculatorKind } from "./calculators";
import { calculatorContent } from "./seoContent";

export const calculatorSearchLabels: Record<CalculatorKind, string> = { loan: "Loan Calculator", mortgage: "Mortgage Calculator", personalLoan: "Personal Loan Calculator", salary: "Salary Calculator", takeHome: "Take-Home Pay Calculator", compound: "Compound Interest Calculator", investment: "Investment Calculator", roi: "ROI Calculator", profitMargin: "Profit Margin Calculator", currency: "Currency Converter", savings: "Savings Calculator", simpleInterest: "Simple Interest Calculator", markup: "Markup Calculator", discount: "Discount Calculator", salesTax: "Sales Tax Calculator" };
export const calculatorSearchAliases: Record<CalculatorKind, string[]> = { loan: ["borrow", "repayment", "debt"], mortgage: ["home loan", "house payment", "home payment", "housing"], personalLoan: ["personal borrowing", "installment loan"], salary: ["gross pay", "annual pay", "hourly pay"], takeHome: ["paycheck", "net pay", "after tax", "take home"], compound: ["compound growth", "interest growth"], investment: ["portfolio growth", "future value"], roi: ["return on investment", "return", "investment return"], profitMargin: ["profit", "margin", "markup", "business profit"], currency: ["exchange rate", "forex", "money conversion"], savings: ["savings goal", "emergency fund", "save"], simpleInterest: ["simple interest", "flat interest"], markup: ["price markup", "selling price"], discount: ["sale price", "percentage off", "markdown"], salesTax: ["tax calculator", "tax on purchase", "checkout tax"] };

export function searchCalculatorKinds(query: string): CalculatorKind[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return (Object.keys(calculatorSearchLabels) as CalculatorKind[]).filter(kind => `${calculatorSearchLabels[kind]} ${calculatorContent[kind].category} ${calculatorContent[kind].intro} ${calculatorSearchAliases[kind].join(" ")}`.toLowerCase().includes(normalized)).slice(0, 5);
}
