import React, { useState } from 'react';
import { Store, Search, CheckCircle, XCircle, Trash2, Star, MapPin, Phone, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const initial = [
  { id: 1, name: 'Apollo Pharmacy', owner: 'Rajesh Mehta', area: 'Bandra, Mumbai', phone: '+91 98765 43210', rating: 4.9, sales: 1240, revenue: '₹8.2L', active: true, verified: true, joined: '2023-06-01', medicines: 62 },
  { id: 2, name: 'MedPlus Store', owner: 'Sunita Reddy', area: 'Andheri, Mumbai', phone: '+91 87654 32109', rating: 4.7, sales: 980, revenue: '₹6.8L', active: true, verified: true, joined: '2023-07-15', medicines: 48 },
  { id: 3, name: 'Wellness Forever', owner: 'Mohan Rao', area: 'Pune, Maharashtra', phone: '+91 76543 21098', rating: 4.6, sales: 820, revenue: '₹5.4L', active: true, verified: true, joined: '2023-08-20', medicines: 55 },
  { id: 4, name: 'Life Care Pharmacy', owner: 'Sanjay Kumar', area: 'Koramangala, Bangalore', phone: '+91 65432 10987', rating: 4.3, sales: 620, revenue: '₹3.8L', active: false, verified: false, joined: '2023-10-05', medicines: 38 },
  { id: 5, name: 'City Medical Hall', owner: 'Prabhavathi S', area: 'T Nagar, Chennai', phone: '+91 54321 09876', rating: 4.1, sales: 480, revenue: '₹2.9L', active: true, verified: false, joined: '2023-11-12', medicines: 42 },
];

export default function ManageVendors() {
  const [vendors, setVendors] = useState(initial);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = vendors.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.area.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Active' ? v.active : filter === 'Verified' ? v.verified : !v.active);
    return matchSearch && matchFilter;
  });

  const toggleActive = (id) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, active: !v.active } : v));
    toast.success('Vendor status updated');
  };

  const toggleVerify = (id) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, verified: !v.verified } : v));
    toast.success('Vendor verification updated');
  };

  const deleteVendor = (id) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    toast.success('Vendor removed from platform');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Manage Vendors</h1>
        <p className="section-subtitle">Oversee all pharmacy partners on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, color: 'text-blue-400' },
          { label: 'Active', value: vendors.filter(v => v.active).length, color: 'text-emerald-400' },
          { label: 'Verified', value: vendors.filter(v => v.verified).length, color: 'text-violet-400' },
          { label: 'Pending Review', value: vendors.filter(v => !v.verified).length, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card text-center">
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, areas..." className="input-field pl-11" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Active', 'Verified', 'Inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(v => (
          <div key={v.id} className="glass-card p-5 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold">{v.name}</h3>
                  {v.verified && <span className="badge badge-blue text-xs">✓ Verified</span>}
                  <span className={`badge ${v.active ? 'badge-green' : 'badge-red'} text-xs`}>{v.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-gray-400 text-sm">Owner: {v.owner}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" /> {v.rating}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {v.area}
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Phone className="w-3.5 h-3.5 shrink-0" /> {v.phone}
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Package className="w-3.5 h-3.5 shrink-0" /> {v.medicines} medicines
              </div>
              <div className="text-emerald-400 font-bold">{v.revenue} revenue</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-xs">Joined {v.joined} • {v.sales} sales</div>
              <div className="flex gap-1.5">
                <button onClick={() => toggleVerify(v.id)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${v.verified ? 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-400' : 'bg-white/10 hover:bg-white/20 text-gray-400'}`}
                  title={v.verified ? 'Unverify' : 'Verify'}>
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(v.id)}
                  className={`p-1.5 rounded-lg transition-colors ${v.active ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'}`}
                  title={v.active ? 'Deactivate' : 'Activate'}>
                  {v.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteVendor(v.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <Store className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No vendors found</p>
        </div>
      )}
    </div>
  );
}
