# MoneyCalci Project TODO

- [x] Build premium responsive public homepage with clear calculator categories and calls to action
- [x] Create global responsive navigation and footer with accessible keyboard focus states
- [x] Create reusable calculator engine components for inputs, validation, results, breakdowns, explanations, formulas, FAQs, and related calculators
- [x] Implement functional Loan Calculator with monthly payment, total payment, total interest, and breakdown
- [x] Implement functional Mortgage Calculator with principal, interest, taxes/insurance assumptions, payment summary, and breakdown
- [x] Implement functional Compound Interest Calculator with contributions, growth summary, and chart-ready result data
- [x] Implement functional Savings Calculator with target, recurring contribution, timeline, and progress summary
- [x] Add SEO-friendly routes, titles, descriptions, headings, educational content, FAQs, and internal links for each calculator
- [x] Add calculators directory and category routes for finance, loans, savings, and investment
- [x] Add clear financial result indicators and decision-support summaries without financial advice claims
- [x] Add mobile and desktop responsive layouts with basic accessibility semantics and labels
- [x] Add unit tests for the core financial formulas and calculator behavior
- [x] Run type checking, tests, and visual verification; fix discovered issues
- [x] Save final project checkpoint after all completed items are marked complete

## Change history

- Initial Version 1 scope expanded to include homepage, reusable calculator framework, loan/mortgage/compound interest/savings calculators, SEO routes, responsive design, and accessibility basics.

## Follow-up implementation gaps

- [x] Create dedicated reusable calculator subcomponents for input fields, validation messages, result cards, formula section, FAQ section, and related calculators, then wire visible validation states into all calculators
- [x] Add real chart-ready time-series data and a chart component for the compound interest calculator
- [x] Implement per-route SEO metadata for each calculator page and add calculator-specific FAQ sections
- [x] Build distinct /calculators, /finance, /loans, /investment, and /savings pages with directory/category content
- [x] Add tests for calculator behavior, including input changes, zero-interest cases, mortgage extras, savings target progress, and rendered result updates

## Final refinement gaps

- [x] Extract calculator result cards into a dedicated reusable component and use it across calculator pages
- [x] Add calculator behavior tests for input changes, mortgage taxes and insurance totals, savings target progress, and result updates

## Client behavior verification

- [x] Add client-side/component behavior tests that render calculator UI, change inputs, and verify updated displayed results for loan, mortgage, and savings calculators

## MoneyCalci Round 1 technical audit

- [x] Audit current architecture, routes, calculator engine, metadata, assets, dependencies, logs, and error states
- [x] Expand route coverage to all ten Version 1 calculator URLs without removing existing working routes
- [x] Add and test Personal Loan Calculator
- [x] Add and test Salary Calculator with clearly labeled estimate assumptions
- [x] Add and test Take-Home Pay Calculator with clearly labeled simplified tax assumptions
- [x] Add and test Investment Calculator
- [x] Add and test ROI Calculator with zero-investment protection
- [x] Add and test Profit Margin Calculator with zero-revenue protection and margin/markup distinction
- [x] Add Currency Converter architecture with explicit non-live fallback labeling and validation
- [x] Audit all calculator formulas for zero, negative, non-finite, decimal, and extreme inputs
- [x] Standardize number and currency formatting and visible validation states
- [x] Add route-level canonical, Open Graph, Twitter, robots, sitemap, and structured-data SEO support where appropriate
- [x] Audit navigation links, 404 handling, mobile layout, desktop layout, accessibility, and console errors
- [x] Add comprehensive unit and component tests for all calculators and edge cases
- [x] Run typecheck, test suite, build, and visual verification; fix regressions
- [x] Review all Round 1 items and save a new checkpoint

## Round 1 verification gaps

- [x] Audit header, footer, category, and legal links, 404 behavior, and browser console errors across all public routes
- [x] Add calculator-specific component tests for personal loan, investment, salary, take-home pay, ROI, profit margin, and currency converter
- [x] Expand formula and UI edge-case coverage to include decimal, invalid string, NaN/Infinity, empty, and extremely large inputs for every calculator
- [x] Add route-level canonical, OG, Twitter, and structured-data handling for homepage, category pages, and informational/legal pages
- [x] Save a fresh project checkpoint after the Round 1 fixes are actually completed and verified

## MoneyCalci Round 2 — Calculator accuracy and financial logic

