import { motion } from "framer-motion";
import { Train, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RakeStatus {
  id: string;
  available: boolean;
  currentLocation?: string;
  destination?: string;
  returnTime?: string;
  estimatedReturn?: string;
  status: 'available' | 'in-transit' | 'loading' | 'unloading' | 'maintenance';
  lastUpdated: string;
}

export default function RakeAllocation() {
  // SAIL-specific rake data
  const rakeData: RakeStatus[] = [
    {
      id: "R1234",
      available: false,
      currentLocation: "Bhilai Steel Plant",
      destination: "Visakhapatnam Port",
      returnTime: "16:30",
      estimatedReturn: "Available for loading in 2 hours",
      status: "in-transit",
      lastUpdated: "14:30"
    },
    {
      id: "R5678",
      available: true,
      currentLocation: "Bokaro Steel Plant",
      status: "available",
      lastUpdated: "15:00"
    },
    {
      id: "R9012",
      available: false,
      currentLocation: "Rourkela Loading Point",
      destination: "Paradip Port",
      returnTime: "18:45",
      estimatedReturn: "Available for loading in 4 hours",
      status: "loading",
      lastUpdated: "14:45"
    },
    {
      id: "R3456",
      available: false,
      currentLocation: "Haldia Port",
      destination: "Durgapur Steel Plant",
      returnTime: "17:15",
      estimatedReturn: "Available for loading in 1.5 hours",
      status: "unloading",
      lastUpdated: "15:45"
    },
    {
      id: "R7890",
      available: true,
      currentLocation: "Durgapur Steel Plant",
      status: "available",
      lastUpdated: "15:30"
    },
    {
      id: "R2468",
      available: false,
      currentLocation: "Maintenance Facility",
      returnTime: "20:00",
      estimatedReturn: "Available for loading in 6 hours",
      status: "maintenance",
      lastUpdated: "14:00"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'in-transit': return 'bg-blue-500';
      case 'loading': return 'bg-yellow-500';
      case 'unloading': return 'bg-orange-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'in-transit': return <Train className="h-4 w-4" />;
      case 'loading': return <Package className="h-4 w-4" />;
      case 'unloading': return <MapPin className="h-4 w-4" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'in-transit': return 'In Transit';
      case 'loading': return 'Loading';
      case 'unloading': return 'Unloading';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header with Allocate Rake Button in right corner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Rake Status Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time status of all rakes and their availability</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg"
            onClick={() => {
              // Handle rake allocation logic
              console.log("Allocate Rake button clicked");
              // You can add custom logic here for manual rake allocation
            }}
          >
             Allocate Rake
          </Button>
        </div>
      </div>

      {/* Rake Status Table */}
      <Card className="bg-transparent backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">Rake ID</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Current Location</th>
                <th className="text-left p-4 font-semibold">Destination</th>
                <th className="text-left p-4 font-semibold">Return Time</th>
                <th className="text-left p-4 font-semibold">Availability</th>
                <th className="text-left p-4 font-semibold">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {rakeData.map((rake, index) => (
                <motion.tr
                  key={rake.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                    rake.available ? 'bg-green-500/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="font-bold">{rake.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(rake.status)}`} />
                      <span className="text-sm">{getStatusText(rake.status)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{rake.currentLocation}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {rake.destination ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-600 font-medium">{rake.destination}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {rake.returnTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">{rake.returnTime}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {rake.available ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Busy
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-muted-foreground">{rake.lastUpdated}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View for Small Screens */}
        <div className="block md:hidden space-y-4 mt-6">
          {rakeData.map((rake, index) => (
            <motion.div
              key={rake.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 bg-transparent backdrop-blur-sm border-border/50 ${
                rake.available ? 'border-green-500/20 bg-green-500/5' : ''
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="font-bold">{rake.id}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(rake.status)}`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(rake.status)}
                        <span>{getStatusText(rake.status)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{rake.currentLocation}</span>
                      </div>
                    </div>
                    {rake.destination && (
                      <div>
                        <span className="text-muted-foreground">Destination:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-600">{rake.destination}</span>
                        </div>
                      </div>
                    )}
                    {rake.returnTime && (
                      <div>
                        <span className="text-muted-foreground">Return:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-orange-600">{rake.returnTime}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {rake.estimatedReturn && (
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Status Update:</p>
                      <p className="text-sm font-medium">{rake.estimatedReturn}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      Updated: {rake.lastUpdated}
                    </span>
                    {rake.available ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                        Ready for Loading
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Currently Busy
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-transparent backdrop-blur-sm border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {rakeData.filter(r => r.available).length}
            </p>
            <p className="text-sm text-muted-foreground">Available Rakes</p>
          </div>
        </Card>
        <Card className="p-4 bg-transparent backdrop-blur-sm border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {rakeData.filter(r => r.status === 'in-transit').length}
            </p>
            <p className="text-sm text-muted-foreground">In Transit</p>
          </div>
        </Card>
        <Card className="p-4 bg-transparent backdrop-blur-sm border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {rakeData.filter(r => r.status === 'loading').length}
            </p>
            <p className="text-sm text-muted-foreground">Loading</p>
          </div>
        </Card>
        <Card className="p-4 bg-transparent backdrop-blur-sm border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {rakeData.filter(r => r.status === 'maintenance').length}
            </p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
