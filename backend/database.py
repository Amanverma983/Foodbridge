import sqlite3
import os
import json

DB_FILE = os.path.join(os.path.dirname(__file__), "foodbridge.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Donations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS donations (
        id TEXT PRIMARY KEY,
        food_name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity TEXT NOT NULL,
        servings INTEGER NOT NULL,
        preparation_time TEXT NOT NULL,
        pickup_deadline TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        allergens TEXT NOT NULL,
        storage_info TEXT NOT NULL,
        image_url TEXT,
        restaurant_id TEXT NOT NULL,
        restaurant_name TEXT NOT NULL,
        restaurant_phone TEXT NOT NULL,
        status TEXT NOT NULL,
        claimed_by_ngo_id TEXT,
        claimed_by_ngo_name TEXT,
        volunteer_id TEXT,
        volunteer_name TEXT,
        volunteer_phone TEXT,
        delivery_status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        delivered_at TEXT,
        is_demo INTEGER DEFAULT 1,
        safety_notes TEXT,
        urgency TEXT NOT NULL
    )
    """)

    # NGOs table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ngos (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        capacity_servings INTEGER NOT NULL,
        accepted_categories TEXT NOT NULL,
        is_verified INTEGER DEFAULT 1
    )
    """)

    # Organization verifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        license_number TEXT NOT NULL,
        address TEXT NOT NULL,
        status TEXT NOT NULL,
        submitted_at TEXT NOT NULL
    )
    """)

    # Moderation reports
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS moderation_reports (
        id TEXT PRIMARY KEY,
        donation_id TEXT NOT NULL,
        donation_title TEXT NOT NULL,
        reported_by TEXT NOT NULL,
        reported_by_role TEXT NOT NULL,
        reason TEXT NOT NULL,
        details TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Audit logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        actor_name TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        details TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SQLite database initialized successfully.")
