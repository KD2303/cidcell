import React, { useState, useEffect, useContext, useRef } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
    Menu,
    X,
    LogOut,
    Users,
    Upload,
    Calendar,
    TrendingUp,
    Bell,
    LayoutDashboard,
    UserCheck,
    UserX,
    GraduationCap,
    Home,
    ChevronRight,
    Briefcase,
    Handshake,
    FileText,
    Trash2,
    Pencil,
    UserCog,
    Mail,
    ChevronDown,
    Globe,
    Info,
    ShieldCheck,
    MessageCircle,
    MessageSquare,
    Activity,
    Shield,
    Folder
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
    const isDarkMode = false; 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNotificationInput, setShowNotificationInput] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [editNotificationId, setEditNotificationId] = useState(null);
    const [isRightNavOpen, setIsRightNavOpen] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

    // Navigation Dropdown States
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [showEventsDropdown, setShowEventsDropdown] = useState(false);
    const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);

    // Refs and timeouts for dropdowns
    const usersDropdownRef = useRef(null);
    const eventsDropdownRef = useRef(null);
    const projectsDropdownRef = useRef(null);
    const teamDropdownRef = useRef(null);
    const dropdownTimeouts = useRef({});

    const handleMouseEnter = (category) => {
        if (dropdownTimeouts.current[category]) {
            clearTimeout(dropdownTimeouts.current[category]);
            delete dropdownTimeouts.current[category];
        }
        if (category === "users") setShowUsersDropdown(true);
        if (category === "events") setShowEventsDropdown(true);
        if (category === "projects") setShowProjectsDropdown(true);
        if (category === "team") setShowTeamDropdown(true);
    };

    const handleMouseLeave = (category) => {
        dropdownTimeouts.current[category] = setTimeout(() => {
            if (category === "users") setShowUsersDropdown(false);
            if (category === "events") setShowEventsDropdown(false);
            if (category === "projects") setShowProjectsDropdown(false);
            if (category === "team") setShowTeamDropdown(false);
        }, 300); // 300ms delay to prevent flickering
    };

    // Navigation options
    const usersOptions = [
        { label: "All Users", path: "/admin/users" },
    ];

    const eventsOptions = [
        { label: "All Events", path: "/admin/events" },
    ];

    const projectsOptions = [
        { label: "All Projects", path: "/admin/projects" },
    ];

    const teamOptions = [
        { label: "Team Members", path: "/admin/members" },
    ];

    const handleDropdownItemClick = (path) => {
        navigate(path);
        setShowUsersDropdown(false);
        setShowEventsDropdown(false);
        setShowProjectsDropdown(false);
        setShowTeamDropdown(false);
        setIsRightNavOpen(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (usersDropdownRef.current && !usersDropdownRef.current.contains(event.target)) setShowUsersDropdown(false);
            if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target)) setShowEventsDropdown(false);
            if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(event.target)) setShowProjectsDropdown(false);
            if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) setShowTeamDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userType = user?.userType || "Admin";

    const fetchNotifications = async () => {
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) return;
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setNotificationMessage("");
            setShowNotificationInput(false);
        }, 500);
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this notification?")) return;
    };

    const startEditNotification = (notif, e) => {
        e.stopPropagation();
        setNotificationMessage(notif.message);
        setEditNotificationId(notif.id);
        setShowNotificationInput(true);
    };

    const handleCancelInput = () => {
        setShowNotificationInput(false);
        setNotificationMessage("");
        setEditNotificationId(null);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobile, isSidebarOpen]);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: "users", label: "User Management", icon: Users, path: "/admin/users" },
        { id: "projects", label: "Projects", icon: Folder, path: "/admin/projects" },
        { id: "events", label: "Events", icon: Calendar, path: "/admin/events" },
        { id: "members", label: "Team Management", icon: Shield, path: "/admin/members" },
    ];

    return (
        <div className="admin-panel dashboard-theme min-h-screen flex flex-col font-sans transition-colors duration-300 bg-bg text-white">
            {/* Header */}
            <header className="h-20 border-b border-white/5 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-2 sm:gap-4 flex-none">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 border border-white/10 rounded-xl transition-all flex items-center justify-center w-10 h-10 text-white hover:bg-accent/20 shadow-glass"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-heading font-bold text-white uppercase tracking-widest leading-none">CID CELL</h1>
                            <div className="inline-block bg-accent/20 border border-accent/30 px-2 rounded-sm mt-0.5">
                                <p className="text-[10px] font-bold text-accent-magenta uppercase tracking-tighter">Admin Control</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    <Link
                        to="/"
                        className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold uppercase transition-all text-slate-300 hover:text-white hover:bg-white/5"
                    >
                        Home
                    </Link>

                    <div className="relative" ref={usersDropdownRef} onMouseEnter={() => handleMouseEnter("users")} onMouseLeave={() => handleMouseLeave("users")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-xs font-bold uppercase transition-all ${showUsersDropdown ? "bg-accent/20 border-accent/40 shadow-neo-mini" : "border-transparent text-slate-300 hover:text-white hover:bg-white/5"}`}>
                            Users <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showUsersDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showUsersDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-xl overflow-hidden z-[60] mt-2 backdrop-blur-xl">
                                <div className="py-1">
                                    {usersOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase transition-colors text-slate-300 border-b border-white/5 last:border-0 hover:bg-accent/20 hover:text-white">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={eventsDropdownRef} onMouseEnter={() => handleMouseEnter("events")} onMouseLeave={() => handleMouseLeave("events")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-xs font-bold uppercase transition-all ${showEventsDropdown ? "bg-accent/20 border-accent/40 shadow-neo-mini" : "border-transparent text-slate-300 hover:text-white hover:bg-white/5"}`}>
                            Events <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showEventsDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showEventsDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-xl overflow-hidden z-[60] mt-2 backdrop-blur-xl">
                                <div className="py-1">
                                    {eventsOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase transition-colors text-slate-300 border-b border-white/5 last:border-0 hover:bg-accent/20 hover:text-white">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={projectsDropdownRef} onMouseEnter={() => handleMouseEnter("projects")} onMouseLeave={() => handleMouseLeave("projects")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-xs font-bold uppercase transition-all ${showProjectsDropdown ? "bg-accent/20 border-accent/40 shadow-neo-mini" : "border-transparent text-slate-300 hover:text-white hover:bg-white/5"}`}>
                            Projects <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showProjectsDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showProjectsDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-xl overflow-hidden z-[60] mt-2 backdrop-blur-xl">
                                <div className="py-1">
                                    {projectsOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase transition-colors text-slate-300 border-b border-white/5 last:border-0 hover:bg-accent/20 hover:text-white">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={teamDropdownRef} onMouseEnter={() => handleMouseEnter("team")} onMouseLeave={() => handleMouseLeave("team")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-xs font-bold uppercase transition-all ${showTeamDropdown ? "bg-accent/20 border-accent/40 shadow-neo-mini" : "border-transparent text-slate-300 hover:text-white hover:bg-white/5"}`}>
                            Team <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTeamDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showTeamDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-xl overflow-hidden z-[60] mt-2 backdrop-blur-xl">
                                <div className="py-1">
                                    {teamOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-bold uppercase transition-colors text-slate-300 border-b border-white/5 last:border-0 hover:bg-accent/20 hover:text-white">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setIsRightNavOpen(!isRightNavOpen)}
                        className="lg:hidden p-2 rounded-lg transition-all flex items-center justify-center w-10 h-10 text-slate-400 hover:bg-white/10"
                        title="Main Site Navigation"
                    >
                        {isRightNavOpen ? <X className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={() => {}}
                        className="p-2 rounded-lg transition text-slate-400 hover:bg-white/10"
                        title="Messages"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg transition relative text-slate-400 hover:bg-white/10"
                        >
                            <Bell className="w-5 h-5" />
                        </button>

                        {showNotifications && (
                            <div className="fixed right-2 left-2 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-4 w-auto sm:w-96 bg-[#0a0a0a] border border-white/5 shadow-2xl animate-in slide-in-from-top-4 fade-in-0 z-50 overflow-hidden rounded-3xl backdrop-blur-xl">
                                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-accent/10">
                                    <h3 className="font-bold text-xs text-white uppercase tracking-widest">
                                        System Protocol Alerts
                                    </h3>
                                    <button
                                        onClick={() => showNotificationInput ? handleCancelInput() : setShowNotificationInput(true)}
                                        className="text-[10px] px-3 py-1.5 border border-white/10 rounded-xl font-bold uppercase transition-all bg-white/5 text-white hover:bg-accent/40"
                                    >
                                        {showNotificationInput ? "Abort" : "+ Push"}
                                    </button>
                                </div>

                                {showNotificationInput && (
                                    <div className="p-4 border-b border-white/5 bg-black/40">
                                        <textarea
                                            value={notificationMessage}
                                            onChange={(e) => setNotificationMessage(e.target.value)}
                                            placeholder="Type message to push..."
                                            className="w-full text-sm p-3 border border-white/10 rounded-lg focus:ring-1 focus:ring-accent focus:border-transparent outline-none transition-all resize-none bg-black/60 text-white placeholder-slate-500"
                                            rows="2"
                                        />
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={!notificationMessage.trim() || isSending}
                                            className={`mt-3 w-full py-2 text-xs font-bold uppercase tracking-wide text-white rounded-lg transition flex items-center justify-center gap-2 ${!notificationMessage.trim() || isSending
                                                ? "bg-slate-700 cursor-not-allowed"
                                                : "bg-accent hover:bg-accent-magenta shadow-lg"
                                                }`}
                                        >
                                            {isSending ? "Processing..." : (editNotificationId ? "Update Alert" : "Push Alert")}
                                        </button>
                                    </div>
                                )}

                                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition group/item"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-sm flex-1 text-slate-300">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => startEditNotification(notif, e)}
                                                            className="p-1 rounded text-blue-400 hover:text-blue-300"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                            className="p-1 rounded text-red-400 hover:text-red-300"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs mt-1.5 text-slate-500">
                                                    {notif.time}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No activity logs</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 text-white hover:bg-red-500/20 hover:border-red-500/40 rounded-xl transition-all font-bold text-xs uppercase"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col pt-20 min-h-screen relative bg-bg">
                <div className="flex flex-1">
                    <aside
                        className={`
                            fixed lg:sticky top-20 left-0 z-40 
                            h-[calc(100vh-80px)] transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                            ${isMobile ? "w-72 shadow-2xl" : isSidebarOpen ? "w-72 border-r border-white/5" : "w-0 overflow-hidden"}
                            bg-black/20 backdrop-blur-md
                        `}
                    >
                        <div className="h-full flex flex-col">
                            <nav className="overflow-y-auto space-y-2 px-4 pt-6">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname === "/admin");
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                navigate(item.path);
                                                if (isMobile) setIsSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border group ${isActive
                                                ? "bg-white/5 border-accent text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white font-bold"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "group-hover:text-accent"} transition-colors`} />
                                                <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto mb-8 mx-4 p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-lg overflow-hidden flex-none">
                                        <UserCog size={24} className="text-accent" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold uppercase truncate text-white leading-tight">{user?.username || "Admin User"}</p>
                                        <div className="inline-block bg-accent-magenta/20 border border-accent-magenta/30 px-1 rounded-sm mt-1">
                                            <p className="text-[8px] font-bold uppercase tracking-tighter text-accent-magenta">Super Admin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 w-full min-w-0">
                        <div className="p-4 lg:p-6 xl:p-8 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
                
                <footer className="relative z-10 border-t border-white/5 py-8 bg-black/40 backdrop-blur-md">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-2">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center">
                      © {new Date().getFullYear()} Collaboration and Innovation Development Cell (CID). Neural Command Established.
                    </p>
                  </div>
                </footer>
            </div>

            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isRightNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRightNavOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-80 shadow-2xl transition-transform duration-300 ease-in-out transform ${isRightNavOpen ? "translate-x-0" : "translate-x-full"} bg-[#0a0a0a] border-l border-white/5 backdrop-blur-xl`}>
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Site Protocols</h2>
                        <button onClick={() => setIsRightNavOpen(false)} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-3 overflow-y-auto h-[calc(100vh-80px)]">
                        <Link to="/" onClick={() => setIsRightNavOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all text-slate-400 hover:bg-white/5 hover:text-white">
                            <Home className="w-5 h-5 text-accent" /> Home
                        </Link>

                        {[
                            { label: "Users", options: usersOptions, icon: Users },
                            { label: "Events", options: eventsOptions, icon: Calendar },
                            { label: "Projects", options: projectsOptions, icon: Folder },
                            { label: "Team", options: teamOptions, icon: Shield },
                        ].map((group, idx) => {
                            const isExpanded = expandedMobileCategory === group.label;
                            return (
                                <div key={idx} className="space-y-1">
                                    <button
                                        onClick={() => setExpandedMobileCategory(isExpanded ? null : group.label)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${isExpanded
                                            ? "bg-accent/10 border-accent/40 text-white font-bold"
                                            : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <group.icon className={`w-5 h-5 ${isExpanded ? "text-accent" : ""}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{group.label}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                    </button>

                                    {isExpanded && (
                                        <div className="pl-12 pr-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                            {group.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleDropdownItemClick(opt.path)}
                                                    className="w-full text-left py-2 text-[10px] font-bold uppercase transition-colors text-slate-500 hover:text-accent"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
