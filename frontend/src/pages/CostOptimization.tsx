import { motion } from "framer-motion";
import { BarChart3, TrendingDown, DollarSign, Clock, Target, AlertCircle, CheckCircle2, Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface CostOptimization {
  id: string;
  route: string;
  material: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  factors: {
    loadingCost: number;
    transportCost: number;
    penaltyCost: number;
    demurrageCost: number;
  };
  recommendations: string[];
  implementation: 'easy' | 'medium' | 'hard';
  timeframe: string;
  status: 'implemented' | 'pending' | 'rejected';
  impact: 'high' | 'medium' | 'low';
}

export default function CostOptimization() {
  const [selectedImpact, setSelectedImpact] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const optimizations: CostOptimization[] = [
    {
      id: "CO-001",
      route: "Bokaro → CMO Kolkata",
      material: "HR Coils",
      currentCost: 2850000,
      optimizedCost: 2340000,
      savings: 510000,
      savingsPercentage: 18,
      factors: {
        loadingCost: 450000,
        transportCost: 1650000,
        penaltyCost: 150000,
        demurrageCost: 300000
      },
      recommendations: [
        "Combine with existing orders to fill rake capacity",
        "Use alternative loading point with lower costs",
        "Optimize dispatch timing to avoid peak hours"
      ],
      implementation: 'easy',
      timeframe: "1-2 weeks",
      status: 'pending',
      impact: 'high'
    },
    {
      id: "CO-002",
      route: "Bokaro → Customer Site A",
      material: "Plates",
      currentCost: 1920000,
      optimizedCost: 1680000,
      savings: 240000,
      savingsPercentage: 12.5,
      factors: {
        loadingCost: 320000,
        transportCost: 1280000,
        penaltyCost: 80000,
        demurrageCost: 160000
      },
      recommendations: [
        "Switch to road transport for smaller quantities",
        "Consolidate with nearby customer orders",
        "Negotiate better freight rates"
      ],
      implementation: 'medium',
      timeframe: "2-3 weeks",
      status: 'implemented',
      impact: 'medium'
    },
    {
      id: "CO-003",
      route: "Bokaro → CMO Mumbai",
      material: "CR Coils",
      currentCost: 3150000,
      optimizedCost: 2620000,
      savings: 530000,
      savingsPercentage: 17,
      factors: {
        loadingCost: 380000,
        transportCost: 2100000,
        penaltyCost: 220000,
        demurrageCost: 450000
      },
      recommendations: [
        "Use multi-destination rake strategy",
        "Optimize siding utilization",
        "Implement just-in-time loading"
      ],
      implementation: 'hard',
      timeframe: "3-4 weeks",
      status: 'pending',
      impact: 'high'
    },
    {
      id: "CO-004",
      route: "Bokaro → Customer Site B",
      material: "Sheets",
      currentCost: 1250000,
      optimizedCost: 1150000,
      savings: 100000,
      savingsPercentage: 8,
      factors: {
        loadingCost: 200000,
        transportCost: 850000,
        penaltyCost: 50000,
        demurrageCost: 100000
      },
      recommendations: [
        "Improve loading point efficiency",
        "Reduce waiting time at destination"
      ],
      implementation: 'easy',
      timeframe: "1 week",
      status: 'implemented',
      impact: 'low'
    }
  ];

  const filteredOptimizations = optimizations.filter(opt =>
    selectedImpact === 'all' || opt.impact === selectedImpact
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Target className="Name h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImplementationColor = (implementation: string) => {
    switch (implementation) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Controls */}
      <div className="flex justify-end items-start">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4" />
            Run Analysis
          </Button>
          <Button className="gap-2">
            <TrendingDown className="h-4 w-4" />
            Apply All
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'high', 'medium', 'low'].map((impact) => (
          <Button
            key={impact}
            variant={selectedImpact === impact ? "default" : "outline"}
            onClick={() => setSelectedImpact(impact as any)}
            className="capitalize"
          >
            {impact === 'all' ? 'All Impacts' : impact}
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
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Opportunities</p>
                <p className="text-2xl font-bold">{optimizations.length}</p>
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
                <TrendingDown className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold">
                  ₹{(optimizations.reduce((sum, opt) => sum + opt.savings, 0) / 100000).toFixed(1)}L
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
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Implemented</p>
                <p className="text-2xl font-bold">
                  {optimizations.filter(opt => opt.status === 'implemented').length}
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
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {optimizations.filter(opt => opt.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Cost Optimization Opportunities */}
      <div className="space-y-4">
        {filteredOptimizations.map((opt, index) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(opt.status)}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{opt.route}</h3>
                      <Badge className={getImpactColor(opt.impact)}>
                        {opt.impact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge className={getImplementationColor(opt.implementation)}>
                        {opt.implementation.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opt.material} • {opt.timeframe} implementation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(opt.status)}
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Current Cost</p>
                  <p className="text-xl font-bold text-red-600">₹{(opt.currentCost / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Optimized Cost</p>
                  <p className="text-xl font-bold text-green-600">₹{(opt.optimizedCost / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{(opt.savings / 100000).toFixed(1)}L ({opt.savingsPercentage}%)
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-muted-foreground">Cost Breakdown:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Loading: </span>
                    <span className="font-medium">₹{(opt.factors.loadingCost / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transport: </span>
                    <span className="font-medium">₹{(opt.factors.transportCost / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Penalty: </span>
                    <span className="font-medium">₹{(opt.factors.penaltyCost / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Demurrage: </span>
                    <span className="font-medium">₹{(opt.factors.demurrageCost / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {opt.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Simulate Impact
                  </Button>
                </div>
                {opt.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                    <Button size="sm">
                      Implement
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
