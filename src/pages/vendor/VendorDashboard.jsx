import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, IndianRupee, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const salesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 3900 },
  { day: 'Thu', sales: 7200 },
  { day: 'Fri', sales: 8100 },
  { day: 'Sat', sales: 9600 },
  { day: 'Sun', sales: 6400 },
];

export default function VendorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'inventory'), where('vendorId', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setInventory(snap.docs.map(doc => doc.data()));
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  const totalUnits = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
  const lowStockItems = inventory.filter(item => item.stock < (item.minStock || 20));
  const totalRevenue = inventory.reduce((sum, item) => sum + ((item.stock || 0) * (item.price || 0)), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Welcome, {currentUser?.displayName?.split(' ')[0]} 🏪</h1>
        <p className="text-gray-400 mt-1">Real-time pharmacy performance overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Estimated Value", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, change: 'Live', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Total Products', value: inventory.length, icon: Package, change: '+0%', up: true, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Total Units', value: totalUnits.toLocaleString(), icon: BarChart3, change: '-0%', up: false, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Alerts', value: lowStockItems.length, icon: AlertTriangle, change: 'Stock', up: false, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, change, up, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${up ? 'text-emerald-400' : 'text-orange-400'}`}>
              {change}
            </div>
          </div>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-bold">Action Required: {lowStockItems.length} items low on stock</span>
          </div>
          <button onClick={() => navigate('/vendor/inventory')} className="text-sm text-orange-400 hover:text-orange-300 underline">Update Inventory Now →</button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Weekly Sales Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Inventory Composition</h2>
          <div className="space-y-3">
            {inventory.slice(0, 5).map((med, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300 truncate mr-2">{med.name}</span>
                  <span className="text-blue-400 font-bold">{med.stock} units</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (med.stock / 100) * 100)}%` }} />
                </div>
              </div>
            ))}
            {inventory.length === 0 && <p className="text-gray-600 text-center py-10 italic">No inventory data to display</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

