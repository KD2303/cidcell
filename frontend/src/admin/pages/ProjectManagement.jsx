import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Github,
  ExternalLink,
  PlusCircle,
  Folder
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [allProjects, setAllProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  useEffect(() => { fetchData(); }, []);

  const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.projects)) return data.projects;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        axios.get(`${API}/projects/all`, authHeaders()),
        axios.get(`${API}/projects/review/admin`, authHeaders()),
      ]);
      setAllProjects(toArray(allRes.data));
      setPendingProjects(toArray(pendingRes.data));
    } catch (err) {
      showToast('Failed to fetch project data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminReview = async (projectId, action) => {
    try {
      await axios.patch(`${API}/projects/${projectId}/admin-review`, {
        action, feedback: feedback[projectId] || '',
      }, authHeaders());
      showToast(`Project ${action === 'approve' ? 'approved' : 'rejected'}!`);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Review failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`, authHeaders());
      showToast('Project deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const filteredAll = Array.isArray(allProjects)
    ? allProjects.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const statusGlow = {
    active: 'text-green-400 bg-green-500/10 border-green-500/30',
    pending_admin_approval: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/30',
    completed: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    draft: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <div className="space-y-10 pb-8 text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white uppercase tracking-widest leading-tight">Project Registry</h1>
          <div className="inline-block bg-accent/10 border border-accent/20 px-4 py-1 mt-3 rounded-full">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] leading-none">Ecosystem Oversight Hub</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects/submit')}
          className="flex items-center gap-3 px-6 py-3 bg-accent/10 border border-accent/30 rounded-2xl text-white font-bold uppercase text-xs hover:bg-accent/20 hover:border-accent/50 transition-all w-fit shadow-glass"
        >
          <PlusCircle size={18} /> Add New Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-xs font-bold uppercase rounded-2xl transition-all flex items-center gap-3 border ${
            activeTab === 'pending'
              ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
              : 'border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Clock size={16} /> Review Queue ({pendingProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 text-xs font-bold uppercase rounded-2xl transition-all flex items-center gap-3 border ${
            activeTab === 'all'
              ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]'
              : 'border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Folder size={16} /> Registry Master ({allProjects.length})
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-accent rounded-full animate-ping opacity-20"></div>
            <Loader className="w-16 h-16 animate-spin absolute top-0 left-0 text-accent stroke-[1.5]" />
          </div>
          <div className="bg-accent/10 border border-accent/20 px-6 py-2 rounded-full">
            <p className="text-xs font-bold text-accent uppercase tracking-[0.3em]">Syncing Registry...</p>
          </div>
        </div>
      ) : activeTab === 'pending' ? (
        /* Pending Review */
        <div className="space-y-6 p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
          {pendingProjects.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <CheckCircle size={56} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Queue Fully Purged</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {pendingProjects.map(project => (
                <div key={project._id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 pb-6 border-b border-white/5">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white uppercase leading-tight">{project.title}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg tracking-widest">
                          Awaiting Oversight
                        </span>
                        <span className="px-3 py-1 text-[10px] font-bold uppercase text-accent bg-accent/10 border border-accent/30 rounded-lg tracking-widest">
                          {project.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4 mb-6">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-3">Architect Identity</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent text-sm uppercase">
                        {project.createdBy?.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase">{project.createdBy?.username}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{project.createdBy?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.githubRepo && (
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                        <Github size={14} /> Codebase
                      </a>
                    )}
                    {project.deployedLink && (
                      <a href={project.deployedLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>

                  <div className="space-y-4">
                    <textarea
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-sm text-white outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all min-h-[100px] placeholder:text-slate-600"
                      placeholder="Admin feedback / modification notes..."
                      value={feedback[project._id] || ''}
                      onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => handleAdminReview(project._id, 'approve')}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 font-bold uppercase text-xs hover:bg-green-500/20 transition-all"
                      >
                        <CheckCircle size={18} /> Authorize
                      </button>
                      <button
                        onClick={() => handleAdminReview(project._id, 'reject')}
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-bold uppercase text-xs hover:bg-red-500/20 transition-all"
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Projects */
        <div className="space-y-8">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search project repository..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all text-sm text-white placeholder:text-slate-600"
            />
          </div>

          <div className="border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Project</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lead Dev</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAll.map(project => (
                    <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-white uppercase leading-tight">{project.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 text-[9px] font-bold uppercase bg-white/5 border border-white/10 text-slate-400 rounded-lg tracking-widest">
                          {project.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center text-[8px] font-bold text-accent uppercase">
                            {project.createdBy?.username?.charAt(0) || "U"}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{project.createdBy?.username || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-lg border text-[9px] font-bold uppercase ${statusGlow[project.status] || statusGlow.draft}`}>
                          {project.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: project._id })}
                          className="w-9 h-9 inline-flex items-center justify-center border border-white/10 rounded-xl bg-white/5 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredAll.length === 0 && (
              <div className="text-center py-20 text-slate-600">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Registry Is Empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Delete Project?</h3>
            <p className="text-sm text-slate-500 mb-8">This action is permanent and cannot be reversed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 px-4 py-3 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest transition-all">Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast.message && ReactDOM.createPortal(
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent/10 border-accent/30 text-white'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} className="text-green-400" />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })}><X size={14} /></button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectManagement;