- [x] Complete reading the full Round 2 specification and document the current calculator architecture and formula inventory
- [x] Separate input, calculation, presentation, and content responsibilities without redesigning unrelated site areas
- [x] Centralize reusable validation, finite-value guards, formatting, and calculation result types
- [x] Audit loan and personal-loan formulas against standard amortization cases, zero interest, invalid terms, decimals, and large values
- [x] Audit mortgage principal-and-interest separately from taxes, insurance, PMI, and HOA optional costs
- [x] Add or verify amortization schedule convergence, principal/interest split, and normalized final balance
- [x] Audit compound-interest and investment contribution timing, compounding frequency, zero values, and long durations
- [x] Audit ROI and profit-margin/markup formulas, including zero-cost and zero-revenue protections
- [x] Audit salary and take-home-pay conversions with explicit period assumptions and simplified-tax disclosure
- [x] Audit currency conversion fallback behavior and explicit non-live-rate labeling
- [x] Add normal, boundary, zero, invalid, decimal, large-number, and applicable-negative tests for every calculator
- [x] Improve result presentation so estimated values, assumptions, and optional-cost breakdowns are unambiguous
- [x] Run typecheck, full tests, production build, and focused visual verification without introducing unrelated features
- [x] Review all Round 2 items and save a new checkpoint

## Round 2 review gaps

- [x] Extract calculator calculation functions and shared result models into a dedicated non-UI module consumed by CalculatorEngine
- [x] Create a shared typed calculation result contract for primary results, secondary results, assumptions, breakdowns, and chart data
- [x] Add optional PMI and HOA mortgage inputs/results, with zero-safe handling and regression coverage
- [x] Add configurable compounding-frequency support or a clearly documented fixed-frequency limitation with tests
- [x] Build a per-calculator regression matrix covering normal, boundary, zero, invalid, decimal, large, and applicable-negative cases

## Round 2 final correction gaps

- [x] Extend CalculationResult with explicit breakdown and chart-data fields, and consume both from CalculatorEngine
- [x] Add PMI and HOA fields/defaults to the mortgage UI and component tests
- [x] Document fixed monthly compounding explicitly in UI/configuration and add dedicated regression coverage
- [x] Expand the regression suite with per-calculator normal, boundary, invalid, decimal, large, zero, and applicable-negative scenarios

## Round 2 final verification correction

- [x] Add explicit per-calculator edge-case assertions for normal, boundary, invalid, decimal, large, zero, and applicable-negative scenarios across all current calculator kinds
- [x] Save a fresh checkpoint after the verified Round 2 changes

## Round 2 scenario-semantic test correction

- [x] Add targeted per-calculator expected-outcome assertions for zero-interest loans, invalid fallbacks, negative investment returns, mortgage PMI/HOA totals, currency fallback labeling, and take-home disclosures

## MoneyCalci Round 3 — Technical SEO, IA, Content Quality & Organic Growth

- [x] Audit current sitemap, robots, metadata, canonical, headings, structured data, Open Graph, Twitter, internal links, breadcrumbs, indexability, 404, search, mobile SEO, performance, and crawlable content
- [x] Create centralized SEO/content data model for calculators with unique title, description, educational sections, examples, assumptions, FAQs, related links, and lastUpdated
- [x] Build topical hubs for finance, loans, salary, taxes, investment, business, ecommerce, shipping, and currency without publishing thin placeholder pages
- [x] Improve calculator page content with genuine how-to-use, how-it-works, formula, variables, worked example, assumptions, common mistakes, FAQ, and related-calculator sections
- [x] Implement semantic breadcrumbs with BreadcrumbList structured data across public calculator, category, and blog pages
- [x] Implement centralized meaningful related-calculator relationships and detect orphan calculator routes
- [x] Build focused educational blog architecture with a small set of calculator-supporting articles and contextual calculator links
- [x] Add truthful trust, methodology, update-date, financial-disclaimer, and future tax-data architecture without inventing expertise or statistics
- [x] Improve homepage SEO metadata and above-the-fold search intent without keyword stuffing
- [x] Ensure unique route-level titles and meta descriptions for all indexable public pages
- [x] Ensure canonical URLs ignore calculation query-string variations and add redirects only where needed
- [x] Audit and improve robots.txt and dynamically maintainable sitemap coverage without private/search/query URLs
- [x] Add Open Graph/Twitter image metadata with an appropriate scalable asset strategy and accessible image handling
- [x] Improve calculator search aliases and category-aware discovery; keep search result pages noindex
- [x] Improve useful 404 page with search, popular calculators, and homepage escape routes
- [x] Add SEO QA automation for titles, descriptions, H1, canonical, structured data, internal links, orphan routes, sitemap, and alt text
- [x] Add future AdSense and affiliate slot components without ads, fake partnerships, or intrusive placements
- [x] Run final SEO, content, link, indexability, structured-data, mobile, performance, typecheck, test, build, and visual QA
- [x] Review all Round 3 items and save a fresh checkpoint

