import { useState } from 'react';
import { MessageCircle, HelpCircle, FolderGit2, Search, ChevronDown, ChevronRight } from 'lucide-react';
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
    <div className="w-20 md:w-72 lg:w-80 bg-white border-r-3 border-primary flex flex-col shrink-0 h-[calc(100vh-80px)]">
      {/* Search */}
      <div className="p-3 border-b-2 border-primary">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary transition-colors hidden md:block"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── DM Section ── */}
        <SectionHeader
          icon={<MessageCircle size={14} />}
          label="Direct Messages"
          badge={totalDMUnread}
          expanded={expandedSections.dms}
          onToggle={() => toggleSection('dms')}
        />
        {expandedSections.dms && (
          <div className="px-2 pb-2">
            {userType === 'student' ? (
              // Grouped by domain
              Object.entries(groupedDMs).map(([domain, users]) => (
                <div key={domain} className="mb-2">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 px-2 py-1">
                    {domain}
                  </p>
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
              <p className="text-[10px] font-bold text-slate-300 italic px-2 py-3">No contacts</p>
            )}
          </div>
        )}

        {/* ── Doubt Sessions Section ── */}
        {(userType === 'student' || userType === 'mentor') && (
          <>
            <SectionHeader
              icon={<HelpCircle size={14} />}
              label="Doubt Sessions"
              badge={0}
              expanded={expandedSections.doubts}
              onToggle={() => toggleSection('doubts')}
            />
            {expandedSections.doubts && (
              <div className="px-2 pb-2">
                {filteredDoubts.map(s => {
                  const partner = userType === 'student' ? s.mentorId : s.studentId;
                  return (
                    <button
                      key={s._id}
                      onClick={() => onSelect('doubt', s._id, { ...s, partner })}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border-2 mb-1
                        ${activePanel.type === 'doubt' && activePanel.id === s._id
                          ? 'bg-highlight-yellow border-primary shadow-neo-sm'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <img
                        src={partner?.profilePicture || `https://ui-avatars.com/api/?name=${partner?.username}`}
                        alt={partner?.username}
                        className="w-9 h-9 rounded-full border-2 border-primary object-cover shrink-0"
                      />
                      <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
                        <p className="font-black text-[10px] text-primary uppercase truncate">{partner?.username}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${DOMAIN_COLORS[s.domain] || DOMAIN_COLORS['Other']}`}>
                            {s.domain}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'open' ? 'bg-green-400' : 'bg-slate-300'}`} />
                        </div>
                        {s.lastMessage && (
                          <p className="text-[9px] font-medium text-slate-400 truncate mt-1">{s.lastMessage}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
                {filteredDoubts.length === 0 && (
                  <p className="text-[10px] font-bold text-slate-300 italic px-2 py-3">No sessions</p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Project Chats Section ── */}
        <SectionHeader
          icon={<FolderGit2 size={14} />}
          label="Project Chats"
          badge={totalProjectUnread}
          expanded={expandedSections.projects}
          onToggle={() => toggleSection('projects')}
        />
        {expandedSections.projects && (
          <div className="px-2 pb-2">
            {filteredProjects.map(p => {
              const memberCount = 1 + (p.contributors?.length || 0) + (p.mentors?.length || 0);
              return (
                <button
                  key={p._id}
                  onClick={() => onSelect('project', p._id, p)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border-2 mb-1
                    ${activePanel.type === 'project' && activePanel.id === p._id
                      ? 'bg-highlight-purple border-primary shadow-neo-sm'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-highlight-purple border-2 border-primary flex items-center justify-center text-primary shrink-0">
                    <FolderGit2 size={16} />
                  </div>
                  <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
                    <p className="font-black text-[10px] text-primary uppercase truncate">{p.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {memberCount} members
                    </p>
                  </div>
                  {(unreadCounts.projects?.[p._id] || 0) > 0 && (
                    <span className="ml-auto w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
                      {unreadCounts.projects[p._id]}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredProjects.length === 0 && (
              <p className="text-[10px] font-bold text-slate-300 italic px-2 py-3">No projects</p>
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
      className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100"
    >
      <span className="text-primary">{icon}</span>
      <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-slate-500 flex-1">
        {label}
      </span>
      {badge > 0 && (
        <span className="w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
      <span className="text-slate-400 hidden md:inline">
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </span>
    </button>
  );
}

function UserRow({ user, isActive, unread, onClick, showType = false, isOnline = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border-2 mb-1
        ${isActive
          ? 'bg-highlight-blue border-primary shadow-neo-sm'
          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
        }`}
    >
      <div className="relative shrink-0">
        <img
          src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`}
          alt={user.username}
          className="w-9 h-9 rounded-full border-2 border-primary object-cover"
        />
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="hidden md:block text-left overflow-hidden flex-1 min-w-0">
        <p className="font-black text-[10px] text-primary uppercase truncate">{user.username}</p>
        {showType && user.userType && (
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.userType}</p>
        )}
      </div>
      {unread > 0 && (
        <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
          {unread}
        </span>
      )}
    </button>
  );
}
