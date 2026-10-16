import json
from datetime import datetime, timedelta
from database import get_db_connection, init_db

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing demo records
    cursor.execute("DELETE FROM donations")
    cursor.execute("DELETE FROM ngos")
    cursor.execute("DELETE FROM verifications")
    cursor.execute("DELETE FROM moderation_reports")
    cursor.execute("DELETE FROM audit_logs")

    now = datetime.utcnow()
    hours_from_now = lambda h: (now + timedelta(hours=h)).isoformat() + "Z"
    hours_ago = lambda h: (now - timedelta(hours=h)).isoformat() + "Z"

    # Seed NGOs (Noida)
    ngos = [
        ("ngo_1", "Noida Food Rescue & Seva Society", "sunita@noidafoodrescue.org", "+91 98110 54321", "Sector 62, Noida", 28.6256, 77.3653, 450, json.dumps(["Cooked Meals", "Bakery", "Raw Groceries", "Dairy"]), 1),
        ("ngo_2", "Robin Hood Army Noida Chapter", "noida@robinhoodarmy.com", "+91 98111 88220", "Sector 18 Main Market, Noida", 28.5708, 77.3271, 250, json.dumps(["Cooked Meals", "Produce", "Packaged"]), 1),
        ("ngo_3", "Annamrita Foundation Noida Kendra", "annamrita@noidakendra.org", "+91 98110 44556", "Central Market, Sector 50, Noida", 28.5794, 77.3712, 600, json.dumps(["Cooked Meals", "Raw Groceries", "Produce", "Dairy", "Bakery"]), 1),
        ("ngo_4", "Gautam Buddha Nagar Bal Kalyan Shelter", "hope@gbnagarbalkalyan.org", "+91 98710 33211", "Advant Hub, Sector 137, Noida Expressway", 28.5034, 77.4048, 180, json.dumps(["Cooked Meals", "Dairy", "Bakery"]), 1),
    ]

    cursor.executemany("""
    INSERT INTO ngos (id, name, email, phone, address, lat, lng, capacity_servings, accepted_categories, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ngos)

    # Seed 9 Noida Donations
    donations = [
        (
            "demo_don_1", "Fresh Dal Makhani, Shahi Paneer & 120 Butter Rotis", "Cooked Meals",
            "30 kg (5 thermal insulated warmers)", 120, hours_ago(2), hours_from_now(2.5),
            "The Grand Saffron Kitchen, Near Atta Market, Sector 18", "Noida", 28.5708, 77.3271,
            json.dumps(["Dairy", "Gluten"]), "Hot Holding",
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
            "user_rest_1", "The Grand Saffron Kitchen & Banquets", "+91 98110 12345",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(2.2), None, 1,
            "Kept above 65°C in industrial warmers. Prepared for grand corporate luncheon with strict hygiene standards.",
            "critical"
        ),
        (
            "demo_don_2", "Artisan Whole Wheat Sourdough & Fresh Croissants", "Bakery",
            "65 fresh loaves and 40 butter croissants", 90, hours_ago(4), hours_from_now(6),
            "The Noida Bakehouse, Sector 50 Main Market", "Noida", 28.5794, 77.3712,
            json.dumps(["Gluten", "Dairy"]), "Room Temperature",
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
            "rest_noida_bake", "The Noida Bakehouse Cafe", "+91 98112 23344",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(3.8), None, 1,
            "Freshly baked today at 7 AM. Stored in sanitized food-grade paper bags.",
            "medium"
        ),
        (
            "demo_don_3", "Steamed Basmati Rice & Vegetable Mixed Pulao", "Cooked Meals",
            "22 kg", 85, hours_ago(1.5), hours_from_now(3),
            "Dhaba Heritage & Tandoor, Electronic City Metro, Sector 62", "Noida", 28.6256, 77.3653,
            json.dumps(["None"]), "Hot Holding",
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
            "rest_dhaba_62", "Dhaba Heritage Sector 62", "+91 98111 99887",
            "claimed", "ngo_1", "Noida Food Rescue & Seva Society", "user_vol_1", "Rahul Kumar (Noida Courier)", "+91 98710 67890", "accepted",
            hours_ago(2), None, 1,
            "Mild aromatic spices, completely nut-free and dairy-free.",
            "high"
        ),
        (
            "demo_don_4", "Organic Farm Fresh Tomatoes, Cucumbers & Spinach", "Produce",
            "45 kg mixed crates", 150, hours_ago(6), hours_from_now(18),
            "Kisan Mandi Direct Organic Hub, Sector 76", "Noida", 28.5670, 77.3870,
            json.dumps(["None"]), "Refrigerated",
            "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80",
            "rest_kisan_76", "Kisan Mandi Sector 76", "+91 98110 77112",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(5), None, 1,
            "Uncut, whole fresh harvest inspected by agricultural quality agent.",
            "low"
        ),
        (
            "demo_don_5", "Chilled Pasteurised Whole Milk & Fresh Paneer Cubes", "Dairy",
            "25 Litres Milk & 10 kg Paneer", 110, hours_ago(3), hours_from_now(3.5),
            "Mother Dairy Regional Depot, Sector 15 Metro Station", "Noida", 28.5833, 77.3167,
            json.dumps(["Dairy"]), "Refrigerated",
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
            "rest_dairy_15", "Mother Dairy Regional Depot", "+91 98110 11223",
            "in_transit", "ngo_1", "Noida Food Rescue & Seva Society", "user_vol_1", "Rahul Kumar (Noida Courier)", "+91 98710 67890", "picked_up",
            hours_ago(3), None, 1,
            "Chilled at 4°C continuous temperature monitored cooling van.",
            "critical"
        ),
        (
            "demo_don_6", "Sealed Whole Grain Wheat Flour & Premium Rice Sacks", "Raw Groceries",
            "100 kg (4 x 25kg factory sacks)", 400, hours_ago(24), hours_from_now(48),
            "Metro Wholesale Cash & Carry, Advant Navis, Sector 137", "Noida", 28.5034, 77.4048,
            json.dumps(["Gluten"]), "Room Temperature",
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
            "rest_metro_137", "Metro Wholesale Sector 137", "+91 98710 44559",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(12), None, 1,
            "Hermetically factory sealed bags, dry pallet storage away from moisture.",
            "low"
        ),
        (
            "demo_don_7", "Assorted Sandwich Platters & Fruit Salad Bowls", "Cooked Meals",
            "40 platters (approx 160 mini sandwiches)", 75, hours_ago(2), hours_from_now(2),
            "Green Leaf Bistro & Deli, Hazipur Market, Sector 104", "Noida", 28.5412, 77.3670,
            json.dumps(["Gluten", "Dairy"]), "Refrigerated",
            "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
            "rest_green_104", "Green Leaf Bistro Sector 104", "+91 98119 88776",
            "delivered", "ngo_4", "Gautam Buddha Nagar Bal Kalyan Shelter", "user_vol_1", "Rahul Kumar (Noida Courier)", "+91 98710 67890", "delivered",
            hours_ago(6), hours_ago(1), 1,
            "Delivered directly to children shelter cooling units within 35 minutes.",
            "critical"
        ),
        (
            "demo_don_8", "South Indian Idli, Medu Vada & Coconut Chutney", "Cooked Meals",
            "150 pieces Idli & 100 Vadas with 5L Sambhar", 130, hours_ago(1), hours_from_now(3),
            "Dharohar Traditional Cafe, Near Jaypee Greens, Sector 128", "Noida", 28.5175, 77.3688,
            json.dumps(["Nuts"]), "Hot Holding",
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
            "rest_dharohar_128", "Dharohar Bhavan Sector 128", "+91 98110 12890",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(1.2), None, 1,
            "Contains coconut in chutney. Steamed fresh hot batches in sanitized warm transport urns.",
            "high"
        ),
        (
            "demo_don_9", "Assorted Individually Wrapped Granola & Biscuit Packs", "Packaged",
            "180 snack packs", 180, hours_ago(10), hours_from_now(36),
            "Express Mart City Center, Sector 25A / Spice Mall Area", "Noida", 28.5862, 77.3415,
            json.dumps(["Nuts", "Gluten", "Soy"]), "Room Temperature",
            "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
            "rest_express_25", "Express Mart Sector 25A", "+91 98110 66554",
            "available", None, None, None, None, None, "unassigned",
            hours_ago(8), None, 1,
            "Factory packaged dry snacks with expiry in 2027. Immediate distribution ready.",
            "low"
        )
    ]

    cursor.executemany("""
    INSERT INTO donations (
        id, food_name, category, quantity, servings, preparation_time, pickup_deadline,
        address, city, lat, lng, allergens, storage_info, image_url,
        restaurant_id, restaurant_name, restaurant_phone, status,
        claimed_by_ngo_id, claimed_by_ngo_name, volunteer_id, volunteer_name, volunteer_phone,
        delivery_status, created_at, delivered_at, is_demo, safety_notes, urgency
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, donations)

    # Seed Verifications (Noida)
    verifications = [
        ("verif_1", "The Grand Saffron Kitchen & Banquets", "restaurant", "Vikram Sharma", "vikram@grandsaffronnoida.com", "+91 98110 12345", "FSSAI-12720042000512", "Sector 18, Noida", "verified", hours_ago(48)),
        ("verif_2", "Noida Food Rescue & Seva Society", "ngo", "Sunita Verma", "sunita@noidafoodrescue.org", "+91 98110 54321", "REG-UP-NGO-2022-419", "Sector 62, Noida", "verified", hours_ago(36)),
        ("verif_3", "Royal Crown Banquets", "restaurant", "Manish Gupta", "info@royalcrownnoida.com", "+91 98110 77665", "FSSAI-12721011000941", "Sector 63, Noida", "pending", hours_ago(24)),
        ("verif_4", "Gaur City Hunger Relief Action", "ngo", "Pooja Agarwal", "pooja@gaurcityrelief.org", "+91 98713 22119", "REG-UP-NGO-2024-884", "Gaur City 1, Greater Noida West", "pending", hours_ago(12)),
    ]

    cursor.executemany("""
    INSERT INTO verifications (id, name, type, contact_person, email, phone, license_number, address, status, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, verifications)

    # Seed Reports
    reports = [
        ("rep_1", "demo_don_2", "Artisan Whole Wheat Sourdough & Fresh Croissants", "Noida Food Rescue & Seva Society", "NGO", "Pickup timing clarification needed", "Bakery rear dispatch gate closes at 10 PM. Please ensure volunteer arrives before 9:30 PM.", "pending", hours_ago(1)),
        ("rep_2", "demo_don_7", "Assorted Sandwich Platters & Fruit Salad Bowls", "FoodBridge Auto-Monitor", "System", "Urgent Pickup Warning", "Donation pickup deadline was under 2 hours. Volunteer Rahul Kumar dispatched and delivered successfully.", "resolved", hours_ago(3)),
    ]

    cursor.executemany("""
    INSERT INTO moderation_reports (id, donation_id, donation_title, reported_by, reported_by_role, reason, details, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, reports)

    # Seed Audit Logs
    audit_logs = [
        ("audit_1", "DONATION_CREATED", "The Grand Saffron Kitchen & Banquets", "Restaurant", "Created donation 'Fresh Dal Makhani, Shahi Paneer & 120 Butter Rotis' (120 servings) in Sector 18. Marked Critical urgency.", hours_ago(2.2)),
        ("audit_2", "DONATION_CLAIMED", "Noida Food Rescue & Seva Society", "NGO", "Claimed donation 'Steamed Basmati Rice & Vegetable Mixed Pulao' (85 servings) in Sector 62.", hours_ago(2)),
        ("audit_3", "VOLUNTEER_ASSIGNED", "Rahul Kumar (Noida Courier)", "Volunteer", "Accepted delivery dispatch for donation 'Steamed Basmati Rice & Vegetable Mixed Pulao'.", hours_ago(1.8)),
        ("audit_4", "DELIVERY_COMPLETED", "Rahul Kumar (Noida Courier)", "Volunteer", "Marked delivery completed for 'Assorted Sandwich Platters & Fruit Salad Bowls' to Gautam Buddha Nagar Bal Kalyan Shelter.", hours_ago(1)),
        ("audit_5", "ORGANIZATION_VERIFIED", "Antigravity SuperAdmin", "Admin", "Verified FSSAI UP credentials for The Grand Saffron Kitchen & Banquets (Sector 18).", hours_ago(24)),
    ]

    cursor.executemany("""
    INSERT INTO audit_logs (id, action, actor_name, actor_role, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
    """, audit_logs)

    conn.commit()
    conn.close()
    print("Database seeded with 9 Noida donations and complete audit trail.")

if __name__ == "__main__":
    seed_database()
