import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodCategory, StorageType, Allergen, Donation } from '../types';
import {
  PlusCircle,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  UtensilsCrossed,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SmartMatchModal } from './SmartMatchModal';

const SAMPLE_IMAGE_PRESETS = [
  {
    label: 'Cooked Curry / Meals',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Fresh Bakery & Breads',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Steamed Rice & Pulao',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Chilled Milk & Dairy',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Farm Fresh Produce',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
  },
];

export const RestaurantDashboard: React.FC = () => {
  const { currentUser, addDonation, donations } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'listings'>('create');
  const [smartMatchDonation, setSmartMatchDonation] = useState<Donation | null>(null);

  // Form State
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState('');
  const [servings, setServings] = useState<number>(50);
  const [prepTime, setPrepTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 1);
    return d.toISOString().slice(0, 16);
  });
  const [pickupDeadline, setPickupDeadline] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 4);
    return d.toISOString().slice(0, 16);
  });
  const [address, setAddress] = useState(currentUser.address || 'Sector 18, Noida, Uttar Pradesh');
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(['Dairy']);
  const [storageInfo, setStorageInfo] = useState<StorageType>('Hot Holding');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [safetyNotes, setSafetyNotes] = useState('');
  const [fssaiCertified, setFssaiCertified] = useState(true);
  const [formFeedback, setFormFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Filter donations belonging to this restaurant or all in demo
  const restaurantDonations = donations.filter(
    (d) => d.restaurant_id === currentUser.id || d.restaurant_name === currentUser.organization_name
  );

  const allAllergens: Allergen[] = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'None'];

  const toggleAllergen = (item: Allergen) => {
    if (item === 'None') {
      setSelectedAllergens(['None']);
      return;
    }
    const filtered = selectedAllergens.filter((a) => a !== 'None');
    if (filtered.includes(item)) {
      setSelectedAllergens(filtered.filter((a) => a !== item));
    } else {
      setSelectedAllergens([...filtered, item]);
    }
  };

  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!foodName.trim() || !quantity.trim() || servings <= 0) {
      setFormFeedback({ type: 'error', message: 'Please fill in all required fields accurately.' });
      return;
    }

    if (!fssaiCertified) {
      setFormFeedback({
        type: 'error',
        message: 'You must certify compliance with FSSAI sanitary norms and temperature safety.',
      });
      return;
    }

    const deadlineTimestamp = new Date(pickupDeadline).getTime();
    if (deadlineTimestamp <= Date.now()) {
      setFormFeedback({ type: 'error', message: 'Pickup deadline must be set in the future.' });
      return;
    }

    const res = addDonation({
      food_name: foodName,
      category,
      quantity,
      servings,
      preparation_time: new Date(prepTime).toISOString(),
      pickup_deadline: new Date(pickupDeadline).toISOString(),
      address,
      city: 'Noida',
      coordinates: { lat: 28.5708 + (Math.random() - 0.5) * 0.05, lng: 77.3271 + (Math.random() - 0.5) * 0.05 },
      allergens: selectedAllergens,
      storage_info: storageInfo,
      image_url: imageUrl,
      safety_notes: safetyNotes || 'Prepared hygienically in accordance with standard kitchen safety standards.',
    });

    if (res.success) {
      setFormFeedback({ type: 'success', message: 'Surplus food donation successfully published to Noida NGO network!' });
      setFoodName('');
      setQuantity('');
      setSafetyNotes('');
      setActiveSubTab('listings');
    } else {
      setFormFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Restaurant Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {currentUser.organization_name || 'Restaurant Kitchen Partner'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified FSSAI Commercial Kitchen
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch clean, unconsumed surplus food to vetted Noida shelters and community kitchens within minutes.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Donation</span>
          </button>
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'listings'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Kitchen Listings ({donations.length})</span>
          </button>
        </div>
      </div>

      {formFeedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium ${
            formFeedback.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}
        >
          {formFeedback.message}
        </div>
      )}

      {/* SUBTAB 1: POST DONATION FORM */}
      {activeSubTab === 'create' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl text-slate-200">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-700/80 mb-5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Verified Food Donation</h3>
              <p className="text-xs text-slate-400">
                Detailed specs allow smart algorithms to match with nearby Noida NGOs with adequate capacity
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateDonation} className="space-y-5 text-xs">
            {/* Row 1: Food Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  Food Item Name & Details *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Paneer Lababdar, Jeera Rice & 60 Tawa Rotis"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Food Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Raw Groceries">Raw Groceries</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Produce">Produce</option>
                  <option value="Packaged">Packaged</option>
                </select>
              </div>
            </div>

            {/* Row 2: Quantity, Servings & Storage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Physical Quantity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25 kg / 4 large insulated vessels"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Estimated Servings (Number of People) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Storage Condition *</label>
                <select
                  value={storageInfo}
                  onChange={(e) => setStorageInfo(e.target.value as StorageType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hot Holding">Hot Holding (&gt;65°C)</option>
                  <option value="Refrigerated">Refrigerated (&lt;4°C)</option>
                  <option value="Room Temperature">Room Temperature</option>
                  <option value="Frozen">Frozen (&lt;-18°C)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Timestamps (Preparation & Pickup Deadline) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Preparation Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Pickup Deadline * (Crucial for Urgency Scoring)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Row 4: Pickup Address */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Pickup Location & Gate Details *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Grand Saffron Kitchen, Near Atta Market, Sector 18, Noida"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Row 5: Allergen Tags */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Allergen Disclosures (Select all that apply) *
              </label>
              <div className="flex flex-wrap gap-2">
                {allAllergens.map((alg) => {
                  const isChecked = selectedAllergens.includes(alg);
                  return (
                    <button
                      type="button"
                      key={alg}
                      onClick={() => toggleAllergen(alg)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        isChecked
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 6: Image Selection Presets */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Optional Food Visual (Choose preset or enter custom URL)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                {SAMPLE_IMAGE_PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => setImageUrl(p.url)}
                    className={`p-1.5 rounded-lg border text-left text-[11px] transition overflow-hidden ${
                      imageUrl === p.url
                        ? 'border-emerald-400 ring-1 ring-emerald-400 bg-slate-750'
                        : 'border-slate-700 bg-slate-900/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-14 object-cover rounded mb-1" />
                    <span className="font-medium text-slate-300 truncate block">{p.label}</span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Row 7: Kitchen Hygiene Notes */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Hygiene & Handling Instructions
              </label>
              <textarea
                rows={2}
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                placeholder="e.g. Keep in sealed food-grade thermal containers. Ready for immediate serving..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Food Safety Certification Checkbox */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="fssai"
                checked={fssaiCertified}
                onChange={(e) => setFssaiCertified(e.target.checked)}
                className="mt-0.5 accent-emerald-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="fssai" className="text-slate-300 text-[11px] leading-relaxed cursor-pointer">
                <strong className="text-emerald-300 font-semibold">FSSAI Hygiene Certification: </strong>
                I hereby certify that this surplus food was cooked/stored in a licensed commercial kitchen under
                hygienic sanitary conditions, has not been touched by diners, and is fit for consumption.
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Publish Food Donation</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 2: RESTAURANT LISTINGS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Listing status across Noida network</span>
            <span className="text-emerald-400 font-semibold">{donations.length} Active & Completed Batches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-md text-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      d.status === 'delivered'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : d.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {d.status} &bull; {d.delivery_status}
                  </span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {d.servings} Servings
                  </span>
                </div>

                {d.image_url && (
                  <img
                    src={d.image_url}
                    alt={d.food_name}
                    className="w-full h-32 object-cover rounded-lg border border-slate-700/60"
                  />
                )}

                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{d.food_name}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{d.quantity}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-medium">{d.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Storage:</span>
                    <span className="font-medium text-emerald-300">{d.storage_info}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Pickup Deadline:</span>
                    <span className="font-medium text-amber-300">
                      {new Date(d.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {d.claimed_by_ngo_name && (
                    <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/50">
                      <span className="text-slate-400">Claimed By:</span>
                      <span className="font-semibold text-emerald-300">{d.claimed_by_ngo_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setSmartMatchDonation(d)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View NGO Matches</span>
                  </button>
                  <span className="text-[10px] text-slate-500">
                    Posted: {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {smartMatchDonation && (
        <SmartMatchModal
          donation={smartMatchDonation}
          onClose={() => setSmartMatchDonation(null)}
        />
      )}
    </div>
  );
};
