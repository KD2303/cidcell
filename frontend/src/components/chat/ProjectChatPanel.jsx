import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, Users, Terminal, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const SOCKET_URL = API.replace('/api', '');

export default function ProjectChatPanel({ projectId, projectData, onBack }) {
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Derive current user from token
  let currentUserId = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUserId = payload.id;
  } catch (e) { /* handled by auth guard */ }

  // Fetch group messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/project-messages/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch project messages:', err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchMessages();
  }, [projectId, token]);

  // Socket: connect to /project-chat namespace
  useEffect(() => {
    if (!token || !projectId) return;

    const projectSocket = io(`${SOCKET_URL}/project-chat`, {
      auth: { token }
    });
    socketRef.current = projectSocket;

    projectSocket.on('connect', () => {
      projectSocket.emit('join_project_room', { projectId });
    });

    projectSocket.on('receive_project_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      projectSocket.emit('leave_project_room', { projectId });
      projectSocket.disconnect();
    };
  }, [projectId, token]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('send_project_message', {
      projectId,
      text: newMessage
    }, (response) => {
      if (!response?.success) {
        console.error('Failed to send project message', response?.error);
      }
    });

    setNewMessage('');
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const memberCount = 1 + (projectData?.contributors?.length || 0) + (projectData?.mentors?.length || 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]/40 relative">
      
      {/* Header */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl px-4 py-3 sm:px-8 sm:py-5 flex items-center justify-between border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
            <button
                onClick={onBack}
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                title="Back to Sidebar"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shadow-glow-purple">
                 <Users size={20} />
            </div>
            <div>
               <h2 className="font-heading font-black text-sm sm:text-lg text-white uppercase tracking-tighter">{projectData?.title}</h2>
               <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-glow-purple"></div>
                   <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">
                       Project Hub · {memberCount} Node{memberCount !== 1 ? 's' : ''} Connected
                   </p>
               </div>
            </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
             <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                 <Terminal size={12} className="text-accent" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Channel</span>
             </div>
        </div>
      </div>

      {/* Group Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-4 sm:p-8 space-y-6">
        {loading ? (
             <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing Project Cloud...</p>
             </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 animate-fade-in-up p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                 <Users size={32} className="opacity-10 text-accent" />
            </div>
            <h3 className="font-heading font-black uppercase tracking-[0.3em] text-[12px] text-white">Project Protocol Idle</h3>
            <p className="text-[10px] font-bold mt-2 opacity-50 uppercase tracking-widest max-w-[280px] leading-loose">The team board is clear. Initiate deployment coordination.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map(msg => {
                const isMe = msg.senderId?._id === currentUserId;
                return (
                <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex gap-4 max-w-[90%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar bubble - skip for me if needed, but standardizing with it */}
                        <div className="shrink-0 mt-1">
                             <img
                                src={msg.senderId?.profilePicture || `https://ui-avatars.com/api/?name=${msg.senderId?.username}`}
                                alt={msg.senderId?.username}
                                className={`w-8 h-8 rounded-xl border border-white/10 object-cover shadow-2xl transition-all duration-300 ${isMe ? 'border-accent' : ''}`}
                            />
                        </div>

                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    {isMe ? 'Local Admin' : msg.senderId?.username}
                                </span>
                                {!isMe && <div className="w-1 h-1 rounded-full bg-accent/40"></div>}
                            </div>
                            
                            <div className={`relative px-4 py-3 border transition-all duration-300
                                ${isMe 
                                    ? 'bg-accent/10 border-accent/20 rounded-2xl rounded-tr-none text-white shadow-glow-purple shadow-[0_0_20px_rgba(139,92,246,0.05)]' 
                                    : 'bg-white/[0.03] border-white/5 rounded-2xl rounded-tl-none text-slate-200 backdrop-blur-md'}
                            `}>
                                <p className="text-[13px] font-medium leading-relaxed break-words">{msg.text}</p>
                                <div className={`flex items-center gap-1 mt-2 opacity-30 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[8px] font-bold uppercase tracking-widest">
                                        {formatTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Field */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-t border-white/5 p-4 sm:p-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-3 sm:gap-4">
            <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent-magenta/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Coordinate with the project nodes..."
                    className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-[13px] text-white outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-slate-700"
                />
            </div>
            <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-14 h-14 bg-accent text-white border border-accent/50 rounded-2xl flex items-center justify-center shadow-glow-purple hover:bg-accent-magenta hover:shadow-glow-purple active:scale-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
            >
                <Send size={20} />
            </button>
        </form>
      </div>
    </div>
  );
}
