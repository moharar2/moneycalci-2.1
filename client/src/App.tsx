import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const publicPaths = ["/", "/calculators", "/categories", "/finance", "/loans", "/salary", "/taxes", "/investment", "/business", "/ecommerce", "/currency", "/tools", "/savings", "/blog", "/loan-calculator", "/mortgage-calculator", "/compound-interest-calculator", "/savings-calculator", "/personal-loan-calculator", "/salary-calculator", "/take-home-pay-calculator", "/investment-calculator", "/roi-calculator", "/profit-margin-calculator", "/currency-converter", "/simple-interest-calculator", "/markup-calculator", "/discount-calculator", "/sales-tax-calculator", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"];
const blogPaths = ["/blog/how-is-a-loan-payment-calculated", "/blog/how-does-compound-interest-work", "/blog/how-to-calculate-profit-margin", "/blog/how-to-calculate-roi", "/blog/gross-pay-vs-net-pay"];

function Router() { return <Switch>{[...publicPaths, ...blogPaths].map(path => <Route key={path} path={path} component={Home} />)}<Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
