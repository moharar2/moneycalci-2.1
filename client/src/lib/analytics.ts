export type MoneyCalciEvent = "calculator_view" | "calculator_calculation" | "calculator_reset" | "calculator_share" | "calculator_copy_result" | "calculator_search" | "calculator_category_click";

export function trackEvent(name: MoneyCalciEvent, details: { calculator?: string; category?: string } = {}) {
  if (typeof window === "undefined") return;
  const payload = { event: name, ...details, timestamp: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("moneycalci:analytics", { detail: payload }));
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) dataLayer.push(payload);
}
