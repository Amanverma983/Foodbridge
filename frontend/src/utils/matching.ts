import { Donation, NGOProfile, MatchScoreBreakdown } from '../types';

// Haversine formula to compute distance in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function computeSmartNgoMatches(
  donation: Donation,
  ngos: NGOProfile[]
): MatchScoreBreakdown[] {
  return ngos
    .map((ngo) => {
      const explanation: string[] = [];
      let total_score = 0;

      // 1. Location & Proximity (30 points max)
      const distance = calculateDistanceKm(
        donation.coordinates.lat,
        donation.coordinates.lng,
        ngo.coordinates.lat,
        ngo.coordinates.lng
      );

      let distance_score = 0;
      if (distance <= 3.0) {
        distance_score = 30;
        explanation.push(`Ultra-close proximity (${distance} km): +30 pts`);
      } else if (distance <= 7.0) {
        distance_score = 25;
        explanation.push(`Close proximity (${distance} km): +25 pts`);
      } else if (distance <= 12.0) {
        distance_score = 15;
        explanation.push(`Moderate distance (${distance} km): +15 pts`);
      } else {
        distance_score = 8;
        explanation.push(`Extended delivery range (${distance} km): +8 pts`);
      }
      total_score += distance_score;

      // 2. Capacity Handling (25 points max)
      let capacity_score = 0;
      if (ngo.capacity_servings >= donation.servings * 1.5) {
        capacity_score = 25;
        explanation.push(
          `Surplus capacity (${ngo.capacity_servings} capacity vs ${donation.servings} required): +25 pts`
        );
      } else if (ngo.capacity_servings >= donation.servings) {
        capacity_score = 20;
        explanation.push(
          `Full capacity fit (${ngo.capacity_servings} capacity vs ${donation.servings} required): +20 pts`
        );
      } else {
        capacity_score = 8;
        explanation.push(
          `Partial capacity fit (${ngo.capacity_servings} capacity): +8 pts`
        );
      }
      total_score += capacity_score;

      // 3. Category Acceptance (25 points max)
      let category_score = 0;
      if (ngo.accepted_categories.includes(donation.category)) {
        category_score = 25;
        explanation.push(
          `Preferred food category "${donation.category}" accepted: +25 pts`
        );
      } else {
        category_score = 0;
        explanation.push(
          `Category "${donation.category}" is not in primary acceptance list: 0 pts`
        );
      }
      total_score += category_score;

      // 4. Urgency Response Readiness (20 points max)
      let urgency_score = 0;
      if (donation.urgency === 'critical') {
        urgency_score = distance <= 6 ? 20 : 14;
        explanation.push(
          `Critical shelf-life (<3h deadline) rapid response capability: +${urgency_score} pts`
        );
      } else if (donation.urgency === 'high') {
        urgency_score = 16;
        explanation.push(`High urgency match capability: +16 pts`);
      } else if (donation.urgency === 'medium') {
        urgency_score = 12;
        explanation.push(`Standard scheduled pickup capability: +12 pts`);
      } else {
        urgency_score = 10;
        explanation.push(`Flexible pickup timeline capability: +10 pts`);
      }
      total_score += urgency_score;

      // Verification bonus (sanity)
      if (ngo.is_verified) {
        explanation.push('Verified Organization Trust Badge');
      }

      return {
        ngo_id: ngo.id,
        ngo_name: ngo.name,
        total_score: Math.min(100, Math.round(total_score)),
        urgency_score,
        capacity_score,
        category_score,
        distance_km: distance,
        distance_score,
        explanation,
      };
    })
    .sort((a, b) => b.total_score - a.total_score);
}
