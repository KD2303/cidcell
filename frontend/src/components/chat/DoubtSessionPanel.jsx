import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Send, GraduationCap, ShieldAlert, ArrowLeft } from 'lucide-react';
import { DOMAIN_COLORS } from '../../constants/domains';

const API = import.meta.env.VITE_API_URL;

export default function DoubtSessionPanel({ sessionId, sessionData, onBack }) {
  const { user, socket } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const partner = sessionData?.partner;

  // Fetch messages for this session
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/doubts/sessions/${sessionId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch doubt messages:', err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchMessages();
  }, [sessionId, token]);

  // Socket: join/leave doubt room + listen for messages
  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit('join_doubt_room', { sessionId });

    const handleMsg = (msg) => {
      if (msg.sessionId === sessionId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receive_doubt_message', handleMsg);

    return () => {
      socket.emit('leave_doubt_room', { sessionId });
      socket.off('receive_doubt_message', handleMsg);
    };
  }, [socket, sessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const senderType = user?.userType === 'mentor' ? 'mentor' : 'student';
      const res = await axios.post(`${API}/doubts/sessions/${sessionId}/messages`, {
        text: newMessage,
        senderType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const savedMessage = res.data;

      // Emit via socket for real-time delivery
      socket?.emit('send_doubt_message', {
        sessionId,
        message: savedMessage
      });

      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send doubt message:', err);
    }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Custom Domain Badge Logic for Dark Theme
  const isStudent = user?.userType !== 'mentor';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]/40 relative">
      
      {/* Header */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl px-4 py-3 sm:px-8 sm:py-5 flex items-center justify-between border-b border-white/5 shrink-0 z-10 transition-all">
        <div className="flex items-center gap-3 sm:gap-4">
            <button
                onClick={onBack}
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                title="Back to Sidebar"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="relative">
                <img
                    src={partner?.profilePicture || `https://ui-avatars.com/api/?name=${partner?.username}`}
                    alt={partner?.username}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-white/10 object-cover shadow-2xl"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0a0a0a] ${sessionData?.status === 'open' ? 'bg-green-500 shadow-glow-purple shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}></div>
            </div>
            <div>
                <h2 className="font-heading font-black text-sm sm:text-base text-white uppercase tracking-widest">{partner?.username}</h2>
                <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-0.5 bg-accent/20 border border-accent/30 rounded text-[7px] font-black uppercase text-accent-magenta tracking-[0.2em]">
                        {sessionData?.domain}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${sessionData?.status === 'open' ? 'text-green-500' : 'text-slate-500'}`}>
                        {sessionData?.status === 'open' && <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>}
                        {sessionData?.status} Session
                    </span>
                </div>
            </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
             <div className="flex flex-col items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session ID</p>
                <p className="text-[10px] font-bold text-accent tracking-widest">{sessionId.slice(-8).toUpperCase()}</p>
             </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-4 sm:p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
             <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Accessing Sector 7...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 animate-fade-in-up p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                 <GraduationCap size={32} className="opacity-10 text-accent" />
            </div>
            <h3 className="font-heading font-black uppercase tracking-[0.3em] text-[12px] text-white">Knowledge Hub Established</h3>
            <p className="text-[10px] font-bold mt-2 opacity-50 uppercase tracking-widest max-w-[280px] leading-loose">The uplink is secure. Signal your mentor to begin the deep-dive.</p>
          </div>
        ) : (
          <div className="space-y-6">
             {messages.map(msg => {
                const isMe = (msg.senderId?._id || msg.senderId) === user?._id;
                return (
                <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className="max-w-[85%] sm:max-w-[70%] transition-all duration-300">
                        <div className={`px-4 py-3 border transition-all duration-300
                        ${isMe
                            ? 'bg-accent/10 border-accent/30 rounded-2xl rounded-tr-none text-white shadow-glow-purple shadow-[0_0_20px_rgba(139,92,246,0.05)]'
                            : 'bg-white/[0.03] border-white/10 rounded-2xl rounded-tl-none text-slate-200 backdrop-blur-md'
                        }`}
                        >
                        <p className="text-[13px] font-medium leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-2 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[8px] font-bold uppercase tracking-widest">
                                {formatTime(msg.timestamp || msg.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Console */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border-t border-white/5 p-4 sm:p-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {sessionData?.status === 'closed' ? (
             <div className="max-w-xl mx-auto flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <ShieldAlert size={16} className="text-red-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400">This sector is no longer active for transmission</p>
             </div>
        ) : (
            <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-3 sm:gap-4">
                <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent-magenta/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={isStudent ? `Ask your question to ${partner?.username.split(' ')[0]}...` : "Neural uplink ready for response..."}
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
        )}
      </div>
    </div>
  );
}
