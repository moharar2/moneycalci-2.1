import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpDown, Calculator, Check, Copy, RotateCcw, Share2, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalculatorField, ResultCard, TimeSeriesBars } from "@/components/CalculatorParts";
import { calculate, CalculatorKind } from "@shared/calculators";
import { formatCurrency, formatPercent } from "@shared/financial";
import { trackEvent } from "@/lib/analytics";

export type { CalculatorKind };
const wholeMoney = (value: number) => formatCurrency(value, "USD", 0);
const pct = (value: number) => formatPercent(value, 1);
const currencyOptions = ["AED", "AUD", "CAD", "CHF", "CNY", "EUR", "GBP", "INR", "JPY", "MXN", "NOK", "NZD", "PKR", "SAR", "SEK", "SGD", "USD", "ZAR"];

const currencyPairKey = (from: string, to: string) => `${(from || "USD").toUpperCase()}_${(to || "SAR").toUpperCase()}`;

export const meta: Record<CalculatorKind, { title: string; kicker: string; intro: string; formula: string; description: string }> = {
  loan: { title: "Loan Calculator", kicker: "Loans & credit", intro: "Estimate your monthly payment, total interest, and total repayment in seconds.", formula: "M = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]", description: "A clear starting point for understanding borrowing costs before you compare lenders." },
  mortgage: { title: "Mortgage Calculator", kicker: "Loans & credit", intro: "Estimate principal, interest, taxes, and insurance for a fixed-rate mortgage scenario.", formula: "Principal and interest use the standard fixed-rate amortization formula; taxes and insurance are separate monthly costs.", description: "Compare home-financing scenarios while keeping optional housing costs visible." },
  personalLoan: { title: "Personal Loan Calculator", kicker: "Loans & credit", intro: "Estimate personal-loan payments, interest, and repayment using your loan assumptions.", formula: "Monthly payment uses the standard amortization formula for fixed-rate installment loans.", description: "Use this estimate to understand the cost of a personal loan before reviewing lender terms." },
  salary: { title: "Salary Calculator", kicker: "Salary & taxes", intro: "Convert an annual salary into monthly, biweekly, weekly, and hourly estimates.", formula: "Hourly salary = annual salary ÷ (hours per week × working weeks per year).", description: "These are gross-pay estimates before deductions and taxes." },
  takeHome: { title: "Take-Home Pay Calculator", kicker: "Salary & taxes", intro: "Estimate take-home pay using a simplified tax-rate assumption you can adjust.", formula: "Estimated take-home = gross pay − gross pay × assumed tax rate.", description: "This is a simplified planning estimate, not an official tax calculation or filing result." },
  compound: { title: "Compound Interest Calculator", kicker: "Investing", intro: "Visualize how an initial deposit and recurring monthly contributions can grow over time.", formula: "A = P(1 + r/n)ⁿᵗ + PMT × [((1 + r/n)ⁿᵗ − 1) ÷ (r/n)]", description: "Contributions are modeled at the end of each month. Growth estimates depend on the assumed return and do not guarantee investment performance." },
  investment: { title: "Investment Calculator", kicker: "Investing", intro: "Project an investment balance from an initial amount, monthly contributions, return, and time horizon.", formula: "Future value combines starting capital, end-of-month contributions, and the assumed periodic return.", description: "Contributions are modeled at the end of each month. Use different return assumptions to compare long-term scenarios, not to predict results." },
  roi: { title: "ROI Calculator", kicker: "Business & finance", intro: "Calculate return on investment from the amount invested and the final value received.", formula: "ROI = (final value − initial investment) ÷ initial investment × 100.", description: "ROI describes the percentage return and does not include timing or financing costs." },
  profitMargin: { title: "Profit Margin Calculator", kicker: "Business & finance", intro: "Calculate profit and profit margin from revenue and cost, without confusing margin with markup.", formula: "Profit = revenue − cost; margin = profit ÷ revenue × 100; markup = profit ÷ cost × 100.", description: "Margin uses revenue as its denominator while markup uses cost, so the two percentages differ." },
  currency: { title: "Currency Converter", kicker: "Currency", intro: "Convert currencies using the latest valid exchange rate returned by the connected exchange-rate service.", formula: "Converted amount = amount × exchange rate.", description: "The converted amount shows the value of your selected amount in the target currency using the latest valid exchange rate returned by the connected exchange-rate service." },
  savings: { title: "Savings Calculator", kicker: "Money & finance", intro: "Plan how much to save each month to reach a target and understand projected growth.", formula: "Future value combines starting savings, recurring deposits, and the selected annual rate.", description: "Use this as a planning tool for an emergency fund, down payment, or another savings goal." },
  simpleInterest: { title: "Simple Interest Calculator", kicker: "Finance", intro: "Estimate simple interest and the total amount from principal, rate, and time.", formula: "I = P × r × t; total = P + I", description: "A transparent estimate for non-compounding interest scenarios." },
  markup: { title: "Markup Calculator", kicker: "Business", intro: "Calculate a markup amount and suggested selling price from cost.", formula: "Price = cost + (cost × markup%)", description: "Separate markup from margin while planning a selling price." },
  discount: { title: "Discount Calculator", kicker: "Business", intro: "Calculate savings and final price from an original price and discount.", formula: "Final price = original price − (original price × discount%)", description: "A quick way to understand sale pricing before tax and shipping." },
  salesTax: { title: "Sales Tax Calculator", kicker: "Business", intro: "Estimate sales tax and total purchase cost from a subtotal and rate.", formula: "Total = subtotal + (subtotal × tax rate%)", description: "Use a local, verified rate for a planning estimate." },
};

