import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  UserPlus, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Shield,
  Layout,
  Layers,
  ExternalLink,
  SearchIcon,
  Filter
} from 'lucide-react';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]); // All registered users
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    team: 'Student Board',
    designation: '',
    domain: '',
    order: 0
  });

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const teams = ['Student Board', 'Core Team', 'Sub-Teams'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [membersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/members`),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setMembers(membersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setIsEditMode(true);
      setSelectedId(member._id);
      setFormData({
        userId: member.user?._id || '',
        team: member.team,
        designation: member.designation,
        domain: member.domain || '',
        order: member.order || 0
      });
    } else {
      setIsEditMode(false);
      setFormData({
        userId: '',
        team: 'Student Board',
        designation: '',
        domain: '',
        order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/members/${selectedId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(members.map(m => m._id === selectedId ? res.data : m));
        showToast('Member updated successfully');
      } else {
        if (!formData.userId) return showToast('Please select a user', 'error');
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/members`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers([...members, res.data]);
        showToast('Member added successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/members/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(members.filter(m => m._id !== deleteConfirm.id));
      showToast('Member removed from team');
    } catch (err) {
      showToast('Removal failed', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const filteredMembers = members.filter(m => 
    m.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = users.filter(u => 
    !members.some(m => m.user?._id === u._id) &&
    (u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Member Management</h1>
          <p className="text-slate-500 text-sm">Organize CID Cell structure and roles.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-black transition-all"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded w-full text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
             <Filter size={14} />
             <span>Team View: All</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-xs font-bold text-slate-500 uppercase">
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Team</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredMembers.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <img 
                        src={m.user?.profilePicture || 'https://via.placeholder.com/40'} 
                        className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                        alt=""
                       />
                       <div>
                         <div className="font-bold text-slate-900">{m.user?.username}</div>
                         <div className="text-[10px] text-slate-400 uppercase font-black">{m.user?.batch} Team</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.team === 'Student Board' ? 'bg-purple-100 text-purple-700' :
                      m.team === 'Core Team' ? 'bg-highlight-blue/20 text-blue-700' :
                      'bg-highlight-teal/20 text-teal-700'
                    }`}>
                      {m.team}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{m.designation}</div>
                    {m.domain && <div className="text-[10px] text-slate-400 uppercase">{m.domain}</div>}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        {m.user?.socialLinks?.linkedin && (
                          <a href={m.user.socialLinks.linkedin} target="_blank" className="text-blue-600 hover:text-blue-800"><ExternalLink size={14} /></a>
                        )}
                        {m.user?.socialLinks?.github && (
                          <a href={m.user.socialLinks.github} target="_blank" className="text-slate-800 hover:text-black"><ExternalLink size={14} /></a>
                        )}
                        <span className="text-slate-400 text-xs truncate max-w-[100px]">{m.user?.email}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(m)} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ isOpen: true, id: m._id })} 
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">{isEditMode ? 'Update Role' : 'Assign New Member'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-6">
                {!isEditMode && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Registered User</label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                       <div className="p-2 bg-slate-50 border-b flex items-center gap-2">
                          <SearchIcon size={14} className="text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Type to filter users..." 
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="bg-transparent text-xs outline-none w-full"
                          />
                       </div>
                       <div className="max-h-40 overflow-y-auto divide-y">
                          {availableUsers.map(u => (
                            <div 
                              key={u._id}
                              onClick={() => setFormData({...formData, userId: u._id})}
                              className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${formData.userId === u._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50'}`}
                            >
                               <div className="flex items-center gap-2">
                                  <img src={u.profilePicture || 'https://via.placeholder.com/30'} className="w-6 h-6 rounded-full" />
                                  <span className="font-bold">{u.username}</span>
                               </div>
                               <span className="text-slate-400">{u.email}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team</label>
                    <select 
                      value={formData.team} 
                      onChange={e => setFormData({...formData, team: e.target.value})} 
                      className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      {teams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort Order</label>
                    <input 
                      type="number" 
                      value={formData.order} 
                      onChange={e => setFormData({...formData, order: e.target.value})} 
                      className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Designation (e.g. Chairman, Technical Lead)*</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.designation} 
                    onChange={e => setFormData({...formData, designation: e.target.value})} 
                    placeholder="Official role title"
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain Group (e.g. Backend, UI/UX, AI/ML)</label>
                  <input 
                    type="text" 
                    value={formData.domain} 
                    onChange={e => setFormData({...formData, domain: e.target.value})} 
                    placeholder="Specific area of focus"
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 uppercase tracking-widest">
                  {isEditMode ? 'Update' : 'Confirm Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertTriangle size={32} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Remove Member</h3>
            <p className="text-slate-500 mb-8 text-sm">This will remove the user from the organization chart. Their user account will NOT be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors uppercase text-xs">Cancel</button>
              <button onClick={handleRemove} className="flex-1 p-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 uppercase text-xs">Remove</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div className={`fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-[70] text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-slate-900'}`}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} className="text-green-400" />}
          <p className="text-sm font-bold uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
