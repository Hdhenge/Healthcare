import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Package, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const categories = ['All', 'Analgesic', 'Antibiotic', 'Antidiabetic', 'Cardiac', 'Antacid', 'Antiallergic'];

export default function MedicineSearch() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = medicines.filter(m => {
    const q = query.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || (m.generic && m.generic.toLowerCase().includes(q)) || (m.brand && m.brand.toLowerCase().includes(q));
    const matchCat = category === 'All' || m.category === category;
    const matchStock = stockFilter === 'All' || (stockFilter === 'In Stock' ? m.stock > 0 : m.stock === 0);
    return matchQ && matchCat && matchStock;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mr-3" />
      Searching Live Database...
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Medicine Search</h1>
        <p className="section-subtitle">Real-time availability across all connected pharmacies</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search medicines, generics, brands..."
          className="input-field pl-12 py-4 text-base shadow-lg shadow-emerald-500/5 focus:shadow-emerald-500/10"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="All">All Stock</option>
          <option value="In Stock">In Stock Only</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <p className="text-gray-500 text-sm">Found {filtered.length} matching medicines nearby</p>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((med) => (
          <div key={med.id} className="glass-card-hover p-5 border border-white/5 hover:border-emerald-500/30">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold">{med.name}</h3>
                <p className="text-gray-400 text-sm">{med.generic || 'Generic Medicine'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500 text-xs">By {med.vendorName || 'Local Pharmacy'}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500 text-xs">{med.packSize || 'Standard Pack'}</span>
                </div>
              </div>
              <span className={`badge ${med.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                {med.stock > 0 ? `${med.stock} Available` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 sm:mt-0">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-emerald-400 font-bold text-lg">₹{med.price}</div>
                <span className="badge badge-blue">{med.category}</span>
              </div>
              {med.stock > 0 ? (
                <button 
                  onClick={() => navigate('/customer/stores')}
                  className="btn-primary py-1.5 px-4 text-sm whitespace-nowrap"
                >
                  Locate Store
                </button>
              ) : (
                <button className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold border border-red-500/20" disabled>
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No results found in live inventory</p>
          <p className="text-sm mt-1">Try expanding your search criteria</p>
        </div>
      )}
    </div>
  );
}
