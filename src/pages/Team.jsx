import { Linkedin, Github, Mail } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const teamSections = [
  {
    title: 'Faculty Coordinator',
    members: [
      {
        name: 'Dr. Rajesh Kumar',
        role: 'Faculty Coordinator, CID-Cell',
        desc: 'Associate Professor, Dept. of CSE. Specialization in AI/ML and Software Engineering.',
        linkedin: '#',
        email: 'rajesh.kumar@college.edu',
      },
    ],
  },
  {
    title: 'Core Team',
    members: [
      {
        name: 'Aarav Sharma',
        role: 'President',
        desc: 'Final year CSE. Full-stack developer with a passion for open source and community building.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Priya Patel',
        role: 'Vice President',
        desc: 'Final year CSE. UI/UX enthusiast and design lead. Experienced in product management.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Rohan Verma',
        role: 'Technical Lead',
        desc: 'Third year CSE. Backend specialist with experience in cloud architecture and DevOps.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Sneha Reddy',
        role: 'Events Lead',
        desc: 'Third year CSE. Expert event organizer who has coordinated 15+ technical events.',
        linkedin: '#',
        github: '#',
      },
    ],
  },
  {
    title: 'Technical Team',
    members: [
      {
        name: 'Karthik Nair',
        role: 'Web Development Lead',
        desc: 'Third year. MERN stack developer. Maintainer of CID-Cell website and web projects.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Ananya Singh',
        role: 'AI/ML Lead',
        desc: 'Third year. Specializes in deep learning and NLP. Published research in AI applications.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Vikram Joshi',
        role: 'Open Source Lead',
        desc: 'Second year. Active open-source contributor with 50+ GitHub contributions across multiple projects.',
        linkedin: '#',
        github: '#',
      },
      {
        name: 'Meera Iyer',
        role: 'Cybersecurity Lead',
        desc: 'Second year. CTF enthusiast and security researcher. Certified in ethical hacking.',
        linkedin: '#',
        github: '#',
      },
    ],
  },
  {
    title: 'Mentors',
    members: [
      {
        name: 'Arjun Menon',
        role: 'Industry Mentor — Google',
        desc: 'CID-Cell alumnus. Software Engineer at Google. Mentors students on system design and career growth.',
        linkedin: '#',
      },
      {
        name: 'Divya Krishnan',
        role: 'Industry Mentor — Microsoft',
        desc: 'CID-Cell alumna. Product Manager at Microsoft. Guides students on product thinking and UX.',
        linkedin: '#',
      },
    ],
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'bg-highlight-teal',
  'bg-highlight-orange',
  'bg-highlight-purple',
  'bg-highlight-pink',
  'bg-highlight-green',
  'bg-highlight-blue',
];

export default function Team() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-cream border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1 bg-black text-white text-sm font-bold uppercase mb-4 shadow-neo transform -rotate-2">
            Our People
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-black mb-6 uppercase leading-none">
            Meet the <span className="p-1 bg-highlight-purple text-black inline-block transform rotate-1 border-3 border-black shadow-small">Team</span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto border-l-4 border-black pl-4">
            The dedicated faculty, student leaders, and industry mentors who drive CID-Cell forward.
          </p>
        </div>
      </section>

      {/* Team Sections */}
      {teamSections.map((section, si) => (
        <section
          key={section.title}
          className={`section-padding ${si % 2 === 0 ? 'bg-white' : 'bg-highlight-blue'} border-b-3 border-black`}
        >
          <div className="container-max mx-auto">
            <SectionHeading subtitle={`Team`} title={section.title} />

            <div
              className={`grid gap-8 ${
                section.members.length === 1
                  ? 'max-w-md mx-auto'
                  : section.members.length === 2
                  ? 'sm:grid-cols-2 max-w-2xl mx-auto'
                  : 'sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {section.members.map((member, mi) => (
                <div
                  key={member.name}
                  className="bg-white border-3 border-black p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 text-center flex flex-col items-center h-full"
                >
                  {/* Avatar */}
                  <div
                    className={`w-24 h-24 ${
                      avatarColors[(si + mi) % avatarColors.length]
                    } flex items-center justify-center mb-5 border-3 border-black shadow-small transform rotate-1`}
                  >
                    <span className="text-black font-heading font-black text-3xl">
                      {getInitials(member.name)}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-2xl text-black uppercase leading-tight mb-2">{member.name}</h3>
                  <p className="inline-block bg-black text-white px-2 py-1 text-xs font-bold uppercase mb-3 transform -rotate-1">{member.role}</p>
                  <p className="text-black text-sm font-medium leading-relaxed mb-6 border-t-2 border-dashed border-gray-300 pt-3 w-full flex-grow">{member.desc}</p>

                  {/* Social links */}
                  <div className="flex justify-center gap-3 w-full border-t-2 border-black pt-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-blue transition-colors hover:shadow-small"
                      >
                        <Linkedin size={20} className="stroke-[2.5px]" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-yellow transition-colors hover:shadow-small"
                      >
                        <Github size={20} className="stroke-[2.5px]" />
                      </a>
                    )}
                     {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-red transition-colors hover:shadow-small"
                      >
                        <Mail size={20} className="stroke-[2.5px]" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Join the Team CTA */}
      <section className="section-padding bg-highlight-yellow border-b-3 border-black">
        <div className="container-max mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-black mb-6 uppercase">
            Want to Join the Team?
          </h2>
          <p className="text-black font-medium text-xl max-w-xl mx-auto mb-8 bg-white border-2 border-black p-4 shadow-neo transform rotate-1">
            We're always looking for passionate students who want to lead, innovate, and make an impact.
          </p>
          <a
            href="/contact"
            className="btn-neo bg-black text-white hover:bg-gray-800 text-lg px-8 py-4"
          >
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
