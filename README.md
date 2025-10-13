# 🚂 AI/ML-based Decision Support System for Rake Formation Optimization (SAIL)

## 🧭 Overview
This project develops an **AI/ML-based Decision Support System (DSS)** for optimizing **rake formation strategies** in large-scale logistics operations.  
The first implementation focuses on **movements from Bokaro Steel Plant (BSP)** to **CMO stockyards and customer destinations**.

---

## 🔍 Detailed Problem Statement

### Context
In large-scale logistics operations (e.g., mining, steel, cement, or ports), rake formation is a critical function. A rake is a full train-load of wagons used to transport bulk materials like coal, iron ore, limestone, or finished goods from stockyards/warehouses to consumption centers or customer destinations.

Currently, rake formation in Steel Plants is often based on manual coordination between:
- Material availability at Plants
- Pending customer orders and their delivery priorities
- Availability of empty rakes/wagons
- Loading point capability and utilization
- Operational constraints like siding capacity, route restrictions

This manual or rule-based approach results in:
- Delayed rake formation, leading to missed delivery deadlines
- Underutilized rakes or partial load shipments
- Increased freight and demurrage costs
- Sub-optimal allocation of materials to rakes across multiple stockyards

### Objective
Develop an AI/ML-based decision support system that:
- Dynamically forms optimal rake plans by evaluating material availability, order position, order priority, loading point availability and rake/wagon availability
- Ensures that rakes are fully and efficiently loaded from the most cost-effective stockyards/destination
- Minimizes total logistics cost, including loading, transport and penalty/delay costs, idle freight

### Problem Scope
The system has to:
- Match material availability across stockyards with open customer orders
- Assign available rakes/wagons to the most suitable loading points
- Optimize the composition of each rake based on cost, availability, and destination constraints
- Respect operational constraints such as minimum rakesize, loading point capacity, and siding availability
- Output daily rake formation and dispatch plan with cost and resource efficiency
- Maintain product vs wagon type matrix
- Suggest production based on rail/road order and rail/road loading capabilities as well as inventory at warehouses

### Key Decisions to Optimize
- For which stockyard(s)/destination should materials be sourced for a rake?
- Which orders or destinations should be clubbed together in a rake (multi-destination allowed or not)?
- Which rake(s)/wagons should be assigned to which route/load point?
- How to sequence rake formation and dispatch to meet SLAs and minimize cost?
- Optimize both rail and road order fulfillment

---

## ⚙️ Problem Context
In large steel logistics, **rake formation** involves grouping wagons and assigning materials from plants or stockyards to customer destinations.  
Currently, this process is **manual**, leading to:
- Delayed dispatches  
- Underutilized rakes  
- Increased demurrage and freight costs  
- Sub-optimal material allocation  

This system automates and optimizes rake formation using **AI/ML models** that consider:
- Material availability  
- Customer order priorities  
- Rake/wagon availability  
- Loading point constraints  
- Route restrictions  

---

## 🎯 Objective
Build a **web-based AI/ML DSS** that dynamically:
- Suggests optimal rake formation and dispatch plans  
- Minimizes total logistics costs  
- Improves resource utilization  
- Enhances on-time delivery performance  

---

## 🧩 System Architecture

```
Frontend (React + Vite)
↓ Fetches data / Displays dashboard
Backend (FastAPI)
↓ Handles business logic & APIs
ML Engine (Python + Scikit-learn / PyTorch)
↓ Optimizes rake formation
Database (PostgreSQL / MongoDB)
↓ Stores all orders, rakes, materials, results
```

---

## 👥 Roles and Users

| Role | Responsibility |
|------|----------------|
| **Admin (System Owner)** | Monitors, configures, and oversees all operations |
| **Plant Operator** | Uploads material & rake availability |
| **Stockyard Manager** | Updates stockyard inventory and orders |
| **Logistics Planner** | Reviews AI-suggested rake plans and confirms dispatch |
| **Management Viewer** | Views reports, cost analytics, and KPIs |

---

## 🗂️ Folder Structure

