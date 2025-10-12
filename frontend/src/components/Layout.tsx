import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Train,
  LayoutDashboard,
  ListOrdered,
  Sparkles,
  Play,
  Bell,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import railwayBg from "@/assets/railway-bg.jpg";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Train, label: "Rake Allocation", path: "/allocation" },
  { icon: ListOrdered, label: "Order Management", path: "/orders" },

  { icon: Sparkles, label: "AI Recommendations", path: "/ai" },
  { icon: Play, label: "Live Simulation", path: "/simulation" },


];

export default function Layout() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const location = useLocation();



  return (
    <div className="min-h-screen bg-background w-full relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${railwayBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-background" />
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-railway"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Train className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-black dark:text-white">
                  RAQ
                </span>
              </motion.div>

            </div>

            {/* Top Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md glow-steel"
                          : "hover:bg-primary/10 font-semibold"
                      )}
                      style={{
                        color: isActive ? undefined : 'black'
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="h-9 w-9 relative"
              >
                <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <BellOff className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${!notificationsEnabled ? 'rotate-0 scale-100' : ''}`} />
                {notificationsEnabled && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                    3
                  </Badge>
                )}
                <span className="sr-only">Toggle notifications</span>
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
