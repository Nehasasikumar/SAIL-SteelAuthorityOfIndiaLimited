interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface SimulationRake {
  id: string;
  from: string;
  to: string;
  progress: number;
  status: string;
  departureTime?: string;
  eta?: string;
}

class WebSocketConnection {
  private ws: WebSocket | null = null;
  private url: string;
  private messageHandlers: { [key: string]: ((data: any) => void)[] } = {};
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(url?: string) {
    this.url = url || 'ws://localhost:8000/ws';
  }

  connect(onConnect?: () => void, onDisconnect?: () => void): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        onDisconnect?.();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, data: any = {}): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, ...data });
      this.ws.send(message);
      return true;
    }
    return false;
  }

  on(type: string, handler: (data: any) => void): () => void {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    this.messageHandlers[type].push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers[type];
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  private handleMessage(data: any): void {
    const { type, ...messageData } = data;

    // Handle all message types
    if (this.messageHandlers['*']) {
      this.messageHandlers['*'].forEach(handler => handler(data));
    }

    // Handle specific message types
    if (this.messageHandlers[type]) {
      this.messageHandlers[type].forEach(handler => handler(messageData));
    }
  }

  startPingInterval(interval: number = 30000): ReturnType<typeof setInterval> {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, interval);
    return this.pingInterval;
  }

  requestPositions(): boolean {
    return this.send('request_positions');
  }

  sendEvent(eventType: string, rakeId: string, details: any = {}): boolean {
    return this.send('simulation_event', { eventType, rakeId, ...details });
  }

  controlSimulation(action: 'pause' | 'resume' | 'stop'): boolean {
    return this.send('simulation_control', { action });
  }
}

class ApiClient {
  private baseURL: string;
  private wsConnection: WebSocketConnection;

  constructor() {
    // Use the proxy configuration from vite.config.ts
    this.baseURL = '/api';
    this.wsConnection = new WebSocketConnection();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  simulation = {
    getActiveRakes: async (): Promise<ApiResponse<SimulationRake[]>> => {
      return this.request<SimulationRake[]>('/live-simulation/active-rakes');
    },

    startSimulation: async (speed: number = 1): Promise<ApiResponse<{ success: boolean }>> => {
      return this.request<{ success: boolean }>('/live-simulation/start', {
        method: 'POST',
        body: JSON.stringify({ speed }),
      });
    },

    pauseSimulation: async (): Promise<ApiResponse<{ success: boolean }>> => {
      return this.request<{ success: boolean }>('/live-simulation/pause', {
        method: 'POST',
      });
    },

    stopSimulation: async (): Promise<ApiResponse<{ success: boolean }>> => {
      return this.request<{ success: boolean }>('/live-simulation/stop', {
        method: 'POST',
      });
    },

    setSpeed: async (speed: number): Promise<ApiResponse<{ success: boolean }>> => {
      return this.request<{ success: boolean }>('/live-simulation/speed', {
        method: 'POST',
        body: JSON.stringify({ speed }),
      });
    },
  };

  // Add other API modules as needed
  dashboard = {
    getMetrics: async (): Promise<ApiResponse<any>> => {
      return this.request<any>('/dashboard/metrics');
    },
  };

  orders = {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return this.request<any[]>('/orders');
    },

    create: async (orderData: any): Promise<ApiResponse<any>> => {
      return this.request<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
  };

  rakes = {
    getAll: async (): Promise<ApiResponse<any[]>> => {
      return this.request<any[]>('/rakes');
    },

    allocate: async (allocationData: any): Promise<ApiResponse<any>> => {
      return this.request<any>('/rakes/allocate', {
        method: 'POST',
        body: JSON.stringify(allocationData),
      });
    },
  };
}

// WebSocket connection factory function
export const createWebSocketConnection = (url?: string): WebSocketConnection => {
  return new WebSocketConnection(url);
};

// Export a singleton instance
const api = new ApiClient();
export default api;
