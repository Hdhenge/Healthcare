import React, { useState } from 'react';
import { MapPin, Navigation, Star, Phone, Clock, Package, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const stores = [
  {
    id: 1, name: 'Sharma Medical Hall', distance: '0.3 km', rating: 4.8, reviews: 234,
    phone: '+91 98765 43210', hours: '7:00 AM - 11:00 PM', address: '12, MG Road, Andheri West',
    services: ['Pre-pack', 'Walk-in', 'Home Delivery'], status: 'Open',
    medicines: { available: 48, total: 52 },
    tag: 'Closest',
  },
  {
    id: 2, name: 'Life Care Pharmacy', distance: '0.7 km', rating: 4.5, reviews: 179,
    phone: '+91 87654 32109', hours: '8:00 AM - 10:00 PM', address: '45, SV Road, Goregaon',
    services: ['Walk-in', 'Home Delivery'], status: 'Open',
    medicines: { available: 35, total: 40 },
    tag: 'Top Rated',
  },
  {
    id: 3, name: 'MediPlus Store', distance: '1.1 km', rating: 4.3, reviews: 98,
    phone: '+91 76543 21098', hours: '9:00 AM - 9:00 PM', address: '8, DN Nagar, Andheri',
    services: ['Pre-pack', 'Walk-in'], status: 'Open',
    medicines: { available: 22, total: 30 },
    tag: null,
  },
  {
    id: 4, name: 'Apollo Pharmacy', distance: '1.8 km', rating: 4.9, reviews: 512,
    phone: '+91 65432 10987', hours: '24 Hours', address: 'Linking Road, Bandra West',
    services: ['Pre-pack', 'Walk-in', 'Home Delivery', '24/7'], status: 'Open',
    medicines: { available: 60, total: 60 },
    tag: '24/7',
  },
  {
    id: 5, name: 'Wellness Pharmacy', distance: '2.4 km', rating: 3.9, reviews: 45,
    phone: '+91 54321 09876', hours: '9:00 AM - 7:00 PM', address: '22, Hill Road, Bandra',
    services: ['Walk-in'], status: 'Closed',
    medicines: { available: 0, total: 35 },
    tag: null,
  },
];

const serviceOptions = ['All', 'Pre-pack', 'Walk-in', 'Home Delivery', '24/7'];

function StoreCard({ store, selected, onClick }) {
  const avail = Math.round((store.medicines.available / store.medicines.total) * 100);
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${selected ? 'border border-emerald-500/50 bg-emerald-500/5' : 'hover:border-white/20'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold">{store.name}</h3>
            {store.tag && (
              <span className="badge badge-green text-xs">{store.tag}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
            <MapPin className="w-3 h-3" />
            {store.address}
          </div>
        </div>
        <div className={`badge ${store.status === 'Open' ? 'badge-green' : 'badge-red'}`}>
          {store.status}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-3">
        <div className="flex items-center gap-1 text-yellow-400">
          <Star className="w-4 h-4 fill-current" /> {store.rating}
          <span className="text-gray-500">({store.reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Navigation className="w-4 h-4" /> {store.distance}
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-4 h-4" /> {store.hours}
        </div>
      </div>

      {/* Medicine availability bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Medicine Availability ({store.medicines.available}/{store.medicines.total})</span>
          <span className={avail > 70 ? 'text-emerald-400' : avail > 40 ? 'text-yellow-400' : 'text-red-400'}>{avail}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${avail > 70 ? 'bg-emerald-400' : avail > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${avail}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {store.services.map(s => (
            <span key={s} className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">{s}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs transition-colors">
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoreLocator() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState('');

  const filtered = stores.filter(s => {
    const matchFilter = filter === 'All' || s.services.includes(filter);
    const matchSearch = s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQ.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Nearby Store Locator</h1>
        <p className="section-subtitle">Find medical stores near you with real-time availability</p>
      </div>

      {/* Map Placeholder */}
      <div className="glass-card overflow-hidden h-48 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-teal-900/30" />
        <div className="z-10 text-center">
          <MapPin className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
          <p className="text-white font-semibold">Interactive Map</p>
          <p className="text-gray-400 text-sm">Geolocation API + Firebase GeoQueries</p>
          <p className="text-xs text-gray-600 mt-1">Replace with Google Maps / Mapbox component</p>
        </div>
        {/* Decorative dots */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-emerald-400/60 rounded-full animate-pulse"
            style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="Search stores by name or area..."
          className="input-field"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {serviceOptions.map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === opt
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 text-sm">
        <span className="text-gray-400">{filtered.length} stores found</span>
        <span className="text-emerald-400">• {filtered.filter(s => s.status === 'Open').length} open now</span>
      </div>

      {/* Store List */}
      <div className="space-y-4">
        {filtered.map(store => (
          <StoreCard
            key={store.id}
            store={store}
            selected={selected === store.id}
            onClick={() => setSelected(store.id === selected ? null : store.id)}
          />
        ))}
      </div>
    </div>
  );
}
