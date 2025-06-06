import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmergencyBanner from "@/components/layout/EmergencyBanner";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Gallery from "@/pages/gallery";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import Calculators from "@/pages/calculators";
import BlogIndex from "@/pages/blog/index";
import BlogFurnaceWinter from "@/pages/blog/prepare-furnace-winter";
import BlogCommercialVsResidential from "@/pages/blog/commercial-vs-residential-hvac";
import Checkout from "@/pages/checkout";
import PaymentConfirmation from "@/pages/payment-confirmation";
import ProCalculator from "@/pages/pro-calculator";
import AuthPage from "@/pages/auth";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForumPage from "@/pages/forum";
import AdminData from "@/pages/admin-data";
import AdminDashboard from "@/pages/admin-dashboard";
import SupplierData from "@/pages/supplier-data";
import AlgginData from "@/pages/alggin-data";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/prepare-furnace-winter" component={BlogFurnaceWinter} />
        <Route path="/blog/commercial-vs-residential-hvac" component={BlogCommercialVsResidential} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        
        {/* Protected routes that require authentication */}
        <ProtectedRoute path="/checkout" component={Checkout} />
        <ProtectedRoute path="/payment-confirmation" component={PaymentConfirmation} />
        <ProtectedRoute path="/pro-calculator" component={ProCalculator} />
        <ProtectedRoute path="/forum" component={ForumPage} />
        
        {/* Admin-only routes */}
        <ProtectedRoute path="/admin-data" component={AdminData} adminOnly={true} />
        <ProtectedRoute path="/supplier-data" component={SupplierData} adminOnly={true} />
        <ProtectedRoute path="/alggin-data" component={AlgginData} adminOnly={true} />
        
        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
              <EmergencyBanner />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
