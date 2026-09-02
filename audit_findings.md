# MoneyCalci Round 1 Technical Audit Findings

## 1. Project Architecture & Structure
- **Architecture:** React 19 + Tailwind 4 + Express 4 + tRPC 11. Solid foundation.
- **Structure:** Clean separation between `client`, `server`, `shared`, and `drizzle`.
- **Issues:** 
  - Client tests are currently discovered under `server/` which is non-standard.
  - No dedicated `storage` or `api` integrations for currency rates yet.

## 2. Calculator Engine & Logic
- **Reusability:** Good use of `CalculatorEngine` and `CalculatorParts`.
- **Logic:** Core formulas in `shared/financial.ts` are tested but narrow.
- **Issues:**
  - `CalculatorField` validation only checks for negative numbers.
  - `TimeSeriesBars` lacks accessibility (ARIA labels) and mobile-responsive table fallback.
  - `CalculatorEngine` uses a monolithic `values` state with hardcoded defaults for all kinds.
  - No handling for `NaN`, `Infinity`, or extremely large numbers in the UI.

## 3. Routing & SEO
- **Routes:** Only 4 out of 10 requested Version 1 calculators are implemented.
- **SEO:** Page-level titles and descriptions are updated via `useEffect`, but canonicals, OG, Twitter, and structured data are missing.
- **Issues:**
  - Missing routes: `/personal-loan-calculator`, `/salary-calculator`, `/take-home-pay-calculator`, `/investment-calculator`, `/roi-calculator`, `/profit-margin-calculator`, `/currency-converter`.
  - `/sitemap.xml` returns 404.
  - No `robots.txt` observed.

## 4. UI/UX & Responsive Design
- **Visuals:** Elegant and professional financial style.
- **Responsive:** Good mobile-first approach, but complex tables/charts need review.
- **Issues:**
  - `TimeSeriesBars` hover titles are not accessible on touch devices.
  - No visible loading or empty states for future API-driven calculators (Currency).

## 5. Mathematical Accuracy
- **Formulas:** Standard amortized and future value formulas are correct.
- **Issues:**
  - Zero-interest and zero-principal cases are handled in helpers but need UI verification.
  - Salary and Tax calculators are missing, which are high-risk for accuracy claims.

## 6. Testing
- **Coverage:** 10 tests pass (auth, formulas, basic component behavior).
- **Issues:**
  - No edge-case testing for extreme inputs.
  - No testing for the 6 missing calculators.
  - Brittle component assertions (e.g., `getAllByText("$1,580")`).
