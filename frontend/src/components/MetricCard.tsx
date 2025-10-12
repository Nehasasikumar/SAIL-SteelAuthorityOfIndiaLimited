import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "success" | "warning";
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  delay = 0,
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  useEffect(() => {
    if (typeof numericValue === "number" && !isNaN(numericValue)) {
      let start = 0;
      const end = numericValue;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [numericValue]);

  const colorClasses = {
    primary: "text-primary border-primary/20 glow-steel",
    accent: "text-accent border-accent/20 glow-orange",
    success: "text-green-500 border-green-500/20",
    warning: "text-yellow-500 border-yellow-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full p-6 border-2 hover:shadow-elevated transition-all duration-300 bg-transparent backdrop-blur-sm border-border/50 h-32 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <motion.div
              className="text-3xl font-bold mb-1"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            >
              {typeof value === "string" && isNaN(numericValue)
                ? value
                : displayValue}
            </motion.div>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl border-2 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
