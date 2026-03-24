import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const SOCKET_URL = API.replace('/api', '');

export default function ProjectChatPanel({ projectId, projectData }) {
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
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b-2 border-primary shadow-sm shrink-0">
        <div className="w-10 h-10 rounded-full bg-highlight-purple border-2 border-primary flex items-center justify-center text-primary shrink-0">
          <Users size={18} />
        </div>
        <div>
          <h2 className="font-black text-lg text-primary uppercase">{projectData?.title}</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Project Team Chat · {memberCount} members
          </p>
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
            <p className="text-xs font-bold italic mt-2">Start the conversation with your team.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId?._id === currentUserId;
            return (
              <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={msg.senderId?.profilePicture || `https://ui-avatars.com/api/?name=${msg.senderId?.username}`}
                    alt={msg.senderId?.username}
                    className="w-8 h-8 rounded-full border-2 border-primary object-cover shadow-neo-sm shrink-0 mt-1"
                  />
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest px-1">
                      {isMe ? 'You' : msg.senderId?.username}
                    </span>
                    <div className={`px-4 py-3 border-2 border-primary shadow-neo-sm
                      ${isMe ? 'bg-highlight-green rounded-2xl rounded-tr-none' : 'bg-white rounded-2xl rounded-tl-none'}
                    `}>
                      <p className="text-sm font-medium text-slate-800 break-words">{msg.text}</p>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 block opacity-70">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
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
            placeholder="Type a message to the team..."
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
