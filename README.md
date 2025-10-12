# 🚂 AI/ML-based Decision Support System for Rake Formation Optimization (SAIL)

## 🧭 Overview
This project develops an **AI/ML-based Decision Support System (DSS)** for optimizing **rake formation strategies** in large-scale logistics operations.  
The first implementation focuses on **movements from Bokaro Steel Plant (BSP)** to **CMO stockyards and customer destinations**.

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
rake-optimization-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── rake_model.py
│   │   │   └── data_schema.py
│   │   ├── routes/
│   │   │   ├── rake_routes.py
│   │   │   ├── stockyard_routes.py
│   │   │   ├── order_routes.py
│   │   │   └── ml_routes.py
│   │   ├── services/
│   │   │   ├── optimization_engine.py
│   │   │   ├── data_cleaning.py
│   │   │   └── prediction.py
│   │   ├── database/
│   │   │   └── connection.py
│   │   └── utils/
│   │       └── helpers.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DataUpload.jsx
│   │   │   ├── RakePlan.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RakeOptimizer.jsx
│   │   │   ├── Stockyard.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── model_training.ipynb
│   └── rake_optimizer.pkl
│
├── README.md
└── .env
```

---

## 🧠 Backend (FastAPI + ML Integration)

### 🔹 Tech Stack
- **FastAPI** – API framework  
- **PostgreSQL** – Data persistence  
- **SQLAlchemy** – ORM  
- **Scikit-learn / PyTorch** – ML model integration  
- **Pandas, Numpy** – Data handling  

### 🔹 API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/materials/upload` | POST | Upload plant material data |
| `/api/orders/upload` | POST | Upload customer order data |
| `/api/rakes/upload` | POST | Upload rake/wagon availability |
| `/api/optimize` | POST | Trigger AI optimization and get best rake plan |
| `/api/rakes/plan` | GET | Retrieve optimized rake plans |
| `/api/analytics/cost` | GET | Get cost and utilization analytics |

### 🔹 Data Flow
1. Input data (materials, orders, rake info) → stored in DB.  
2. `/api/optimize` triggers ML model → evaluates combinations → outputs rake plans.  
3. FastAPI sends response back to frontend dashboard.  

---

## ⚛️ Frontend (React + Vite)

### 🔹 Tech Stack
- React 18 + Vite  
- Axios (API calls)  
- Recharts (data visualization)  
- TailwindCSS (UI design)

### 🔹 Main Pages

| Page | Description |
|------|--------------|
| **Home Page** | Overview, system intro |
| **Dashboard** | Displays KPIs, total rakes, cost savings |
| **Data Upload** | Upload CSV files for orders/materials |
| **Rake Optimizer** | Trigger ML optimization and view results |
| **Reports** | Cost trends, performance analytics |

### 🔹 Example Component: Fetch & Display Plan

```javascript
useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/rakes/plan")
    .then(res => setPlans(res.data))
    .catch(err => console.error(err));
}, []);
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
git clone https://github.com/yourusername/rake-optimization-system.git
cd rake-optimization-system
```

### 🔹 Step 2: Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### 🔹 Step 3: Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 End-to-End Flow

1️⃣ **Plant Operator** uploads data → `/api/materials/upload`  
2️⃣ **Stockyard Manager** uploads order data → `/api/orders/upload`  
3️⃣ **Planner** runs optimization → `/api/optimize`  
4️⃣ **Backend** calls ML model → generates `rake_plan.json`  
5️⃣ **Frontend Dashboard** displays optimized plan visually  
6️⃣ **Admin** reviews and exports daily dispatch report  

---

## 📊 Output Example

```json
{
  "rake_id": "R001",
  "loading_point": "Bokaro Y1",
  "destination": "CMO Kolkata",
  "material": "Steel Coils",
  "wagons": 59,
  "total_cost": 480000,
  "optimization_score": 0.93
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
