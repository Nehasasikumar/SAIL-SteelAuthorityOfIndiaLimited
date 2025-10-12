# RakeVision AI - Rake Allocation and Quality Control System

An AI-powered decision support system for optimizing rake formation and dispatch planning for SAIL (Steel Authority of India Ltd).

## System Architecture

This project follows a modern web architecture with:

- **Frontend**: React + Vite with TailwindCSS
- **Backend**: FastAPI with Python
- **ML Engine**: OR-Tools, Scikit-learn for optimization and prediction

## Directory Structure

```
project/
├── backend/               # FastAPI backend
│   ├── app/              
│   │   ├── main.py        # Entry point
│   │   ├── core/          # Core configurations
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Data validation schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── ml/            # Machine learning components
│   │   └── utils/         # Helper utilities
│   └── requirements.txt   # Python dependencies
│
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # UI components
    │   ├── pages/         # Application pages
    │   └── ...
    └── package.json       # JS dependencies
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL database

### Quick Start

The easiest way to get started is to use the provided development script:

1. Run the startup script:
   ```
   start_dev.bat
   ```
   This will start both the frontend and backend servers.

2. Access the application:
   - Frontend: http://localhost:5173
   - API documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. The `.env` file has been created with development settings:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rakevision
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=rakevision
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   API_PORT=8000
   API_HOST=0.0.0.0
   ```

5. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
   ```
   The backend will be available at http://localhost:8000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. The API client has been configured in `src/lib/api.ts` to connect to the backend.

4. Run the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Connecting Frontend to Backend

### API Integration

The frontend connects to the backend using the following endpoints:

| Frontend Page        | Backend Endpoints                                   |
|----------------------|----------------------------------------------------|
| Dashboard            | GET `/api/dashboard/overview`                       |
| Rake Allocation      | GET `/api/rake/{id}`, POST `/api/rake/optimize`     |
| Orders Management    | GET/POST `/api/orders/`                            |
| Inventory Management | GET `/api/inventory/stockyards`                     |
| AI Recommendations   | GET `/api/ai/recommendations`                       |
| Live Simulation      | GET `/api/simulation/live`<br>GET `/api/simulation/config`<br>GET `/api/simulation/active-rakes`<br>POST `/api/simulation/start`<br>POST `/api/simulation/event`<br>POST `/api/simulation/control`<br>WebSocket `/ws/simulation` |
| Reports              | GET `/api/reports/summary`                          |

### New Simulation API Endpoints

#### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/simulation/live` | GET | Get real-time rake positions for the simulation map |
| `/api/simulation/config` | GET | Get configuration data (routes, stations, etc.) |
| `/api/simulation/active-rakes` | GET | Get all active rakes for the simulation |
| `/api/simulation/start` | POST | Start or restart the simulation with custom settings |
| `/api/simulation/event` | POST | Trigger custom simulation events (delays, breakdowns, weather) |
| `/api/simulation/control` | POST | Control the simulation (pause, resume, stop) |

#### WebSocket Messages

| Message Type | Direction | Description |
|--------------|-----------|-------------|
| `connection_established` | Server → Client | Sent when a client connects successfully |
| `position_update` | Server → Client | Real-time updates of rake positions |
| `event_notification` | Server → Client | Notifications about simulation events |
| `simulation_control` | Server → Client | Status updates about simulation control actions |
| `get_positions` | Client → Server | Request current rake positions |
| `ping` | Client → Server | Keep-alive message |
| `simulate_event` | Client → Server | Trigger a simulation event |
| `control_simulation` | Client → Server | Control the simulation |

### Enhanced WebSocket Integration for Live Updates

We've implemented an advanced React hook for robust WebSocket communication in the Live Simulation page with auto-reconnection and typed message handling:

