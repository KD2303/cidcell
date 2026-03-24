import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Send } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function DirectMessagePanel({ recipientId, recipientData }) {
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
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b-2 border-primary shadow-sm shrink-0">
        <img
          src={recipientData?.profilePicture || `https://ui-avatars.com/api/?name=${recipientData?.username}`}
          alt={recipientData?.username}
          className="w-10 h-10 rounded-full border-2 border-primary object-cover"
        />
        <div>
          <h2 className="font-black text-lg text-primary uppercase">{recipientData?.username}</h2>
          {recipientData?.userType && (
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{recipientData.userType}</p>
          )}
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
            <p className="text-xs font-bold italic mt-2">Say hello!</p>
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
                  <p className="text-sm font-medium text-slate-800 break-words">{msg.text}</p>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block opacity-70">
                    {formatTime(msg.createdAt)}
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
            placeholder={`Message ${recipientData?.username}...`}
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
