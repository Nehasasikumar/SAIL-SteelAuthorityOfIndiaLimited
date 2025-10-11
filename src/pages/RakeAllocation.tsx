import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Train, Sparkles, TrendingUp, Package, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RakeDetails {
  id: string;
  type: string;
  wagons: number;
  capacity: number;
  currentStatus: string;
  utilization?: number;
  destination?: string;
  material?: string;
  eta?: string;
}

export default function RakeAllocation() {
  const [rakeId, setRakeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [rakeDetails, setRakeDetails] = useState<RakeDetails | null>(null);
  const [optimized, setOptimized] = useState(false);

  const handleFetchRake = () => {
    if (!rakeId.trim()) {
      toast.error("Please enter a Rake ID");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRakeDetails({
        id: rakeId,
        type: "BOX-N",
        wagons: 58,
        capacity: 3654,
        currentStatus: "Available at Bokaro",
      });
      setOptimized(false);
      setLoading(false);
      toast.success("Rake details fetched successfully");
    }, 1500);
  };

  const handleOptimize = () => {
    setLoading(true);
    // Simulate AI optimization
    setTimeout(() => {
      setRakeDetails((prev) =>
        prev
          ? {
              ...prev,
              utilization: 92,
              destination: "CMO Kolkata",
              material: "HR Coils",
              eta: "14 hours",
            }
          : null
      );
      setOptimized(true);
      setLoading(false);
      toast.success("AI optimization complete!", {
        description: "Rake allocation optimized with 92% utilization",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Rake Allocation</h1>
        <p className="text-muted-foreground">
          AI-powered rake optimization for maximum efficiency
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 shadow-elevated">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter Rake ID</label>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., R1234"
                value={rakeId}
                onChange={(e) => setRakeId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchRake()}
                className="text-lg"
              />
              <Button
                onClick={handleFetchRake}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 glow-steel"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Train className="h-5 w-5" />
                  </motion.div>
                ) : (
                  "Fetch Details"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Rake Details */}
      <AnimatePresence>
        {rakeDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="p-6 shadow-elevated border-2 border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Train className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{rakeDetails.id}</h3>
                    <Badge variant="outline" className="mt-1">
                      {rakeDetails.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1 bg-green-500">{rakeDetails.currentStatus}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">Wagons</p>
                  <p className="text-2xl font-bold">{rakeDetails.wagons}</p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-muted/50 rounded-lg"
                >
                  <p className="text-sm text-muted-foreground">Capacity (T)</p>
                  <p className="text-2xl font-bold">{rakeDetails.capacity}</p>
                </motion.div>
                {rakeDetails.utilization && (
                  <>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-primary/10 rounded-lg border border-primary/20"
                    >
                      <p className="text-sm text-muted-foreground">Utilization</p>
                      <p className="text-2xl font-bold text-primary">{rakeDetails.utilization}%</p>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 bg-accent/10 rounded-lg border border-accent/20"
                    >
                      <p className="text-sm text-muted-foreground">ETA</p>
                      <p className="text-2xl font-bold text-accent">{rakeDetails.eta}</p>
                    </motion.div>
                  </>
                )}
              </div>

              {!optimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <Button
                    onClick={handleOptimize}
                    disabled={loading}
                    className="w-full bg-gradient-railway text-white hover:opacity-90 glow-orange"
                    size="lg"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                      </motion.div>
                    ) : (
                      <Sparkles className="h-5 w-5 mr-2" />
                    )}
                    Run AI Optimization
                  </Button>
                </motion.div>
              )}
            </Card>

            {optimized && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 shadow-elevated border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="text-xl font-bold">AI Recommendations</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Material Loading</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Load {rakeDetails.material} (3,360 tons) for optimal weight distribution
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                      <MapPin className="h-5 w-5 text-accent mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Destination</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Route to {rakeDetails.destination} via fastest available track
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                      <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Schedule</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Depart by 14:00 today for on-time delivery (ETA: {rakeDetails.eta})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-primary">Expected Improvement</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          +12% efficiency compared to manual allocation • -8% fuel consumption
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      📊 View Full Report
                    </Button>
                    <Button className="flex-1 bg-accent hover:bg-accent/90">
                      🎥 View Simulation
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
