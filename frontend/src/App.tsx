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
import Inventory from "./pages/Inventory";
import LoadingPoints from "./pages/LoadingPoints";
import Production from "./pages/Production";
import CostOptimization from "./pages/CostOptimization";
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
            <Route path="inventory" element={<Inventory />} />
            <Route path="loading-points" element={<LoadingPoints />} />
            <Route path="ai" element={<AIRecommendations />} />
            <Route path="production" element={<Production />} />
            <Route path="cost-optimization" element={<CostOptimization />} />
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
