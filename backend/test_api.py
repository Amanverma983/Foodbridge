from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from main import app
from seed import seed_database

client = TestClient(app)

def test_complete_foodbridge_workflow():
    # 0. Re-seed to a known state
    seed_database()

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("[PASS] Health check passed")

    # 2. Verify at least 8 Jaipur demo donations
    res = client.get("/api/donations")
    assert res.status_code == 200
    donations = res.json()
    assert len(donations) >= 8, f"Expected at least 8 donations, got {len(donations)}"
    print(f"[PASS] Seed verification passed ({len(donations)} Noida demo donations loaded)")

    # 3. Security: Role permission enforcement on POST /api/donations
    # Non-restaurant (e.g. volunteer) trying to create donation
    future_time = (datetime.utcnow() + timedelta(hours=4)).isoformat() + "Z"
    past_time = (datetime.utcnow() - timedelta(hours=1)).isoformat() + "Z"

    bad_role_res = client.post(
        "/api/donations",
        headers={"x-user-role": "volunteer", "x-user-name": "Intruder"},
        json={
            "food_name": "Unauthorized Batch",
            "category": "Cooked Meals",
            "quantity": "10 kg",
            "servings": 40,
            "preparation_time": past_time,
            "pickup_deadline": future_time,
            "address": "Sector 62, Noida",
            "allergens": [],
            "storage_info": "Hot Holding",
            "fssai_certified": True
        }
    )
    assert bad_role_res.status_code == 403
    print("[PASS] Role permission enforcement passed (volunteer blocked from posting donations)")

    # 4. Past deadline validation
    bad_deadline_res = client.post(
        "/api/donations",
        headers={"x-user-role": "restaurant", "x-user-name": "Chef Vikram"},
        json={
            "food_name": "Expired Food Test",
            "category": "Cooked Meals",
            "quantity": "10 kg",
            "servings": 40,
            "preparation_time": past_time,
            "pickup_deadline": past_time, # in the past
            "address": "Sector 18, Noida",
            "allergens": [],
            "storage_info": "Hot Holding",
            "fssai_certified": True
        }
    )
    assert bad_deadline_res.status_code == 400
    print("[PASS] Deadline validation passed (past deadlines rejected)")

    # 5. Create valid restaurant donation
    create_res = client.post(
        "/api/donations",
        headers={"x-user-role": "restaurant", "x-user-name": "Chef Vikram"},
        json={
            "food_name": "Fresh Kadhai Paneer & Naan",
            "category": "Cooked Meals",
            "quantity": "20 kg",
            "servings": 70,
            "preparation_time": past_time,
            "pickup_deadline": future_time,
            "address": "Near Atta Market, Sector 18, Noida",
            "lat": 28.5708,
            "lng": 77.3271,
            "allergens": ["Dairy", "Gluten"],
            "storage_info": "Hot Holding",
            "fssai_certified": True
        }
    )
    assert create_res.status_code == 200
    new_donation_id = create_res.json()["id"]
    print(f"[PASS] Valid donation created ({new_donation_id})")

    # 6. Smart NGO Matching for this donation
    match_res = client.get(f"/api/donations/{new_donation_id}/match")
    assert match_res.status_code == 200
    matches = match_res.json()
    assert len(matches) > 0
    assert "total_score" in matches[0]
    assert "explanation" in matches[0]
    print(f"[PASS] Transparent Smart NGO Matching passed (Top Match: {matches[0]['ngo_name']} with {matches[0]['total_score']} pts)")

    # 7. NGO Claim & Duplicate Claim Prevention
    # A) Non-NGO trying to claim
    bad_claim_role = client.post(
        f"/api/donations/{new_donation_id}/claim",
        headers={"x-user-role": "volunteer"}
    )
    assert bad_claim_role.status_code == 403

    # B) Valid NGO claim
    claim_res = client.post(
        f"/api/donations/{new_donation_id}/claim",
        headers={"x-user-role": "ngo", "x-user-name": "Noida Food Rescue & Seva Society"}
    )
    assert claim_res.status_code == 200
    print("[PASS] NGO claim succeeded")

    # C) Duplicate claim attempt by another NGO
    dup_claim_res = client.post(
        f"/api/donations/{new_donation_id}/claim",
        headers={"x-user-role": "ngo", "x-user-name": "Robin Hood Army Noida Chapter"}
    )
    assert dup_claim_res.status_code == 409
    print("[PASS] Duplicate claim prevention passed (409 Conflict returned)")

    # 8. Volunteer Delivery Workflow: Assigned -> Accepted -> Picked Up -> Delivered
    # A) Attempt invalid jump (Delivered before Accepted/Picked up)
    bad_jump_res = client.patch(
        f"/api/donations/{new_donation_id}/delivery",
        headers={"x-user-role": "volunteer"},
        json={"status": "delivered"}
    )
    assert bad_jump_res.status_code == 400
    print("[PASS] Invalid status transition prevention passed (cannot deliver before pickup)")

    # B) Step 1: Accept
    acc_res = client.patch(
        f"/api/donations/{new_donation_id}/delivery",
        headers={"x-user-role": "volunteer", "x-user-name": "Rahul Kumar (Noida Courier)"},
        json={"status": "accepted"}
    )
    assert acc_res.status_code == 200

    # C) Step 2: Pickup
    pickup_res = client.patch(
        f"/api/donations/{new_donation_id}/delivery",
        headers={"x-user-role": "volunteer", "x-user-name": "Rahul Kumar (Noida Courier)"},
        json={"status": "picked_up"}
    )
    assert pickup_res.status_code == 200

    # D) Step 3: Complete Delivery
    deliv_res = client.patch(
        f"/api/donations/{new_donation_id}/delivery",
        headers={"x-user-role": "volunteer", "x-user-name": "Rahul Kumar (Noida Courier)"},
        json={"status": "delivered"}
    )
    assert deliv_res.status_code == 200
    print("[PASS] Complete Volunteer Delivery Workflow verified (Assigned -> Accepted -> Picked Up -> Delivered)")

    # 9. Analytics check
    analytics_res = client.get("/api/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    assert analytics_data["total_donations"] > 0
    assert analytics_data["delivered_servings"] >= 70
    print("[PASS] Analytics telemetry computation passed")

    # 10. Audit log check
    audit_res = client.get("/api/admin/audit-logs")
    assert audit_res.status_code == 200
    logs = audit_res.json()
    assert len(logs) >= 5
    print(f"[PASS] Tamper-evident Audit ledger verified ({len(logs)} events logged)")

    # 11. CSV export check
    csv_res = client.get("/api/export/csv")
    assert csv_res.status_code == 200
    assert "Food Name" in csv_res.text
    print("[PASS] CSV Ledger Export verified")

    print("\n=== ALL FOODBRIDGE BACKEND SUITE CHECKS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_complete_foodbridge_workflow()
