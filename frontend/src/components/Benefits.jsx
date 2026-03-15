import { Cpu, Target, Award, Flame } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const benefits = [
  {
    icon: Cpu,
    title: 'Technical Skills',
    desc: 'Master programming, full-stack development, AI/ML, cloud computing, and emerging technologies through structured learning.',
    color: 'bg-highlight-blue'
  },
  {
    icon: Target,
    title: 'Career Readiness',
    desc: 'Build a strong portfolio, gain interview experience, and develop soft skills that make you stand out to recruiters.',
    color: 'bg-highlight-yellow'
  },
  {
    icon: Award,
    title: 'Leadership',
    desc: 'Take ownership of projects, lead teams, mentor juniors, and build leadership skills that last a lifetime.',
    color: 'bg-highlight-purple'
  },
  {
    icon: Flame,
    title: 'Innovation Culture',
    desc: 'Be part of an ecosystem that celebrates creativity, experimentation, and out-of-the-box thinking.',
    color: 'bg-highlight-orange'
  },
];

export default function Benefits() {
  return (
    <section className="w-screen h-screen flex items-center bg-bg relative overflow-hidden">
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Why Join"
          title="Benefits of CID-Cell"
          description="Joining CID-Cell gives you access to a transformative learning environment that goes far beyond the classroom."
          compact
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc, color }, idx) => (
            <ScrollReveal key={title} delay={idx * 100}>
            <div
              className="neo-card p-6 flex flex-col items-center text-center group bg-white border-3 border-primary h-full"
            >
              <div className={`w-20 h-20 ${color} border-3 border-primary rounded-full flex items-center justify-center mb-5 shadow-neo group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all`}>
                <Icon size={34} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-black uppercase text-primary mb-3 leading-none">{title}</h3>
              <p className="text-primary text-sm font-medium leading-relaxed">{desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
