import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Send, ShieldCheck, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function DirectMessagePanel({ recipientId, recipientData, onBack }) {
  const { user, socket } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/messages/${recipientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch DMs:', err);
      } finally {
        setLoading(false);
      }
    };
    if (recipientId) fetchMessages();
  }, [recipientId, token]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleMsg = (msg) => {
      // Only add if it's from this conversation
      const fromRecipient = (msg.senderId?._id || msg.senderId) === recipientId;
      const toRecipient = (msg.receiverId?._id || msg.receiverId) === recipientId;
      if (fromRecipient || toRecipient) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleMsg);
    return () => socket.off('receive_message', handleMsg);
  }, [socket, recipientId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      receiverId: recipientId,
      text: newMessage
    });

    setNewMessage('');
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
            <div className="relative">
                <img
                    src={recipientData?.profilePicture || `https://ui-avatars.com/api/?name=${recipientData?.username}`}
                    alt={recipientData?.username}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border border-white/10 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div>
            <h2 className="font-heading font-black text-sm sm:text-base text-white uppercase tracking-widest">{recipientData?.username}</h2>
            <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-accent" />
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{recipientData?.userType || 'Verified User'}</p>
            </div>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-4 sm:p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
             <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Decrypting Ledger...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                 <Send size={24} className="opacity-20" />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-[10px]">No transmission history</p>
            <p className="text-[9px] font-bold italic mt-2 opacity-50 uppercase tracking-widest text-accent">Initiate First Contact</p>
          </div>
        ) : (
          <div className="space-y-4">
             {messages.map(msg => {
                const isMe = (msg.senderId?._id || msg.senderId) === user?._id;
                return (
                <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 border transition-all duration-300
                    ${isMe
                        ? 'bg-accent/10 border-accent/30 rounded-2xl rounded-tr-none text-white shadow-glow-purple shadow-[0_0_20px_rgba(139,92,246,0.05)]'
                        : 'bg-white/[0.03] border-white/10 rounded-2xl rounded-tl-none text-slate-200 backdrop-blur-md'
                    }`}
                    >
                    <p className="text-[13px] font-medium leading-relaxed break-words">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-2 opacity-50 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[8px] font-bold uppercase tracking-widest">
                            {formatTime(msg.createdAt)}
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
      <div className="bg-[#050505]/60 backdrop-blur-3xl border-t border-white/5 p-4 sm:p-6 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex gap-3 sm:gap-4">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent-magenta/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder={`Type a secure message to ${recipientData?.username.split(' ')[0]}...`}
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
