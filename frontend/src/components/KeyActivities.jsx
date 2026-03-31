import { Link } from 'react-router-dom';
import {
  MonitorSmartphone,
  Trophy,
  FolderGit2,
  Globe,
  Mic2,
  ArrowRight
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const activities = [
  {
    icon: MonitorSmartphone,
    title: 'Workshops',
    desc: 'Hands-on sessions on Web Dev, AI/ML, Cybersecurity, Cloud, and IoT.',
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
  },
  {
    icon: Trophy,
    title: 'Hackathons',
    desc: 'Intra- and inter-college hackathons to solve real-world problems in 24-48 hours.',
    color: 'text-accent-magenta',
    bg: 'bg-accent-magenta/10',
  },
  {
    icon: FolderGit2,
    title: 'Projects',
    desc: 'Micro, Macro, and Capstone projects built with industry-standard technologies.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Globe,
    title: 'Open Source',
    desc: 'Active contributions to open-source repositories and Git/GitHub programs.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Mic2,
    title: 'Guest Lectures',
    desc: 'Sessions with industry experts and alumni sharing real-world insights.',
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
  },
];

export default function KeyActivities() {
  return (
    <section className="w-full min-h-screen flex items-center py-20 bg-transparent relative overflow-hidden z-0">
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute right-10 bottom-10 font-heading font-black text-6xl md:text-8xl text-white opacity-[0.02] transform rotate-3 pointer-events-none z-0 tracking-widest hidden sm:block">ACTIVITIES</div>

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="What We Do"
          title="Key Activities"
          description="From workshops to hackathons, CID-Cell offers diverse opportunities to learn, build, and grow."
          compact
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {activities.map(({ icon: Icon, title, desc, color, bg }, idx) => (
            <ScrollReveal key={title} delay={idx * 100}>
            <div className="glass-panel p-6 group flex flex-col items-start h-full relative z-10 hover:-translate-y-1">
              <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-glass`}>
                <Icon size={24} />
              </div>
              <h3 className="font-heading font-semibold text-xl text-white mb-3 tracking-wide">{title}</h3>
              <p className="text-secondary font-medium text-sm leading-relaxed border-l-2 border-border pl-4 group-hover:border-accent/50 transition-colors">{desc}</p>
            </div>
            </ScrollReveal>
          ))}

          {/* CTA card */}
          <Link
            to="/events"
            className="glass-card p-6 flex flex-col items-center justify-center text-center group lg:col-span-1 relative z-10"
          >
            <div className="w-16 h-16 bg-white/5 border border-border rounded-full flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent group-hover:shadow-glow-purple transition-all duration-300">
               <ArrowRight size={24} className="text-secondary group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-white mb-2 tracking-wide">
              Explore Matrix
            </h3>
            <p className="text-secondary font-medium text-xs uppercase tracking-widest mt-2">View Event Logs</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
