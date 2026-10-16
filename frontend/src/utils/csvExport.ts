import { Donation } from '../types';

export function exportDonationsToCSV(donations: Donation[], filename = 'foodbridge-donations.csv'): void {
  const headers = [
    'ID',
    'Food Name',
    'Category',
    'Quantity',
    'Servings',
    'Status',
    'Delivery Status',
    'Urgency',
    'Pickup Deadline',
    'Preparation Time',
    'Restaurant Name',
    'Claimed By NGO',
    'Volunteer Assigned',
    'Address',
    'Storage Info',
    'Allergens',
  ];

  const rows = donations.map((d) => [
    `"${d.id}"`,
    `"${d.food_name.replace(/"/g, '""')}"`,
    `"${d.category}"`,
    `"${d.quantity.replace(/"/g, '""')}"`,
    d.servings,
    `"${d.status}"`,
    `"${d.delivery_status}"`,
    `"${d.urgency}"`,
    `"${d.pickup_deadline}"`,
    `"${d.preparation_time}"`,
    `"${d.restaurant_name.replace(/"/g, '""')}"`,
    `"${(d.claimed_by_ngo_name || 'N/A').replace(/"/g, '""')}"`,
    `"${(d.volunteer_name || 'Unassigned').replace(/"/g, '""')}"`,
    `"${d.address.replace(/"/g, '""')}"`,
    `"${d.storage_info}"`,
    `"${d.allergens.join(', ')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
