// Synchronous, non-module script that runs in <head> before any React module.
// Reads window.location.pathname and injects the correct <title>,
// <meta name="description">, <link rel="canonical">, og/twitter tags,
// and updates the static <h1 id="primary-h1"> inside #root.
// This ensures Bing/Google View-Source sees the correct SEO data
// for every route, not just the homepage.

(function () {
  "use strict";
  var SITE = "https://moneycalci.online";
  var ACCENT = "#1d4ed8";

  // ---- Static metadata (mirrors shared/seoContent.ts) ----
  var calculatorContent = {
    loan:        { seoTitle: "Loan Calculator — Monthly Payment & Interest", metaDescription: "Estimate a fixed-rate loan payment, total interest, and repayment with MoneyCalci's free loan calculator." },
    mortgage:    { seoTitle: "Mortgage Calculator — Estimate Your Monthly Payment", metaDescription: "Estimate mortgage principal, interest, property tax, insurance, PMI, and HOA costs with a clear fixed-rate calculator." },
    personalLoan:{ seoTitle: "Personal Loan Calculator — Payment & Interest", metaDescription: "Estimate personal-loan payments, interest, and total repayment for a fixed-rate installment scenario." },
    salary:      { seoTitle: "Salary Calculator — Annual to Hourly Pay", metaDescription: "Convert annual salary into monthly, biweekly, weekly, and hourly gross-pay estimates with MoneyCalci." },
    takeHome:    { seoTitle: "Take-Home Pay Calculator — Simplified Net Pay Estimate", metaDescription: "Estimate monthly and annual take-home pay from gross salary using a transparent simplified tax-rate assumption." },
    compound:    { seoTitle: "Compound Interest Calculator — Investment Growth", metaDescription: "Calculate compound growth with an initial balance, monthly contributions, annual return, and time horizon." },
    investment:  { seoTitle: "Investment Calculator — Project Future Value", metaDescription: "Project an investment balance from starting capital, monthly contributions, return assumptions, and time horizon." },
    roi:         { seoTitle: "ROI Calculator — Calculate Return on Investment", metaDescription: "Calculate return on investment and profit or loss from an initial investment and final value." },
    profitMargin:{ seoTitle: "Profit Margin Calculator — Profit, Margin & Markup", metaDescription: "Calculate business profit, profit margin, and markup while keeping the two percentages distinct." },
    currency:    { seoTitle: "Currency Converter — Live Exchange Rate", metaDescription: "Convert an amount using the latest valid exchange rate from the connected exchange-rate service." },
    savings:     { seoTitle: "Savings Calculator — Monthly Contributions & Goal Progress", metaDescription: "Plan a savings target with an initial balance, monthly contribution, return assumption, and timeline." },
    simpleInterest:{ seoTitle: "Simple Interest Calculator — Interest & Total", metaDescription: "Calculate simple interest, interest earned, and total amount from principal, rate, and time." },
    markup:      { seoTitle: "Markup Calculator — Selling Price from Cost", metaDescription: "Calculate markup amount and suggested selling price from cost and a markup percentage." },
    discount:    { seoTitle: "Discount Calculator — Sale Price & Savings", metaDescription: "Calculate the discount amount, final sale price, and savings from an original price and percentage off." },
    salesTax:    { seoTitle: "Sales Tax Calculator — Tax & Total", metaDescription: "Estimate sales tax and total purchase cost from a subtotal and one tax-rate assumption." }
  };

  var calculatorPaths = {
    loan: "/loan-calculator", mortgage: "/mortgage-calculator", personalLoan: "/personal-loan-calculator",
    salary: "/salary-calculator", takeHome: "/take-home-pay-calculator",
    compound: "/compound-interest-calculator", investment: "/investment-calculator",
    roi: "/roi-calculator", profitMargin: "/profit-margin-calculator",
    currency: "/currency-converter", savings: "/savings-calculator",
    simpleInterest: "/simple-interest-calculator", markup: "/markup-calculator",
    discount: "/discount-calculator", salesTax: "/sales-tax-calculator"
  };

  var calculatorLabels = {
    loan: "Loan Calculator", mortgage: "Mortgage Calculator", personalLoan: "Personal Loan Calculator",
    salary: "Salary Calculator", takeHome: "Take-Home Pay Calculator",
    compound: "Compound Interest Calculator", investment: "Investment Calculator",
    roi: "ROI Calculator", profitMargin: "Profit Margin Calculator",
    currency: "Currency Converter", savings: "Savings Calculator",
    simpleInterest: "Simple Interest Calculator", markup: "Markup Calculator",
    discount: "Discount Calculator", salesTax: "Sales Tax Calculator"
  };

  var categoryContent = {
    finance:    { name: "Money & Finance Calculators", seoTitle: "Money & Finance Calculators | MoneyCalci", metaDescription: "Plan everyday money decisions with clear calculators for savings, salary, take-home pay, and currency scenarios." },
    loans:      { name: "Loan Calculators", seoTitle: "Loan Calculators — Payments, Interest & Housing Costs", metaDescription: "Estimate loan and mortgage payments, interest, amortization, and optional housing costs with MoneyCalci." },
    salary:     { name: "Salary Calculators", seoTitle: "Salary Calculators — Gross Pay & Pay Period Estimates", metaDescription: "Convert salary across pay periods and compare gross-pay and simplified take-home estimates." },
    taxes:      { name: "Tax Planning Estimates", seoTitle: "Tax Planning Estimates | MoneyCalci", metaDescription: "Use a transparent simplified take-home-pay estimate without treating it as official tax advice." },
    investment: { name: "Investment Calculators", seoTitle: "Investment Calculators — Growth, Returns & ROI", metaDescription: "Explore compound growth, investment projections, and return on investment with transparent assumptions." },
    business:   { name: "Business Calculators", seoTitle: "Business Calculators — ROI, Profit Margin & Markup", metaDescription: "Calculate ROI, profit, margin, and markup with business-focused tools that explain denominator differences." },
    ecommerce:  { name: "Ecommerce Planning", seoTitle: "Ecommerce Planning Calculators | MoneyCalci", metaDescription: "Use profit margin and currency planning tools to understand ecommerce scenarios without invented benchmarks." },
    currency:   { name: "Currency Tools", seoTitle: "Currency Tools — Transparent Conversion Planning", metaDescription: "Convert amounts with a user-provided exchange rate and understand the limitations of a non-live tool." }
  };

  var blogArticles = [
    { slug: "how-is-a-loan-payment-calculated", title: "How Is a Loan Payment Calculated?", description: "Understand the fixed-rate amortization formula behind a monthly loan payment and why term matters." },
    { slug: "how-does-compound-interest-work", title: "How Does Compound Interest Work?", description: "Learn how starting money, recurring contributions, time, and an assumed return affect projected growth." },
    { slug: "how-to-calculate-profit-margin", title: "How to Calculate Profit Margin", description: "Learn the difference between profit margin and markup and when each business metric is useful." },
    { slug: "how-to-calculate-roi", title: "How to Calculate ROI", description: "Understand total return on investment, profit or loss, and why timing changes the interpretation." },
    { slug: "gross-pay-vs-net-pay", title: "Gross Pay vs Net Pay", description: "See why an annual salary conversion differs from a take-home-pay estimate and what each number leaves out." }
  ];

  var infoMeta = {
    about:           ["About MoneyCalci", "MoneyCalci is an independent financial calculator platform. Learn what it offers and how calculator estimates work."],
    contact:         ["Contact MoneyCalci", "Get in touch with MoneyCalci about calculator errors, technical issues, or general feedback."],
    "privacy-policy":["Privacy Policy | MoneyCalci", "See exactly how MoneyCalci handles browser storage, calculator data, cookies, analytics, and third-party services."],
    terms:           ["Terms of Use | MoneyCalci", "Read the MoneyCalci terms of use and estimate disclaimer."],
    disclaimer:      ["Financial Disclaimer | MoneyCalci", "Understand the limits of MoneyCalci calculator estimates and why results can differ from real-world outcomes."]
  };

  // ---- Route resolver ----
  function buildRouteMeta(pathname) {
    // Strip query/hash
    var cleanPath = (pathname || "/").split("?")[0].split("#")[0] || "/";

    // Home
    if (cleanPath === "/") {
      return {
        title: "MoneyCalci — Calculate Smarter. Decide Better.",
        description: "Free online calculators for loans, mortgages, salary, taxes, investments, business, savings, and currency planning.",
        canonical: SITE + "/",
        h1Parts: ["Free calculators for ", "smarter", " money decisions."]
      };
    }
    // Blog index
    if (cleanPath === "/blog") {
      return {
        title: "MoneyCalci Guides — Learn the Numbers Behind the Tools",
        description: "Focused guides that explain the calculations behind MoneyCalci's financial tools, with links to the matching calculators.",
        canonical: SITE + "/blog",
        h1Parts: ["Learn the numbers behind the tools."]
      };
    }
    // Blog article
    if (cleanPath.indexOf("/blog/") === 0) {
      var slug = cleanPath.slice("/blog/".length);
      for (var i = 0; i < blogArticles.length; i++) {
        if (blogArticles[i].slug === slug) {
          return {
            title: blogArticles[i].title + " | MoneyCalci",
            description: blogArticles[i].description,
            canonical: SITE + "/blog/" + slug,
            h1Parts: [blogArticles[i].title]
          };
        }
      }
    }
    // Calculator routes
    var kinds = Object.keys(calculatorPaths);
    for (var j = 0; j < kinds.length; j++) {
      if (calculatorPaths[kinds[j]] === cleanPath) {
        var kind = kinds[j];
        return {
          title: calculatorContent[kind].seoTitle + " | MoneyCalci",
          description: calculatorContent[kind].metaDescription,
          canonical: SITE + calculatorPaths[kind],
          h1Parts: [calculatorLabels[kind]]
        };
      }
    }
    // Category hubs
    var categorySlug = cleanPath.slice(1);
    if (categoryContent[categorySlug]) {
      return {
        title: categoryContent[categorySlug].seoTitle,
        description: categoryContent[categorySlug].metaDescription,
        canonical: SITE + "/" + categorySlug,
        h1Parts: [categoryContent[categorySlug].name]
      };
    }
    // Directories
    if (cleanPath === "/calculators") {
      return {
        title: "All Financial Calculators | MoneyCalci",
        description: "Browse all MoneyCalci financial calculators — loans, mortgages, salary, take-home pay, savings, investments, ROI, and more.",
        canonical: SITE + "/calculators",
        h1Parts: ["All calculators"]
      };
    }
    if (cleanPath === "/categories") {
      return {
        title: "Browse Calculator Categories | MoneyCalci",
        description: "Browse MoneyCalci calculator categories — money & finance, loans, salary, taxes, investment, business, ecommerce, and currency.",
        canonical: SITE + "/categories",
        h1Parts: ["Browse by topic"]
      };
    }
    // Aliases
    if (cleanPath === "/tools") return buildRouteMeta("/calculators");
    if (cleanPath === "/savings") return buildRouteMeta("/savings-calculator");
    // Info pages
    if (infoMeta[categorySlug]) {
      var fullTitle = infoMeta[categorySlug][0];
      var cleanTitle = fullTitle.replace(" | MoneyCalci", "");
      return {
        title: fullTitle,
        description: infoMeta[categorySlug][1],
        canonical: SITE + cleanPath,
        h1Parts: [cleanTitle]
      };
    }
    // 404 fallback
    return {
      title: "Page Not Found | MoneyCalci",
      description: "The requested MoneyCalci page could not be found.",
      canonical: SITE + cleanPath,
      h1Parts: ["That page could not be found."]
    };
  }

  function setMeta(selector, attribute, value) {
    var node = document.querySelector(selector);
    if (!node) {
      node = document.createElement("meta");
      document.head.appendChild(node);
    }
    node.setAttribute(attribute, value);
  }

  function apply() {
    var pathname = window.location.pathname;
    var meta = buildRouteMeta(pathname);

    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", meta.canonical);
    setMeta('meta[name="twitter:title"]', "content", meta.title);
    setMeta('meta[name="twitter:description"]', "content", meta.description);

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonical;

    var h1 = document.getElementById("primary-h1");
    if (h1) {
      // Remove existing children
      while (h1.firstChild) h1.removeChild(h1.firstChild);
      var parts = meta.h1Parts;
      for (var k = 0; k < parts.length; k++) {
        if (k === 1 && parts.length === 3) {
          // accent word
          var span = document.createElement("span");
          span.style.color = ACCENT;
          span.appendChild(document.createTextNode(parts[k]));
          h1.appendChild(span);
        } else {
          h1.appendChild(document.createTextNode(parts[k]));
        }
      }
    }
  }

  // Run immediately
  apply();
})();
