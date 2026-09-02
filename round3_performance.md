# MoneyCalci Round 3 Performance QA

The production build completed successfully after moving the interactive calculator engine behind a lazy-loaded boundary. The calculator engine is now emitted as a separate asynchronous chunk of approximately 34 KB uncompressed and 7.5 KB gzip, so guide, category, information, and 404 routes do not need to load that feature code up front.

The main client chunk remains approximately 767 KB uncompressed and 214 KB gzip, with the build tool retaining a warning above its 500 KB advisory threshold. This is a known tradeoff from the React, UI primitives, icon set, and route shell currently bundled together. The SEO audit enforces a hard guard at 950 KB for any individual client chunk, and the current build remains below that guard.

Validation completed: TypeScript check passed; 112 Vitest tests passed; the SEO audit passed with unique metadata hooks, 33 clean sitemap URLs, 11 calculator routes, internal-link/orphan checks, structured-data hooks, alias checks, image-alt checks, and performance guard; the production build passed; representative desktop and mobile routes were visually inspected.
