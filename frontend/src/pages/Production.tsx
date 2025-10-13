import { motion } from "framer-motion";
import { TrendingUp, Factory, Truck, Train, Calendar, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface ProductionPlan {
  id: string;
  material: string;
  grade: string;
  plannedQuantity: number;
  currentProduction: number;
  railOrders: number;
  roadOrders: number;
  priority: 'high' | 'medium' | 'low';
  suggestedMode: 'rail' | 'road' | 'both';
  productionCost: number;
  transportCost: number;
  totalCost: number;
  deadline: string;
  status: 'on-track' | 'delayed' | 'at-risk' | 'completed';
  efficiency: number;
}

export default function Production() {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const productionPlans: ProductionPlan[] = [
    {
      id: "PP-001",
      material: "Rails",
      grade: "UIC 60",
      plannedQuantity: 15000,
      currentProduction: 12800,
      railOrders: 12000,
      roadOrders: 3000,
      priority: 'high',
      suggestedMode: 'rail',
      productionCost: 45000000,
      transportCost: 8500000,
      totalCost: 53500000,
      deadline: "2025-01-20",
      status: 'on-track',
      efficiency: 94
    },
    {
      id: "PP-002",
      material: "HR Coils",
      grade: "IS:2062",
      plannedQuantity: 8000,
      currentProduction: 5600,
      railOrders: 2000,
      roadOrders: 6000,
      priority: 'medium',
      suggestedMode: 'road',
      productionCost: 28000000,
      transportCost: 4200000,
      totalCost: 32200000,
      deadline: "2025-01-22",
      status: 'on-track',
      efficiency: 88
    },
    {
      id: "PP-003",
      material: "Plates",
      grade: "IS:2062",
      plannedQuantity: 12000,
      currentProduction: 12000,
      railOrders: 8000,
      roadOrders: 4000,
      priority: 'high',
      suggestedMode: 'both',
      productionCost: 38000000,
      transportCost: 6800000,
      totalCost: 44800000,
      deadline: "2025-01-18",
      status: 'completed',
      efficiency: 96
    },
    {
      id: "PP-004",
      material: "CR Sheets",
      grade: "IS:513",
      plannedQuantity: 6000,
      currentProduction: 3600,
      railOrders: 1000,
      roadOrders: 5000,
      priority: 'low',
      suggestedMode: 'road',
      productionCost: 18000000,
      transportCost: 3200000,
      totalCost: 21200000,
      deadline: "2025-01-25",
      status: 'at-risk',
      efficiency: 82
    },
    {
      id: "PP-005",
      material: "Stainless Steel",
      grade: "SS 304",
      plannedQuantity: 10000,
      currentProduction: 7500,
      railOrders: 7000,
      roadOrders: 3000,
      priority: 'medium',
      suggestedMode: 'rail',
      productionCost: 32000000,
      transportCost: 5800000,
      totalCost: 37800000,
      deadline: "2025-01-23",
      status: 'delayed',
      efficiency: 85
    }
  ];

  const filteredPlans = productionPlans.filter(plan =>
    selectedPriority === 'all' || plan.priority === selectedPriority
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'on-track': return <Target className="h-4 w-4 text-blue-500" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Factory className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'rail': return 'bg-blue-100 text-blue-800';
      case 'road': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Controls */}
      <div className="flex justify-end items-start">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimize Plan
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'high', 'medium', 'low'].map((priority) => (
          <Button
            key={priority}
            variant={selectedPriority === priority ? "default" : "outline"}
            onClick={() => setSelectedPriority(priority as any)}
            className="capitalize"
          >
            {priority === 'all' ? 'All Priorities' : priority}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Factory className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{productionPlans.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold">
                  {productionPlans.filter(p => p.status === 'on-track' || p.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Train className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rail Priority</p>
                <p className="text-2xl font-bold">
                  {productionPlans.filter(p => p.suggestedMode === 'rail').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold">
                  {productionPlans.filter(p => p.status === 'delayed' || p.status === 'at-risk').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Production Plans */}
      <div className="space-y-4">
        {filteredPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(plan.status)}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{plan.material}</h3>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getModeColor(plan.suggestedMode)}>
                        {plan.suggestedMode.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.grade} • Target: {plan.plannedQuantity.toLocaleString()} tons
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(plan.status)}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Production Progress</span>
                  <span className="font-medium">
                    {plan.currentProduction.toLocaleString()} / {plan.plannedQuantity.toLocaleString()} tons
                  </span>
                </div>
                <Progress
                  value={(plan.currentProduction / plan.plannedQuantity) * 100}
                  className="h-2"
                />
              </div>

              {/* Orders Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rail Orders</p>
                  <p className="text-lg font-bold text-blue-600">{plan.railOrders.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Road Orders</p>
                  <p className="text-lg font-bold text-green-600">{plan.roadOrders.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Production Cost</p>
                  <p className="text-lg font-bold">₹{(plan.productionCost / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Transport Cost</p>
                  <p className="text-lg font-bold">₹{(plan.transportCost / 100000).toFixed(1)}L</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="font-semibold">{plan.efficiency}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-semibold">{plan.deadline}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
