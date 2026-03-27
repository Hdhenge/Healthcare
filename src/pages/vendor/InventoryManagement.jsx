import React, { useState } from 'react';
import { Package, Plus, ArrowUpCircle, ArrowDownCircle, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initial = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 320, minStock: 50, price: 1.2, expiry: '2025-08', supplier: 'Sun Pharma' },
  { id: 2, name: 'Azithromycin 250mg', category: 'Antibiotic', stock: 48, minStock: 30, price: 14.2, expiry: '2024-12', supplier: 'Cipla' },
  { id: 3, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 200, minStock: 40, price: 2.5, expiry: '2025-06', supplier: 'Glenmark' },
  { id: 4, name: 'Atorvastatin 10mg', category: 'Cardiac', stock: 15, minStock: 25, price: 4.5, expiry: '2024-11', supplier: 'Zydus' },
  { id: 5, name: 'Omeprazole 20mg', category: 'Antacid', stock: 180, minStock: 30, price: 2.1, expiry: '2025-03', supplier: 'Dr. Reddys' },
  { id: 6, name: 'Cetirizine 10mg', category: 'Antiallergic', stock: 240, minStock: 50, price: 1.0, expiry: '2025-09', supplier: 'Mankind' },
  { id: 7, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 60, minStock: 40, price: 8.5, expiry: '2024-08', supplier: 'Alkem' },
  { id: 8, name: 'Ibuprofen 400mg', category: 'Analgesic', stock: 8, minStock: 30, price: 2.2, expiry: '2025-01', supplier: 'Abbott' },
];

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(initial);
  const [search, setSearch] = useState('');
  const [adjustId, setAdjustId] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState('in');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Analgesic', stock: '', minStock: '', price: '', expiry: '', supplier: '' });

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const stockStatus = (item) => {
    if (item.stock === 0) return { label: 'Out of Stock', badge: 'badge-red' };
    if (item.stock < item.minStock) return { label: 'Low Stock', badge: 'badge-yellow' };
    return { label: 'In Stock', badge: 'badge-green' };
  };

  const applyAdjust = () => {
    const qty = parseInt(adjustQty);
    if (!qty || qty <= 0) { toast.error('Enter valid quantity'); return; }
    setInventory(prev => prev.map(i => {
      if (i.id === adjustId) {
        const newStock = adjustType === 'in' ? i.stock + qty : Math.max(0, i.stock - qty);
        return { ...i, stock: newStock };
      }
      return i;
    }));
    toast.success(`Stock ${adjustType === 'in' ? 'added' : 'removed'}: ${qty} units`);
    setAdjustId(null);
    setAdjustQty('');
  };

  const addItem = () => {
    if (!newItem.name || !newItem.stock) { toast.error('Fill required fields'); return; }
    setInventory(prev => [...prev, { ...newItem, id: Date.now(), stock: parseInt(newItem.stock), minStock: parseInt(newItem.minStock) || 20, price: parseFloat(newItem.price) || 0 }]);
    setNewItem({ name: '', category: 'Analgesic', stock: '', minStock: '', price: '', expiry: '', supplier: '' });
    setShowAdd(false);
    toast.success('Medicine added to inventory!');
  };

  const lowStockCount = inventory.filter(i => i.stock < i.minStock).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Inventory Management</h1>
          <p className="section-subtitle">Track stock In/Out and manage availability</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Medicine
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-white">{inventory.length}</div>
          <div className="text-gray-400 text-sm">Total Products</div>
        </div>
        <div className="glass-card p-4 text-center bg-yellow-500/5 border border-yellow-500/20">
          <div className="text-2xl font-black text-yellow-400">{lowStockCount}</div>
          <div className="text-gray-400 text-sm">Low Stock Items</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-blue-400">{inventory.reduce((s, i) => s + i.stock, 0).toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Units</div>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="glass-card p-6 border border-blue-500/30">
          <h3 className="text-white font-bold mb-4">Add New Medicine</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input value={newItem.name} onChange={e => setNewItem(f => ({ ...f, name: e.target.value }))} placeholder="Medicine Name*" className="input-field" />
            <select value={newItem.category} onChange={e => setNewItem(f => ({ ...f, category: e.target.value }))} className="input-field">
              <option>Analgesic</option><option>Antibiotic</option><option>Antidiabetic</option>
              <option>Cardiac</option><option>Antacid</option><option>Antiallergic</option><option>Other</option>
            </select>
            <input type="number" value={newItem.stock} onChange={e => setNewItem(f => ({ ...f, stock: e.target.value }))} placeholder="Current Stock*" className="input-field" />
            <input type="number" value={newItem.minStock} onChange={e => setNewItem(f => ({ ...f, minStock: e.target.value }))} placeholder="Min Stock Level" className="input-field" />
            <input type="number" value={newItem.price} onChange={e => setNewItem(f => ({ ...f, price: e.target.value }))} placeholder="Price per unit (₹)" className="input-field" />
            <input type="month" value={newItem.expiry} onChange={e => setNewItem(f => ({ ...f, expiry: e.target.value }))} placeholder="Expiry Date" className="input-field" />
            <input value={newItem.supplier} onChange={e => setNewItem(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier Name" className="input-field" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addItem} className="btn-primary flex items-center gap-2"><Check className="w-4 h-4" /> Add to Inventory</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..." className="input-field pl-11" />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Medicine', 'Category', 'Stock', 'Min Stock', 'Price', 'Expiry', 'Supplier', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(item => {
                const { label, badge } = stockStatus(item);
                const isAdjusting = adjustId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3"><span className="badge badge-blue">{item.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${item.stock < item.minStock ? 'text-yellow-400' : 'text-white'}`}>{item.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{item.minStock}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">₹{item.price}</td>
                    <td className="px-4 py-3 text-gray-300">{item.expiry}</td>
                    <td className="px-4 py-3 text-gray-400">{item.supplier}</td>
                    <td className="px-4 py-3"><span className={`badge ${badge}`}>{label}</span></td>
                    <td className="px-4 py-3">
                      {isAdjusting ? (
                        <div className="flex items-center gap-1">
                          <select value={adjustType} onChange={e => setAdjustType(e.target.value)} className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs text-white">
                            <option value="in">Stock In</option>
                            <option value="out">Stock Out</option>
                          </select>
                          <input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Qty" className="w-16 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs text-white" />
                          <button onClick={applyAdjust} className="text-emerald-400 hover:text-emerald-300 p-1"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setAdjustId(null)} className="text-gray-500 hover:text-gray-300 p-1"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => { setAdjustId(item.id); setAdjustType('in'); }} className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" title="Stock In">
                            <ArrowUpCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setAdjustId(item.id); setAdjustType('out'); }} className="p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400" title="Stock Out">
                            <ArrowDownCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setInventory(prev => prev.filter(i => i.id !== item.id)); toast.success('Removed'); }} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
