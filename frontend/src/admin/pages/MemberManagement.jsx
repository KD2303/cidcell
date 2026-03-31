import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
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
  Filter,
  GripVertical,
  Mail,
  Linkedin,
  Github,
  Award,
  Loader,
  SearchIcon,
  Shield
} from 'lucide-react';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    userId: '', team: 'Student Board', designation: '', domain: '',
  });

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [draggedMember, setDraggedMember] = useState(null);

  const teams = ['Student Board', 'Core Team', 'Sub-Teams'];
  const designations = ['Lead', 'Member'];
  const domains = ['Frontend','Backend','Graphic','Videography','Management','Content Writing','AI/ML','App Development','Data Science'];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [membersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/members`),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setMembers(membersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      showToast('Error fetching data', 'error');
    } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setIsEditMode(true);
      setSelectedId(member._id);
      setFormData({ userId: member.user?._id || '', team: member.team, designation: member.designation, domain: member.domain || '' });
    } else {
      setIsEditMode(false);
      setFormData({ userId: '', team: 'Student Board', designation: '', domain: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/members/${selectedId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        setMembers(members.map(m => m._id === selectedId ? res.data : m));
        showToast('Member updated successfully');
      } else {
        if (!formData.userId) return showToast('Please select a user', 'error');
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/members`, formData, { headers: { Authorization: `Bearer ${token}` } });
        setMembers([...members, res.data]);
        showToast('Member added successfully');
      }
      setIsModalOpen(false);
    } catch (err) { showToast(err.response?.data?.message || 'Operation failed', 'error'); }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/members/${deleteConfirm.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMembers(members.filter(m => m._id !== deleteConfirm.id));
      showToast('Member removed from team');
    } catch (err) { showToast('Removal failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, id: null }); }
  };

  const handleDragStart = (e, member) => { setDraggedMember(member); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const handleDrop = async (e, targetTeam, targetMemberId = null) => {
    e.preventDefault();
    if (!draggedMember) return;
    let newMembers = [...members].filter(m => m._id !== draggedMember._id);
    const updatedDraggedMember = { ...draggedMember, team: targetTeam };
    if (targetMemberId) {
      const targetIndex = newMembers.findIndex(m => m._id === targetMemberId);
      newMembers.splice(targetIndex, 0, updatedDraggedMember);
    } else { newMembers.push(updatedDraggedMember); }
    const reorderedList = [];
    teams.forEach(team => {
      const teamMembers = newMembers.filter(m => m.team === team);
      teamMembers.forEach((m, index) => reorderedList.push({ ...m, order: index }));
    });
    setMembers(reorderedList);
    setDraggedMember(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/members/reorder`, {
        memberOrders: reorderedList.map(m => ({ id: m._id, order: m.order, team: m.team }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Order saved');
    } catch (err) { showToast('Failed to save order', 'error'); fetchData(); }
  };

  const filteredMembers = members.filter(m =>
    m.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = users.filter(u =>
    !members.some(m => m.user?._id === u._id) &&
    (u.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
     u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const selectCls = "w-full p-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-accent/50 text-sm text-white transition-all";
  const inputCls = "w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent/50 transition-all placeholder:text-slate-600";
  const labelCls = "text-[10px] font-bold text-slate-500 uppercase tracking-widest";

  return (
    <div className="space-y-10 max-w-7xl mx-auto text-white pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white uppercase tracking-widest">Team Management</h1>
          <div className="inline-block bg-accent/10 border border-accent/20 px-4 py-1 mt-3 rounded-full">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] leading-none">Internal Ecosystem Oversight</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-accent/10 border border-accent/30 rounded-2xl text-white font-bold uppercase text-xs hover:bg-accent/20 transition-all flex items-center gap-2 shadow-glass"
        >
          <UserPlus size={16} /> Assign New Member
        </button>
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative group flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
          <input type="text" placeholder="Search by name, designation, team..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/40 transition-all text-sm text-white placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 px-5 py-3 rounded-2xl">
          <Filter size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">Drag to Reorder</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white/[0.02] rounded-3xl border border-white/5">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-accent rounded-full animate-ping opacity-20"></div>
            <Loader className="w-16 h-16 animate-spin absolute top-0 left-0 text-accent stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Syncing Team Records...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {teams.map(teamName => {
            const teamMembers = filteredMembers.filter(m => m.team === teamName);
            return (
              <section key={teamName} className="space-y-8" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, teamName)}>
                {/* Team Header */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <Shield size={14} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">{teamName}</h3>
                  </div>
                  <div className="flex-1 h-px bg-white/5"></div>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl uppercase tracking-widest">
                    {teamMembers.length} Members
                  </span>
                </div>

                {teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {teamMembers.map((m) => (
                      <div
                        key={m._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m)}
                        onDrop={(e) => { e.stopPropagation(); handleDrop(e, teamName, m._id); }}
                        className={`group relative bg-white/5 border border-white/10 rounded-2xl p-5 cursor-move hover:bg-white/[0.08] hover:border-white/20 transition-all ${draggedMember?._id === m._id ? 'opacity-30 border-dashed' : ''}`}
                      >
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button onClick={() => handleOpenModal(m)}
                            className="w-8 h-8 border border-white/10 rounded-xl bg-black/40 text-slate-400 hover:bg-accent/20 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center">
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ isOpen: true, id: m._id })}
                            className="w-8 h-8 border border-white/10 rounded-xl bg-black/40 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center">
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Profile */}
                        <div className="flex flex-col items-center text-center gap-3 mb-5 pt-2">
                          <div className="w-18 h-18 rounded-2xl overflow-hidden border border-white/10 bg-accent/10 shrink-0 group-hover:scale-105 transition-transform" style={{width:'72px',height:'72px'}}>
                            <img
                              src={m.user?.profilePicture || `https://ui-avatars.com/api/?name=${m.user?.username}&background=8B5CF6&color=fff`}
                              className="w-full h-full object-cover"
                              alt={m.user?.username}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white uppercase leading-tight mb-1">{m.user?.username}</h4>
                            <span className="inline-block px-2.5 py-0.5 bg-accent-magenta/10 border border-accent-magenta/30 text-accent-magenta text-[9px] font-bold uppercase tracking-widest rounded-md">
                              {m.designation}
                            </span>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1.5">{m.domain || 'Systems'}</p>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Mail size={10} /> <span className="truncate">{m.user?.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-600">
                            <Award size={10} /> Batch of {m.user?.batch || 'N/A'}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex gap-2">
                            {m.user?.socialLinks?.linkedin && (
                              <a href={m.user.socialLinks.linkedin} target="_blank" className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-[#0077b5] hover:bg-blue-500/10 transition-all">
                                <Linkedin size={12} />
                              </a>
                            )}
                            {m.user?.socialLinks?.github && (
                              <a href={m.user.socialLinks.github} target="_blank" className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                <Github size={12} />
                              </a>
                            )}
                          </div>
                          <GripVertical size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center bg-white/[0.01]">
                    <Users size={28} className="text-slate-700 mb-3" />
                    <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">No members in this team</p>
                    <button onClick={() => handleOpenModal()} className="mt-3 text-xs font-bold text-accent hover:text-accent/80 transition-colors">+ Add member</button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Update Member Role' : 'Assign New Member'}
        footer={<>
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
          <button form="memberForm" type="submit" className="px-6 py-2.5 bg-accent border border-accent/50 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/80 transition-all">
            {isEditMode ? 'Save Changes' : 'Confirm'}
          </button>
        </>}>
        <form id="memberForm" onSubmit={handleSubmit} className="p-6 space-y-6">
          {!isEditMode && (
            <div className="space-y-3">
              <label className={labelCls + " flex items-center gap-2"}><SearchIcon size={12} /> Select User</label>
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                <div className="p-3 bg-black/40 border-b border-white/5">
                  <input type="text" placeholder="Search by name or email..." value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="bg-transparent text-sm outline-none w-full text-white placeholder:text-slate-600" />
                </div>
                <div className="max-h-52 overflow-y-auto divide-y divide-white/5">
                  {availableUsers.length > 0 ? availableUsers.map(u => (
                    <div key={u._id} onClick={() => setFormData({...formData, userId: u._id})}
                      className={`p-4 text-sm flex items-center justify-between cursor-pointer transition-all ${formData.userId === u._id ? 'bg-accent/10 border-l-2 border-accent' : 'hover:bg-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center overflow-hidden">
                          {u.profilePicture ? <img src={u.profilePicture} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-accent">{u.username?.[0]}</span>}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.username}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      {formData.userId === u._id && <CheckCircle size={16} className="text-accent" />}
                    </div>
                  )) : <div className="p-8 text-center text-slate-600 text-sm">No available users found.</div>}
                </div>
              </div>
            </div>
          )}

          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Team</label>
              <select value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} className={selectCls + " bg-[#0a0a0a]"}>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Designation</label>
              <select required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className={selectCls + " bg-[#0a0a0a]"}>
                <option value="" disabled>Select Designation</option>
                {designations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Domain</label>
              <select value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className={selectCls + " bg-[#0a0a0a]"}>
                <option value="" disabled>Select Domain</option>
                {domains.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-white uppercase tracking-wider mb-2">Remove Member?</h3>
            <p className="text-slate-500 mb-8 text-sm">This will remove the member from all team records. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-3 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 text-xs font-bold uppercase tracking-widest">Abort</button>
              <button onClick={handleRemove} className="flex-1 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest">Confirm</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-sm font-bold ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent/10 border-accent/30 text-white'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} className="text-green-400" />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({message: '', type: null})} className="ml-2"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
