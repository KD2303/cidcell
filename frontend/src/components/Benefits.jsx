import { Cpu, Target, Award, Flame } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const benefits = [
  {
    icon: Cpu,
    title: 'Technical Skills',
    desc: 'Master programming, full-stack development, AI/ML, cloud computing, and emerging technologies through structured learning.',
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10'
  },
  {
    icon: Target,
    title: 'Career Readiness',
    desc: 'Build a strong portfolio, gain interview experience, and develop soft skills that make you stand out to recruiters.',
    color: 'text-accent-magenta',
    bg: 'bg-accent-magenta/10'
  },
  {
    icon: Award,
    title: 'Leadership',
    desc: 'Take ownership of projects, lead teams, mentor juniors, and build leadership skills that last a lifetime.',
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    icon: Flame,
    title: 'Innovation Culture',
    desc: 'Be part of an ecosystem that celebrates creativity, experimentation, and out-of-the-box thinking.',
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
];

export default function Benefits() {
  return (
    <section className="w-full min-h-screen flex items-center bg-transparent relative overflow-hidden py-20 z-0">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent transform -rotate-3 z-0"></div>
      <div className="absolute right-0 top-0 w-[400px] h-[400px] border-[1px] border-white/5 rounded-full z-0 hidden md:block"></div>
      <div className="absolute right-[50px] top-[50px] w-[300px] h-[300px] border-[1px] border-white/5 rounded-full z-0 hidden md:block"></div>
      
      <div className="absolute left-10 bottom-20 font-heading font-black text-6xl md:text-8xl text-white opacity-[0.02] transform -rotate-90 origin-bottom-left pointer-events-none z-0 hidden sm:block">GROWTH</div>

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="Why Join"
          title="Benefits of CID-Cell"
          description="Joining CID-Cell gives you access to a transformative learning environment that goes far beyond the classroom."
          compact
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map(({ icon: Icon, title, desc, color, bg }, idx) => (
            <ScrollReveal key={title} delay={idx * 100} className="h-full">
            <div className="glass-panel p-8 flex flex-col items-center text-center group h-full relative z-10">
              <div className={`w-16 h-16 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-glass`}>
                <Icon size={32} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-4 tracking-wide">{title}</h3>
              <p className="text-secondary text-sm font-medium leading-relaxed">{desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
