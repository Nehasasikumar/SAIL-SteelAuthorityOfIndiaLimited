import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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

// RAQ Simulation System - Smart Rake Formation Optimization
interface SimulationOrder {
  id: string;
  material: string;
  quantity: number;
  priority: string;
  destination: string;
  status: string;
  createdAt: Date;
  assignedRake: number | null;
  estimatedDelivery: Date | null;
  actualDelivery: Date | null;
}

interface SimulationRake {
  id: number;
  name: string;
  capacity: number;
  status: string;
  position: { x: number; y: number };
  currentOrder: SimulationOrder | null;
  loadProgress: number;
  element: HTMLElement | null;
}

interface Stockyard {
  name: string;
  location: string;
  position: { x: number; y: number };
  materials: { [key: string]: number };
  loadingCapacity: number;
  currentLoading: number[];
}

interface Destination {
  name: string;
  position: { x: number; y: number };
}

interface Material {
  name: string;
  color: string;
}

interface Priority {
  name: string;
  color: string;
  weight: number;
}

interface SimulationMetrics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  onTimeDeliveries: number;
  transportCosts: number;
  penaltyCosts: number;
  materialDelivered: { [key: string]: number };
}

interface SimulationEvent {
  type: string;
  message: string;
  timestamp: Date;
}

class RAQSimulation {
  orders: SimulationOrder[] = [];
  rakes: SimulationRake[] = [];
  events: SimulationEvent[] = [];
  metrics: SimulationMetrics = {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    onTimeDeliveries: 0,
    transportCosts: 0,
    penaltyCosts: 0,
    materialDelivered: {
      'Iron Ore': 0,
      'Coal': 0,
      'Limestone': 0
    }
  };

  stockyards: Stockyard[] = [
    {
      name: 'Stockyard-A',
      location: 'North Sector',
      position: { x: 100, y: 150 },
      materials: { 'Iron Ore': 800, 'Coal': 600 },
      loadingCapacity: 2,
      currentLoading: []
    },
    {
      name: 'Stockyard-B',
      location: 'South Sector',
      position: { x: 400, y: 150 },
      materials: { 'Coal': 900, 'Limestone': 500 },
      loadingCapacity: 2,
      currentLoading: []
    },
    {
      name: 'Stockyard-C',
      location: 'East Sector',
      position: { x: 700, y: 150 },
      materials: { 'Iron Ore': 700, 'Limestone': 800 },
      loadingCapacity: 2,
      currentLoading: []
    }
  ];

  destinations: Destination[] = [
    { name: 'Blast Furnace', position: { x: 100, y: 400 } },
    { name: 'Steel Plant', position: { x: 400, y: 400 } },
    { name: 'Coking Plant', position: { x: 700, y: 400 } }
  ];

  materials: Material[] = [
    { name: 'Iron Ore', color: '#8B4513' },
    { name: 'Coal', color: '#2F2F2F' },
    { name: 'Limestone', color: '#D3D3D3' }
  ];

  priorities: Priority[] = [
    { name: 'High', color: '#FF4444', weight: 3 },
    { name: 'Medium', color: '#FF8800', weight: 2 },
    { name: 'Low', color: '#44AA44', weight: 1 }
  ];

  costs = {
    transportPerUnit: 12.0,
    penaltyPerLateUnit: 80.0,
    fuelPerKm: 5.0,
    demurragePerHour: 200.0
  };

  config = {
    orderInterval: [5000, 15000] as [number, number], // milliseconds
    loadingTime: [3000, 8000] as [number, number],    // milliseconds
    transitTime: [8000, 20000] as [number, number],   // milliseconds
    delayProbability: 0.2,
    maxDelay: 10000
  };

  constructor() {
    this.init();
  }

  init() {
    this.initializeRakes();
    this.startSimulation();
    this.updateUI();
    this.startMetricsUpdate();
  }

  initializeRakes() {
    for (let i = 1; i <= 6; i++) {
      this.rakes.push({
        id: i,
        name: `Rake-0${i}`,
        capacity: 120,
        status: 'available',
        position: { x: 150 + (i - 1) * 80, y: 400 },
        currentOrder: null,
        loadProgress: 0,
        element: null
      });
    }
  }

  startSimulation() {
    this.scheduleNextOrder();
    this.processRakeOperations();
  }

