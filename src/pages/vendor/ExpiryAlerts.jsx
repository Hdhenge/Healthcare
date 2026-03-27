import React from 'react';
import { AlertTriangle, Calendar, Package, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const alerts = [
  { id: 1, name: 'Amoxicillin 500mg', batch: 'AMX2401', qty: 24, expiry: '2024-02-01', days: 5, category: 'Antibiotic', action: 'Return to supplier' },
  { id: 2, name: 'Insulin Glargine 100IU', batch: 'INS2402', qty: 6, expiry: '2024-02-08', days: 12, category: 'Diabetic', action: 'Sell at discount' },
  { id: 3, name: 'Cefixime 200mg', batch: 'CEF2401', qty: 60, expiry: '2024-02-28', days: 35, category: 'Antibiotic', action: 'Priority sale' },
  { id: 4, name: 'Diclofenac 50mg Gel', batch: 'DIC2403', qty: 15, expiry: '2024-03-15', days: 50, category: 'Analgesic', action: 'Monitor' },
  { id: 5, name: 'Betadine Solution', batch: 'BET2402', qty: 8, expiry: '2024-04-01', days: 67, category: 'Antiseptic', action: 'Monitor' },
];

const urgencyColor = (days) => {
  if (days <= 15) return { bar: 'bg-red-400', badge: 'badge-red', label: 'Critical', text: 'text-red-400' };
  if (days <= 45) return { bar: 'bg-yellow-400', badge: 'badge-yellow', label: 'Warning', text: 'text-yellow-400' };
  return { bar: 'bg-blue-400', badge: 'badge-blue', label: 'Monitor', text: 'text-blue-400' };
};

export default function ExpiryAlerts() {
  const critical = alerts.filter(a => a.days <= 15);
  const warning = alerts.filter(a => a.days > 15 && a.days <= 45);
  const monitor = alerts.filter(a => a.days > 45);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Expiry & Stock Alerts</h1>
        <p className="section-subtitle">Monitor medicines nearing expiry to prevent losses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Critical (≤15 days)', count: critical.length, color: 'text-red-400', bg: 'bg-red-500/10 border border-red-500/20' },
          { label: 'Warning (≤45 days)', count: warning.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border border-yellow-500/20' },
          { label: 'Monitor (>45 days)', count: monitor.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`glass-card p-5 text-center ${bg}`}>
            <div className={`text-3xl font-black ${color}`}>{count}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map(alert => {
          const cfg = urgencyColor(alert.days);
          const pct = Math.min(100, Math.round((1 - alert.days / 90) * 100));
          return (
            <div key={alert.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">{alert.name}</h3>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-0.5">
                    Batch: {alert.batch} • {alert.category} • {alert.qty} units remaining
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${cfg.text}`}>{alert.days}</div>
                  <div className="text-gray-500 text-xs">days left</div>
                </div>
              </div>

              {/* Expiry Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Time to expiry</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Expires: {alert.expiry}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Package className="w-4 h-4" />
                  Recommended: <span className="text-white font-medium ml-1">{alert.action}</span>
                </div>
                <button
                  onClick={() => toast.success(`Marked as resolved: ${alert.name}`)}
                  className="text-sm py-1.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
