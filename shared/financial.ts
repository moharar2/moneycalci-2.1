export type AmortizationRow = { paymentNumber: number; payment: number; interest: number; principal: number; balance: number };

export function safeNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function nonNegative(value: unknown) {
  return Math.max(0, safeNumber(value));
}

export function formatCurrency(value: number, currency = "USD", maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2, maximumFractionDigits }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, maximumFractionDigits = 1) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(maximumFractionDigits)}%`;
}

const MAX_TERM_YEARS = 100;

export function amortizedPayment(principalInput: number, annualRateInput: number, yearsInput: number) {
  const principal = nonNegative(principalInput);
  const years = Math.min(MAX_TERM_YEARS, nonNegative(yearsInput));
  const annualRatePercent = nonNegative(annualRateInput);
  if (principal === 0 || years === 0) return 0;
  const payments = Math.max(1, Math.round(years * 12));
  const periodicRate = annualRatePercent / 100 / 12;
  if (periodicRate === 0) return principal / payments;
  const factor = Math.pow(1 + periodicRate, payments);
  const payment = principal * periodicRate * factor / (factor - 1);
  return Number.isFinite(payment) ? payment : 0;
}

export function amortizationSchedule(principalInput: number, annualRateInput: number, yearsInput: number): AmortizationRow[] {
  const principal = nonNegative(principalInput);
  const years = Math.min(MAX_TERM_YEARS, nonNegative(yearsInput));
  if (principal === 0 || years === 0) return [];
  const payments = Math.min(MAX_TERM_YEARS * 12, Math.max(1, Math.round(years * 12)));
  const rate = nonNegative(annualRateInput) / 100 / 12;
  const scheduledPayment = amortizedPayment(principal, annualRateInput, years);
  let balance = principal;
  const rows: AmortizationRow[] = [];
  for (let index = 1; index <= payments && balance > 0; index += 1) {
    const interest = rate === 0 ? 0 : balance * rate;
    const payment = Math.min(scheduledPayment, balance + interest);
    const principalPaid = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    rows.push({ paymentNumber: index, payment, interest, principal: principalPaid, balance: index === payments ? 0 : balance });
  }
  return rows;
}

export function futureValue(initialInput: number, monthlyContributionInput: number, annualRateInput: number, yearsInput: number) {
  const initial = nonNegative(initialInput);
  const monthlyContribution = nonNegative(monthlyContributionInput);
  const years = nonNegative(yearsInput);
  const periods = Math.max(0, Math.round(years * 12));
  if (periods === 0) return initial;
  const annualRatePercent = Math.max(-99.999999, safeNumber(annualRateInput));
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return initial + monthlyContribution * periods;
  const factor = Math.pow(1 + monthlyRate, periods);
  const value = initial * factor + monthlyContribution * ((factor - 1) / monthlyRate);
  return Number.isFinite(value) ? value : 0;
}

export function salaryBreakdown(annualInput: number, hoursPerWeekInput = 40, weeksInput = 52) {
  const annual = nonNegative(annualInput);
  const hours = Math.max(1, nonNegative(hoursPerWeekInput));
  const weeks = Math.max(1, nonNegative(weeksInput));
  return { annual, monthly: annual / 12, biweekly: annual / 26, weekly: annual / 52, hourly: annual / (hours * weeks) };
}

export function takeHomeEstimate(annualInput: number, taxRateInput: number) {
  const annual = nonNegative(annualInput);
  const taxRate = Math.min(100, nonNegative(taxRateInput));
  const taxes = annual * taxRate / 100;
  return { annual: annual - taxes, grossAnnual: annual, netAnnual: annual - taxes, monthly: (annual - taxes) / 12, taxes, taxRate };
}

export function roi(initialInput: number, finalInput: number) {
  const initial = nonNegative(initialInput);
  const final = nonNegative(finalInput);
  return initial > 0 ? ((final - initial) / initial) * 100 : 0;
}

export function profitMargin(revenueInput: number, costInput: number) {
  const revenue = nonNegative(revenueInput);
  const cost = nonNegative(costInput);
  const profit = revenue - cost;
  return { revenue, cost, profit, margin: revenue > 0 ? (profit / revenue) * 100 : 0, markup: cost > 0 ? (profit / cost) * 100 : 0 };
}

export function simpleInterest(principalInput: number, annualRateInput: number, yearsInput: number) {
  const principal = nonNegative(principalInput);
  const rate = nonNegative(annualRateInput);
  const years = nonNegative(yearsInput);
  const interest = principal * rate / 100 * years;
  return { principal, interest: Number.isFinite(interest) ? interest : 0, total: principal + (Number.isFinite(interest) ? interest : 0) };
}

export function markupPrice(costInput: number, markupInput: number) {
  const cost = nonNegative(costInput);
  const markup = nonNegative(markupInput);
  const amount = cost * markup / 100;
  return { cost, markup, amount: Number.isFinite(amount) ? amount : 0, price: cost + (Number.isFinite(amount) ? amount : 0) };
}

export function discountPrice(priceInput: number, discountInput: number) {
  const price = nonNegative(priceInput);
  const discount = Math.min(100, nonNegative(discountInput));
  const savings = price * discount / 100;
  return { price, discount, savings: Number.isFinite(savings) ? savings : 0, finalPrice: price - (Number.isFinite(savings) ? savings : 0) };
}

export function salesTax(totalInput: number, taxRateInput: number) {
  const subtotal = nonNegative(totalInput);
  const rate = nonNegative(taxRateInput);
  const tax = subtotal * rate / 100;
  return { subtotal, rate, tax: Number.isFinite(tax) ? tax : 0, total: subtotal + (Number.isFinite(tax) ? tax : 0) };
}
