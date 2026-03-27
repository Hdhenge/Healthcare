import React, { useState } from 'react';
import { Map, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const areaData = [
  { area: 'Andheri', pincode: '400053', orders: 4820, top: 'Dengue Meds', alert: true, change: '+38%' },
  { area: 'Koramangala', pincode: '560034', orders: 3960, top: 'Antibiotics', alert: false, change: '+12%' },
  { area: 'Connaught Place', pincode: '110001', orders: 3210, top: 'Antacids', alert: false, change: '+5%' },
  { area: 'T Nagar', pincode: '600017', orders: 2880, top: 'Vitamins', alert: false, change: '+8%' },
  { area: 'Salt Lake', pincode: '700064', orders: 2340, top: 'Cardiac', alert: false, change: '+3%' },
  { area: 'Banjara Hills', pincode: '500034', orders: 1980, top: 'Antidiabetic', alert: false, change: '+7%' },
  { area: 'Viman Nagar', pincode: '411014', orders: 1640, top: 'Analgesics', alert: false, change: '+4%' },
];

const spikeMeds = [
  { medicine: 'Dengue Combo Kit', area: 'Andheri, Mumbai', spike: '+245%', reason: 'Dengue Outbreak', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { medicine: 'Azithromycin 250mg', area: 'Koramangala, Bangalore', spike: '+88%', reason: 'Seasonal Infections', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { medicine: 'ORS Packets', area: 'T Nagar, Chennai', spike: '+62%', reason: 'Summer Heat', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f9fafb' }
};

export default function AreaAnalytics() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Area-Wise Analytics</h1>
        <p className="section-subtitle">Identify demand hotspots and disease outbreaks by pin code</p>
      </div>

      {/* Outbreak Alerts */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" /> Active Demand Spikes
        </h3>
        {spikeMeds.map(spike => (
          <div key={spike.medicine} className={`p-4 border rounded-2xl ${spike.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${spike.color}`} />
                  <span className="text-white font-bold">{spike.medicine}</span>
                  <span className={`badge text-xs ${spike.color.includes('red') ? 'badge-red' : spike.color.includes('orange') ? 'badge-yellow' : 'badge-yellow'}`}>
                    {spike.spike}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-0.5">{spike.area} — {spike.reason}</p>
              </div>
              <button className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Orders by Area</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="area" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v.toLocaleString(), 'Orders']} />
            <Bar dataKey="orders" fill="url(#violetGrad)" radius={[6, 6, 0, 0]} onClick={(d) => setSelected(d.area)} />
            <defs>
              <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-bold">Area-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Area', 'Pin Code', 'Orders', 'Top Medicine', 'MoM Change', 'Alert'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {areaData.map(row => (
                <tr key={row.area} className={`hover:bg-white/5 transition-colors ${selected === row.area ? 'bg-violet-500/5' : ''}`}
                  onClick={() => setSelected(row.area)}>
                  <td className="px-5 py-3 text-white font-medium">{row.area}</td>
                  <td className="px-5 py-3"><span className="badge badge-blue">{row.pincode}</span></td>
                  <td className="px-5 py-3 text-violet-400 font-bold">{row.orders.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-300">{row.top}</td>
                  <td className="px-5 py-3 text-emerald-400 font-medium">{row.change}</td>
                  <td className="px-5 py-3">
                    {row.alert ? (
                      <span className="badge badge-red flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Outbreak
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