```
SAIL-SteelAuthorityOfIndiaLimited/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── inventory.py
│   │   │   ├── optimization.py
│   │   │   ├── order.py
│   │   │   └── rake.py
│   │   ├── routes/
│   │   │   ├── ai_recommendations.py
│   │   │   ├── dashboard.py
│   │   │   ├── inventory.py
│   │   │   ├── live_simulation.py
│   │   │   ├── order_management.py
│   │   │   ├── rake_allocation.py
│   │   │   └── reports.py
│   │   ├── schemas/
│   │   │   ├── inventory_schema.py
│   │   │   ├── optimize_schema.py
│   │   │   ├── order_schema.py
│   │   │   ├── rake_schema.py
│   │   │   └── report_schema.py
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── dashboard_service.py
│   │   │   ├── inventory_service.py
│   │   │   ├── optimize_service.py
│   │   │   ├── order_service.py
│   │   │   ├── rake_service.py
│   │   │   ├── report_service.py
│   │   │   └── simulation_service.py
│   │   ├── ml/
│   │   │   ├── cost_model.py
│   │   │   ├── eta_predictor.py
│   │   │   ├── rake_optimizer.py
│   │   │   └── models/
│   │   └── utils/
│   │       ├── helpers.py
│   │       └── logger.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── AIRecommendations.tsx
│   │   │   ├── CostOptimization.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── LiveSimulation.tsx
│   │   │   ├── LoadingPoints.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Production.tsx
│   │   │   └── RakeAllocation.tsx
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   └── useWebSocket.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env
│   └── tsconfig.json
│
├── README.md
└── start_dev.bat
```

---

## 🧠 Backend (FastAPI + ML Integration)

### 🔹 Tech Stack
- **FastAPI** – API framework  
- **SQLite/PostgreSQL** – Data persistence  
- **SQLAlchemy** – ORM  
- **Scikit-learn / PyTorch** – ML model integration  
- **Pandas, Numpy** – Data handling  
- **WebSockets** - Real-time simulation and updates

### 🔹 API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/dashboard/overview` | GET | Get system overview and metrics |
| `/api/orders/` | GET/POST | Retrieve or add customer orders |
| `/api/rake/` | GET/POST | Get or add rake information |
| `/api/rake/optimize` | POST | Trigger AI optimization and get best rake plan |
| `/api/inventory/stockyards` | GET | Retrieve stockyard inventory |
| `/api/simulation/live` | GET | Get live simulation data |
| `/api/ai/recommendations` | GET | Get AI-powered recommendations |
| `/api/reports/summary` | GET | Generate summary reports |
| `/ws/simulation` | WebSocket | Real-time simulation updates |

### 🔹 Data Flow
1. Input data (materials, orders, rake info) → stored in DB.  
2. `/api/optimize` triggers ML model → evaluates combinations → outputs rake plans.  
3. FastAPI sends response back to frontend dashboard.  

---

## ⚛️ Frontend (React + TypeScript + Vite)

### 🔹 Tech Stack
- **React 18** with **TypeScript**  
- **Vite** - Build tool & dev server  
- **TailwindCSS** - UI styling  
- **Shadcn/UI** - UI component library  
- **Framer Motion** - Animations  
- **Recharts** - Data visualization  
- **WebSockets** - Real-time updates

### 🔹 Main Pages

| Page | Description |
|------|--------------|
| **Dashboard** | Overview, KPIs, system metrics |
| **Orders** | Manage customer orders |
| **Inventory** | Stockyard inventory management |
| **Rake Allocation** | Optimal rake assignment |
| **Live Simulation** | Real-time rake movement visualization |
| **Cost Optimization** | Cost analysis and optimization tools |
| **AI Recommendations** | AI-powered insights |

### 🔹 Example Component: WebSocket Connection

```typescript
// Using WebSockets for real-time updates
const { isConnected, messages, sendMessage } = useWebSocket();

// Send command to backend
if (isConnected) {
  sendMessage({
    action: "start_simulation",
    speed: speed
  });
}

// Handle incoming messages
useEffect(() => {
  if (messages && messages.length > 0) {
    const data = typeof latestMessage === 'string' 
      ? JSON.parse(latestMessage) 
      : latestMessage;
      
    if (data.type === "simulation_update") {
      setRoutes(data.rakes);
    }
  }
}, [messages]);
```

