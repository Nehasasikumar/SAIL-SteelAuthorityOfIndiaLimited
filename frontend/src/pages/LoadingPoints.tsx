import { motion } from "framer-motion";
import { MapPin, Truck, Clock, AlertCircle, CheckCircle2, Activity, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface LoadingPoint {
  id: string;
  name: string;
  type: 'rail' | 'road' | 'both';
  location: string;
  capacity: number;
  currentLoad: number;
  status: 'operational' | 'maintenance' | 'idle' | 'overloaded';
  utilization: number;
  materials: string[];
  constraints: {
    maxRakesPerDay: number;
    sidingCapacity: number;
    currentRakes: number;
  };
  efficiency: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export default function LoadingPoints() {
  const [selectedType, setSelectedType] = useState<'all' | 'rail' | 'road' | 'both'>('all');

  const loadingPoints: LoadingPoint[] = [
    {
      id: "LP-001",
      name: "Bhilai Rail Siding-1",
      type: "rail",
      location: "Chhattisgarh",
      capacity: 5000,
      currentLoad: 4200,
      status: "operational",
      utilization: 84,
      materials: ["Rails", "Plates"],
      constraints: {
        maxRakesPerDay: 12,
        sidingCapacity: 2,
        currentRakes: 1
      },
      efficiency: 92,
      lastMaintenance: "2025-01-10",
      nextMaintenance: "2025-02-10"
    },
    {
      id: "LP-002",
      name: "Bokaro Rail Siding-2",
      type: "rail",
      location: "Jharkhand",
      capacity: 3500,
      currentLoad: 2800,
      status: "operational",
      utilization: 80,
      materials: ["HR Coils", "CR Sheets"],
      constraints: {
        maxRakesPerDay: 8,
        sidingCapacity: 1,
        currentRakes: 1
      },
      efficiency: 88,
      lastMaintenance: "2025-01-08",
      nextMaintenance: "2025-02-08"
    },
    {
      id: "LP-003",
      name: "Rourkela Road Terminal",
      type: "road",
      location: "Odisha",
      capacity: 2000,
      currentLoad: 1800,
      status: "operational",
      utilization: 90,
      materials: ["Plates", "HR Coils"],
      constraints: {
        maxRakesPerDay: 20,
        sidingCapacity: 0,
        currentRakes: 0
      },
      efficiency: 85,
      lastMaintenance: "2025-01-12",
      nextMaintenance: "2025-02-12"
    },
    {
      id: "LP-004",
      name: "Durgapur Combined Terminal",
      type: "both",
      location: "West Bengal",
      capacity: 8000,
      currentLoad: 7200,
      status: "overloaded",
      utilization: 90,
      materials: ["Rails", "Wheels", "Axles"],
      constraints: {
        maxRakesPerDay: 15,
        sidingCapacity: 3,
        currentRakes: 3
      },
      efficiency: 78,
      lastMaintenance: "2025-01-05",
      nextMaintenance: "2025-02-05"
    },
    {
      id: "LP-005",
      name: "Visakhapatnam Port Terminal",
      type: "both",
      location: "Andhra Pradesh",
      capacity: 10000,
      currentLoad: 8500,
      status: "operational",
      utilization: 85,
      materials: ["Export Cargo", "HR Coils", "Plates"],
      constraints: {
        maxRakesPerDay: 18,
        sidingCapacity: 4,
        currentRakes: 2
      },
      efficiency: 90,
      lastMaintenance: "2025-01-15",
      nextMaintenance: "2025-02-15"
    }
  ];

  const filteredPoints = loadingPoints.filter(point =>
    selectedType === 'all' || point.type === selectedType
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'idle': return 'bg-blue-500';
      case 'overloaded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'idle': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overloaded': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure Points
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'rail', 'road', 'both'].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type as any)}
            className="capitalize"
          >
            {type === 'all' ? 'All Types' : type}
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
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{loadingPoints.length}</p>
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
                <p className="text-sm text-muted-foreground">Operational</p>
                <p className="text-2xl font-bold">
                  {loadingPoints.filter(p => p.status === 'operational').length}
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
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round(loadingPoints.reduce((sum, p) => sum + p.utilization, 0) / loadingPoints.length)}%
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
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold">
                  {loadingPoints.filter(p => p.status === 'maintenance' || p.status === 'overloaded').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Loading Points Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPoints.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(point.status)}`} />
                  <div>
                    <h3 className="font-bold text-lg">{point.name}</h3>
                    <p className="text-sm text-muted-foreground">{point.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(point.status)}
                  <Badge className={getTypeColor(point.type)}>
                    {point.type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Capacity and Utilization */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Load</span>
                  <span className="font-medium">
                    {point.currentLoad.toLocaleString()} / {point.capacity.toLocaleString()} tons
                  </span>
                </div>
                <Progress value={point.utilization} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className={`font-medium ${
                    point.utilization > 90 ? 'text-red-500' :
                    point.utilization > 75 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {point.utilization}%
                  </span>
                </div>
              </div>

              {/* Materials and Constraints */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Materials</p>
                  <div className="flex flex-wrap gap-1">
                    {point.materials.slice(0, 2).map((material) => (
                      <Badge key={material} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                    {point.materials.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{point.materials.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Constraints</p>
                  <div className="space-y-1 text-xs">
                    <p>Max Rakes/Day: {point.constraints.maxRakesPerDay}</p>
                    <p>Siding Capacity: {point.constraints.sidingCapacity}</p>
                    <p>Current Rakes: {point.constraints.currentRakes}</p>
                  </div>
                </div>
              </div>

              {/* Efficiency and Maintenance */}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="font-semibold">{point.efficiency}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next Maintenance</p>
                  <p className="font-semibold text-xs">{point.nextMaintenance}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
