import React, { useState, useEffect } from 'react';
import { Package, Plus, ArrowUpCircle, ArrowDownCircle, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function InventoryManagement() {
  const { currentUser, userProfile } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjustId, setAdjustId] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState('in');
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Analgesic', stock: '', minStock: '', price: '', expiry: '', supplier: '' });

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'inventory'),
      where('vendorId', '==', currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
      setLoading(false);
    }, (err) => {
      console.error(err);
      toast.error('Failed to load inventory');
      setLoading(false);
    });

    return unsub;
  }, [currentUser]);

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const stockStatus = (item) => {
    if (item.stock === 0) return { label: 'Out of Stock', badge: 'badge-red' };
    if (item.stock < (item.minStock || 0)) return { label: 'Low Stock', badge: 'badge-yellow' };
    return { label: 'In Stock', badge: 'badge-green' };
  };

  const applyAdjust = async (item) => {
    const qty = parseInt(adjustQty);
    if (!qty || qty <= 0) { toast.error('Enter valid quantity'); return; }
    
    try {
      const newStock = adjustType === 'in' ? item.stock + qty : Math.max(0, item.stock - qty);
      await updateDoc(doc(db, 'inventory', item.id), { stock: newStock });
      toast.success(`Stock updated: ${newStock} units`);
      setAdjustId(null);
      setAdjustQty('');
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const addItem = async () => {
    if (!newItem.name || newItem.stock === '') { toast.error('Fill required fields'); return; }
    
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newItem,
        vendorId: currentUser.uid,
        vendorName: userProfile?.displayName || 'Unknown Pharmacy',
        stock: parseInt(newItem.stock),
        minStock: parseInt(newItem.minStock) || 20,
        price: parseFloat(newItem.price) || 0,
        createdAt: new Date().toISOString()
      });
      setNewItem({ name: '', category: 'Analgesic', stock: '', minStock: '', price: '', expiry: '', supplier: '' });
      setShowAdd(false);
      toast.success('Medicine added to inventory!');
    } catch (err) {
      toast.error('Failed to add medicine');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await deleteDoc(doc(db, 'inventory', id));
      toast.success('Removed');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const lowStockCount = inventory.filter(i => i.stock < (i.minStock || 20)).length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Inventory Management</h1>
          <p className="section-subtitle">Real-time stock tracking for your pharmacy</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Medicine
        </button>
      </div>

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
          <div className="text-2xl font-black text-blue-400">{inventory.reduce((s, i) => s + (i.stock || 0), 0).toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Units</div>
        </div>
      </div>

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

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..." className="input-field pl-11" />
      </div>

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
                      <span className={`font-bold ${item.stock < (item.minStock || 25) ? 'text-yellow-400' : 'text-white'}`}>{item.stock}</span>
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
                          <button onClick={() => applyAdjust(item)} className="text-emerald-400 hover:text-emerald-300 p-1"><Check className="w-4 h-4" /></button>
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
                          <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
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
          {filtered.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500 italic">No medicines found in your inventory</div>
          )}
        </div>
      </div>
    </div>
  );
}
