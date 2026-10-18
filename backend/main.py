import json
import math
import os
import io
import csv
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Header, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from database import get_db_connection, init_db
from seed import seed_database

app = FastAPI(
    title="FoodBridge API — Save Food, Feed People",
    description="Backend service for Noida Food Recovery Network with strict role security and audit logs",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class DonationCreate(BaseModel):
    food_name: str
    category: str
    quantity: str
    servings: int = Field(gt=0, description="Servings count must be greater than 0")
    preparation_time: str
    pickup_deadline: str
    address: str
    city: str = "Noida"
    lat: float = 28.5708
    lng: float = 77.3271
    allergens: List[str]
    storage_info: str
    image_url: Optional[str] = None
    safety_notes: Optional[str] = None
    fssai_certified: bool = True

class DeliveryStatusUpdate(BaseModel):
    status: str # 'accepted', 'picked_up', 'delivered'
    volunteer_id: Optional[str] = "user_vol_1"
    volunteer_name: Optional[str] = "Rahul Kumar (Noida Courier)"
    volunteer_phone: Optional[str] = "+91 98710 67890"

class ReportCreate(BaseModel):
    donation_id: str
    reason: str
    details: str

def calculate_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def determine_urgency(pickup_deadline_iso: str) -> str:
    try:
        deadline = datetime.fromisoformat(pickup_deadline_iso.replace("Z", "+00:00"))
        now = datetime.now(deadline.tzinfo)
        diff_hours = (deadline - now).total_seconds() / 3600.0
        if diff_hours <= 3:
            return "critical"
        elif diff_hours <= 6:
            return "high"
        elif diff_hours <= 12:
            return "medium"
        return "low"
    except Exception:
        return "medium"

@app.on_event("startup")
def startup_event():
    init_db()
    conn = get_db_connection()
    count = conn.execute("SELECT COUNT(*) FROM donations").fetchone()[0]
    conn.close()
    if count == 0:
        seed_database()

@app.get("/api")
@app.get("/api/")
def api_root():
    return {
        "service": "FoodBridge API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FoodBridge API",
        "mode": "Local SQLite Persistence / Demo Enabled",
        "city": "Noida, Uttar Pradesh",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/donations")
def list_donations(
    category: Optional[str] = None,
    status: Optional[str] = None,
    urgency: Optional[str] = None,
    q: Optional[str] = None
):
    conn = get_db_connection()
    query = "SELECT * FROM donations WHERE 1=1"
    params = []

    if category and category != "all":
        query += " AND category = ?"
        params.append(category)
    if status and status != "all":
        query += " AND status = ?"
        params.append(status)
    if urgency and urgency != "all":
        query += " AND urgency = ?"
        params.append(urgency)
    if q:
        query += " AND (food_name LIKE ? OR restaurant_name LIKE ? OR address LIKE ?)"
        wildcard = f"%{q}%"
        params.extend([wildcard, wildcard, wildcard])

    query += " ORDER BY pickup_deadline ASC"
    rows = conn.execute(query, params).fetchall()
    conn.close()

    donations = []
    for r in rows:
        d = dict(r)
        d["allergens"] = json.loads(d["allergens"]) if d["allergens"] else []
        d["coordinates"] = {"lat": d["lat"], "lng": d["lng"]}
        donations.append(d)

    return donations

@app.get("/api/donations/{donation_id}")
def get_donation(donation_id: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM donations WHERE id = ?", (donation_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Donation not found")
    d = dict(row)
    d["allergens"] = json.loads(d["allergens"]) if d["allergens"] else []
    d["coordinates"] = {"lat": d["lat"], "lng": d["lng"]}
    return d

@app.post("/api/donations")
def create_donation(
    payload: DonationCreate,
    x_user_role: Optional[str] = Header("restaurant"),
    x_user_name: Optional[str] = Header("Chef Vikram Rathore")
):
    if x_user_role not in ["restaurant", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied: Only registered commercial restaurants or platform admins may post surplus food."
        )

    if not payload.fssai_certified:
        raise HTTPException(
            status_code=400,
            detail="Mandatory FSSAI kitchen hygiene compliance certification required."
        )

    # Deadline validation
    try:
        dl = datetime.fromisoformat(payload.pickup_deadline.replace("Z", "+00:00"))
        now = datetime.now(dl.tzinfo)
        if dl <= now:
            raise HTTPException(status_code=400, detail="Pickup deadline must be in the future.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid pickup deadline ISO datetime string.")

    urgency = determine_urgency(payload.pickup_deadline)
    donation_id = f"don_{uuid.uuid4().hex[:12]}"
    created_at = datetime.utcnow().isoformat() + "Z"

    conn = get_db_connection()
    conn.execute("""
    INSERT INTO donations (
        id, food_name, category, quantity, servings, preparation_time, pickup_deadline,
        address, city, lat, lng, allergens, storage_info, image_url,
        restaurant_id, restaurant_name, restaurant_phone, status,
        delivery_status, created_at, is_demo, safety_notes, urgency
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        donation_id, payload.food_name, payload.category, payload.quantity, payload.servings,
        payload.preparation_time, payload.pickup_deadline, payload.address, payload.city,
        payload.lat, payload.lng, json.dumps(payload.allergens), payload.storage_info,
        payload.image_url, "user_rest_1", x_user_name, "+91 98290 12345",
        "available", "unassigned", created_at, 1, payload.safety_notes, urgency
    ))

    # Audit log
    audit_id = f"audit_{uuid.uuid4().hex[:12]}"
    conn.execute("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        audit_id, "DONATION_CREATED", x_user_name, x_user_role.upper(),
        f"Created donation '{payload.food_name}' ({payload.servings} servings) at {payload.address}. Urgency: {urgency.upper()}.",
        created_at
    ))

    conn.commit()
    conn.close()

    return {"success": True, "id": donation_id, "message": "Donation published to Noida NGO network."}

@app.post("/api/donations/{donation_id}/claim")
def claim_donation(
    donation_id: str,
    x_user_role: Optional[str] = Header("ngo"),
    x_user_name: Optional[str] = Header("Noida Food Rescue & Seva Society")
):
    if x_user_role not in ["ngo", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied: Only accredited NGOs or admins may claim surplus food."
        )

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM donations WHERE id = ?", (donation_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Donation not found")

    donation = dict(row)
    if donation["status"] != "available":
        claimed_by = donation.get("claimed_by_ngo_name") or "another organization"
        conn.close()
        raise HTTPException(
            status_code=409,
            detail=f"Conflict: Cannot claim. Donation is already {donation['status'].upper()} by {claimed_by}."
        )

    conn.execute("""
    UPDATE donations
    SET status = 'claimed', claimed_by_ngo_id = 'user_ngo_1', claimed_by_ngo_name = ?, delivery_status = 'assigned'
    WHERE id = ?
    """, (x_user_name, donation_id))

    audit_id = f"audit_{uuid.uuid4().hex[:12]}"
    conn.execute("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        audit_id, "DONATION_CLAIMED", x_user_name, "NGO",
        f"Claimed donation '{donation['food_name']}' from {donation['restaurant_name']}.",
        datetime.utcnow().isoformat() + "Z"
    ))

    conn.commit()
    conn.close()

    return {"success": True, "message": f"Successfully claimed for {x_user_name}!"}

@app.patch("/api/donations/{donation_id}/delivery")
def update_delivery(
    donation_id: str,
    payload: DeliveryStatusUpdate,
    x_user_role: Optional[str] = Header("volunteer"),
    x_user_name: Optional[str] = Header("Rahul Meena (City Courier)")
):
    if x_user_role not in ["volunteer", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Permission denied: Only assigned volunteers or platform admins may update transport statuses."
        )

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM donations WHERE id = ?", (donation_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Donation not found")

    current = dict(row)
    next_step = payload.status
    current_deliv = current["delivery_status"]

    # State machine enforcement: Assigned -> Accepted -> Picked Up -> Delivered
    if next_step == "accepted":
        if current["status"] != "claimed":
            conn.close()
            raise HTTPException(status_code=400, detail="Cannot accept un-claimed donation.")
        conn.execute("""
        UPDATE donations
        SET delivery_status = 'accepted', volunteer_id = ?, volunteer_name = ?, volunteer_phone = ?
        WHERE id = ?
        """, (payload.volunteer_id, payload.volunteer_name, payload.volunteer_phone, donation_id))
        action = "DELIVERY_ACCEPTED"
        details = f"Volunteer {payload.volunteer_name} accepted dispatch for '{current['food_name']}'."

    elif next_step == "picked_up":
        if current_deliv != "accepted":
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Invalid transition: Cannot pick up item when current status is '{current_deliv}'."
            )
        conn.execute("""
        UPDATE donations
        SET status = 'in_transit', delivery_status = 'picked_up'
        WHERE id = ?
        """, (donation_id,))
        action = "DELIVERY_PICKED_UP"
        details = f"Volunteer {payload.volunteer_name} confirmed pickup of '{current['food_name']}'. In transit to shelter."

    elif next_step == "delivered":
        if current_deliv != "picked_up":
            conn.close()
            raise HTTPException(
                status_code=400,
                detail=f"Invalid transition: Cannot mark delivered before picking up."
            )
        now_iso = datetime.utcnow().isoformat() + "Z"
        conn.execute("""
        UPDATE donations
        SET status = 'delivered', delivery_status = 'delivered', delivered_at = ?
        WHERE id = ?
        """, (now_iso, donation_id))
        action = "DELIVERY_DELIVERED"
        details = f"Successfully delivered '{current['food_name']}' to {current['claimed_by_ngo_name']}."

    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid delivery status. Must be accepted, picked_up, or delivered.")

    audit_id = f"audit_{uuid.uuid4().hex[:12]}"
    conn.execute("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (audit_id, action, payload.volunteer_name, "VOLUNTEER", details, datetime.utcnow().isoformat() + "Z"))

    conn.commit()
    conn.close()

    return {"success": True, "message": details}

@app.get("/api/donations/{donation_id}/match")
def smart_ngo_match(donation_id: str):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM donations WHERE id = ?", (donation_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Donation not found")
    donation = dict(row)
    ngo_rows = conn.execute("SELECT * FROM ngos").fetchall()
    conn.close()

    matches = []
    for nr in ngo_rows:
        ngo = dict(nr)
        accepted_cats = json.loads(ngo["accepted_categories"])
        dist = calculate_distance_km(donation["lat"], donation["lng"], ngo["lat"], ngo["lng"])

        explanation = []
        total_score = 0

        # 1. Distance (30 pts)
        if dist <= 3.0:
            dist_score = 30
            explanation.append(f"Ultra-close proximity ({dist} km): +30 pts")
        elif dist <= 7.0:
            dist_score = 25
            explanation.append(f"Close proximity ({dist} km): +25 pts")
        elif dist <= 12.0:
            dist_score = 15
            explanation.append(f"Moderate distance ({dist} km): +15 pts")
        else:
            dist_score = 8
            explanation.append(f"Extended delivery range ({dist} km): +8 pts")
        total_score += dist_score

        # 2. Capacity (25 pts)
        if ngo["capacity_servings"] >= donation["servings"] * 1.5:
            cap_score = 25
            explanation.append(f"Surplus capacity ({ngo['capacity_servings']} capacity vs {donation['servings']} required): +25 pts")
        elif ngo["capacity_servings"] >= donation["servings"]:
            cap_score = 20
            explanation.append(f"Full capacity fit ({ngo['capacity_servings']} capacity vs {donation['servings']} required): +20 pts")
        else:
            cap_score = 8
            explanation.append(f"Partial capacity fit: +8 pts")
        total_score += cap_score

        # 3. Category (25 pts)
        if donation["category"] in accepted_cats:
            cat_score = 25
            explanation.append(f"Preferred food category '{donation['category']}' accepted: +25 pts")
        else:
            cat_score = 0
            explanation.append(f"Category '{donation['category']}' not in primary focus: 0 pts")
        total_score += cat_score

        # 4. Urgency (20 pts)
        if donation["urgency"] == "critical":
            urg_score = 20 if dist <= 6 else 14
            explanation.append(f"Critical shelf-life (<3h deadline) rapid response capability: +{urg_score} pts")
        elif donation["urgency"] == "high":
            urg_score = 16
            explanation.append("High urgency match capability: +16 pts")
        else:
            urg_score = 12
            explanation.append("Standard pickup capability: +12 pts")
        total_score += urg_score

        matches.append({
            "ngo_id": ngo["id"],
            "ngo_name": ngo["name"],
            "total_score": min(100, round(total_score)),
            "distance_km": dist,
            "distance_score": dist_score,
            "capacity_score": cap_score,
            "category_score": cat_score,
            "urgency_score": urg_score,
            "explanation": explanation
        })

    matches.sort(key=lambda x: x["total_score"], reverse=True)
    return matches

@app.get("/api/analytics")
def get_analytics():
    conn = get_db_connection()
    donations = [dict(r) for r in conn.execute("SELECT * FROM donations").fetchall()]
    conn.close()

    total_donations = len(donations)
    total_servings = sum(d["servings"] for d in donations)
    available_servings = sum(d["servings"] for d in donations if d["status"] == "available")
    delivered_servings = sum(d["servings"] for d in donations if d["status"] == "delivered")
    delivered_count = sum(1 for d in donations if d["status"] == "delivered")
    completion_rate = round((delivered_count / total_donations * 100)) if total_donations > 0 else 0
    co2_diverted_kg = round(delivered_servings * 1.85)

    cat_map = {}
    for d in donations:
        cat_map[d["category"]] = cat_map.get(d["category"], 0) + d["servings"]
    category_distribution = [{"name": k, "value": v} for k, v in cat_map.items()]

    urg_map = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    for d in donations:
        urg_map[d["urgency"]] = urg_map.get(d["urgency"], 0) + 1
    urgency_distribution = [
        {"name": "Critical (<3h)", "value": urg_map["critical"]},
        {"name": "High (<6h)", "value": urg_map["high"]},
        {"name": "Medium (<12h)", "value": urg_map["medium"]},
        {"name": "Low (Flexible)", "value": urg_map["low"]},
    ]

    return {
        "total_donations": total_donations,
        "total_servings": total_servings,
        "available_servings": available_servings,
        "delivered_servings": delivered_servings,
        "completion_rate": completion_rate,
        "co2_diverted_kg": co2_diverted_kg,
        "category_distribution": category_distribution,
        "urgency_distribution": urgency_distribution
    }

@app.get("/api/admin/verifications")
def list_verifications():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM verifications ORDER BY submitted_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.patch("/api/admin/verifications/{verification_id}")
def update_verification(
    verification_id: str,
    status: str = Query(..., pattern="^(verified|rejected)$"),
    x_user_role: Optional[str] = Header("admin")
):
    if x_user_role != "admin":
        raise HTTPException(status_code=403, detail="Admin role required to verify organizations.")
    conn = get_db_connection()
    conn.execute("UPDATE verifications SET status = ? WHERE id = ?", (status, verification_id))
    audit_id = f"audit_{uuid.uuid4().hex[:12]}"
    conn.execute("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (audit_id, "ORGANIZATION_STATUS_UPDATE", "Admin", "ADMIN", f"Set status of {verification_id} to {status.upper()}.", datetime.utcnow().isoformat() + "Z"))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Verification status updated to {status}."}

@app.get("/api/admin/reports")
def list_reports():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM moderation_reports ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/admin/reports")
def create_report(payload: ReportCreate, x_user_name: Optional[str] = Header("User")):
    conn = get_db_connection()
    rep_id = f"rep_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.utcnow().isoformat() + "Z"
    row = conn.execute("SELECT food_name FROM donations WHERE id = ?", (payload.donation_id,)).fetchone()
    title = row[0] if row else "Unknown Donation"

    conn.execute("""
    INSERT INTO moderation_reports (id, donation_id, donation_title, reported_by, reported_by_role, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (rep_id, payload.donation_id, title, x_user_name, "USER", payload.reason, payload.details, "pending", now_iso))

    audit_id = f"audit_{int(datetime.utcnow().timestamp() * 1000)}"
    conn.execute("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (audit_id, "REPORT_SUBMITTED", x_user_name, "USER", f"Filed safety report for '{title}': {payload.reason}.", now_iso))

    conn.commit()
    conn.close()
    return {"success": True, "message": "Report logged and escalated to admin team."}

@app.get("/api/admin/audit-logs")
def list_audit_logs():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/export/csv")
def export_csv():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM donations ORDER BY created_at DESC").fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Food Name", "Category", "Quantity", "Servings", "Status",
        "Delivery Status", "Urgency", "Pickup Deadline", "Restaurant Name",
        "Claimed By NGO", "Volunteer", "Address", "Storage"
    ])
    for r in rows:
        d = dict(r)
        writer.writerow([
            d["id"], d["food_name"], d["category"], d["quantity"], d["servings"],
            d["status"], d["delivery_status"], d["urgency"], d["pickup_deadline"],
            d["restaurant_name"], d["claimed_by_ngo_name"] or "N/A",
            d["volunteer_name"] or "Unassigned", d["address"], d["storage_info"]
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=foodbridge-noida-donations.csv"}
    )

@app.post("/api/seed")
def reset_seed():
    seed_database()
    return {"success": True, "message": "Database successfully re-seeded with 9 Noida demo donations."}
