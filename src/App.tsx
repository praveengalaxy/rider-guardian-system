import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardIndividual from "./pages/DashboardIndividual";
import DashboardOrg from "./pages/DashboardOrg";
import DeviceDetail from "./pages/DeviceDetail";
import AlertsPage from "./pages/AlertsPage";
import CrashDetectionPage from "./pages/CrashDetectionPage";
import ARNavigationPage from "./pages/ARNavigationPage";
import MaintenancePage from "./pages/MaintenancePage";
import GamificationPage from "./pages/GamificationPage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";
import SimulationPanel from "./components/SimulationPanel";
import RegisterRider from "./pages/RegisterRider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/individual" element={<DashboardIndividual />} />
          <Route path="/dashboard/org" element={<DashboardOrg />} />
          <Route path="/dashboard/org/:id" element={<DeviceDetail />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/crash-detection" element={<CrashDetectionPage />} />
          <Route path="/ar-navigation" element={<ARNavigationPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/manual-trigger" element={<SimulationPanel />} />
          <Route path="/org/register-rider" element={<RegisterRider />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
