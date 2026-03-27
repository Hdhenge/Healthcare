import React, { useState } from 'react';
import { Users, Search, Trash2, CheckCircle, XCircle, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const initial = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', joined: '2024-01-05', active: true, orders: 12, reminders: 3 },
  { id: 2, name: 'Rahul Gupta', email: 'rahul@email.com', phone: '+91 87654 32109', joined: '2024-01-08', active: true, orders: 7, reminders: 1 },
  { id: 3, name: 'Ananya Iyer', email: 'ananya@email.com', phone: '+91 76543 21098', joined: '2024-01-10', active: false, orders: 3, reminders: 2 },
  { id: 4, name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 65432 10987', joined: '2024-01-12', active: true, orders: 18, reminders: 5 },
  { id: 5, name: 'Meera Nair', email: 'meera@email.com', phone: '+91 54321 09876', joined: '2024-01-15', active: true, orders: 9, reminders: 0 },
  { id: 6, name: 'Aditya Kumar', email: 'aditya@email.com', phone: '+91 43210 98765', joined: '2024-01-18', active: false, orders: 1, reminders: 1 },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Active' ? u.active : !u.active);
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    toast.success('User status updated');
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User removed');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Manage Users</h1>
        <p className="section-subtitle">View and manage all registered patients/customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-violet-400">{users.length}</div>
          <div className="text-gray-400 text-sm">Total Users</div>
        </div>
        <div className="glass-card p-4 text-center bg-emerald-500/5 border border-emerald-500/20">
          <div className="text-2xl font-black text-emerald-400">{users.filter(u => u.active).length}</div>
          <div className="text-gray-400 text-sm">Active Users</div>
        </div>
        <div className="glass-card p-4 text-center bg-red-500/5 border border-red-500/20">
          <div className="text-2xl font-black text-red-400">{users.filter(u => !u.active).length}</div>
          <div className="text-gray-400 text-sm">Inactive Users</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-11" />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-violet-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['User', 'Contact', 'Joined', 'Orders', 'Reminders', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-gray-300 text-xs">{user.email}</div>
                    <div className="text-gray-500 text-xs">{user.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{user.joined}</td>
                  <td className="px-5 py-3 text-gray-300">{user.orders}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-orange-400">
                      <Bell className="w-3.5 h-3.5" /> {user.reminders}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(user.id)}
                        className={`p-1.5 rounded-lg transition-colors ${user.active ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'}`}
                        title={user.active ? 'Deactivate' : 'Activate'}>
                        {user.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
