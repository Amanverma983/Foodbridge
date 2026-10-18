import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Donation,
  UserProfile,
  Role,
  NGOProfile,
  OrganizationVerification,
  ModerationReport,
  AuditLog,
  AppNotification,
  ImpactAnalytics,
  DeliveryStatus,
  UrgencyLevel,
} from '../types';
import {
  DEMO_USERS,
  DEMO_NGOS,
  SEED_DONATIONS,
  DEMO_VERIFICATIONS,
  DEMO_REPORTS,
  DEMO_AUDIT_LOGS,
} from '../data/seedData';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: Role) => void;
  isDemoMode: boolean;
  isBackendConnected: boolean;
  donations: Donation[];
  ngos: NGOProfile[];
  verifications: OrganizationVerification[];
  reports: ModerationReport[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];
  unreadCount: number;
  analytics: ImpactAnalytics;
  addDonation: (donationData: Omit<Donation, 'id' | 'created_at' | 'restaurant_id' | 'restaurant_name' | 'restaurant_phone' | 'status' | 'delivery_status' | 'is_demo' | 'urgency'>) => { success: boolean; message: string; donation?: Donation };
  claimDonation: (donationId: string) => { success: boolean; message: string };
  volunteerAcceptDelivery: (donationId: string) => { success: boolean; message: string };
  volunteerPickupDelivery: (donationId: string) => { success: boolean; message: string };
  volunteerCompleteDelivery: (donationId: string) => { success: boolean; message: string };
  submitReport: (donationId: string, reason: string, details: string) => { success: boolean; message: string };
  verifyOrganization: (verificationId: string, status: 'verified' | 'rejected') => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DONATIONS: 'foodbridge_donations_noida_v2',
  VERIFICATIONS: 'foodbridge_verifications_noida_v2',
  REPORTS: 'foodbridge_reports_noida_v2',
  AUDIT_LOGS: 'foodbridge_audit_logs_noida_v2',
  NOTIFICATIONS: 'foodbridge_notifications_noida_v2',
  USER_ROLE: 'foodbridge_active_role_v1',
};

