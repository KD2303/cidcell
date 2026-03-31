import React, { useState, useEffect, useContext } from 'react';
import { Users, Folder, Shield, Calendar, Loader, ArrowRight, Activity, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || "";

const AdminDashboard = () => {
    const isDarkMode = true;
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        users: 0,
        projects: 0,
        members: 0,
        events: 0,
        myProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const [usersRes, projectsRes, membersRes, eventsRes] = await Promise.all([
                axios.get(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/members`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/events`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setStats({
                users: usersRes.data.length || 0,
                projects: projectsRes.data.length || 0,
                members: membersRes.data.length || 0,
                events: eventsRes.data.length || 0,
                myProjects: projectsRes.data.filter(p => p.createdBy?._id === user?._id || p.createdBy === user?._id).length || 0
            });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Ecosystem Events', value: stats.events, icon: Calendar, color: 'text-accent', bg: 'bg-accent/10', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]', path: '/admin/events' },
        { label: 'Network Projects', value: stats.projects, icon: Folder, color: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', path: '/admin/projects' },
        { label: 'Mentors & Staff', value: stats.members, icon: Shield, color: 'text-accent-magenta', bg: 'bg-accent-magenta/10', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]', path: '/admin/members' },
        { label: 'My Projects', value: stats.myProjects, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', path: '/admin/projects' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-accent rounded-full animate-ping opacity-20"></div>
                    <Loader className="w-20 h-20 animate-spin absolute top-0 left-0 text-accent stroke-[2]" />
                </div>
                <div className="bg-accent/10 border border-accent/30 px-6 py-2 rounded-full shadow-glass backdrop-blur-md">
                    <p className="text-sm font-bold text-white uppercase tracking-[0.3em]">Syncing Neural Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-8 font-sans px-4 lg:px-0 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl lg:text-5xl font-heading font-bold text-white uppercase tracking-tighter leading-tight">
                        COMMANDER: {user?.username || 'ADMIN'}
                    </h2>
                    <div className="inline-block bg-accent/10 border border-accent/20 px-4 py-1 mt-4 rounded-full backdrop-blur-md">
                        <p className="text-[10px] lg:text-xs font-bold text-accent uppercase tracking-[0.2em] leading-none">Architect Command Center</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-white/10 bg-accent/20 shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-pulse-slow"></div>
                    <div className="w-6 h-6 rounded-full border border-white/10 bg-accent-magenta/20 shadow-[0_0_15px_rgba(217,70,239,0.2)]"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">
                {statCards.map((stat, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className={`p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md transition-all text-left flex flex-col gap-4 group relative overflow-hidden hover:bg-white/10 hover:border-white/10 shadow-glass`}
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} border border-white/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.glow}`}>
                            <stat.icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-4xl font-heading font-bold leading-tight text-white uppercase tracking-tighter">{stat.value}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-slate-400 group-hover:text-slate-200 transition-colors">{stat.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="w-full p-8 lg:p-10 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-sm shadow-glass transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="font-bold text-2xl lg:text-3xl uppercase tracking-widest flex items-center gap-4 text-white">
                        <Activity className="w-8 h-8 text-accent stroke-[2]" /> SYSTEM PROTOCOLS
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button onClick={() => navigate('/admin/users')} className="p-6 border border-white/5 rounded-2xl transition-all text-left flex flex-col gap-4 bg-white/5 hover:bg-accent/10 hover:border-accent/30 group">
                        <div className="flex items-center justify-between">
                            <Users className="w-8 h-8 text-slate-300 group-hover:text-accent transition-colors stroke-[2]" />
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg uppercase tracking-tight text-white leading-none">Member Forge</h5>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-2">Identity Database</p>
                        </div>
                    </button>
                    
                    <button onClick={() => navigate('/admin/projects')} className="p-6 border border-white/5 rounded-2xl transition-all text-left flex flex-col gap-4 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 group">
                        <div className="flex items-center justify-between">
                            <Folder className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors stroke-[2]" />
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg uppercase tracking-tight text-white leading-none">Project Hub</h5>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-2">Active Repositories</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/events')} className="p-6 border border-white/5 rounded-2xl transition-all text-left flex flex-col gap-4 bg-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/30 group">
                        <div className="flex items-center justify-between">
                            <Calendar className="w-8 h-8 text-slate-300 group-hover:text-yellow-400 transition-colors stroke-[2]" />
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg uppercase tracking-tight text-white leading-none">Activity Stream</h5>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-2">Events Deployment</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/members')} className="p-6 border border-white/5 rounded-2xl transition-all text-left flex flex-col gap-4 bg-white/5 hover:bg-accent-magenta/10 hover:border-accent-magenta/30 group">
                        <div className="flex items-center justify-between">
                            <Shield className="w-8 h-8 text-slate-300 group-hover:text-accent-magenta transition-colors stroke-[2]" />
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-accent-magenta group-hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg uppercase tracking-tight text-white leading-none">Architects Hub</h5>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-2">Team Configuration</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
