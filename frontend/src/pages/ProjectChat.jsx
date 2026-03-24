import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ChevronLeft, Send, Users, Info } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const SOCKET_URL = API.replace('/api', '');
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ProjectChat() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Derive current user from token
  const token = localStorage.getItem('token');
  let currentUserId = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    currentUserId = payload.id;
  } catch (e) { /* will be caught by auth guard */ }

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projRes = await axios.get(`${API}/projects/${id}`);
        setProject(projRes.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Fetch group messages
  useEffect(() => {
    if (!project) return;
    const fetchMessages = async () => {
      try {
        const msgRes = await axios.get(`${API}/project-messages/${id}`, authHeaders());
        setMessages(msgRes.data);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [id, project]);

  // Socket setup — connect to /project-chat namespace
  useEffect(() => {
    if (!token) return;

    const projectSocket = io(`${SOCKET_URL}/project-chat`, {
      auth: { token }
    });
    socketRef.current = projectSocket;

    projectSocket.on('connect', () => {
      projectSocket.emit('join_project_room', { projectId: id });
    });

    projectSocket.on('receive_project_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      projectSocket.emit('leave_project_room', { projectId: id });
      projectSocket.disconnect();
    };
  }, [id, token]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('send_project_message', {
      projectId: id,
      text: newMessage
    }, (response) => {
      if (!response.success) {
        console.error("Failed to send message", response.error);
      }
    });

    setNewMessage('');
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse">
        Loading Chat Room...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h2 className="text-2xl font-black text-primary mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-blue-600 font-bold hover:underline italic">Return to Projects</Link>
      </div>
    );
  }

  // Access check
  const isCreator = project.createdBy?._id === currentUserId;
  const isContributor = project.contributors?.some(c => (c.userId?._id || c.userId) === currentUserId);
  const isProjectMentor = project.mentors?.some(m => (m.userId?._id || m.userId) === currentUserId);

  if (!isCreator && !isContributor && !isProjectMentor) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h2 className="text-2xl font-black text-red-600 mb-4 uppercase">Access Denied</h2>
        <p className="text-slate-600 mb-4">You are not a member of this project.</p>
        <Link to={`/projects/${id}`} className="text-blue-600 font-bold hover:underline italic flex items-center justify-center gap-2">
          <ChevronLeft size={16} /> Return to Project
        </Link>
      </div>
    );
  }

  // Team member count for header
  const memberCount = 1 + (project.contributors?.length || 0) + (project.mentors?.length || 0);

  return (
    <div className="bg-bg min-h-screen pt-20 flex flex-col">
      {/* Main Chat Area — Group Only */}
      <div className="flex-1 flex flex-col bg-slate-50 h-[calc(100vh-80px)] max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white px-4 sm:px-8 py-4 flex items-center justify-between border-b-2 border-primary shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Link to={`/projects/${id}`} className="p-2 bg-bg border-2 border-primary rounded-xl shadow-neo-sm hover:-translate-x-1 hover:shadow-none transition-all">
              <ChevronLeft size={16} />
            </Link>
            <div>
              <h1 className="font-black text-xl text-primary uppercase leading-tight flex items-center gap-2">
                <Users size={18} className="text-highlight-purple" /> {project.title}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Project Team Chat · {memberCount} members
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <Info size={48} className="mb-4 opacity-50" />
              <p className="font-black uppercase tracking-widest text-sm">No messages yet</p>
              <p className="text-xs font-bold italic mt-2">Start the conversation with your team.</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId?._id === currentUserId;
              return (
                <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <img 
                      src={msg.senderId?.profilePicture || `https://ui-avatars.com/api/?name=${msg.senderId?.username}`} 
                      alt={msg.senderId?.username}
                      className="w-8 h-8 rounded-full border-2 border-primary object-cover shadow-neo-sm shrink-0 mt-1"
                    />
                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest px-1">
                        {isMe ? 'You' : msg.senderId?.username}
                      </span>
                      <div className={`
                        px-4 py-3 border-2 border-primary shadow-neo-sm relative
                        ${isMe ? 'bg-highlight-green rounded-2xl rounded-tr-none' : 'bg-white rounded-2xl rounded-tl-none'}
                      `}>
                        <p className="text-sm font-medium text-slate-800 break-words">{msg.text}</p>
                        <span className="text-[9px] font-bold text-slate-400 mt-2 block opacity-70">
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

        {/* Input Form */}
        <div className="bg-white border-t-2 border-primary p-4 shrink-0">
          <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message to the team..."
              className="flex-1 bg-slate-50 border-2 border-primary rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:shadow-neo transition-all"
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
    </div>
  );
}
