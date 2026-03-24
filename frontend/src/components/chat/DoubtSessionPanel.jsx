import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Send } from 'lucide-react';
import { DOMAIN_COLORS } from '../../constants/domains';

const API = import.meta.env.VITE_API_URL;

export default function DoubtSessionPanel({ sessionId, sessionData }) {
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
  const domainColor = DOMAIN_COLORS[sessionData?.domain] || DOMAIN_COLORS['Other'];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b-2 border-primary shadow-sm shrink-0">
        <img
          src={partner?.profilePicture || `https://ui-avatars.com/api/?name=${partner?.username}`}
          alt={partner?.username}
          className="w-10 h-10 rounded-full border-2 border-primary object-cover"
        />
        <div>
          <h2 className="font-black text-lg text-primary uppercase">{partner?.username}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${domainColor}`}>
              {sessionData?.domain}
            </span>
            <span className={`text-[8px] font-black uppercase ${sessionData?.status === 'open' ? 'text-green-500' : 'text-slate-400'}`}>
              {sessionData?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-bold text-slate-300 animate-pulse">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <p className="font-black uppercase tracking-widest text-sm">No messages yet</p>
            <p className="text-xs font-bold italic mt-2">Start your doubt session.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = (msg.senderId?._id || msg.senderId) === user?._id;
            return (
              <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-3 border-2 border-primary shadow-neo-sm
                  ${isMe
                    ? 'bg-highlight-green rounded-2xl rounded-tr-none'
                    : 'bg-white rounded-2xl rounded-tl-none'
                  }`}
                >
                  <p className="text-sm font-bold text-primary leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block opacity-70">
                    {formatTime(msg.timestamp || msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-primary p-4 shrink-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder={`Ask ${partner?.username} a doubt...`}
            className="flex-1 bg-slate-50 border-2 border-primary rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-primary text-white border-2 border-primary rounded-xl flex items-center justify-center shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