  scheduleNextOrder() {
    const interval = this.randomBetween(...this.config.orderInterval);
    setTimeout(() => {
      this.generateOrder();
      this.scheduleNextOrder();
    }, interval);
  }

  generateOrder() {
    const materials = this.materials.map(m => m.name);
    const priorities = this.priorities.map(p => p.name);
    const destinations = this.destinations.map(d => d.name);

    const order = {
      id: `ORD-${String(this.metrics.totalOrders + 1).padStart(4, '0')}`,
      material: this.randomChoice(materials),
      quantity: this.randomBetween(80, 120),
      priority: this.randomChoice(priorities),
      destination: this.randomChoice(destinations),
      status: 'pending',
      createdAt: new Date(),
      assignedRake: null,
      estimatedDelivery: null,
      actualDelivery: null
    };

    this.orders.push(order);
    this.metrics.totalOrders++;
    this.metrics.pendingOrders++;

    this.addEvent('order', `New order created: ${order.id} - ${order.quantity}t ${order.material}`);
    this.assignRakeToOrder(order);
    this.updateUI();
  }

  assignRakeToOrder(order) {
    // Find available stockyard with the material
    const suitableStockyards = this.stockyards.filter(sy =>
      sy.materials[order.material] && sy.materials[order.material] > 0
    );

    if (suitableStockyards.length === 0) {
      this.addEvent('delay', `No material available for order ${order.id}`);
      return;
    }

    // Find available rake
    const availableRake = this.rakes.find(rake => rake.status === 'available');

    if (!availableRake) {
      this.addEvent('delay', `No available rake for order ${order.id}`);
      return;
    }

    // Assign rake to order
    availableRake.currentOrder = order;
    availableRake.status = 'assigned';
    order.assignedRake = availableRake.id;
    order.status = 'assigned';

    // Choose best stockyard (closest or with most material)
    const selectedStockyard = suitableStockyards[0];

    this.addEvent('rake', `${availableRake.name} assigned to order ${order.id}`);

    // Move rake to stockyard and start loading
    this.moveRakeToStockyard(availableRake, selectedStockyard);
  }

  moveRakeToStockyard(rake, stockyard) {
    rake.status = 'moving-to-load';
    const targetPosition = this.getStockyardLoadingPosition(stockyard);
    const duration = this.randomBetween(2000, 4000);

    this.animateRakeMovement(rake, targetPosition, duration, () => {
      this.startLoading(rake, stockyard);
    });

    this.updateRakeUI(rake);
  }

  getStockyardLoadingPosition(stockyard) {
    const stockyardElement = document.getElementById(`stockyard-${stockyard.name.split('-')[1].toLowerCase()}`);
    if (!stockyardElement) return stockyard.position;

    const rect = stockyardElement.getBoundingClientRect();
    const mapRect = document.getElementById('mapArea')?.getBoundingClientRect();
    if (!mapRect) return stockyard.position;

    return {
      x: rect.left - mapRect.left + rect.width / 2 - 40,
      y: rect.top - mapRect.top + rect.height + 20
    };
  }

  animateRakeMovement(rake, targetPosition, duration, callback) {
    if (!rake.element) {
      if (callback) callback();
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentX = rake.position.x + (targetPosition.x - rake.position.x) * easeInOutCubic;
      const currentY = rake.position.y + (targetPosition.y - rake.position.y) * easeInOutCubic;

      if (rake.element) {
        rake.element.style.left = `${currentX}px`;
        rake.element.style.top = `${currentY}px`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        rake.position = targetPosition;
        if (callback) callback();
      }
    };

    requestAnimationFrame(animate);
  }

  startLoading(rake, stockyard) {
    const order = rake.currentOrder;
    rake.status = 'loading';
    order.status = 'loading';

    // Occupy loading slot
    const availableSlot = stockyard.currentLoading.length;
    if (availableSlot < stockyard.loadingCapacity) {
      stockyard.currentLoading.push(rake.id);
      const slotElement = document.getElementById(`slot-${stockyard.name.split('-')[1].toLowerCase()}-${availableSlot + 1}`);
      if (slotElement) {
        slotElement.classList.add('occupied');
      }
    }

    this.addEvent('loading', `${rake.name} started loading ${order.material} at ${stockyard.name}`);

    const loadingDuration = this.randomBetween(...this.config.loadingTime);

    // Animate loading progress
    this.animateLoadingProgress(rake, loadingDuration, () => {
      this.completeLoading(rake, stockyard);
    });

    this.updateRakeUI(rake);
  }

