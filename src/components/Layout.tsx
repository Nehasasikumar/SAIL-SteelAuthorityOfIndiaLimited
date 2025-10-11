import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Train,
  LayoutDashboard,
  ListOrdered,
  Package,
  Sparkles,
  Play,
  FileText,
  Settings,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import railwayBg from "@/assets/railway-bg.jpg";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Train, label: "Rake Allocation", path: "/allocation" },
  { icon: ListOrdered, label: "Order Management", path: "/orders" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Sparkles, label: "AI Recommendations", path: "/ai" },
  { icon: Play, label: "Live Simulation", path: "/simulation" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex w-full relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${railwayBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-background" />
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-railway"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative border-r border-border bg-card shadow-elevated z-10"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-border flex items-center justify-between px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Train className="h-6 w-6 text-primary" />
              {sidebarOpen && (
                <span className="font-bold text-lg text-black dark:text-white">
                  RAQ
                </span>
              )}
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-primary/10"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md glow-steel"
                        : "hover:bg-primary/10 text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Rake Allocation and Quality Control
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" className="gap-2 text-foreground hover:text-primary hover:bg-primary/10">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