---

## 🧮 ML Model (Optimization Logic)

### 🔹 Objective

Minimize:

```
Total Cost = Loading Cost + Transport Cost + Penalty/Delay Cost
```

Subject to constraints:

* Material availability
* Rake capacity
* Route restrictions
* Delivery SLAs

### 🔹 Techniques Used

* Linear Programming (using `PuLP` / `OR-Tools`)
* Heuristic Optimization
* Cost Prediction using Regression / XGBoost

Output → `rake_optimizer.pkl`

---

## 🛠️ Installation & Working Guide

### 🔹 Step 1: Clone Repository

```bash
git clone https://github.com/Nehasasikumar/SAIL-SteelAuthorityOfIndiaLimited.git
cd SAIL-SteelAuthorityOfIndiaLimited
```

### 🔹 Step 2: Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: **[http://localhost:8000](http://localhost:8000)**

### 🔹 Step 3: Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

### 🔹 Quick Start Script

For Windows users, you can use the included batch file to start both servers:
```bash
start_dev.bat
```

## 🔧 Troubleshooting WebSocket Issues

### Common WebSocket Error: "WebSocket error: Event" or "ECONNABORTED"

#### 1. Check if both servers are running
Ensure both uvicorn (backend) and Vite dev server (frontend) are running properly:
```bash
# Check backend
curl http://localhost:8000/
# Check frontend
curl http://localhost:5173/
```

#### 2. Direct WebSocket Connection
Try establishing a direct WebSocket connection by enabling the direct connection option:
- Open `frontend/.env` 
- Uncomment: `VITE_WS_BASE_URL=ws://localhost:8000/ws`
- Restart frontend server

#### 3. Backend Binding Address
Ensure the backend binds to all network interfaces:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Debug Logs
For more detailed logging, run backend with debug level:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

#### 5. Test WebSocket in Browser Console
Test direct WebSocket connection via browser console:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/simulation');
ws.onopen = () => console.log('Connected!');
ws.onerror = (e) => console.log('Error:', e);
```

---

## 🔗 End-to-End Flow

1️⃣ **Plant Operator** updates inventory → `/api/inventory/stockyards`  
2️⃣ **Stockyard Manager** submits orders → `/api/orders/`  
3️⃣ **Logistics Planner** runs optimization → `/api/rake/optimize`  
4️⃣ **Backend** calls ML model → optimizes rake allocation  
5️⃣ **Live Simulation** visualizes rake movement via WebSockets  
6️⃣ **Admin** reviews AI recommendations and cost analytics  

---

## 📊 Output Example

### Rake Allocation API Response

```json
{
  "rake_id": "R1234",
  "origin": "Bokaro",
  "destination": "CMO Kolkata",
  "material_type": "Steel Coils",
  "wagons": 59,
  "estimated_cost": 480000,
  "transit_progress": 45,
  "status": "In Transit",
  "departure_time": "08:30 AM",
  "eta": "14:45 PM",
  "optimization_score": 0.93
}
```

### WebSocket Simulation Update

```json
{
  "type": "simulation_update",
  "rakes": [
    {
      "id": "R1234",
      "from": "Bokaro",
      "to": "CMO Kolkata",
      "progress": 48,
      "status": "In Transit",
      "departureTime": "08:30 AM",
      "eta": "14:45 PM"
    },
    {
      "id": "R5678",
      "from": "Bokaro",
      "to": "Customer A123",
      "progress": 82,
      "status": "In Transit",
      "departureTime": "07:15 AM",
      "eta": "12:30 PM"
    }
  ]
}
```

---

## 📈 Future Enhancements

* Real-time API integration with Indian Railways data
* Predictive loading scheduling
* Multi-objective optimization (time + cost)
* AI-based ETA prediction for delivery

---

## 👨‍💻 Contributors

* **Nishakar (Full Stack + AI/ML Developer)**
  Role: End-to-end system design, ML model integration, and deployment

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🚀 Summary

This system replaces manual, rule-based rake planning with a **data-driven AI/ML engine**, improving:

* Material utilization efficiency
* Cost savings
* Delivery reliability
* Decision-making transparency
