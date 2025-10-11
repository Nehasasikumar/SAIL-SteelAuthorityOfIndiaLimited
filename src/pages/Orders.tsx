import { motion } from "framer-motion";
import { ListOrdered, Package, Clock, CheckCircle2 } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Orders"
          value={18}
          icon={Clock}
          trend="Awaiting allocation"
          color="warning"
        />
        <MetricCard
          title="In Progress"
          value={32}
          icon={Package}
          trend="Being loaded"
          color="primary"
        />
        <MetricCard
          title="Completed Today"
          value={45}
          icon={CheckCircle2}
          trend="+12 from yesterday"
          color="success"
        />
        <MetricCard
          title="Total Orders"
          value={95}
          icon={ListOrdered}
          trend="This week"
          color="accent"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="text-center text-muted-foreground py-8">
          Order management interface coming soon...
        </div>
      </Card>
    </div>
  );
}
