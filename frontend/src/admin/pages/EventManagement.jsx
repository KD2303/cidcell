import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import {
  Edit2, Trash2, Plus, X, AlertTriangle, CheckCircle, Calendar, Clock, MapPin, Users, Search, ExternalLink, Loader
} from 'lucide-react';
import { formatTime12h } from '../../utils/formatTime';
import { compressImage } from '../../utils/compressImage';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [proposals, setProposals] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', location: '', organizer: '', organizerEmail: '',
    creatorName: '', userType: 'admin', category: 'tech', type: 'in-person', maxAttendees: 30,
    image: '', whatsappGroupLink: '', isScheduled: true, registrationType: 'platform', externalLink: '',
    isPaid: false, price: 0
  });

  const categories = ["training and mentorships", "tech", "cultural", "sports", "educational", "special"];
  const userTypes = ["student", "member", "faculty", "HOD", "admin"];
  const eventTypes = ["virtual", "in-person"];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, proposalsRes] = await Promise.all([
        axios.get(`${API}/events`),
        axios.get(`${API}/events/proposals`, authHeaders())
      ]);
      setEvents(eventsRes.data);
      setProposals(proposalsRes.data);
    } catch (err) { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const compressedFile = await compressImage(file, 1200, 1200, 0.75);
      const uploadData = new FormData();
      uploadData.append('image', compressedFile);
      const res = await axios.post(`${API}/upload`, uploadData, {
        headers: { ...authHeaders().headers, 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
      showToast('Image uploaded');
    } catch (err) { showToast('Upload failed', 'error'); }
    finally { setUploadingImage(false); }
  };

  const handleOpenModal = (event = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (event) {
      setIsEditMode(true);
      setSelectedId(event._id);
      setFormData({
        title: event.title, description: event.description, date: event.date, time: event.time || '',
        location: event.location, organizer: event.organizer, organizerEmail: event.organizerEmail,
        creatorName: event.creatorName || '', userType: event.userType || 'admin', category: event.category || 'tech',
        type: event.type || 'in-person', maxAttendees: event.maxAttendees || 30, image: event.image || '',
        whatsappGroupLink: event.whatsappGroupLink || '', isScheduled: event.isScheduled ?? true,
        isPaid: event.isPaid || false, price: event.price || 0, registrationType: event.registrationType || 'platform',
        externalLink: event.externalLink || ''
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: '', description: '', date: '', time: '', location: '', organizer: '', organizerEmail: '',
        creatorName: '', userType: 'admin', category: 'tech', type: 'in-person', maxAttendees: 30,
        image: '', whatsappGroupLink: '', isScheduled: true, isPaid: false, price: 0,
        registrationType: 'platform', externalLink: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const res = await axios.put(`${API}/events/${selectedId}`, formData, authHeaders());
        setEvents(events.map(ev => ev._id === selectedId ? res.data : ev));
        showToast('Event updated');
      } else {
        const res = await axios.post(`${API}/events`, formData, authHeaders());
        setEvents([...events, res.data]);
        showToast('Event created');
      }
      setIsModalOpen(false);
    } catch (err) { showToast(err.response?.data?.message || 'Error saving event', 'error'); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/events/${deleteConfirm.id}`, authHeaders());
      setEvents(events.filter(ev => ev._id !== deleteConfirm.id));
      showToast('Event deleted');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, id: null }); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`${API}/events/proposals/${id}/approve`, {}, authHeaders());
      setProposals(proposals.filter(p => p._id !== id));
      setEvents([res.data, ...events]);
      showToast('Proposal approved');
    } catch (err) { showToast('Approval failed', 'error'); }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API}/events/proposals/${id}/reject`, {}, authHeaders());
      setProposals(proposals.filter(p => p._id !== id));
      showToast('Proposal rejected');
    } catch (err) { showToast('Rejection failed', 'error'); }
  };

  const filteredEvents = events.filter(ev => ev.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  const inputCls = "w-full p-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-slate-600";
  const labelCls = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-10 max-w-7xl mx-auto text-white pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-widest">Event Oversight</h1>
          <div className="inline-block bg-accent/10 border border-accent/20 px-4 py-1 mt-3 rounded-full">
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] leading-none">Global Activity Command</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-accent/10 border border-accent/40 rounded-2xl text-white font-bold uppercase text-[10px] shadow-glass hover:bg-accent/20 transition-all flex items-center gap-2">
            <Plus size={16} strokeWidth={3} /> Initiate Event
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4">
        <button onClick={() => setActiveTab('events')} className={`px-6 py-3 text-xs font-bold uppercase rounded-2xl transition-all border ${activeTab === 'events' ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'}`}>
          Managed Events
        </button>
        <button onClick={() => setActiveTab('proposals')} className={`px-6 py-3 text-xs font-bold uppercase rounded-2xl transition-all border relative ${activeTab === 'proposals' ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'}`}>
          Pending Proposals {proposals.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{proposals.length}</span>}
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="relative group max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-accent transition-colors" />
          <input type="text" placeholder="Search calendar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/40 transition-all text-sm placeholder:text-slate-600" />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white/[0.02] border border-white/5 rounded-3xl">
          <Loader className="w-16 h-16 animate-spin text-accent stroke-[1.5]" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Syncing Global Calendar...</p>
        </div>
      ) : (
        <div className="border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Temporal Marker</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Mode</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Sanctions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(activeTab === 'events' ? filteredEvents : proposals).map((ev) => (
                  <tr key={ev._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm uppercase leading-tight">{ev.title}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">{ev.category}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest">{ev.date}</p>
                      {ev.time && <p className="text-[9px] text-slate-500 uppercase mt-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> {formatTime12h(ev.time)}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${ev.type === 'virtual' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>{ev.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'events' ? (
                          <>
                            <button onClick={() => handleOpenModal(ev)} className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-yellow-500/20 hover:text-yellow-400 transition-all"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: ev._id })} className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleOpenModal(ev, true)} className="w-9 h-9 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all"><ExternalLink className="w-4 h-4" /></button>
                            <button onClick={() => handleApprove(ev._id)} className="w-9 h-9 border border-white/10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleReject(ev._id)} className="w-9 h-9 border border-white/10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"><X className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(activeTab === 'events' ? filteredEvents : proposals).length === 0 && (
              <div className="text-center py-20 text-slate-600">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Registry Depth Zero</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isViewOnly ? 'Proposal Detail' : isEditMode ? 'Modify Activity' : 'Initiate Activity'}
        footer={<>
          <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 text-[10px] font-bold uppercase hover:bg-white/5">Cancel</button>
          {!isViewOnly && <button form="eventForm" type="submit" className="px-6 py-2.5 bg-accent border border-accent/50 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-accent/80">Authorize</button>}
        </>}>
        <form id="eventForm" onSubmit={handleSubmit} className="p-6 space-y-6">
          <fieldset disabled={isViewOnly} className="space-y-6">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
              <h3 className={labelCls + " text-accent pb-2 border-b border-white/5"}>Operational Details</h3>
              <div className="space-y-2"><label className={labelCls}>Activity Title*</label><input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Date*</label><input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Time</label><input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Location*</label><input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Category</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls + " bg-[#0a0a0a]"}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
              <h3 className={labelCls + " text-accent pb-2 border-b border-white/5"}>Access & Registry</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Registration Mode</label><select value={formData.registrationType} onChange={e => setFormData({ ...formData, registrationType: e.target.value })} className={inputCls + " bg-[#0a0a0a]"}><option value="platform">Internal</option><option value="external">External Link</option></select></div>
                {formData.registrationType === 'external' && <div><label className={labelCls}>External URL*</label><input type="url" required value={formData.externalLink} onChange={e => setFormData({ ...formData, externalLink: e.target.value })} className={inputCls} /></div>}
                <div><label className={labelCls}>Max Capacity</label><input type="number" value={formData.maxAttendees} onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>WhatsApp Group</label><input type="text" required value={formData.whatsappGroupLink} onChange={e => setFormData({ ...formData, whatsappGroupLink: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="flex gap-4 items-center"><label className="flex items-center gap-2 text-xs text-slate-400 font-bold"><input type="checkbox" checked={formData.isPaid} onChange={e => setFormData({ ...formData, isPaid: e.target.checked })} /> Paid Activity</label>{formData.isPaid && <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputCls + " w-32 py-1"} placeholder="₹ Price" />}</div>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
               <h3 className={labelCls + " text-accent pb-2 border-b border-white/5"}>Payload Description</h3>
               <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 min-h-[200px] mb-8"><ReactQuill theme="snow" readOnly={isViewOnly} value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} /></div>
            </div>
          </fieldset>
        </form>
      </Modal>

      {/* Delete Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="font-bold text-lg text-white uppercase tracking-wider mb-2">Delete Event?</h3>
            <p className="text-slate-500 mb-8 text-sm">All associated registries will be purged. IRREVERSIBLE.</p>
            <div className="flex gap-3"><button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-3 border border-white/10 rounded-2xl text-slate-400 text-[10px] font-bold uppercase">Abort</button><button onClick={handleDelete} className="flex-1 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-[10px] font-bold uppercase">Purge</button></div>
          </div>
        </div>, document.body
      )}

      {/* Toast */}
      {toast.message && <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in"><div className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-accent/10 border-accent/30 text-white'}`}>{toast.type === 'error' ? <AlertTriangle size={14} /> : <CheckCircle size={14} className="text-green-400" />}<p>{toast.message}</p><button onClick={() => setToast({message: '', type: null})}><X size={12} /></button></div></div>}
    </div>
  );
};

export default EventManagement;
