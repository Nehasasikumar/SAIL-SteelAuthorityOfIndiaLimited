import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RakeAllocation from "./pages/RakeAllocation";
import LiveSimulation from "./pages/LiveSimulation";
import Orders from "./pages/Orders";
import AIRecommendations from "./pages/AIRecommendations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="allocation" element={<RakeAllocation />} />
            <Route path="simulation" element={<LiveSimulation />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Dashboard />} />
            <Route path="ai" element={<AIRecommendations />} />
            <Route path="reports" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</ThemeProvider>
);

export default App;
