import React, { useState } from 'react';
import { TrendingUp, Package, ArrowUpRight, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const topProducts = [
  { rank: 1, name: 'Paracetamol 500mg', category: 'Analgesic', totalSold: 48200, revenue: '₹5.78L', growth: '+22%', stores: 380 },
  { rank: 2, name: 'Metformin 500mg', category: 'Antidiabetic', totalSold: 38600, revenue: '₹9.65L', growth: '+18%', stores: 310 },
  { rank: 3, name: 'Vitamin C 1000mg', category: 'Vitamins', totalSold: 34800, revenue: '₹6.96L', growth: '+31%', stores: 290 },
  { rank: 4, name: 'Azithromycin 250mg', category: 'Antibiotic', totalSold: 28400, revenue: '₹40.32L', growth: '+14%', stores: 220 },
  { rank: 5, name: 'Omeprazole 20mg', category: 'Antacid', totalSold: 26200, revenue: '₹5.5L', growth: '+9%', stores: 200 },
  { rank: 6, name: 'Cetirizine 10mg', category: 'Antiallergic', totalSold: 22400, revenue: '₹2.24L', growth: '+6%', stores: 186 },
  { rank: 7, name: 'Atorvastatin 10mg', category: 'Cardiac', totalSold: 18600, revenue: '₹8.37L', growth: '+11%', stores: 164 },
  { rank: 8, name: 'Ibuprofen 400mg', category: 'Analgesic', totalSold: 16300, revenue: '₹3.59L', growth: '+7%', stores: 152 },
];

const trendData = topProducts.slice(0, 6).map(p => ({
  name: p.name.split(' ')[0],
  sold: p.totalSold,
}));

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f9fafb' }
};

export default function ProductTrends() {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(topProducts.map(p => p.category))];

  const filtered = topProducts.filter(p => category === 'All' || p.category === category);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Product-Wise Trends</h1>
        <p className="section-subtitle">Track top-performing medicines platform-wide</p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 border border-violet-500/20">
          <TrendingUp className="w-8 h-8 text-violet-400 mb-2" />
          <div className="text-2xl font-black text-white">Vitamin C</div>
          <div className="text-gray-400 text-sm">Fastest growing (+31%)</div>
        </div>
        <div className="glass-card p-5 border border-emerald-500/20">
          <Package className="w-8 h-8 text-emerald-400 mb-2" />
          <div className="text-2xl font-black text-white">Paracetamol</div>
          <div className="text-gray-400 text-sm">Most units sold (48.2K)</div>
        </div>
        <div className="glass-card p-5 border border-blue-500/20">
          <ArrowUpRight className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-2xl font-black text-white">Azithromycin</div>
          <div className="text-gray-400 text-sm">Highest revenue (₹40.32L)</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Top 6 Products by Units Sold</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v.toLocaleString(), 'Units Sold']} />
            <Bar dataKey="sold" fill="url(#prodGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-violet-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Rank', 'Medicine', 'Category', 'Units Sold', 'Revenue', 'Growth', 'Stores'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(prod => (
                <tr key={prod.name} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${prod.rank <= 3 ? 'bg-violet-500/20 text-violet-400' : 'bg-white/10 text-gray-400'}`}>
                      #{prod.rank}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white font-medium">{prod.name}</td>
                  <td className="px-5 py-3"><span className="badge badge-blue">{prod.category}</span></td>
                  <td className="px-5 py-3 text-gray-300 font-medium">{prod.totalSold.toLocaleString()}</td>
                  <td className="px-5 py-3 text-emerald-400 font-bold">{prod.revenue}</td>
                  <td className="px-5 py-3 text-emerald-400 font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {prod.growth}
                  </td>
                  <td className="px-5 py-3 text-gray-300">{prod.stores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