function calculateUrgency(pickupDeadline: string): UrgencyLevel {
  const diffHours = (new Date(pickupDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
  if (diffHours <= 3) return 'critical';
  if (diffHours <= 6) return 'high';
  if (diffHours <= 12) return 'medium';
  return 'low';
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return (saved as Role) || 'restaurant';
  });

  const currentUser = DEMO_USERS[activeRole] || DEMO_USERS.restaurant;

  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return saved ? JSON.parse(saved) : SEED_DONATIONS;
    } catch {
      return SEED_DONATIONS;
    }
  });

  const [verifications, setVerifications] = useState<OrganizationVerification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      return saved ? JSON.parse(saved) : DEMO_VERIFICATIONS;
    } catch {
      return DEMO_VERIFICATIONS;
    }
  });

  const [reports, setReports] = useState<ModerationReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : DEMO_REPORTS;
    } catch {
      return DEMO_REPORTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
    } catch {
      return DEMO_AUDIT_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return [
      {
        id: 'notif_1',
        title: 'New High-Urgency Food Donation in Sector 18, Noida',
        message: 'The Grand Saffron Kitchen listed 120 servings of fresh Dal Makhani & Rotis. Pickup within 2.5 hours.',
        type: 'urgent',
        timestamp: new Date().toISOString(),
        read: false,
        linkTab: 'browse',
      },
      {
        id: 'notif_2',
        title: 'Successful Delivery in Sector 104, Noida',
        message: 'Volunteer Rahul completed delivery of 75 sandwich platters to Gautam Buddha Nagar Shelter.',
        type: 'success',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        linkTab: 'analytics',
      },
    ];
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, activeRole);
  }, [activeRole]);

  // Check backend health
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || '';
    fetch(`${apiBase}/api/health`)
      .then((res) => {
        if (res.ok) setIsBackendConnected(true);
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, []);

  const switchRole = (role: Role) => {
    setActiveRole(role);
    // Add audit log
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'ROLE_SWITCHED',
      actor_name: DEMO_USERS[role]?.name || 'User',
      actor_role: role.toUpperCase(),
      details: `Switched demo active persona to ${role.toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addDonation = (
    donationData: Omit<Donation, 'id' | 'created_at' | 'restaurant_id' | 'restaurant_name' | 'restaurant_phone' | 'status' | 'delivery_status' | 'is_demo' | 'urgency'>
  ) => {
    // 1. Role verification
    if (currentUser.role !== 'restaurant' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only registered restaurants or admins can post food donations.' };
    }

    // 2. Deadline validation
    const deadlineDate = new Date(donationData.pickup_deadline);
    if (isNaN(deadlineDate.getTime())) {
      return { success: false, message: 'Invalid pickup deadline date/time format.' };
    }
    if (deadlineDate.getTime() <= Date.now()) {
      return { success: false, message: 'Pickup deadline must be in the future.' };
    }

    // 3. Servings validation
    if (donationData.servings <= 0) {
      return { success: false, message: 'Servings must be at least 1 person.' };
    }

    const urgency = calculateUrgency(donationData.pickup_deadline);
    const newDonation: Donation = {
      ...donationData,
      id: `don_${Date.now()}`,
      created_at: new Date().toISOString(),
      restaurant_id: currentUser.id,
      restaurant_name: currentUser.organization_name || currentUser.name,
      restaurant_phone: currentUser.phone,
      status: 'available',
      delivery_status: 'unassigned',
      is_demo: true,
      urgency,
    };

    setDonations((prev) => [newDonation, ...prev]);

    // Audit Log
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'DONATION_CREATED',
      actor_name: newDonation.restaurant_name,
      actor_role: 'Restaurant',
      details: `Created donation: "${newDonation.food_name}" (${newDonation.servings} servings) at ${newDonation.address}. Urgency: ${urgency.toUpperCase()}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    // Push Notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `New Donation Available: ${newDonation.food_name}`,
      message: `${newDonation.restaurant_name} posted ${newDonation.servings} servings of ${newDonation.category}. Pickup deadline: ${new Date(newDonation.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      type: urgency === 'critical' ? 'urgent' : 'info',
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'browse',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: 'Donation created successfully!', donation: newDonation };
  };

  const claimDonation = (donationId: string) => {
    // 1. Role verification
    if (currentUser.role !== 'ngo' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only registered NGOs or admins can claim surplus food.' };
    }

    const target = donations.find((d) => d.id === donationId);
    if (!target) {
      return { success: false, message: 'Donation not found.' };
    }

    // 2. Duplicate claim prevention & State transition check
    if (target.status !== 'available') {
      return {
        success: false,
        message: `Cannot claim: This donation is already ${target.status.toUpperCase()} by ${target.claimed_by_ngo_name || 'another organization'}.`,
      };
    }

    const ngoName = currentUser.organization_name || currentUser.name;
    const updated: Donation = {
      ...target,
      status: 'claimed',
      claimed_by_ngo_id: currentUser.id,
      claimed_by_ngo_name: ngoName,
      delivery_status: 'assigned',
    };

    setDonations((prev) => prev.map((d) => (d.id === donationId ? updated : d)));

    // Audit Log
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'DONATION_CLAIMED',
      actor_name: ngoName,
      actor_role: 'NGO',
      details: `Claimed donation "${target.food_name}" (${target.servings} servings) from ${target.restaurant_name}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    // Notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Donation Claimed: ${target.food_name}`,
      message: `${ngoName} has claimed "${target.food_name}". Volunteer dispatch pending.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'deliveries',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: `Successfully claimed donation for ${ngoName}!` };
  };

  const volunteerAcceptDelivery = (donationId: string) => {
    if (currentUser.role !== 'volunteer' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only verified volunteers or admins can accept delivery dispatches.' };
    }

    const target = donations.find((d) => d.id === donationId);
    if (!target) return { success: false, message: 'Donation not found.' };

    // State transition check: Must be claimed and unassigned or assigned
    if (target.status !== 'claimed' && target.delivery_status !== 'assigned') {
      return { success: false, message: 'Donation must be claimed by an NGO before volunteer delivery can be accepted.' };
    }

    const updated: Donation = {
      ...target,
      volunteer_id: currentUser.id,
      volunteer_name: currentUser.name,
      volunteer_phone: currentUser.phone,
      delivery_status: 'accepted',
    };

    setDonations((prev) => prev.map((d) => (d.id === donationId ? updated : d)));

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'DELIVERY_ACCEPTED',
      actor_name: currentUser.name,
      actor_role: 'Volunteer',
      details: `Accepted transport route for "${target.food_name}" from ${target.restaurant_name} to ${target.claimed_by_ngo_name}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return { success: true, message: 'Delivery mission accepted! Safe travels.' };
  };

  const volunteerPickupDelivery = (donationId: string) => {
    if (currentUser.role !== 'volunteer' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only assigned volunteers or admins can confirm pickup.' };
    }

    const target = donations.find((d) => d.id === donationId);
    if (!target) return { success: false, message: 'Donation not found.' };

    if (target.delivery_status !== 'accepted') {
      return { success: false, message: `Invalid status transition: Cannot pick up when delivery is ${target.delivery_status.toUpperCase()}.` };
    }

    const updated: Donation = {
      ...target,
      status: 'in_transit',
      delivery_status: 'picked_up',
    };

    setDonations((prev) => prev.map((d) => (d.id === donationId ? updated : d)));

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'DELIVERY_PICKED_UP',
      actor_name: currentUser.name,
      actor_role: 'Volunteer',
      details: `Picked up package "${target.food_name}" from ${target.restaurant_name}. In transit to destination.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return { success: true, message: 'Package marked as Picked Up! Keep foods at recommended storage temperatures.' };
  };

  const volunteerCompleteDelivery = (donationId: string) => {
    if (currentUser.role !== 'volunteer' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only assigned volunteers or admins can mark delivery completed.' };
    }

    const target = donations.find((d) => d.id === donationId);
    if (!target) return { success: false, message: 'Donation not found.' };

    if (target.delivery_status !== 'picked_up') {
      return { success: false, message: `Invalid status transition: Package must be Picked Up first before it can be marked Delivered.` };
    }

    const updated: Donation = {
      ...target,
      status: 'delivered',
      delivery_status: 'delivered',
      delivered_at: new Date().toISOString(),
    };

    setDonations((prev) => prev.map((d) => (d.id === donationId ? updated : d)));

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'DELIVERY_DELIVERED',
      actor_name: currentUser.name,
      actor_role: 'Volunteer',
      details: `Successfully handed over "${target.food_name}" (${target.servings} servings) to ${target.claimed_by_ngo_name}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Food Delivered! ${target.servings} Servings Saved`,
      message: `${currentUser.name} successfully delivered "${target.food_name}" to ${target.claimed_by_ngo_name}.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'analytics',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: 'Delivery completed! Outstanding contribution to hunger relief.' };
  };

  const submitReport = (donationId: string, reason: string, details: string) => {
    const target = donations.find((d) => d.id === donationId);
    const newReport: ModerationReport = {
      id: `rep_${Date.now()}`,
      donation_id: donationId,
      donation_title: target ? target.food_name : 'Unknown Item',
      reported_by: currentUser.organization_name || currentUser.name,
      reported_by_role: currentUser.role.toUpperCase(),
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      action: 'REPORT_SUBMITTED',
      actor_name: currentUser.name,
      actor_role: currentUser.role.toUpperCase(),
      details: `Filed moderation report on "${newReport.donation_title}". Reason: ${reason}.`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return { success: true, message: 'Report submitted to admin team for urgent safety inspection.' };
  };

  const verifyOrganization = (verificationId: string, status: 'verified' | 'rejected') => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === verificationId ? { ...v, status } : v))
    );

    const target = verifications.find((v) => v.id === verificationId);
    if (target) {
      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        action: status === 'verified' ? 'ORGANIZATION_VERIFIED' : 'ORGANIZATION_REJECTED',
        actor_name: currentUser.name,
        actor_role: 'Admin',
        details: `${status === 'verified' ? 'Approved' : 'Rejected'} accreditation for ${target.name} (${target.type.toUpperCase()}). License: ${target.license_number}.`,
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => [log, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setDonations(SEED_DONATIONS);
    setVerifications(DEMO_VERIFICATIONS);
    setReports(DEMO_REPORTS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  };

  // Analytics computation
  const analytics: ImpactAnalytics = useMemo(() => {
    const total_donations = donations.length;
    const total_servings = donations.reduce((sum, d) => sum + d.servings, 0);
    const available_servings = donations
      .filter((d) => d.status === 'available')
      .reduce((sum, d) => sum + d.servings, 0);
    const deliveredDonations = donations.filter((d) => d.status === 'delivered');
    const delivered_servings = deliveredDonations.reduce((sum, d) => sum + d.servings, 0);
    const completion_rate =
      total_donations > 0 ? Math.round((deliveredDonations.length / total_donations) * 100) : 0;
    const active_deliveries = donations.filter(
      (d) => d.status === 'claimed' || d.status === 'in_transit'
    ).length;

    // Distinct restaurants and NGOs
    const active_restaurants = new Set(donations.map((d) => d.restaurant_name)).size;
    const active_ngos = new Set(
      donations.filter((d) => d.claimed_by_ngo_name).map((d) => d.claimed_by_ngo_name)
    ).size + 3; // base network

    const co2_diverted_kg = Math.round(delivered_servings * 1.85);

    // Category distribution
    const catMap: Record<string, number> = {};
    donations.forEach((d) => {
      catMap[d.category] = (catMap[d.category] || 0) + d.servings;
    });
    const category_distribution = Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Urgency distribution
    const urgMap: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    donations.forEach((d) => {
      urgMap[d.urgency] = (urgMap[d.urgency] || 0) + 1;
    });
    const urgency_distribution = [
      { name: 'Critical (<3h)', value: urgMap.critical },
      { name: 'High (<6h)', value: urgMap.high },
      { name: 'Medium (<12h)', value: urgMap.medium },
      { name: 'Low (Flexible)', value: urgMap.low },
    ];

    // Weekly trend
    const weekly_trend = [
      { day: 'Mon', donations: 8, servings: 640 },
      { day: 'Tue', donations: 12, servings: 920 },
      { day: 'Wed', donations: 15, servings: 1150 },
      { day: 'Thu', donations: 14, servings: 1040 },
      { day: 'Fri', donations: 18, servings: 1480 },
      { day: 'Sat', donations: 24, servings: 1950 },
      { day: 'Sun (Today)', donations: total_donations, servings: total_servings },
    ];

    return {
      total_donations,
      total_servings,
      available_servings,
      delivered_servings,
      completion_rate,
      active_deliveries,
      active_restaurants,
      active_ngos,
      co2_diverted_kg,
      category_distribution,
      urgency_distribution,
      weekly_trend,
    };
  }, [donations]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        isDemoMode: true,
        isBackendConnected,
        donations,
        ngos: DEMO_NGOS,
        verifications,
        reports,
        auditLogs,
        notifications,
        unreadCount,
        analytics,
        addDonation,
        claimDonation,
        volunteerAcceptDelivery,
        volunteerPickupDelivery,
        volunteerCompleteDelivery,
        submitReport,
        verifyOrganization,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
