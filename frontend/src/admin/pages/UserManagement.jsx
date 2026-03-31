import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  Mail,
  Calendar,
  Building,
  Briefcase,
  Globe,
  Loader
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });
  const [toast, setToast] = useState({ message: '', type: null });

  const [editFormData, setEditFormData] = useState({
    username: '', email: '', enrollmentNo: '', branch: '', batch: '', userType: '',
    skills: '',
    socialLinks: { linkedin: '', github: '', leetcode: '', other: '' }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      showToast('Failed to fetch users', 'error');
    } finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username, email: user.email,
      enrollmentNo: user.enrollmentNo || '', branch: user.branch || '',
      batch: user.batch || '', userType: user.userType || 'student',
      skills: user.skills ? user.skills.join(', ') : '',
      socialLinks: {
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || '',
        leetcode: user.socialLinks?.leetcode || '',
        other: user.socialLinks?.other || ''
      }
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === selectedUser._id ? res.data : u));
      setIsEditModalOpen(false);
      showToast('User updated successfully');
    } catch (err) { showToast('Failed to update user', 'error'); }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${deleteConfirm.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== deleteConfirm.userId));
      showToast('User deleted successfully');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, userId: null }); }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const roleColors = {
    admin: 'text-accent bg-accent/10 border-accent/30',
    faculty: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    student: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    member: 'text-green-400 bg-green-500/10 border-green-500/30',
    HOD: 'text-accent-magenta bg-accent-magenta/10 border-accent-magenta/30',
    mentor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  };

  const inputCls = "w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-slate-600";
  const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white uppercase tracking-widest">User Directory</h2>
          <div className="inline-block bg-accent/10 border border-accent/20 px-4 py-1 mt-3 rounded-full">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] leading-none">Global Identity Hub</p>
          </div>
        </div>
        <div className="relative w-full lg:w-[380px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
          <input
            type="text" placeholder="Search users..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/40 transition-all text-sm text-white placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white/[0.02] rounded-3xl border border-white/5">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-accent rounded-full animate-ping opacity-20"></div>
            <Loader className="w-16 h-16 animate-spin absolute top-0 left-0 text-accent stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Fetching Directory Data...</p>
        </div>
      ) : (
        <div className="border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Member</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Academic Info</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl border border-white/10 bg-accent/10 flex items-center justify-center overflow-hidden flex-none">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-base font-bold text-accent uppercase">{user.username?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white uppercase leading-tight truncate mb-0.5">{user.username}</p>
                          <p className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
                          <Building className="w-3 h-3" /> {user.branch || "Not Assigned"}
                        </p>
                        <p className="text-[10px] text-slate-600 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Batch: {user.batch || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block border px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${roleColors[user.userType] || roleColors.student}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}
                          className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEditOpen(user)}
                          className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-accent/20 hover:text-accent hover:border-accent/30 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ isOpen: true, userId: user._id })}
                          className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-slate-600">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-[0.2em]">No Records Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Showing {Math.min((currentPage - 1) * usersPerPage + 1, filteredUsers.length)} – {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <div className="flex gap-3">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold uppercase text-slate-400 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-20">
                Prev
              </button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                className="px-5 py-2.5 border border-accent/30 rounded-xl text-xs font-bold uppercase text-accent bg-accent/10 hover:bg-accent/20 transition-all disabled:opacity-20">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="User Profile" maxWidth="max-w-2xl">
        {selectedUser && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                {selectedUser.profilePic ? <img src={selectedUser.profilePic} alt="" className="w-full h-full object-cover" /> : <p className="text-3xl font-bold text-accent uppercase">{selectedUser.username?.charAt(0)}</p>}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white uppercase">{selectedUser.username}</h2>
                <p className="text-slate-500 text-sm mt-1">{selectedUser.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className={`px-2.5 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider ${roleColors[selectedUser.userType] || roleColors.student}`}>{selectedUser.userType}</span>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400">{selectedUser.branch || 'No Branch'}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Academic Info</h3>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-500">Enrollment:</span>
                  <span className="font-bold text-white">{selectedUser.enrollmentNo || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-500">Batch:</span>
                  <span className="font-bold text-white">{selectedUser.batch || 'N/A'}</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Social Links</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.socialLinks ? Object.entries(selectedUser.socialLinks).map(([p, link]) =>
                    link && <a key={p} href={link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all capitalize">
                      <Globe className="w-3 h-3" /> {p}
                    </a>
                  ) : <p className="text-xs text-slate-600 italic">No links added.</p>}
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.skills?.length > 0 ? selectedUser.skills.map(skill =>
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-400 lowercase">{skill}</span>
                  ) : <p className="text-xs text-slate-600 italic">No skills listed.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User"
        footer={<>
          <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <button form="editUserForm" type="submit" className="px-5 py-2.5 bg-accent border border-accent/50 text-white rounded-xl text-sm font-bold hover:bg-accent/80 transition-all">Update</button>
        </>}>
        <form id="editUserForm" onSubmit={handleEditSubmit} className="p-6 space-y-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Account Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Username</label><input type="text" required value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Role</label>
                <select value={editFormData.userType} onChange={e => setEditFormData({...editFormData, userType: e.target.value})} className={inputCls + " bg-[#0a0a0a]"}>
                  {['student','member','faculty','HOD','admin','mentor'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Academic Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Enrollment No</label><input type="text" value={editFormData.enrollmentNo} onChange={e => setEditFormData({...editFormData, enrollmentNo: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Branch</label><input type="text" value={editFormData.branch} onChange={e => setEditFormData({...editFormData, branch: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Batch Year</label><input type="text" value={editFormData.batch} onChange={e => setEditFormData({...editFormData, batch: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>Skills (comma-separated)</label><input type="text" value={editFormData.skills} onChange={e => setEditFormData({...editFormData, skills: e.target.value})} className={inputCls} placeholder="React, Node, etc." /></div>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest pb-2 border-b border-white/5">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(editFormData.socialLinks).map(platform => (
                <div key={platform}><label className={labelCls}>{platform}</label>
                  <input type="text" value={editFormData.socialLinks[platform]} onChange={e => setEditFormData({...editFormData, socialLinks: {...editFormData.socialLinks, [platform]: e.target.value}})} className={inputCls} />
                </div>
              ))}
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
            <h3 className="font-bold text-lg text-white uppercase tracking-wider mb-2">Terminate Account?</h3>
            <p className="text-slate-500 mb-8 text-sm">This will permanently erase the user's account. This action is irreversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, userId: null })} className="flex-1 px-4 py-3 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 text-xs font-bold uppercase tracking-widest">Abort</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest">Execute</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent/10 border-accent/30 text-white'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} className="text-green-400" />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({message: '', type: null})} className="ml-2"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
