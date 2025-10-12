import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Train,
  Play,
  Pause,
  FastForward,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";
import useWebSocket from "@/hooks/useWebSocket";

// Fallback data if API is not available
const fallbackRoutes = [
  {
    id: "R1234",
    from: "Bokaro",
    to: "CMO Kolkata",
    progress: 45,
    status: "In Transit",
    departureTime: "08:30 AM",
    eta: "14:45 PM",
  },
  {
    id: "R5678",
    from: "Bokaro",
    to: "Customer A123",
    progress: 78,
    status: "In Transit",
    departureTime: "09:15 AM",
    eta: "15:30 PM",
  },
  {
    id: "R9012",
    from: "Bokaro",
    to: "CMO Mumbai",
    progress: 92,
    status: "Arriving",
    departureTime: "07:45 AM",
    eta: "16:00 PM",
  },
  {
    id: "R3456",
    from: "Bokaro",
    to: "Customer B456",
    progress: 15,
    status: "Departed",
    departureTime: "10:00 AM",
    eta: "17:15 PM",
  },
];

export default function LiveSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [error, setError] = useState<string | null>(null);

  // Setup WebSocket connection
  const { isConnected, messages, sendMessage, connectionStatus } =
    useWebSocket();

  // Initialize data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.simulation.getActiveRakes();
        if (response.data && Array.isArray(response.data)) {
          setRoutes(response.data);
        }
      } catch (err) {
        console.error("Error fetching initial simulation data:", err);
        setError("Failed to load simulation data. Using fallback data.");
      }
    };

    fetchInitialData();
  }, []);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];

      try {
        // Process message data
        if (latestMessage && typeof latestMessage === "string") {
          const data = JSON.parse(latestMessage);

          if (data.type === "simulation_update" && Array.isArray(data.rakes)) {
            setRoutes(data.rakes);
          } else if (data.type === "simulation_error") {
            setError(data.message || "Simulation error occurred");
          } else if (data.type === "simulation_status") {
            setIsPlaying(data.is_running || false);
            setSpeed(data.speed || 1);
          }
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    }
  }, [messages]);

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Controls */}
      <div className="flex items-center justify-end">

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-2">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="icon"
            onClick={() => {
              const newState = !isPlaying;
              setIsPlaying(newState);

              // Send command to backend via WebSocket
              if (isConnected) {
                sendMessage(
                  JSON.stringify({
                    action: newState ? "start_simulation" : "pause_simulation",
                    speed: speed,
                  })
                );
              } else {
                setError("WebSocket not connected. Cannot control simulation.");
              }
            }}
            className="glow-steel"
            disabled={!isConnected}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newSpeed = speed === 1 ? 2 : 1;
              setSpeed(newSpeed);

              // Update simulation speed on backend
              if (isConnected && isPlaying) {
                sendMessage(
                  JSON.stringify({
                    action: "set_speed",
                    speed: newSpeed,
                  })
                );
              }
            }}
            disabled={!isConnected}
          >
            <FastForward className="h-5 w-5" />
          </Button>

          {/* Connection status indicator */}
          <div className="ml-2 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-muted-foreground">
              {connectionStatus}
            </span>
          </div>
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
              {routes.map((route, index) => {
                // Determine route path based on destination
                const isTopRoute =
                  route.to.includes("Kolkata") || index % 2 === 0;
                const topOffset = isTopRoute ? "35%" : "65%";

                // Calculate duration based on route progress
                const duration = (100 - route.progress) * 0.1;

                return (
                  <motion.div
                    key={route.id}
                    className="absolute"
                    initial={{
                      left: `${10 + route.progress * 0.6}%`,
                      top: isTopRoute ? "45%" : "55%",
                    }}
                    animate={{
                      left: "70%",
                      top: isTopRoute
                        ? ["45%", topOffset, "45%"]
                        : ["55%", topOffset, "55%"],
                    }}
                    transition={{
                      duration: duration / speed,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <Train
                        className={`h-8 w-8 ${
                          isTopRoute ? "text-primary glow-steel" : "text-accent"
                        }`}
                      />
                      <span className="text-xs font-medium">{route.id}</span>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </Card>

      {/* Rake Status List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {routes.map((route, index) => {
          // Calculate estimated times based on progress
          const departureTime = route.departureTime || "08:30 AM";
          const eta = route.eta || "14:45 PM";

          return (
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
                    <span>Departed: {departureTime}</span>
                    <span>ETA: {eta}</span>
                  </div>
                </div>

                {isPlaying && isConnected && (
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
          );
        })}
      </div>
    </div>
  );
}
