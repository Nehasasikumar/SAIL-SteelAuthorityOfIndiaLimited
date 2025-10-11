import { motion } from "framer-motion";
import { useState } from "react";
import { Train, Play, Pause, FastForward, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const routes = [
  { id: "R1234", from: "Bokaro", to: "CMO Kolkata", progress: 45, status: "In Transit" },
  { id: "R5678", from: "Bokaro", to: "Customer A123", progress: 78, status: "In Transit" },
  { id: "R9012", from: "Bokaro", to: "CMO Mumbai", progress: 92, status: "Arriving" },
  { id: "R3456", from: "Bokaro", to: "Customer B456", progress: 15, status: "Departed" },
];

export default function LiveSimulation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Simulation</h1>
          <p className="text-muted-foreground">
            Real-time visualization of rake movements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="glow-steel"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
          >
            <FastForward className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Map Visualization */}
      <Card className="p-8 shadow-elevated bg-transparent backdrop-blur-sm border-border/50 min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 400">
            {/* Railway tracks */}
            <motion.path
              d="M 50 200 Q 250 100, 450 200 T 750 200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="text-primary"
            />
            <motion.path
              d="M 50 200 Q 250 300, 450 200 T 750 200"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="text-primary"
            />
          </svg>
        </div>

        {/* Location Markers */}
        <div className="relative z-10">
          <div className="absolute left-12 top-1/2 -translate-y-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-4 h-4 rounded-full bg-primary glow-steel" />
              <Badge className="mt-2 bg-primary">Bokaro</Badge>
            </motion.div>
          </div>

          <div className="absolute right-12 top-1/4 -translate-y-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-4 h-4 rounded-full bg-accent glow-orange" />
              <Badge className="mt-2 bg-accent">CMO Kolkata</Badge>
            </motion.div>
          </div>

          <div className="absolute right-12 bottom-1/4 translate-y-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-4 h-4 rounded-full bg-accent glow-orange" />
              <Badge className="mt-2 bg-accent">CMO Mumbai</Badge>
            </motion.div>
          </div>

          {/* Animated Trains */}
          {isPlaying && (
            <>
              <motion.div
                className="absolute"
                initial={{ left: "10%", top: "45%" }}
                animate={{ left: "70%", top: ["45%", "35%", "45%"] }}
                transition={{
                  duration: 8 / speed,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Train className="h-8 w-8 text-primary glow-steel" />
              </motion.div>

              <motion.div
                className="absolute"
                initial={{ left: "10%", top: "55%" }}
                animate={{ left: "70%", top: ["55%", "65%", "55%"] }}
                transition={{
                  duration: 10 / speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
              >
                <Train className="h-8 w-8 text-accent" />
              </motion.div>
            </>
          )}
        </div>
      </Card>

      {/* Rake Status List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 shadow-elevated hover:shadow-xl transition-shadow border-l-4 border-l-primary bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Train className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{route.id}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {route.from} → {route.to}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    route.status === "Arriving"
                      ? "border-green-500 text-green-500"
                      : route.status === "In Transit"
                      ? "border-primary text-primary"
                      : "border-accent text-accent"
                  }
                >
                  {route.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{route.progress}%</span>
                </div>
                <Progress value={route.progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Departed: 08:30 AM</span>
                  <span>ETA: 14:45 PM</span>
                </div>
              </div>

              {isPlaying && (
                <motion.div
                  className="mt-4 flex items-center gap-2 text-xs text-primary"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Live tracking active</span>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
