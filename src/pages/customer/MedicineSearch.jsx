import React, { useState } from 'react';
import { Search, Filter, MapPin, Package, ChevronDown } from 'lucide-react';

const medicines = [
  { name: 'Paracetamol 500mg', generic: 'Acetaminophen', category: 'Analgesic', price: 12, stores: 15, inStock: true, brand: 'Calpol', packSize: '10 tabs' },
  { name: 'Azithromycin 250mg', generic: 'Azithromycin', category: 'Antibiotic', price: 85, stores: 6, inStock: true, brand: 'Zithromax', packSize: '6 caps' },
  { name: 'Metformin 500mg', generic: 'Metformin HCl', category: 'Antidiabetic', price: 25, stores: 9, inStock: true, brand: 'Glycomet', packSize: '10 tabs' },
  { name: 'Atorvastatin 10mg', generic: 'Atorvastatin', category: 'Cardiac', price: 45, stores: 4, inStock: true, brand: 'Lipitor', packSize: '10 tabs' },
  { name: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'Antacid', price: 30, stores: 12, inStock: true, brand: 'Prilosec', packSize: '14 caps' },
  { name: 'Amlodipine 5mg', generic: 'Amlodipine', category: 'Cardiac', price: 18, stores: 8, inStock: false, brand: 'Norvasc', packSize: '10 tabs' },
  { name: 'Cetirizine 10mg', generic: 'Cetirizine HCl', category: 'Antiallergic', price: 10, stores: 18, inStock: true, brand: 'Zyrtec', packSize: '10 tabs' },
  { name: 'Ibuprofen 400mg', generic: 'Ibuprofen', category: 'Analgesic', price: 22, stores: 14, inStock: true, brand: 'Brufen', packSize: '10 tabs' },
  { name: 'Amoxicillin 500mg', generic: 'Amoxicillin', category: 'Antibiotic', price: 65, stores: 7, inStock: true, brand: 'Amoxil', packSize: '10 caps' },
  { name: 'Losartan 50mg', generic: 'Losartan Potassium', category: 'Cardiac', price: 38, stores: 5, inStock: false, brand: 'Cozaar', packSize: '10 tabs' },
];

const categories = ['All', 'Analgesic', 'Antibiotic', 'Antidiabetic', 'Cardiac', 'Antacid', 'Antiallergic'];

export default function MedicineSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  const filtered = medicines.filter(m => {
    const q = query.toLowerCase();
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.generic.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q);
    const matchCat = category === 'All' || m.category === category;
    const matchStock = stockFilter === 'All' || (stockFilter === 'In Stock' ? m.inStock : !m.inStock);
    return matchQ && matchCat && matchStock;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Medicine Search</h1>
        <p className="section-subtitle">Search by medicine name, generic, or brand</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search medicines, generics, brands..."
          className="input-field pl-12 py-4 text-base"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
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

      <p className="text-gray-500 text-sm">{filtered.length} medicines found</p>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((med) => (
          <div key={med.name} className="glass-card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold">{med.name}</h3>
                <p className="text-gray-400 text-sm">{med.generic}</p>
                <p className="text-gray-500 text-xs">Brand: {med.brand} • {med.packSize}</p>
              </div>
              <span className={`badge ${med.inStock ? 'badge-green' : 'badge-red'}`}>
                {med.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {med.stores} stores
                </div>
                <div className="text-emerald-400 font-bold">₹{med.price}</div>
                <span className="badge badge-blue">{med.category}</span>
              </div>
              {med.inStock && (
                <button className="btn-primary py-1.5 px-4 text-sm">
                  Find Store
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No medicines found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
