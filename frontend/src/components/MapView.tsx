import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Donation } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Sparkles, AlertTriangle, Clock, Utensils, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { SmartMatchModal } from './SmartMatchModal';

interface MapViewProps {
  onSelectDonation?: (donation: Donation) => void;
}

export const MapView: React.FC<MapViewProps> = ({ onSelectDonation }) => {
  const { donations, claimDonation, currentUser } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filter, setFilter] = useState<'all' | 'available' | 'critical' | 'in_transit'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [smartMatchTarget, setSmartMatchTarget] = useState<Donation | null>(null);

  const filteredDonations = donations.filter((d) => {
    if (filter === 'available') return d.status === 'available';
    if (filter === 'critical') return d.urgency === 'critical' && d.status === 'available';
    if (filter === 'in_transit') return d.status === 'in_transit' || d.status === 'claimed';
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Noida (Gautam Buddha Nagar): 28.5700, 77.3500
    const map = L.map(mapContainerRef.current, {
      center: [28.5700, 77.3500],
      zoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | FoodBridge',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;

    layerGroup.clearLayers();

    filteredDonations.forEach((d) => {
      // Determine pin color
      let markerColor = '#10b981'; // emerald
      if (d.status === 'delivered') markerColor = '#64748b'; // slate
      else if (d.status === 'in_transit' || d.status === 'claimed') markerColor = '#3b82f6'; // blue
      else if (d.urgency === 'critical') markerColor = '#ef4444'; // red
      else if (d.urgency === 'high') markerColor = '#f59e0b'; // amber

      const customIcon = L.divIcon({
        className: 'custom-food-pin',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
            border: 2px solid #ffffff;
            cursor: pointer;
            position: relative;
          ">
            <span style="transform: rotate(45deg); font-size: 13px; font-weight: bold; color: #ffffff;">
              🍲
            </span>
            ${
              d.urgency === 'critical' && d.status === 'available'
                ? `<span style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #ef4444;
                    border: 2px solid #ffffff;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></span>`
                : ''
            }
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });

      const marker = L.marker([d.coordinates.lat, d.coordinates.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: ${markerColor}; font-weight: bold;">
            ${d.status.toUpperCase()} &bull; ${d.category}
          </div>
          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 700; color: #f8fafc;">
            ${d.food_name}
          </h4>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            ${d.restaurant_name} (${d.city})
          </p>
          <div style="margin: 6px 0; font-size: 11px; color: #34d399; font-weight: 600;">
            ${d.servings} Servings Available
          </div>
          <div style="font-size: 10px; color: #cbd5e1; background: #0f172a; padding: 4px 6px; border-radius: 4px; margin-top: 4px;">
            Deadline: ${new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedDonation(d);
      });

      layerGroup.addLayer(marker);
    });
  }, [filteredDonations]);

  const handleZoomToDonation = (d: Donation) => {
    setSelectedDonation(d);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([d.coordinates.lat, d.coordinates.lng], 14, {
        duration: 1.2,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Noida Food Recovery Map
          </h2>
          <p className="text-xs text-slate-400">
            Real-time geospatial distribution of surplus food donations across Noida sectors & Expressway
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({donations.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              filter === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Available ({donations.filter((d) => d.status === 'available').length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              filter === 'critical' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical (&lt;3h)
          </button>
          <button
            onClick={() => setFilter('in_transit')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              filter === 'in_transit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            In Transit / Claimed
          </button>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 relative h-[520px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Legend Floating Tag */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1.5 shadow-xl">
            <span className="font-bold text-white text-[10px] uppercase tracking-wider block border-b border-slate-700 pb-1">
              Map Key
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <span>Critical Urgency (&lt;3h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span>High Urgency (&lt;6h)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>Available Surplus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <span>Claimed / Dispatch</span>
            </div>
          </div>
        </div>

        {/* Sidebar Cards List */}
        <div className="lg:col-span-1 space-y-3 h-[520px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between pb-1">
            <span>Locations in Filter ({filteredDonations.length})</span>
            <span className="text-emerald-400 text-[11px]">Click card to fly on map</span>
          </div>

          {filteredDonations.map((d) => (
            <div
              key={d.id}
              onClick={() => handleZoomToDonation(d)}
              className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                selectedDonation?.id === d.id
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/80 border-slate-700/70 hover:bg-slate-750'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    d.status === 'available'
                      ? d.urgency === 'critical'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {d.status} &bull; {d.urgency}
                </span>
                <span className="text-emerald-400 font-bold text-xs">
                  {d.servings} Servings
                </span>
              </div>

              <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">
                {d.food_name}
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{d.address}</span>
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Due: {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSmartMatchTarget(d);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Sparkles className="w-3 h-3" />
                  Match Score
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {smartMatchTarget && (
        <SmartMatchModal
          donation={smartMatchTarget}
          onClose={() => setSmartMatchTarget(null)}
        />
      )}
    </div>
  );
};
