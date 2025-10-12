import { motion } from "framer-motion";
import { ListOrdered, Package, Clock, CheckCircle2, Download } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const handleDownload = () => {
    const ordersData = {
      summary: {
        pendingOrders: 18,
        inProgressOrders: 32,
        completedToday: 45,
        totalOrders: 95
      },
      orders: [
        {
          id: "ORD-001",
          customer: "Steel Corp Ltd",
          material: "Iron Ore",
          quantity: 5000,
          status: "pending",
          priority: "high",
          createdDate: "2025-01-15",
          expectedDelivery: "2025-01-20"
        },
        {
          id: "ORD-002",
          customer: "Cement Industries",
          material: "Coal",
          quantity: 3000,
          status: "in_progress",
          priority: "medium",
          createdDate: "2025-01-14",
          expectedDelivery: "2025-01-19"
        },
        {
          id: "ORD-003",
          customer: "Power Plant Ltd",
          material: "Coal",
          quantity: 8000,
          status: "completed",
          priority: "high",
          createdDate: "2025-01-13",
          expectedDelivery: "2025-01-18"
        }
      ],
      generatedAt: new Date().toISOString(),
      reportType: "Order Management"
    };

    const fileName = `orders_data_${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(ordersData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex justify-end items-start">
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Pending Orders"
            value={18}
            icon={Clock}
            trend="Awaiting allocation"
            color="warning"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="In Progress"
            value={32}
            icon={Package}
            trend="Being loaded"
            color="primary"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Completed Today"
            value={45}
            icon={CheckCircle2}
            trend="+12 from yesterday"
            color="success"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Total Orders"
            value={95}
            icon={ListOrdered}
            trend="This week"
            color="accent"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="text-center text-muted-foreground py-8">
            Order management interface coming soon...
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
