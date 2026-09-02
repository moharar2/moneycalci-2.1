# MoneyCalci Round 2 Accuracy Audit

## Scope

Round 2 focused on mathematical accuracy, input safety, reusable calculation logic, result trust, and regression coverage. The visual system and public information architecture were intentionally preserved.

## Findings addressed

The shared layer previously normalized every numeric input to a non-negative value, which prevented valid negative-return investment scenarios and made the input contract implicit. Loan repayment totals were derived from a rounded schedule approximation inside the UI, and mortgage optional costs were combined into one result label. Currency formatting was duplicated in the engine rather than using a shared formatter. The chart also used fixed year labels that could extend beyond the user's selected horizon.

## Fixes applied

The shared financial module now exposes finite-value parsing, locale-aware currency and percentage formatting, amortized payment, a normalized amortization schedule, future value with safe negative annual returns, salary conversion, simplified take-home estimation, ROI, and profit margin/markup. The calculator engine consumes the shared formatting and amortization functions, labels monthly contributions as end-of-period assumptions, separates mortgage property tax and insurance, and generates chart points from the selected horizon.

The shared input field now supports minimum and maximum rules, `aria-invalid`, announced error text, numeric input mode, and field-specific constraints for terms, rates, tax percentages, working hours, and exchange rates. The currency converter remains explicitly user-rate based; no live rate is claimed or fetched.

## Verification

TypeScript checking, the complete Vitest suite, and the production build passed after the changes. The regression suite covers normal, zero, negative, non-finite, decimal, long-duration, large-number, amortization convergence, precision formatting, mortgage extras, salary assumptions, simplified taxes, ROI, margin, markup, and component-level calculator behavior.

## Remaining risks

Take-home pay is intentionally a simplified percentage estimate and is not a jurisdiction-aware payroll or tax engine. Currency conversion is intentionally not live and requires the user to provide a current rate. Investment and savings projections are estimates and do not guarantee returns. A future round may introduce server-backed, versioned tax rules or an exchange-rate provider only after defining data freshness, source attribution, timeout, and rate-limit behavior.

## Final correction pass

The calculation result contract now includes explicit `breakdown` and `chartData` collections, and the UI consumes those shared payloads. Mortgage users can enter PMI and HOA monthly costs, which are included in the monthly housing estimate and shown as separate result cards. Projection assumptions now state that monthly compounding frequency is fixed in this version; this is a deliberate limitation rather than an implied configurable option.

The regression suite now includes an explicit matrix for each current calculator kind plus targeted semantic assertions for zero-interest loans, invalid currency input, negative investment returns, mortgage optional costs, and simplified take-home disclosures. Final verification passed with 108 tests across three test files, TypeScript checking, production build, and focused desktop/mobile screenshots.