```typescript
// src/hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { createWebSocketConnection } from '../lib/api';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  
  // Connection reference
  const wsConnectionRef = useRef(createWebSocketConnection());
  
  // Connect to the WebSocket
  const connect = useCallback(() => {
    setConnectionStatus('connecting');
    
    wsConnectionRef.current.connect(
      // onConnect callback
      () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
        wsConnectionRef.current.requestPositions();
      },
      // onDisconnect callback
      () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    );
    
    // Setup message handlers
    const unsubscribe = wsConnectionRef.current.on('*', (data) => {
      setLastMessage(data);
      setMessages((prev) => [...prev, data]);
    });
    
    return unsubscribe;
  }, []);
  
  // Auto-connect on mount
  useEffect(() => {
    const unsubscribe = connect();
    return () => {
      unsubscribe();
      wsConnectionRef.current.disconnect();
    };
  }, [connect]);

  return {
    isConnected,
    connectionStatus,
    messages,
    lastMessage,
    error,
    // Enhanced API
    on: wsConnectionRef.current.on,
    send: wsConnectionRef.current.send,
    requestPositions: wsConnectionRef.current.requestPositions,
    sendEvent: wsConnectionRef.current.sendEvent,
    controlSimulation: wsConnectionRef.current.controlSimulation,
  };
}
```

Using the enhanced hook in components:

```tsx
// Example usage in LiveSimulation component
const { 
  isConnected, 
  connectionStatus,
  lastMessage,
  on,
  requestPositions,
  sendEvent,
  controlSimulation 
} = useWebSocket();

// Subscribe to specific message types
useEffect(() => {
  // Handle position updates
  const unsubscribe = on('position_update', (data) => {
    updateMapPositions(data);
  });
  
  // Handle events
  const unsubscribeEvents = on('event_notification', (data) => {
    showEventNotification(data);
  });
  
  return () => {
    unsubscribe();
    unsubscribeEvents();
  };
}, [on]);

// Example: Send an event when a rake has an issue
const reportRakeIssue = (rakeId, issueType) => {
  sendEvent('breakdown', rakeId, { severity: 'high', details: issueType });
};

// Control the simulation
const pauseSimulation = () => controlSimulation('pause');
const resumeSimulation = () => controlSimulation('resume');
const stopSimulation = () => controlSimulation('stop');
```
```

## Features

- **Dashboard**: View metrics on rake utilization, order fulfillment, etc.
- **Rake Allocation**: AI-optimized rake formation and allocation
- **Order Management**: Track and manage customer orders
- **Inventory**: Monitor stockyard material availability
- **Live Simulation**: Real-time visualization of rake movements
- **AI Recommendations**: Get AI-driven insights and suggestions
- **Reports**: Generate analytics reports and performance metrics

## ML Model Integration

The system uses three primary ML components:

1. **Rake Optimizer**: Allocation optimization using OR-Tools
2. **ETA Predictor**: Regression model for arrival time prediction
3. **Cost Model**: Cost estimation for different routes and loads

These models are integrated through the backend services layer, which calls the ML components as needed.

The backend ML components are structured as follows:

```
backend/
└── app/
    └── ml/
        ├── rake_optimizer.py     # OR-Tools optimization logic
        ├── eta_predictor.py      # Regression-based ETA prediction
        ├── cost_model.py         # Cost estimation model
        └── models/               # Saved model files
```

### Rake Optimizer Integration

The rake optimizer uses Google OR-Tools to solve the optimization problem:

```python
from ortools.linear_solver import pywraplp

def optimize_rake_allocation(orders, available_rakes, constraints):
    # Create solver
    solver = pywraplp.Solver.CreateSolver('SCIP')
    
    # Define variables
    # x[i][j] = 1 if rake i is assigned to order j
    x = {}
    for i in range(len(available_rakes)):
        for j in range(len(orders)):
            x[i, j] = solver.IntVar(0, 1, f'x_{i}_{j}')
    
    # Add constraints and objective
    # ... (constraint implementation)
    
    # Solve the problem
    status = solver.Solve()
    
    # Process results
    if status == pywraplp.Solver.OPTIMAL:
        # Extract solution
        solution = extract_solution(x, available_rakes, orders)
        return solution
    else:
        return None
```

## Production Deployment

For production deployment, consider:

1. Setting up a production database
2. Configuring CORS for specific origins
3. Using HTTPS for all connections
4. Setting up proper authentication
5. Deploying behind a reverse proxy (Nginx/Apache)
6. Using process managers (PM2 for Node, Gunicorn for Python)

---

## Troubleshooting

### Common Issues

#### Backend won't start
- Check PostgreSQL connection settings
- Ensure Python environment is activated
- Verify port 8000 is available

#### Frontend API calls failing
- Check CORS settings in backend
- Verify API base URL is correct
- Check network tab in browser dev tools for specific errors

#### ML models not working
- Ensure OR-Tools is properly installed
- Check model paths in configuration

For more help, please open an issue on the repository.