## Round 3 visual QA correction

- [x] Replace the generic framework 404 fallback with a useful MoneyCalci not-found page containing search, popular calculators, and a homepage escape route

## Round 3 final corrections

- [x] Remove the thin /shipping placeholder from the indexable category inventory, or substantially enrich it with a real verified shipping tool
- [x] Add automated orphan detection proving every calculator is linked from homepage, category, related links, breadcrumbs, and sitemap
- [x] Display last-updated information from the centralized content model on calculator and article pages
- [x] Add explicit calculator search aliases such as home loan, paycheck, net pay, margin, and markup, with behavior tests
- [x] Add a search field to the actual NotFound page used by App.tsx
- [x] Expand SEO QA automation to validate title/meta uniqueness, H1 counts, internal links, orphan routes, sitemap membership, structured-data JSON, and alt text
- [x] Perform and document performance QA; apply an appropriate code-splitting or bundle mitigation for the large client chunk warning
- [x] Save a fresh Round 3 checkpoint after all final corrections are verified

## Round 3 QA precision corrections

- [x] Verify each calculator is linked from homepage, its published category hub, a related-calculator block, breadcrumbs, and sitemap
- [x] Render and test last-updated dates on blog/article pages using the centralized content model
- [x] Parse JSON-LD blocks in SEO QA and validate required structured-data shapes rather than only checking source strings
- [x] Validate exact H1 counts for representative page families in SEO QA

## Round 3 evidence-quality corrections

- [x] Add per-calculator QA assertions that parse published category and related-link source relationships and confirm breadcrumb route coverage for every calculator
- [x] Add a component regression test for visible article last-updated output sourced from calculator content
- [x] Make SEO QA extract and parse the actual JSON-LD object literals emitted by the shared SEO components
- [x] Add rendered-route H1 count QA for homepage, calculator, category, blog index, blog article, and 404 representatives

## Round 3 final evidence corrections

- [x] Add route-aware rendered-source tests for every calculator proving breadcrumbs and related calculator links include the current route and expected destinations
- [x] Add a real render-to-static-markup SEO audit utility that parses emitted JSON-LD and exact H1 counts for homepage, calculator, category, blog index, article, and 404 representatives
- [x] Save a new reviewable Round 3 checkpoint after all final evidence corrections pass

## Round 3 final audit hardening

- [x] Assert each rendered calculator breadcrumb contains the current calculator label as the terminal page item
- [x] Create a standalone rendered SEO audit helper that renders representative routes and parses all emitted JSON-LD payloads, including breadcrumb, FAQ, Article, and calculator schemas
- [x] Re-run final verification and save the new Round 3 checkpoint

## Round 3 schema completion

- [x] Render and validate calculator SoftwareApplication JSON-LD in the standalone SSR audit, not only the client-side head effect
- [x] Save the final Round 3 checkpoint after schema verification passes

## MoneyCalci Round 4 — scalable platform, UX, and expansion

- [x] Complete Round 4 architecture and product review against the inherited specification
- [x] Add scalable calculator registry metadata for slugs, labels, categories, feature status, and discovery
- [x] Add the first high-value calculator expansion using the shared calculation engine and content model
- [x] Add lightweight shareable calculation URLs with validation and clean canonical URLs
- [x] Add copy-results, print stylesheet, recent calculators, and favorites without requiring accounts
- [x] Improve search result and empty-state UX and expose category-aware discovery
- [x] Add privacy-safe analytics event architecture without claiming an active provider
- [x] Keep reusable ad and affiliate readiness components clearly labeled and non-deceptive
- [x] Add and link a professional financial disclaimer page
- [x] Add Round 4 regression tests, visual checks, production build, and final checkpoint

## Round 4 verification fixes

- [x] Add an inbound related-calculator relationship for Simple Interest so it is not orphaned
- [x] Add the published disclaimer URL to sitemap coverage and rerun all gates

## Round 4 gap closure

