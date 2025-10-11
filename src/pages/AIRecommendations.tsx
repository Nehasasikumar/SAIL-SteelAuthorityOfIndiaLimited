import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recommendations = [
  {
    id: 1,
    type: "optimization",
    title: "Combine Orders for Efficiency",
    description: "Load HR coils to CMO Kolkata using Rake R1234. Combine customer orders A123 + A124 for 95% utilization.",
    impact: "High",
    savings: "₹45,000 fuel savings",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "warning",
    title: "Maintenance Alert",
    description: "Delay dispatch of R5678 due to scheduled maintenance. Alternative rake R5679 available.",
    impact: "Medium",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: 3,
    type: "suggestion",
    title: "Route Optimization",
    description: "Use alternate route via Dhanbad for R9012 to avoid congestion. ETA improvement: 2 hours.",
    impact: "Medium",
    savings: "2 hours faster",
    icon: Lightbulb,
    color: "text-primary",
  },
];

export default function AIRecommendations() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">AI Recommendations</h1>
          <p className="text-muted-foreground">
            Smart suggestions powered by machine learning
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className="p-6 border-l-4 border-l-accent shadow-elevated hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-muted ${rec.color}`}>
                  <rec.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{rec.title}</h3>
                    <Badge
                      variant={
                        rec.impact === "High"
                          ? "default"
                          : "outline"
                      }
                    >
                      {rec.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{rec.description}</p>
                  {rec.savings && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        {rec.savings}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
