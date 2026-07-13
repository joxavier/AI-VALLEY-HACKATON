import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import BookingDetails from "./pages/BookingDetails.tsx";
import BarberDashboard from "./pages/BarberDashboard.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import BlogDay0 from "./pages/BlogDay0.tsx";
import Shop from "./pages/Shop.tsx";
import Landing from "./pages/Landing.tsx";
import DashboardLayout from "./pages/dashboard/Layout.tsx";
import DashboardOverview from "./pages/dashboard/Overview.tsx";
import BookingsPage from "./pages/dashboard/Bookings.tsx";
import {
  CalendarPage,
  ClientsPage,
  PaymentsPage,
  ServicesPage,
  SettingsPage,
} from "./pages/dashboard/Placeholders.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-bookings" element={<CustomerDashboard />} />
            <Route path="/bookings/:bookingId" element={<BookingDetails />} />
            <Route path="/dashboard/legacy" element={<BarberDashboard />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/blog/day-0" element={<BlogDay0 />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
