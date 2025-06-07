import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmergencyBanner from "@/components/layout/EmergencyBanner";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";

import Pricing from "@/pages/pricing-cards";
import Contact from "@/pages/contact";
import Calculators from "@/pages/calculators";
import MaterialEstimator from "@/pages/calculators/material-estimator-alggin";
import CommercialEstimator from "@/pages/calculators/commercial-estimator";
import BTUCalculator from "@/pages/calculators/btu";
import BTUCalc from "@/pages/calculators/btu-calculator";
import EnergySavingsCalculator from "@/pages/calculators/energy-savings";
import LoadCalculator from "@/pages/calculators/load-calculator";
import ServiceTracking from "@/pages/service-tracking";
import ProCalculator from "@/pages/pro-calculator";
import ProPortal from "@/pages/pro-portal";
import Membership from "@/pages/membership";
import FurnaceInstall from "@/pages/services/furnace-install";
import BlogIndex from "@/pages/blog/index";
import BlogFurnaceWinter from "@/pages/blog/prepare-furnace-winter";
import BlogCommercialVsResidential from "@/pages/blog/commercial-vs-residential-hvac";
import Checkout from "@/pages/checkout";
import AdminPhotos from "@/pages/admin-photos-enhanced";
import PaymentConfirmation from "@/pages/payment-confirmation";
import CalendarBooking from "@/pages/calendar-booking";
import FurnacePage from "@/pages/products/furnace";
import AuthPage from "@/pages/auth";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ForumPage from "@/pages/forum-functional";
import AdminDashboard from "@/pages/admin-dashboard-enhanced";
import UserSettings from "@/pages/user-settings";
import CustomerDashboard from "@/pages/customer-dashboard";

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

        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/calculators" component={Calculators} />
        <Route path="/calculators/material-estimator" component={MaterialEstimator} />
        <Route path="/calculators/commercial-estimator" component={CommercialEstimator} />
        <Route path="/calculators/btu" component={BTUCalculator} />
        <Route path="/calculators/btu-calculator" component={BTUCalc} />
        <Route path="/calculators/energy-savings" component={EnergySavingsCalculator} />
        <Route path="/calculators/load-calculator" component={LoadCalculator} />
        <Route path="/service-tracking" component={ServiceTracking} />
        <Route path="/services/furnace-install" component={FurnaceInstall} />
        <Route path="/products/furnace" component={FurnacePage} />
        <Route path="/blog" component={BlogIndex} />
        <Route path="/blog/prepare-furnace-winter" component={BlogFurnaceWinter} />
        <Route path="/blog/commercial-vs-residential-hvac" component={BlogCommercialVsResidential} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        
        {/* Membership and Pro routes */}
        <Route path="/membership" component={Membership} />
        <Route path="/pro-calculator" component={ProCalculator} />
        <Route path="/pro-portal" component={ProPortal} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/payment-confirmation" component={PaymentConfirmation} />
        <Route path="/calendar-booking" component={CalendarBooking} />
        
        {/* Protected routes that require authentication */}
        <ProtectedRoute path="/forum" component={ForumPage} />
        <ProtectedRoute path="/settings" component={UserSettings} />
        <ProtectedRoute path="/dashboard" component={CustomerDashboard} />
        
        {/* Admin-only routes */}
        <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
        <ProtectedRoute path="/admin/photos" component={AdminPhotos} adminOnly={true} />
        
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