  animateLoadingProgress(rake, duration, callback) {
    if (!rake.element) {
      if (callback) callback();
      return;
    }

    const progressElement = rake.element.querySelector('.progress-fill');
    if (!progressElement) {
      if (callback) callback();
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      rake.loadProgress = progress * 100;
      progressElement.style.width = `${rake.loadProgress}%`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }

  completeLoading(rake, stockyard) {
    const order = rake.currentOrder;
    rake.status = 'loaded';
    order.status = 'loaded';
    rake.loadProgress = 100;

    // Free loading slot
    const slotIndex = stockyard.currentLoading.indexOf(rake.id);
    if (slotIndex !== -1) {
      stockyard.currentLoading.splice(slotIndex, 1);
      const slotElement = document.getElementById(`slot-${stockyard.name.split('-')[1].toLowerCase()}-${slotIndex + 1}`);
      if (slotElement) {
        slotElement.classList.remove('occupied');
      }
    }

    // Reduce material from stockyard
    stockyard.materials[order.material] -= order.quantity;

    this.addEvent('loading', `${rake.name} completed loading ${order.quantity}t ${order.material}`);

    // Move to destination
    setTimeout(() => {
      this.moveRakeToDestination(rake);
    }, 1000);

    this.updateRakeUI(rake);
  }

  moveRakeToDestination(rake) {
    const order = rake.currentOrder;
    rake.status = 'in-transit';
    order.status = 'in-transit';

    const destination = this.destinations.find(d => d.name === order.destination);
    const targetPosition = this.getDestinationPosition(destination);
    const transitDuration = this.randomBetween(...this.config.transitTime);

    // Add possible delay
    const hasDelay = Math.random() < this.config.delayProbability;
    const delay = hasDelay ? this.randomBetween(1000, this.config.maxDelay) : 0;

    if (hasDelay) {
      this.addEvent('delay', `${rake.name} delayed en route to ${destination.name}`);
    }

    this.addEvent('delivery', `${rake.name} in transit to ${destination.name}`);

    this.animateRakeMovement(rake, targetPosition, transitDuration + delay, () => {
      this.completeDelivery(rake);
    });

    this.updateRakeUI(rake);
  }

  getDestinationPosition(destination) {
    const destElement = document.getElementById(`dest-${this.destinations.indexOf(destination) + 1}`);
    if (!destElement) return destination.position;

    const rect = destElement.getBoundingClientRect();
    const mapRect = document.getElementById('mapArea')?.getBoundingClientRect();
    if (!mapRect) return destination.position;

    return {
      x: rect.left - mapRect.left + rect.width / 2 - 40,
      y: rect.top - mapRect.top - 60
    };
  }

  completeDelivery(rake) {
    const order = rake.currentOrder;
    rake.status = 'delivering';
    order.status = 'delivering';

    this.addEvent('delivery', `${rake.name} delivering ${order.quantity}t ${order.material} to ${order.destination}`);

    // Simulate unloading time
    setTimeout(() => {
      this.finishOrder(rake);
    }, this.randomBetween(2000, 4000));

    this.updateRakeUI(rake);
  }

  finishOrder(rake) {
    const order = rake.currentOrder;

    // Update order status
    order.status = 'delivered';
    order.actualDelivery = new Date();

    // Update metrics
    this.metrics.completedOrders++;
    this.metrics.pendingOrders--;
    this.metrics.materialDelivered[order.material] += order.quantity;

    // Calculate costs
    const transportCost = order.quantity * this.costs.transportPerUnit;
    this.metrics.transportCosts += transportCost;

    // Check if on time (assuming 30 min target)
    const deliveryTime = order.actualDelivery - order.createdAt;
    const targetTime = 30 * 60 * 1000; // 30 minutes

    if (deliveryTime <= targetTime) {
      this.metrics.onTimeDeliveries++;
    } else {
      const penaltyCost = order.quantity * this.costs.penaltyPerLateUnit;
      this.metrics.penaltyCosts += penaltyCost;
    }

    this.addEvent('delivery', `Order ${order.id} delivered successfully`);

    // Reset rake
    rake.currentOrder = null;
    rake.status = 'returning';
    rake.loadProgress = 0;

    // Return to depot
    const depotPosition = { x: 150 + (rake.id - 1) * 80, y: 300 };

    this.animateRakeMovement(rake, depotPosition, 3000, () => {
      rake.status = 'available';
      this.updateRakeUI(rake);
    });

    this.updateRakeUI(rake);
    this.updateUI();
  }

  updateRakeUI(rake) {
    if (!rake.element) return;

    const progressFill = rake.element.querySelector('.progress-fill');

    // Remove all status classes
    rake.element.classList.remove('available', 'loading', 'in-transit', 'delivering');

    // Add current status class
    switch (rake.status) {
      case 'available':
        rake.element.classList.add('available');
        break;
      case 'loading':
      case 'assigned':
      case 'moving-to-load':
      case 'loaded':
        rake.element.classList.add('loading');
        break;
      case 'in-transit':
      case 'returning':
        rake.element.classList.add('in-transit');
        break;
      case 'delivering':
        rake.element.classList.add('delivering');
        break;
    }

    // Update progress bar
    if (progressFill) {
      progressFill.style.width = `${rake.loadProgress}%`;
    }
  }

  processRakeOperations() {
    // Process any pending operations
    setInterval(() => {
      this.updateMetricsDisplay();
    }, 1000);
  }

  updateUI() {
    this.updateOrdersList();
    this.updateMetricsDisplay();
  }

  updateOrdersList() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    const activeOrders = this.orders.filter(order => order.status !== 'delivered').slice(-10);

    ordersList.innerHTML = activeOrders.map(order => `
      <div class="order-item ${order.priority.toLowerCase()}">
        <div class="order-header">
          <span class="order-id">${order.id}</span>
          <span class="order-priority ${order.priority.toLowerCase()}">${order.priority}</span>
        </div>
        <div class="order-details">
          <span>Material: ${order.material}</span>
          <span>Qty: ${order.quantity}t</span>
          <span>Dest: ${order.destination}</span>
          <span>Rake: ${order.assignedRake ? `Rake-0${order.assignedRake}` : 'Unassigned'}</span>
        </div>
        <div class="order-status">
          <span class="status-badge ${order.status}">${order.status.toUpperCase()}</span>
        </div>
      </div>
    `).join('');
  }

