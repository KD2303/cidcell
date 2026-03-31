import { useState } from 'react';
import { MessageCircle, HelpCircle, FolderGit2, Search, ChevronDown, ChevronRight, Terminal } from 'lucide-react';
import { DOMAIN_COLORS } from '../../constants/domains';

export default function ChatSidebar({ conversations, unreadCounts, activePanel, onSelect, userType, currentUserId, onlineUsers }) {
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    dms: true,
    doubts: true,
    projects: true
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { dmUsers, doubtSessions, projects } = conversations;

  // Filter by search
  const filteredDMs = dmUsers.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDoubts = doubtSessions.filter(s => {
    const partner = userType === 'student' ? s.mentorId : s.studentId;
    return partner?.username?.toLowerCase().includes(search.toLowerCase()) ||
           s.domain?.toLowerCase().includes(search.toLowerCase());
  });
  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Group DMs by domain for students
  const groupedDMs = {};
  if (userType === 'student') {
    filteredDMs.forEach(u => {
      const domain = u.domainOfExpertise || 'Other';
      if (!groupedDMs[domain]) groupedDMs[domain] = [];
      groupedDMs[domain].push(u);
    });
  }

  const totalDMUnread = Object.values(unreadCounts.dms || {}).reduce((a, b) => a + b, 0);
  const totalProjectUnread = Object.values(unreadCounts.projects || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full md:w-72 lg:w-80 bg-[#0a0a0a]/60 backdrop-blur-3xl border-r border-white/10 flex flex-col shrink-0 h-[calc(100vh-80px)] z-20">
      {/* Search Console */}
      <div className="p-4 border-b border-white/5 space-y-4">
        <div className="flex items-center gap-2 px-2">
            <Terminal size={14} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Console</span>
        </div>
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-accent transition-colors" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ACCESS PROTOCOL..."
            className="w-full pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-bold text-white outline-none focus:border-accent/40 focus:bg-white/5 transition-all hidden md:block placeholder:text-slate-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar-dark py-2">
        {/* ── DM Section ── */}
        <SectionHeader
          icon={<MessageCircle size={14} />}
          label="Direct Links"
          badge={totalDMUnread}
          expanded={expandedSections.dms}
          onToggle={() => toggleSection('dms')}
        />
        {expandedSections.dms && (
          <div className="px-2 pb-2 space-y-1">
            {userType === 'student' ? (
              // Grouped by domain
              Object.entries(groupedDMs).map(([domain, users]) => (
                <div key={domain} className="mt-4 first:mt-0">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 px-3 py-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent-magenta"></span>
                    {domain}
                  </p>
                  <div className="space-y-1">
                    {users.map(u => (
                      <UserRow
                        key={u._id}
                        user={u}
                        isActive={activePanel.type === 'dm' && activePanel.id === u._id}
                        unread={unreadCounts.dms?.[u._id] || 0}
                        onClick={() => onSelect('dm', u._id, u)}
                        isOnline={onlineUsers?.includes(u._id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              filteredDMs.map(u => (
                <UserRow
                  key={u._id}
                  user={u}
                  isActive={activePanel.type === 'dm' && activePanel.id === u._id}
                  unread={unreadCounts.dms?.[u._id] || 0}
                  onClick={() => onSelect('dm', u._id, u)}
                  showType={userType !== 'student'}
                  isOnline={onlineUsers?.includes(u._id)}
                />
              ))
            )}
            {filteredDMs.length === 0 && (
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-4 py-4 text-center">Empty Matrix</p>
            )}
          </div>
        )}

        {/* ── Doubt Sessions Section ── */}
        {(userType === 'student' || userType === 'mentor') && (
          <>
            <SectionHeader
              icon={<HelpCircle size={14} />}
              label="Doubt Modules"
              badge={0}
              expanded={expandedSections.doubts}
              onToggle={() => toggleSection('doubts')}
            />
            {expandedSections.doubts && (
              <div className="px-2 pb-2 space-y-1">
                {filteredDoubts.map(s => {
                  const partner = userType === 'student' ? s.mentorId : s.studentId;
                  const isActive = activePanel.type === 'doubt' && activePanel.id === s._id;
                  return (
                    <button
                      key={s._id}
                      onClick={() => onSelect('doubt', s._id, { ...s, partner })}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border group relative
                        ${isActive
                          ? 'bg-accent/10 border-accent/40 shadow-glow-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                          : 'border-transparent hover:bg-white/5'
                        }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={partner?.profilePicture || `https://ui-avatars.com/api/?name=${partner?.username}`}
                          alt={partner?.username}
                          className={`w-9 h-9 rounded-full border border-white/10 object-cover shrink-0 transition-all duration-300 ${isActive ? 'scale-110 border-accent' : ''}`}
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${s.status === 'open' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`} />
                      </div>
                      <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
                        <p className={`font-black text-[9px] uppercase tracking-widest truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {partner?.username}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[7px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-accent-magenta opacity-80`}>
                            {s.domain}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredDoubts.length === 0 && (
                   <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-4 py-4 text-center">Inactive Uplinks</p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Project Chats Section ── */}
        <SectionHeader
          icon={<FolderGit2 size={14} />}
          label="Project Grids"
          badge={totalProjectUnread}
          expanded={expandedSections.projects}
          onToggle={() => toggleSection('projects')}
        />
        {expandedSections.projects && (
          <div className="px-2 pb-2 space-y-1">
            {filteredProjects.map(p => {
              const memberCount = 1 + (p.contributors?.length || 0) + (p.mentors?.length || 0);
              const isActive = activePanel.type === 'project' && activePanel.id === p._id;
              return (
                <button
                  key={p._id}
                  onClick={() => onSelect('project', p._id, p)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border group
                    ${isActive
                      ? 'bg-accent/10 border-accent/40 shadow-glow-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'border-transparent hover:bg-white/5'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'text-accent border-accent scale-110 shadow-glow-purple' : 'text-slate-400 group-hover:text-white group-hover:border-white/20'}`}>
                    <FolderGit2 size={16} />
                  </div>
                  <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
                    <p className={`font-black text-[9px] uppercase tracking-widest truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {p.title}
                    </p>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                      {memberCount} Nodes Connected
                    </p>
                  </div>
                  {(unreadCounts.projects?.[p._id] || 0) > 0 && (
                    <span className="ml-auto w-4 h-4 bg-accent text-white text-[8px] font-black rounded-lg flex items-center justify-center shrink-0 shadow-glow-purple">
                      {unreadCounts.projects[p._id]}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredProjects.length === 0 && (
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-4 py-4 text-center">No Active Grids</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──

function SectionHeader({ icon, label, badge, expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-5 py-4 text-left hover:bg-white/5 transition-colors group"
    >
      <span className="text-accent group-hover:scale-110 transition-transform">{icon}</span>
      <span className="hidden md:inline text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 flex-1">
        {label}
      </span>
      {badge > 0 && (
        <span className="w-4 h-4 bg-accent text-white text-[8px] font-black rounded-lg flex items-center justify-center shadow-glow-purple">
          {badge}
        </span>
      )}
      <span className="text-slate-600 hidden md:inline group-hover:text-white transition-colors">
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </span>
    </button>
  );
}

function UserRow({ user, isActive, unread, onClick, showType = false, isOnline = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border group relative
        ${isActive
          ? 'bg-accent/10 border-accent/40 shadow-glow-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]'
          : 'border-transparent hover:bg-white/5'
        }`}
    >
      <div className="relative shrink-0">
        <img
          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`}
          alt={user.username}
          className={`w-9 h-9 rounded-full border border-white/10 object-cover transition-all duration-300 ${isActive ? 'scale-110 border-accent' : 'group-hover:border-white/20'}`}
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-[#0a0a0a] rounded-full transition-all duration-500 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] scale-110' : 'bg-slate-700 opacity-50'}`} />
      </div>
      <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
        <p className={`font-black text-[9px] uppercase tracking-widest truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
          {user.username}
        </p>
        {showType && user.userType && (
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{user.userType}</p>
        )}
      </div>
      {unread > 0 && (
        <span className="ml-auto w-4 h-4 bg-accent text-white text-[8px] font-black rounded-lg flex items-center justify-center shrink-0 shadow-glow-purple">
          {unread}
        </span>
      )}
    </button>
  );
}
