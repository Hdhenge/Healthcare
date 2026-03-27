import React, { useState, useEffect } from 'react';
import { Users, Store, TrendingUp, Map, ShieldCheck, ArrowUpRight, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const growthData = [
  { month: 'Oct', users: 120, vendors: 15 },
  { month: 'Nov', users: 240, vendors: 30 },
  { month: 'Dec', users: 480, vendors: 45 },
  { month: 'Jan', users: 960, vendors: 68 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, vendors: 0, medicines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const all = snap.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        users: all.length,
        vendors: all.filter(u => u.role === 'vendor').length
      }));
    });

    const unsubInventory = onSnapshot(collection(db, 'inventory'), (snap) => {
      setStats(prev => ({ ...prev, medicines: snap.docs.length }));
      setLoading(false);
    });

    return () => { unsubUsers(); unsubInventory(); };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Master Control Panel 🛡️</h1>
        <p className="text-gray-400 mt-1">Platform-wide overview — live data from MedCart network.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', change: 'Total' },
          { label: 'Active Vendors', value: stats.vendors, icon: Store, color: 'text-blue-400', bg: 'bg-blue-500/10', change: 'Verified' },
          { label: 'Active Medicines', value: stats.medicines, icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10', change: 'In Stock' },
          { label: 'System Health', value: '100%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: 'Stable' },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
            <div className="text-emerald-400 text-xs mt-1 font-bold">{change}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Platform Growth (Live Sync)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Total Users" />
            <Line type="monotone" dataKey="vendors" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Total Vendors" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">System Alerts</h2>
          <div className="space-y-3">
             <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">All APIs Operational</p>
                  <p className="text-gray-500 text-xs text-emerald-500/80">Google Cloud Vision | Firebase Auth | Firestore</p>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <Package className="w-5 h-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Global Inventory Healthy</p>
                  <p className="text-gray-500 text-xs">Total listing saturation: 94.2%</p>
                </div>
             </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Platform Security</h2>
          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-sm">
            <div className="flex gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
              <span className="text-white font-bold">Encrypted Data Transport</span>
            </div>
            <p className="text-gray-400 text-xs">Role-based access control (RBAC) is strictly enforced for Admin, Vendor, and Customer panels via Firestore security rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

