import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  CalendarDays,
  Users,
  Code,
  LogOut,
  Menu,
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/auth');
  };

  const getLinksByRole = () => {
    const role = user?.userType?.toLowerCase() || 'student';
    // Admin has own layout, but if we merge, we can handle it here too.
    
    let links = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Projects', icon: FolderKanban, path: '/projects' },
      { name: 'Roadmap', icon: Map, path: '/roadmap' },
      { name: 'Events', icon: CalendarDays, path: '/events' },
    ];

    if (role === 'student') {
      links.push({ name: 'Mentor Hub', icon: Users, path: '/mentors' });
    } else {
      links.push({ name: 'Chat', icon: MessageSquare, path: '/chat' });
    }

    if (role === 'admin') {
      links.splice(1, 0, { name: 'Users', icon: Users, path: '/admin/users' });
    }

    return links;
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && <span className="text-xl font-bold text-blue-500 font-display">CIDCELL</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {getLinksByRole().map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600/20 text-blue-500' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`
            }
          >
            <link.icon size={20} className="shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <NavLink to="/team" className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white">
          <Users size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Team</span>}
        </NavLink>
        <NavLink to="/developers" className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white">
          <Code size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Developers</span>}
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-500/10">
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;