export type Role = 'restaurant' | 'ngo' | 'volunteer' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Raw Groceries'
  | 'Bakery'
  | 'Dairy'
  | 'Produce'
  | 'Packaged';

export type StorageType =
  | 'Refrigerated'
  | 'Frozen'
  | 'Room Temperature'
  | 'Hot Holding';

export type Allergen =
  | 'Nuts'
  | 'Dairy'
  | 'Gluten'
  | 'Soy'
  | 'Eggs'
  | 'Shellfish'
  | 'None';

export type DonationStatus =
  | 'available'
  | 'claimed'
  | 'in_transit'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'
  | 'expired';

export type DeliveryStatus =
  | 'unassigned'
  | 'assigned'
  | 'accepted'
  | 'picked_up'
  | 'delivered';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Donation {
  id: string;
  food_name: string;
  category: FoodCategory;
  quantity: string;
  servings: number;
  preparation_time: string;
  pickup_deadline: string;
  address: string;
  city: string;
  coordinates: Coordinates;
  allergens: Allergen[];
  storage_info: StorageType;
  image_url?: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_phone: string;
  status: DonationStatus;
  claimed_by_ngo_id?: string;
  claimed_by_ngo_name?: string;
  volunteer_id?: string;
  volunteer_name?: string;
  volunteer_phone?: string;
  delivery_status: DeliveryStatus;
  created_at: string;
  delivered_at?: string;
  is_demo: boolean;
  safety_notes?: string;
  urgency: UrgencyLevel;
}

export interface NGOProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  coordinates: Coordinates;
  capacity_servings: number;
  accepted_categories: FoodCategory[];
  is_verified: boolean;
}

export interface MatchScoreBreakdown {
  ngo_id: string;
  ngo_name: string;
  total_score: number; // 0 - 100
  urgency_score: number;
  capacity_score: number;
  category_score: number;
  distance_km: number;
  distance_score: number;
  explanation: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization_name?: string;
  phone: string;
  address?: string;
  is_verified: boolean;
  avatar_url?: string;
}

export interface ModerationReport {
  id: string;
  donation_id: string;
  donation_title: string;
  reported_by: string;
  reported_by_role: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface OrganizationVerification {
  id: string;
  name: string;
  type: 'restaurant' | 'ngo';
  contact_person: string;
  email: string;
  phone: string;
  license_number: string;
  address: string;
  status: 'pending' | 'verified' | 'rejected';
  submitted_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor_name: string;
  actor_role: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface ImpactAnalytics {
  total_donations: number;
  total_servings: number;
  available_servings: number;
  delivered_servings: number;
  completion_rate: number;
  active_deliveries: number;
  active_restaurants: number;
  active_ngos: number;
  co2_diverted_kg: number;
  category_distribution: { name: string; value: number }[];
  weekly_trend: { day: string; donations: number; servings: number }[];
  urgency_distribution: { name: string; value: number }[];
}
