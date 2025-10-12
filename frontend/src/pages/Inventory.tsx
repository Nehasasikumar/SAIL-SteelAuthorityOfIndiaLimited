import { motion } from "framer-motion";
import { Package, Warehouse, TrendingUp, AlertTriangle, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface InventoryItem {
  id: string;
  material: string;
  grade: string;
  stockyard: string;
  quantity: number;
  unit: string;
  available: number;
  reserved: number;
  location: string;
  lastUpdated: string;
  quality: 'A' | 'B' | 'C';
  status: 'available' | 'low-stock' | 'critical' | 'reserved';
}

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStockyard, setSelectedStockyard] = useState("all");

  const inventoryData: InventoryItem[] = [
    {
      id: "INV-001",
      material: "HR Coils",
      grade: "IS:2062",
      stockyard: "Bokaro Main",
      quantity: 15420,
      unit: "tons",
      available: 12350,
      reserved: 3070,
      location: "Yard-A1",
      lastUpdated: "2025-01-15 14:30",
      quality: 'A',
      status: 'available'
    },
    {
      id: "INV-002",
      material: "Coal",
      grade: "Grade-A",
      stockyard: "Bokaro Coal Yard",
      quantity: 25600,
      unit: "tons",
      available: 18900,
      reserved: 6700,
      location: "Yard-C2",
      lastUpdated: "2025-01-15 13:45",
      quality: 'A',
      status: 'available'
    },
    {
      id: "INV-003",
      material: "Iron Ore",
      grade: "Fe-62%",
      stockyard: "Bokaro Ore Yard",
      quantity: 8750,
      unit: "tons",
      available: 8750,
      reserved: 0,
      location: "Yard-O1",
      lastUpdated: "2025-01-15 12:15",
      quality: 'B',
      status: 'available'
    },
    {
      id: "INV-004",
      material: "CR Coils",
      grade: "IS:513",
      stockyard: "Bokaro Main",
      quantity: 3200,
      unit: "tons",
      available: 1200,
      reserved: 2000,
      location: "Yard-A2",
      lastUpdated: "2025-01-15 11:30",
      quality: 'A',
      status: 'low-stock'
    },
    {
      id: "INV-005",
      material: "Limestone",
      grade: "High Grade",
      stockyard: "Bokaro Flux Yard",
      quantity: 4500,
      unit: "tons",
      available: 4500,
      reserved: 0,
      location: "Yard-F1",
      lastUpdated: "2025-01-15 10:00",
      quality: 'B',
      status: 'critical'
    }
  ];

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.stockyard.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStockyard = selectedStockyard === "all" || item.stockyard === selectedStockyard;
    return matchesSearch && matchesStockyard;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'low-stock': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'reserved': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
      {/* Controls */}
      <div className="flex justify-end items-start">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="w-full p-6 bg-transparent backdrop-blur-sm border-border/50 h-32 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Materials</p>
                <p className="text-2xl font-bold">{inventoryData.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="w-full p-6 bg-transparent backdrop-blur-sm border-border/50 h-32 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Warehouse className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Stock</p>
                <p className="text-2xl font-bold">
                  {inventoryData.reduce((sum, item) => sum + item.available, 0).toLocaleString()} tons
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
          <Card className="w-full p-6 bg-transparent backdrop-blur-sm border-border/50 h-32 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reserved Stock</p>
                <p className="text-2xl font-bold">
                  {inventoryData.reduce((sum, item) => sum + item.reserved, 0).toLocaleString()} tons
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
          <Card className="w-full p-6 bg-transparent backdrop-blur-sm border-border/50 h-32 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Items</p>
                <p className="text-2xl font-bold">
                  {inventoryData.filter(item => item.status === 'critical').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 bg-transparent backdrop-blur-sm border-border/50">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials, grades, or stockyards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedStockyard}
            onChange={(e) => setSelectedStockyard(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="all">All Stockyards</option>
            <option value="Bokaro Main">Bokaro Main</option>
            <option value="Bokaro Coal Yard">Bokaro Coal Yard</option>
            <option value="Bokaro Ore Yard">Bokaro Ore Yard</option>
            <option value="Bokaro Flux Yard">Bokaro Flux Yard</option>
          </select>
        </div>

        {/* Inventory Table */}
        <div className="space-y-3">
          {filteredInventory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-primary/20 bg-transparent backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.material}</h3>
                        <Badge className={getQualityColor(item.quality)}>
                          Grade {item.quality}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.grade} • {item.stockyard} • {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="font-semibold">{item.available.toLocaleString()} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reserved</p>
                        <p className="font-semibold text-blue-600">{item.reserved.toLocaleString()} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-semibold">{item.quantity.toLocaleString()} {item.unit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