- [x] Add explicit registry labels and make the shared registry authoritative for homepage routing and calculator discovery
- [x] Expose visible recent and favorite calculator sections with regression coverage
- [x] Complete visual verification and save the final Round 4 checkpoint

## Round 4 registry audit correction

- [x] Update source SEO audit to validate registry-backed route discovery rather than requiring duplicated literal route strings in Home.tsx

## Round 4 final evidence

- [x] Add component coverage for localStorage-backed Recent Calculators and Saved Favorites rendering
- [x] Save the reviewable Round 4 checkpoint after all final evidence passes

## MoneyCalci Round 5 — final production audit and go-live readiness

- [x] Audit current code, dependencies, environment variables, production URLs, debug code, and deployment configuration
- [x] Audit secrets, input handling, URL parameters, XSS surfaces, APIs, database exposure, and error boundaries
- [x] Audit routes, canonical domain strategy, robots, sitemap, structured data, metadata, legal pages, and indexability
- [x] Audit responsive layouts, accessibility, bundle/performance risks, third-party resources, and user journeys
- [x] Fix only material production-readiness issues found during the audit
- [x] Add regression tests for production gates and rerun full verification
- [x] Save a new Round 5 checkpoint and deliver a go-live readiness report with unresolved launch prerequisites

## Round 5 discovered production risks

- [x] Remove the unconfigured analytics script and verify no third-party tracking loads by default
- [x] Replace temporary preview canonical, robots, sitemap, and social URL references with the configured production origin
- [x] Tighten unnecessary server body-parser limits and avoid localhost/debug-style production logging
- [x] Add production-gate tests for canonical origin, sitemap origin, and malformed query parameter stability

## Round 5 audit gap closure

- [x] Prevent production ErrorBoundary from rendering stack traces or internal error details
- [x] Add a regression test proving the user-facing error boundary remains generic
- [x] Document broader responsive/a11y review and accepted bundle-warning rationale in the final go-live report

## MoneyCalci Round 6 — final pre-launch verification and gap closure

- [x] Audit `__manus__` and debug-collector artifacts and verify production build inclusion and execution risk
- [x] Inventory localStorage, URL parameters, cookies, analytics hooks, and external data transmission
- [x] Reconcile privacy-policy wording with actual current data behavior without broad legal rewriting
- [x] Run calculator route, render, input, reset, metadata, link, edge-case, and extreme-term regression checks
- [x] Verify currency and tax calculators continue to use transparent non-live/basic estimates
- [x] Verify ErrorBoundary safe output and optional external API failure handling
- [x] Apply only targeted safe production-readiness fixes discovered in Round 6
- [x] Run full tests, typecheck, SEO audit, production build, and final visual verification
- [x] Save the Round 6 checkpoint and report any remaining NOT VERIFIED items

## Round 6 verification correction

- [x] Remove the copied debug collector from `dist/public/__manus__` using the actual Vite output path and re-run the production artifact scan

## Round 6 test-command correction

- [x] Add the existing SEO audit utility to package scripts so the documented final gate is runnable and re-run it

## Round 6 dependency decision

- [x] Record the dependency audit finding for fast-xml-parser and distinguish it as a transitive NOT VERIFIED risk requiring a compatible AWS SDK update or platform patch

## New attached instructions — pending implementation

- [x] Read and extract the actionable requirements from `pasted_content_2.txt`
- [x] Map each requirement to the current MoneyCalci architecture and identify safe implementation boundaries
- [x] Implement the requested changes without regressing existing calculators, SEO, privacy, or production safeguards
- [x] Add or update regression tests for the new behavior
- [x] Run typecheck, full test suite, SEO audit, production build, and visual verification
- [x] Save a new reviewable checkpoint and summarize remaining limitations

## Round 6.1 targeted fixes

- [x] Keep one authoritative calculator SoftwareApplication JSON-LD block across SSR and client navigation
- [x] Make the Contact page explicitly state the missing real contact-channel launch requirement without inventing an address
- [x] Add regression coverage for single calculator JSON-LD and contact-page disclosure
- [x] Re-run the specified calculator, SEO, build, artifact, accessibility, and mobile checks without redesigning or adding features

## Round 6.1 audit parser correction

- [x] Update rendered SEO audit JSON-LD extraction to accept the authoritative calculator script's id and type attributes in either order

## Round 6.1 visual regression correction

- [x] Resolve the actual published blog article route used by the content model and ensure the SEO regression path renders the article rather than 404