const defaults: Record<CalculatorKind, Record<string, string>> = {
  loan: { amount: "250000", rate: "6.5", term: "30" }, mortgage: { amount: "400000", down: "80000", rate: "6.5", term: "30", tax: "320", insurance: "100", pmi: "0", hoa: "0" }, personalLoan: { amount: "25000", rate: "9.5", term: "5" }, salary: { annual: "75000", hours: "40", weeks: "52" }, takeHome: { annual: "75000", tax: "24" }, compound: { initial: "10000", contribution: "300", rate: "6", years: "20" }, investment: { initial: "10000", contribution: "500", rate: "7", years: "20" }, roi: { initial: "10000", final: "13500" }, profitMargin: { revenue: "50000", cost: "32000" }, currency: { amount: "1000", fromCurrency: "USD", toCurrency: "EUR", rate: "1" }, savings: { target: "25000", initial: "1000", contribution: "300", rate: "4", years: "5" }, simpleInterest: { principal: "5000", rate: "6", years: "3" }, markup: { cost: "40", markup: "50" }, discount: { price: "100", discount: "20" }, salesTax: { subtotal: "200", rate: "7.5" },
};

function fields(kind: CalculatorKind, v: (key: string) => string, set: (key: string) => (value: string) => void, onSwap?: () => void) {
  const field = (label: string, key: string, prefix?: string, suffix?: string, min = 0, max?: number) => <CalculatorField key={key} label={label} value={v(key)} onChange={set(key)} prefix={prefix} suffix={suffix} min={min} max={max} />;
  if (kind === "loan" || kind === "personalLoan") return <>{field(kind === "loan" ? "Loan amount" : "Personal loan amount", "amount", "$" )}{field("Interest rate", "rate", undefined, "%", 0, 100)}{field("Loan term", "term", undefined, "years", 0.01)}</>;
  if (kind === "mortgage") return <>{field("Home price", "amount", "$" )}{field("Down payment", "down", "$" )}{field("Interest rate", "rate", undefined, "%", 0, 100)}{field("Loan term", "term", undefined, "years", 0.01)}<div className="grid grid-cols-2 gap-3">{field("Property tax / mo", "tax", "$" )}{field("Home insurance / mo", "insurance", "$" )}{field("PMI / mo", "pmi", "$" )}{field("HOA / mo", "hoa", "$" )}</div></>;
  if (kind === "salary") return <>{field("Annual salary", "annual", "$" )}{field("Hours per week", "hours", undefined, "hours", 0.01)}{field("Working weeks per year", "weeks", undefined, "weeks", 0.01)}</>;
  if (kind === "takeHome") return <>{field("Annual gross salary", "annual", "$" )}{field("Assumed tax rate", "tax", undefined, "%", 0, 100)}</>;
  if (kind === "roi") return <>{field("Initial investment", "initial", "$" )}{field("Final value", "final", "$" )}</>;
  if (kind === "profitMargin") return <>{field("Revenue", "revenue", "$" )}{field("Cost", "cost", "$" )}</>;
  if (kind === "currency") {
    return <>
      {field("Amount", "amount", "$")}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 pt-1">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">From</Label>
          <select aria-label="From currency" value={v("fromCurrency") || "USD"} onChange={e => set("fromCurrency")(e.target.value)} className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            {currencyOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <Button type="button" aria-label="Swap from and to currencies" onClick={onSwap} variant="outline" className="h-11 w-11 rounded-full border-slate-200 bg-slate-50 p-0 text-slate-700 hover:bg-slate-100">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">To</Label>
          <select aria-label="To currency" value={v("toCurrency") || "SAR"} onChange={e => set("toCurrency")(e.target.value)} className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            {currencyOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>
    </>;
  }
  if (kind === "simpleInterest") return <>{field("Principal", "principal", "$" )}{field("Interest rate", "rate", undefined, "%", 0, 100)}{field("Time", "years", undefined, "years", 0.01)}</>;
  if (kind === "markup") return <>{field("Cost", "cost", "$" )}{field("Markup", "markup", undefined, "%", 0, 1000)}</>;
  if (kind === "discount") return <>{field("Original price", "price", "$" )}{field("Discount", "discount", undefined, "%", 0, 100)}</>;
  if (kind === "salesTax") return <>{field("Subtotal", "subtotal", "$" )}{field("Sales tax rate", "rate", undefined, "%", 0, 100)}</>;
  return <>{kind === "savings" && field("Savings target", "target", "$" )}{field("Starting balance", "initial", "$" )}{field("Monthly contribution", "contribution", "$" )}{field("Annual return", "rate", undefined, "%", -99.99, 100)}{field("Time horizon", "years", undefined, "years")}</>;
}


export default function CalculatorEngine({ kind }: { kind: CalculatorKind }) {
  const [values, setValues] = useState(() => { const base = defaults[kind]; if (typeof window === "undefined") return base; const params = new URLSearchParams(window.location.search); return Object.fromEntries(Object.entries(base).map(([key, fallback]) => [key, params.get(key) ?? fallback])); });
  const [currencyError, setCurrencyError] = useState("");
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const currencyCacheRef = useRef<Record<string, number>>({});
  const requestIdRef = useRef(0);
  const set = (key: string) => (value: string) => setValues(current => ({ ...current, [key]: value }));
  const swapCurrencies = useCallback(() => {
    setValues(current => {
      const previousFrom = current.fromCurrency || "USD";
      const previousTo = current.toCurrency || "SAR";
      if (!previousFrom || !previousTo) return current;
      return { ...current, fromCurrency: previousTo, toCurrency: previousFrom };
    });
  }, []);
  const result = useMemo(() => calculate(kind, values), [kind, values]); const m = meta[kind]; const [notice, setNotice] = useState(""); const [favorite, setFavorite] = useState(() => { try { return JSON.parse(localStorage.getItem("moneycalci-favorites") || "[]").includes(kind); } catch { return false; } }); useEffect(() => { try { const recent = JSON.parse(localStorage.getItem("moneycalci-recent") || "[]") as string[]; localStorage.setItem("moneycalci-recent", JSON.stringify([kind, ...recent.filter(item => item !== kind)].slice(0, 6))); } catch {} trackEvent("calculator_view", { calculator: kind }); }, [kind]); useEffect(() => { const params = new URLSearchParams(); Object.entries(values).forEach(([key, value]) => { if (value !== "") params.set(key, value); }); window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`); }, [values]);
  const series = result.chartData;
  const reset = () => { setValues(defaults[kind]); setNotice("Inputs reset"); trackEvent("calculator_reset", { calculator: kind }); }; const toggleFavorite = () => { try { const current = JSON.parse(localStorage.getItem("moneycalci-favorites") || "[]") as string[]; const next = favorite ? current.filter(item => item !== kind) : Array.from(new Set([...current, kind])); localStorage.setItem("moneycalci-favorites", JSON.stringify(next)); setFavorite(!favorite); setNotice(!favorite ? "Saved to favorites" : "Removed from favorites"); } catch {} }; const share = async () => { try { await navigator.clipboard.writeText(window.location.href); setNotice("Share link copied"); trackEvent("calculator_share", { calculator: kind }); } catch { setNotice("Copy the page URL to share this scenario"); } }; const copyResults = async () => { const lines = [m.title, ...result.results.map(item => `${item.label}: ${item.formattedValue}`), ...result.assumptions.map(item => `Note: ${item}`)]; try { await navigator.clipboard.writeText(lines.join("\n")); setNotice("Results copied"); trackEvent("calculator_copy_result", { calculator: kind }); } catch { setNotice("Copy is unavailable in this browser"); } };

  useEffect(() => {
    if (kind !== "currency") return;
    const nextFrom = values.fromCurrency || "USD";
    const nextTo = values.toCurrency || "SAR";
    const sameCurrency = nextFrom === nextTo;
    const pairKey = currencyPairKey(nextFrom, nextTo);
    if (sameCurrency) {
      const rateValue = "1";
      setValues(current => ({ ...current, fromCurrency: nextFrom, toCurrency: nextTo, rate: current.rate === rateValue ? current.rate : rateValue }));
      setCurrencyError("");
      setCurrencyLoading(false);
      currencyCacheRef.current[pairKey] = 1;
      return;
    }

    if (currencyCacheRef.current[pairKey] !== undefined) {
      const cachedRate = currencyCacheRef.current[pairKey];
      setValues(current => ({ ...current, fromCurrency: nextFrom, toCurrency: nextTo, rate: String(cachedRate) }));
      setCurrencyError("");
      setCurrencyLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setCurrencyError("");
    setCurrencyLoading(true);
    setValues(current => ({ ...current, fromCurrency: nextFrom, toCurrency: nextTo, rate: "" }));

    fetch(`https://api.frankfurter.dev/v2/rate/${nextFrom}/${nextTo}`)
      .then(async response => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        const rawRate = payload?.rate;
        const parsedRate = Number(rawRate);
        if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
          throw new Error("Invalid rate received");
        }
        return parsedRate;
      })
      .then(rate => {
        if (requestId !== requestIdRef.current) return;
        currencyCacheRef.current[pairKey] = rate;
        setValues(current => ({ ...current, fromCurrency: nextFrom, toCurrency: nextTo, rate: String(rate) }));
        setCurrencyError("");
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setCurrencyError("Rate unavailable");
        setValues(current => ({ ...current, fromCurrency: nextFrom, toCurrency: nextTo, rate: "" }));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setCurrencyLoading(false);
      });
  }, [kind, values.fromCurrency, values.toCurrency]);

  const heroValue = kind === "currency" ? formatCurrency(result.hero, Number.isFinite(Number(values.rate)) && Number(values.rate) > 0 ? values.toCurrency || "SAR" : values.fromCurrency || "USD", 2) : kind === "roi" || kind === "profitMargin" ? pct(result.hero) : wholeMoney(result.hero);
  const currencyStatus = kind === "currency" ? (currencyLoading ? "Loading exchange rate…" : currencyError ? currencyError : Number.isFinite(Number(values.rate)) && Number(values.rate) > 0 ? `${values.fromCurrency || "USD"} → ${values.toCurrency || "SAR"} = ${Number(values.rate).toFixed(4)}` : "Rate unavailable") : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <Card className="border-0 bg-white shadow-xl shadow-slate-200/60">
          <CardHeader>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              <Calculator className="h-4 w-4" /> Your inputs
            </div>
            <CardTitle className="text-2xl text-slate-950">Customize your estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {fields(kind, key => values[key] || "", set, kind === "currency" ? swapCurrencies : undefined)}
            {kind === "currency" && (
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span>{currencyStatus}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4 sm:gap-3">
              <Button onClick={reset} variant="outline" className="w-full min-w-0 border-slate-200"><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
              <Button onClick={share} variant="outline" className="w-full min-w-0 border-slate-200"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
              <Button onClick={copyResults} variant="outline" className="w-full min-w-0 border-slate-200"><Copy className="mr-2 h-4 w-4" /> Copy results</Button>
              <Button onClick={toggleFavorite} variant="outline" className="w-full min-w-0 border-slate-200"><Star className={`mr-2 h-4 w-4 ${favorite ? "fill-amber-400 text-amber-500" : ""}`} /> {favorite ? "Saved" : "Save"}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-[#10233f] text-white shadow-xl shadow-blue-950/20">
          <CardContent className="p-7 sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">{result.heroLabel}</p>
                <div className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{heroValue}</div>
              </div>
              <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300"><TrendingUp className="h-6 w-6" /></div>
            </div>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400 transition-all duration-300" style={{ width: `${result.chart}%` }} />
            </div>
            <p className="mt-3 text-sm text-blue-100">
              {kind === "currency"
                ? (currencyLoading ? "Loading a fresh exchange rate…" : currencyError ? "Unable to load a live rate right now." : "The converted amount updates using the selected currency pair.")
                : kind === "takeHome"
                  ? "Simplified estimate using your assumed tax rate; not official tax advice."
                  : kind === "savings"
                    ? `${result.chart.toFixed(0)}% of your target is projected`
                    : "Your estimate updates instantly as you adjust inputs."}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {result.results.map(r => <ResultCard key={r.label} label={r.label} value={r.formattedValue} tone={r.tone} />)}
            </div>
            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Assumptions</p>
              <ul className="mt-3 space-y-1 text-xs leading-5 text-blue-100">
                {result.assumptions.map(assumption => <li key={assumption}>• {assumption}</li>)}
              </ul>
              {result.breakdown.length > 0 && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Calculation breakdown</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {result.breakdown.slice(0, 4).map(item => (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2 text-xs">
                        <span className="text-blue-100">{item.label}</span>
                        <span className="font-semibold text-white">{item.formattedValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {notice && <p role="status" className="text-sm font-semibold text-emerald-700">{notice}</p>}
      {(kind === "compound" || kind === "investment") && series.length > 0 && <TimeSeriesBars data={series} />}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">What this number means</h2>
            <p className="mt-3 leading-7 text-slate-600">{m.description} The estimate uses the values above and is designed to give you an understandable comparison point, not a personalized financial recommendation.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Clear assumptions", "Instant updates", "No sign-up required"].map(x => (
                <div key={x} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600" /> {x}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Formula</p>
            <p className="mt-4 font-mono text-sm leading-6 text-slate-700">{m.formula}</p>
            <p className="mt-4 text-xs leading-5 text-slate-500">Verify rates, fees, tax rules, and provider terms before acting.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RelatedCalculators({ current }: { current: CalculatorKind }) { const items = ([['loan','Loan Calculator','/loan-calculator'],['mortgage','Mortgage Calculator','/mortgage-calculator'],['personalLoan','Personal Loan','/personal-loan-calculator'],['salary','Salary Calculator','/salary-calculator'],['takeHome','Take-Home Pay','/take-home-pay-calculator'],['compound','Compound Interest','/compound-interest-calculator'],['investment','Investment Calculator','/investment-calculator'],['roi','ROI Calculator','/roi-calculator'],['profitMargin','Profit Margin','/profit-margin-calculator'],['currency','Currency Converter','/currency-converter'],['savings','Savings Calculator','/savings-calculator']] as const).filter(x => x[0] !== current); return <section className="mt-16"><div className="flex items-end justify-between"><div><p className="eyebrow">Keep exploring</p><h2 className="mt-2 text-3xl font-bold text-slate-950">Related calculators</h2></div><Link href="/calculators" className="hidden items-center gap-2 text-sm font-bold text-blue-700 sm:flex">View all <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-6 grid gap-4 sm:grid-cols-3">{items.slice(0,3).map(([key,title,path]) => <Link key={key} href={path} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"><p className="font-bold text-slate-900">{title}</p><p className="mt-2 text-sm text-slate-500">Make your next money decision clearer.</p><ArrowRight className="mt-5 h-4 w-4 text-blue-600 transition group-hover:translate-x-1" /></Link>)}</div></section>; }
