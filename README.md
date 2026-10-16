# FoodBridge — Save Food, Feed People 🍲🤝

FoodBridge is a full-stack, hackathon-ready hunger alleviation web platform that connects commercial kitchens (restaurants, banquet halls, bakery chains) with vetted NGOs, food shelters, and volunteer couriers across Jaipur, Rajasthan.

---

## 🌟 Key Innovations & Features

1. **Emerald-Themed Responsive Interface**: Built with React 18, TypeScript, Tailwind CSS, and sleek glassmorphism.
2. **Four Specialized Role Dashboards**:
   - 🍲 **Restaurant Dashboard**: Register food items, specify category, servings count, preparation time, strict pickup deadline, storage requirements, allergen declarations, and FSSAI hygiene pledge.
   - 🤝 **NGO Marketplace**: Real-time listing with search, category filtering, urgency flags, allergen inspection, and single-click food claiming.
   - 🚴 **Volunteer Courier Hub**: Complete 4-stage delivery state machine: `Assigned → Accepted → Picked Up → Delivered`.
   - 🛡️ **Admin Governance Portal**: Organization accreditation check, food safety moderation reports, and an immutable system audit trail.
3. **Instant Demo Persona Switcher**: Seamlessly switch between Restaurant, NGO, Volunteer, and Admin personas with one click, without requiring external accounts or setup.
4. **Transparent Smart NGO Matching**: Multi-factor algorithmic scoring (0–100 pts) evaluating Proximity (Haversine distance), Shelter Capacity, Category Affinity, and Shelf-life Urgency. Each score provides an explainable breakdown.
5. **Interactive Jaipur Geospatial Map**: Powered by Leaflet & OpenStreetMap, displaying color-coded urgency pins for Jaipur zones (C-Scheme, Malviya Nagar, Raja Park, Mansarovar, MI Road, Vaishali Nagar, Bani Park, Tonk Road).
6. **Telemetry & Impact Analytics**: Interactive Recharts visualizations displaying total servings rescued, landfill methane (CO₂) averted, category distributions, and daily trajectory.
7. **Strict Safety Protocol & Disclaimers**: Explicit adherence to FSSAI guidelines with an unwavering policy: **Food safety is never judged by AI or image predictions**. Human chain-of-custody and temperature maintenance are legally verified.
8. **Persistent Local Mode**: Automatically persists all operational state in SQLite and browser `localStorage`, with support for Supabase PostgreSQL when credentials are supplied.
9. **Data Export**: Single-click CSV export of the complete donation ledger and administrative audit events.

---

## 🏗️ Architecture & Tech Stack

```
foodbridge/
├── frontend/               # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Navbar, MapView, Dashboards, Modals, Banner
│   │   ├── context/        # AppContext (central state, validation, storage)
│   │   ├── data/           # Seed data (9 Jaipur donations, NGOs, users)
│   │   ├── types/          # Core TypeScript data contracts
│   │   └── utils/          # Smart matching, CSV export algorithms
│   └── dist/               # Production-ready client build
├── backend/                # Python FastAPI Backend
│   ├── main.py             # REST API routes & role enforcement
│   ├── database.py         # SQLite connection & schema initialization
│   ├── seed.py             # Jaipur seed data populator
│   ├── test_api.py         # Automated test suite
│   └── foodbridge.db       # Local SQLite database file
├── .env.example            # Environment variables template
└── README.md               # Documentation & setup guide
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.11)

---

### 2. Running the Python FastAPI Backend

Open a terminal in `backend`:

```powershell
cd backend
# Create and activate virtual environment (if not already created)
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install fastapi "uvicorn[standard]" pydantic httpx

# Initialize & seed SQLite database
python seed.py

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The backend will start at:
👉 **API Root & Docs**: `http://localhost:8000/docs`  
👉 **API Health Check**: `http://localhost:8000/api/health`

---

### 3. Running the React Frontend

Open a second terminal in `frontend`:

```powershell
cd frontend
# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

The frontend will start at:
👉 **Web Application**: `http://localhost:5173/`

---

### 4. Running the Automated Test Suite

To verify all backend permissions, duplicate claim protections, delivery state transitions, and smart matching algorithms:

```powershell
cd backend
.\.venv\Scripts\python test_api.py
```

Expected result:
```
[PASS] Health check passed
[PASS] Seed verification passed (9 Jaipur demo donations loaded)
[PASS] Role permission enforcement passed (volunteer blocked from posting donations)
[PASS] Deadline validation passed (past deadlines rejected)
[PASS] Valid donation created
[PASS] Transparent Smart NGO Matching passed
[PASS] NGO claim succeeded
[PASS] Duplicate claim prevention passed (409 Conflict returned)
[PASS] Invalid status transition prevention passed (cannot deliver before pickup)
[PASS] Complete Volunteer Delivery Workflow verified (Assigned -> Accepted -> Picked Up -> Delivered)
[PASS] Analytics telemetry computation passed
[PASS] Tamper-evident Audit ledger verified
[PASS] CSV Ledger Export verified
=== ALL FOODBRIDGE BACKEND SUITE CHECKS PASSED SUCCESSFULLY! ===
```

---

## 🔒 Security & Data Integrity

- **Role Verification**: Permissions are strictly enforced both in the UI context and at the FastAPI route level using HTTP headers and authorization guards.
- **Duplicate Claim Protection**: Donations transition to `claimed` atomically. Duplicate claims return `409 Conflict`.
- **Delivery State Machine**: Enforces strictly: `Assigned → Accepted → Picked Up → Delivered`. Any attempt to mark a donation as delivered without being picked up is rejected.
- **Zero AI-Sanctified Safety**: The application explicitly disclaims automated image safety checks and enforces physical inspection and temperature logs under FSSAI rules.
- **No Secret Leakage**: Service-role keys are never embedded in the client.

---

## 📍 Jaipur Demo Seed Stations Included

1. **Royal Spice Kitchen & Banquets** — Statue Circle, C-Scheme (Cooked Meals, 120 Servings, Critical Urgency)
2. **The Pink Bakehouse Cafe** — Malviya Nagar Sector 3 (Bakery, 90 Servings)
3. **Jaipur Heritage Haveli** — MI Road (Cooked Meals, 85 Servings, High Urgency)
4. **Kisan Mandi Direct Market** — Mansarovar (Fresh Produce, 150 Servings)
5. **Saras Dairy Cooperative Depot** — Tonk Road (Dairy, 110 Servings, Refrigerated)
6. **Metro Wholesale Banipark** — Bani Park (Raw Groceries, 400 Servings)
7. **Green Leaf Bistro** — Vaishali Nagar (Cooked Meals, 75 Servings, Delivered)
8. **Dharohar Bhavan Cafe** — Raja Park (South Indian Hot Meals, 130 Servings)
9. **City Mall Express Mart** — MI Road (Packaged Snacks, 180 Servings)

---

## 📜 License & Compliance

Built for hackathons under the MIT License. Designed to comply with FSSAI regulations on food donation and recovery in India.