  updateMetricsDisplay() {
    const updateElement = (id: string, value: string | number) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value.toString();
    };

    updateElement('totalOrders', this.metrics.totalOrders);
    updateElement('completedOrders', this.metrics.completedOrders);
    updateElement('pendingOrders', this.metrics.pendingOrders);

    const onTimeRate = this.metrics.completedOrders > 0
      ? Math.round((this.metrics.onTimeDeliveries / this.metrics.completedOrders) * 100)
      : 100;
    updateElement('onTimeRate', `${onTimeRate}%`);

    updateElement('transportCosts', `₹${this.metrics.transportCosts.toLocaleString()}`);
    updateElement('penaltyCosts', `₹${this.metrics.penaltyCosts.toLocaleString()}`);
    updateElement('totalCosts', `₹${(this.metrics.transportCosts + this.metrics.penaltyCosts).toLocaleString()}`);

    // Utilization
    const busyRakes = this.rakes.filter(rake => rake.status !== 'available').length;
    const utilization = Math.round((busyRakes / this.rakes.length) * 100);
    updateElement('utilizationValue', `${utilization}%`);

    const utilizationGauge = document.getElementById('utilizationGauge');
    if (utilizationGauge) {
      utilizationGauge.style.width = `${utilization}%`;
    }

    // Materials
    updateElement('ironOreDelivered', this.metrics.materialDelivered['Iron Ore']);
    updateElement('coalDelivered', this.metrics.materialDelivered['Coal']);
    updateElement('limestoneDelivered', this.metrics.materialDelivered['Limestone']);
  }

  addEvent(type: string, message: string) {
    const event = {
      type,
      message,
      timestamp: new Date()
    };

    this.events.unshift(event);
    if (this.events.length > 50) {
      this.events.pop();
    }

    this.updateEventsLog();
  }

  updateEventsLog() {
    const eventsLog = document.getElementById('eventsLog');
    if (!eventsLog) return;

    const recentEvents = this.events.slice(0, 20);

    eventsLog.innerHTML = recentEvents.map(event => `
      <div class="event-item">
        <span class="event-time">${event.timestamp.toLocaleTimeString().slice(0, 8)}</span>
        <span class="event-type ${event.type}">${event.type.toUpperCase()}</span>
        <span class="event-message">${event.message}</span>
      </div>
    `).join('');

    // Auto-scroll to top
    eventsLog.scrollTop = 0;
  }

  startMetricsUpdate() {
    setInterval(() => {
      this.updateMetricsDisplay();
    }, 2000);
  }

  pauseSimulation() {
    // Clear any pending timeouts and stop the simulation
    // This is a simple pause - in a more complex implementation,
    // you might want to store timeout IDs to clear them specifically
    this.updateUI(); // Update UI once when paused
  }

  // Utility functions
  randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

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
  const [routes, setRoutes] = useState<any[]>(fallbackRoutes);
  const [error, setError] = useState<string | null>(null);
  const [raqSimulation, setRaqSimulation] = useState<RAQSimulation | null>(null);
  const mapAreaRef = useRef<HTMLDivElement>(null);

  // Setup WebSocket connection
  const { isConnected, messages, sendMessage, connectionStatus } =
    useWebSocket();

  // Initialize simulation after component mounts but don't start it
  useEffect(() => {
    const simulation = new RAQSimulation();
    setRaqSimulation(simulation);

    // Connect rake elements to simulation after DOM is ready
    const connectRakeElements = () => {
      if (simulation && mapAreaRef.current) {
        simulation.rakes.forEach(rake => {
          const element = document.getElementById(`rake-${rake.id}`);
          if (element) {
            rake.element = element;
          }
        });
      }
    };

    // Wait for DOM to be ready
    const timer = setTimeout(connectRakeElements, 100);

    return () => clearTimeout(timer);
  }, []);

  // Control simulation based on play button
  useEffect(() => {
    if (raqSimulation) {
      if (isPlaying) {
        raqSimulation.startSimulation();
      } else {
        // Pause simulation by clearing any pending timeouts
        raqSimulation.pauseSimulation();
      }
    }
  }, [isPlaying, raqSimulation]);

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
        // Messages may be objects or JSON strings depending on the socket implementation
        const data =
          typeof latestMessage === "string"
            ? JSON.parse(latestMessage)
            : latestMessage;

        if (!data || typeof data !== "object") return;

        if (data.type === "simulation_update" && Array.isArray(data.rakes)) {
          setRoutes(data.rakes);
        } else if (data.type === "simulation_error") {
          setError(data.message || "Simulation error occurred");
        } else if (data.type === "simulation_status") {
          setIsPlaying(Boolean(data.is_running));
          setSpeed(data.speed || 1);
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    }
  }, [messages]);

  return (
    <div
      className="space-y-6 animate-fade-in-up"
      style={{ position: "relative", zIndex: 1 }}
    >
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

              // Send command to backend via WebSocket (send object, not pre-stringified)
              if (isConnected) {
                sendMessage({
                  action: newState ? "start_simulation" : "pause_simulation",
                  speed: speed,
                });
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
                sendMessage({
                  action: "set_speed",
                  speed: newSpeed,
                });
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

      {/* RAQ Simulation Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Simulation View */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50 min-h-[500px] relative overflow-hidden">
            <div className="map-container">
              <div className="map-area" id="mapArea" ref={mapAreaRef}>
                {/* Stockyards */}
                <div className="stockyard" id="stockyard-a" data-name="Stockyard-A">
                  <div className="stockyard-icon"></div>
                  <div className="stockyard-label">Stockyard-A</div>
                  <div className="stockyard-capacity">North Sector</div>
                  <div className="loading-slots">
                    <div className="loading-slot" id="slot-a-1"></div>
                    <div className="loading-slot" id="slot-a-2"></div>
                  </div>
                </div>

                <div className="stockyard" id="stockyard-b" data-name="Stockyard-B">
                  <div className="stockyard-icon"></div>
                  <div className="stockyard-label">Stockyard-B</div>
                  <div className="stockyard-capacity">South Sector</div>
                  <div className="loading-slots">
                    <div className="loading-slot" id="slot-b-1"></div>
                    <div className="loading-slot" id="slot-b-2"></div>
                  </div>
                </div>

                <div className="stockyard" id="stockyard-c" data-name="Stockyard-C">
                  <div className="stockyard-icon"></div>
                  <div className="stockyard-label">Stockyard-C</div>
                  <div className="stockyard-capacity">East Sector</div>
                  <div className="loading-slots">
                    <div className="loading-slot" id="slot-c-1"></div>
                    <div className="loading-slot" id="slot-c-2"></div>
                  </div>
                </div>

                {/* Destination Points */}
                <div className="destination" id="dest-1">
                  <div className="dest-icon"></div>
                  <div className="dest-label">Blast Furnace</div>
                </div>

                <div className="destination" id="dest-2">
                  <div className="dest-icon"></div>
                  <div className="dest-label">Steel Plant</div>
                </div>

                <div className="destination" id="dest-3">
                  <div className="dest-icon"></div>
                  <div className="dest-label">Coking Plant</div>
                </div>

                {/* Rakes */}
                <div className="rake available" id="rake-1" data-name="Rake-01">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-01</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="rake available" id="rake-2" data-name="Rake-02">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-02</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="rake available" id="rake-3" data-name="Rake-03">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-03</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="rake available" id="rake-4" data-name="Rake-04">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-04</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="rake available" id="rake-5" data-name="Rake-05">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-05</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>

                <div className="rake available" id="rake-6" data-name="Rake-06">
                  <div className="rake-icon"></div>
                  <div className="rake-label">Rake-06</div>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>


          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Live Metrics Dashboard */}
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-bold mb-4 text-primary">Live Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value" id="totalOrders">0</div>
                <div className="metric-label">Total Orders</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" id="completedOrders">0</div>
                <div className="metric-label">Completed</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" id="pendingOrders">0</div>
                <div className="metric-label">Pending</div>
              </div>
              <div className="metric-card">
                <div className="metric-value" id="onTimeRate">100%</div>
                <div className="metric-label">On-time Rate</div>
              </div>
            </div>

            <div className="cost-metrics">
              <h4 className="font-semibold mb-3">Cost Tracking</h4>
              <div className="cost-item">
                <span>Transport Costs:</span>
                <span id="transportCosts">₹0</span>
              </div>
              <div className="cost-item">
                <span>Penalty Costs:</span>
                <span id="penaltyCosts">₹0</span>
              </div>
              <div className="cost-item total">
                <span>Total Costs:</span>
                <span id="totalCosts">₹0</span>
              </div>
            </div>

            <div className="utilization-gauge">
              <h4 className="font-semibold mb-3">Rake Utilization</h4>
              <div className="gauge-container">
                <div className="gauge">
                  <div className="gauge-fill" id="utilizationGauge"></div>
                  <div className="gauge-value" id="utilizationValue">0%</div>
                </div>
              </div>
            </div>

            <div className="material-summary">
              <h4 className="font-semibold mb-3">Materials Delivered Today</h4>
              <div className="material-item">
                <div className="material-color iron-ore"></div>
                <span>Iron Ore: <span id="ironOreDelivered">0</span>t</span>
              </div>
              <div className="material-item">
                <div className="material-color coal"></div>
                <span>Coal: <span id="coalDelivered">0</span>t</span>
              </div>
              <div className="material-item">
                <div className="material-color limestone"></div>
                <span>Limestone: <span id="limestoneDelivered">0</span>t</span>
              </div>
            </div>
          </Card>

          {/* Order Management Panel */}
          <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-bold mb-4 text-primary">Active Orders</h3>
            <div className="orders-list" id="ordersList">
              {/* Orders will be populated by JavaScript */}
            </div>
          </Card>
        </div>
      </div>

      {/* Events Log */}
      <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-bold mb-4 text-primary">Recent Events</h3>
        <div className="events-log" id="eventsLog">
          {/* Events will be populated by JavaScript */}
        </div>
      </Card>

      {/* Rake Management Section */}
      <Card className="p-6 shadow-elevated bg-transparent backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary">Rake Status Dashboard</h3>
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
