import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Edit2,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Download
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatTime12h } from '../../utils/formatTime';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    organizerEmail: '',
    creatorName: '',
    userType: 'admin',
    category: 'tech',
    type: 'in-person',
    maxAttendees: 30,
    image: '',
    whatsappGroupLink: '',
    isScheduled: true
  });

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const categories = [
    "trainig and mentorships",
    "tech",
    "cultural",
    "sports",
    "educational",
    "special"
  ];

  const userTypes = ["student", "member", "faculty", "HOD", "admin"];
  const eventTypes = ["virtual", "in-person"];

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleDownloadCSV = async (eventId, eventTitle) => {
    try {
      showToast("Preparing CSV...", "success");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/${eventId}/registrations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!data || data.length === 0) {
        showToast("No registrations found for this event.", "error");
        return;
      }

      const headers = ['Name', 'Email', 'SAP ID', 'Branch', 'Year', 'Section', 'Registered At'];
      const csvRows = data.map(reg => {
        const user = reg.userId || {};
        return [
          user.name || 'N/A',
          user.email || 'N/A',
          user.sapId || 'N/A',
          user.branch || 'N/A',
          user.year || 'N/A',
          user.section || 'N/A',
          new Date(reg.createdAt).toLocaleDateString()
        ].map(val => `"${val}"`).join(',');
      });

      const csvContent = [headers.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${eventTitle.replace(/\s+/g, '_')}_registrations.csv`;
      link.click();
      
      showToast("CSV downloaded successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Error downloading CSV", "error");
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setIsEditMode(true);
      setSelectedId(event._id);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time || '',
        location: event.location,
        organizer: event.organizer,
        organizerEmail: event.organizerEmail,
        creatorName: event.creatorName || '',
        userType: event.userType || 'admin',
        category: event.category || 'tech',
        type: event.type || 'in-person',
        maxAttendees: event.maxAttendees || 30,
        image: event.image || '',
        whatsappGroupLink: event.whatsappGroupLink || '',
        isScheduled: event.isScheduled ?? true
      });
    } else {
      setIsEditMode(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        organizer: '',
        organizerEmail: '',
        creatorName: '',
        userType: 'admin',
        category: 'tech',
        type: 'in-person',
        maxAttendees: 30,
        image: '',
        whatsappGroupLink: '',
        isScheduled: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/events/${selectedId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(events.map(ev => ev._id === selectedId ? res.data : ev));
        showToast('Event updated successfully');
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/events`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents([...events, res.data]);
        showToast('Event created successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving event', 'error');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/events/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(ev => ev._id !== deleteConfirm.id));
      showToast('Event deleted successfully');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, id: null }); }
  };

  const filteredEvents = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
          <p className="text-slate-500 text-sm">Organize and track CID Cell activities.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-black transition-all">
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" placeholder="Filter events..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded w-full text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-xs font-bold text-slate-500 uppercase">
                <th className="px-6 py-3">Event Details</th>
                <th className="px-6 py-3 text-center">Date & Time</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredEvents.map((ev) => (
                <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{ev.title}</div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{ev.category}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-slate-700 font-medium">{ev.date}</div>
                    <div className="text-slate-400 text-xs">{formatTime12h(ev.time)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ev.type === 'virtual' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleDownloadCSV(ev._id, ev.title)} title="Download Registrations CSV" className="p-1.5 text-slate-400 hover:text-green-600 border border-transparent hover:border-green-100 hover:bg-green-50 rounded"><Download size={16} /></button>
                    <button onClick={() => handleOpenModal(ev)} className="p-1.5 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, id: ev._id })} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">{isEditMode ? 'Edit Event' : 'New Event Submission'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Title*</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Date*</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Time</label>
                    <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>

                  {/* Location & Type */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location*</label>
                    <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" placeholder="Venue or Link" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Type</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold">
                      {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Category & Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Attendees</label>
                    <input type="number" value={formData.maxAttendees} onChange={e => setFormData({ ...formData, maxAttendees: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>

                  {/* Organizer Details */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organizer*</label>
                    <input type="text" required value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Organizer Email*</label>
                    <input type="email" required value={formData.organizerEmail} onChange={e => setFormData({ ...formData, organizerEmail: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" />
                  </div>

                  {/* Creator Info */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Name</label>
                    <input type="text" value={formData.creatorName} onChange={e => setFormData({ ...formData, creatorName: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" placeholder="Who created this entry" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Type</label>
                    <select value={formData.userType} onChange={e => setFormData({ ...formData, userType: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold">
                      {userTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* WhatsApp & Image */}
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-green-600">WhatsApp Group Link*</label>
                    <input type="text" required value={formData.whatsappGroupLink} onChange={e => setFormData({ ...formData, whatsappGroupLink: e.target.value })} className="w-full p-2.5 border-2 border-green-100 bg-green-50/30 rounded-lg outline-none focus:border-green-500 text-sm font-bold" />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Header Image URL</label>
                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-lg outline-none focus:border-blue-500 text-sm font-bold" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description*</label>
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={value => setFormData({ ...formData, description: value })}
                    className="bg-white"
                  />
                </div>

                <div className="flex items-center gap-4 py-2 border-t border-slate-50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isScheduled} onChange={e => setFormData({ ...formData, isScheduled: e.target.checked })} className="w-4 h-4 rounded text-blue-600 border-2 border-slate-200 focus:ring-0" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Publish Event Immediately</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 uppercase tracking-widest">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border-2 border-red-50">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900 mb-2 uppercase">Destructive Action</h3>
            <p className="text-slate-500 mb-8 text-sm font-medium">This will permanently delete the event and all associated registrations. Continue?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-2.5 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs">Retreat</button>
              <button onClick={handleDelete} className="flex-1 p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs font-black">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div className={`fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[70] text-white border-b-4 ${toast.type === 'error' ? 'bg-red-500 border-red-700' : 'bg-slate-900 border-slate-700'}`}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} className="text-green-400" />}
          <p className="text-sm font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
