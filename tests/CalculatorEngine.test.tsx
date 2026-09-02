// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

afterEach(() => cleanup());
import CalculatorEngine from "../client/src/components/CalculatorEngine";
import { formatCurrency } from "../shared/financial";

describe("CalculatorEngine UI behavior", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    window.history.pushState({}, "", "/currency-converter");
  });

  it("updates the loan payment when the amount changes", () => {
    render(<CalculatorEngine kind="loan" />);
    const amount = screen.getByLabelText("Loan amount");
    expect(screen.getAllByText("$1,580").length).toBeGreaterThan(0);
    fireEvent.change(amount, { target: { value: "100000" } });
    expect(screen.getAllByText("$632").length).toBeGreaterThan(0);
  });

  it("includes mortgage taxes and insurance in the visible payment", () => {
    render(<CalculatorEngine kind="mortgage" />);
    expect(screen.getByText("Property tax")).toBeTruthy();
    expect(screen.getByText("Insurance")).toBeTruthy();
    expect((screen.getByLabelText("Property tax / mo") as HTMLInputElement).value).toBe("320");
    expect((screen.getByLabelText("Home insurance / mo") as HTMLInputElement).value).toBe("100");
  });

  it.each([
    ["personalLoan", "Personal Loan Calculator", "Personal loan amount"],
    ["salary", "Salary Calculator", "Annual salary"],
    ["takeHome", "Take-Home Pay Calculator", "Annual gross salary"],
    ["investment", "Investment Calculator", "Starting balance"],
    ["roi", "ROI Calculator", "Initial investment"],
    ["profitMargin", "Profit Margin Calculator", "Revenue"],
    ["currency", "Currency Converter", "Amount"],
  ] as const)("renders %s with its dedicated inputs", (kind, title, inputLabel) => {
    render(<CalculatorEngine kind={kind} />);
    expect(screen.getByLabelText(inputLabel)).toBeTruthy();
  });

  it("exposes optional mortgage PMI and HOA controls with zero-safe defaults", () => {
    render(<CalculatorEngine kind="mortgage" />);
    expect((screen.getByLabelText("PMI / mo") as HTMLInputElement).value).toBe("0");
    expect((screen.getByLabelText("HOA / mo") as HTMLInputElement).value).toBe("0");
    fireEvent.change(screen.getByLabelText("PMI / mo"), { target: { value: "125.50" } });
    fireEvent.change(screen.getByLabelText("HOA / mo"), { target: { value: "75" } });
    expect(screen.getByText("PMI")).toBeTruthy();
    expect(screen.getByText("HOA")).toBeTruthy();
  });

  it("renders projection data from a fixed monthly compounding model", () => {
    render(<CalculatorEngine kind="compound" />);
    expect(screen.getAllByText("0y").length).toBeGreaterThan(0);
    expect(screen.getAllByText("20y").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/end of each month/).length).toBeGreaterThan(0);
  });

  it("shows validation for invalid and non-finite-style input strings", () => {
    render(<CalculatorEngine kind="salary" />);
    const annual = screen.getByLabelText("Annual salary");
    fireEvent.change(annual, { target: { value: "-100" } });
    expect(annual.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toContain("0 or more");
  });

  it("updates savings target progress when the target changes", () => {
    render(<CalculatorEngine kind="savings" />);
    const target = screen.getByLabelText("Savings target");
    expect(screen.getByText(/% of your target is projected/)).toBeTruthy();
    fireEvent.change(target, { target: { value: "500000" } });
    expect(screen.getByText(/% of your target is projected/)).toBeTruthy();
    expect(screen.getByText(/% of your target is projected/)).toBeTruthy();
  });

  it("uses the Frankfurter API rate for the chosen currency pair", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ date: "2026-09-01", base: "USD", quote: "EUR", rate: 0.92 }) });
    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    render(<CalculatorEngine kind="currency" />);

    const amount = screen.getByLabelText("Amount");
    fireEvent.change(amount, { target: { value: "100" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("https://api.frankfurter.dev/v2/rate/USD/EUR"));
    await waitFor(() => expect(screen.getAllByText(/92\.00/).length).toBeGreaterThan(0));
  });

  it("swaps the currencies and recalculates using the reversed pair", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ date: "2026-09-01", base: "USD", quote: "EUR", rate: 0.92 }) });
    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    render(<CalculatorEngine kind="currency" />);
    fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /swap/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("https://api.frankfurter.dev/v2/rate/EUR/USD"));
    expect((screen.getByLabelText("From currency") as HTMLSelectElement).value).toBe("EUR");
    expect((screen.getByLabelText("To currency") as HTMLSelectElement).value).toBe("USD");
    expect((screen.getByLabelText("Amount") as HTMLInputElement).value).toBe("100");
  });

  it("uses a rate of 1 without fetching when the currencies match", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock as typeof fetch);
    window.history.pushState({}, "", "/currency-converter?fromCurrency=USD&toCurrency=USD&amount=100");

    render(<CalculatorEngine kind="currency" />);

    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
    expect(screen.getAllByText(/USD → USD = 1.0000/i).length).toBeGreaterThan(0);
  });

  it("handles API failures safely without fake results", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    render(<CalculatorEngine kind="currency" />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getAllByText(/Rate unavailable/i).length).toBeGreaterThan(0));
  });
});
