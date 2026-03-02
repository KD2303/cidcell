import { useState } from 'react';
import { ExternalLink, Github, Filter } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const categories = ['All', 'Capstone', 'Macro', 'Micro', 'Open Source'];

const projects = [
  {
    title: 'Smart Campus Management System',
    category: 'Capstone',
    tech: ['React', 'Node.js', 'MongoDB', 'IoT'],
    desc: 'An integrated campus management platform with automated attendance, smart energy management, and real-time analytics dashboard.',
    github: '#',
  },
  {
    title: 'AI-Powered Placement Predictor',
    category: 'Capstone',
    tech: ['Python', 'TensorFlow', 'Flask', 'React'],
    desc: 'Machine learning model that predicts student placement probability based on academic performance, skills, and extracurriculars.',
    github: '#',
  },
  {
    title: 'E-Commerce Microservices Platform',
    category: 'Capstone',
    tech: ['Spring Boot', 'Docker', 'Kubernetes', 'PostgreSQL'],
    desc: 'Scalable e-commerce platform built with microservices architecture, containerized deployment, and CI/CD pipeline.',
    github: '#',
  },
  {
    title: 'Collaborative Code Editor',
    category: 'Macro',
    tech: ['React', 'Socket.io', 'Express', 'Monaco Editor'],
    desc: 'Real-time collaborative code editor with syntax highlighting, multi-language support, and live chat functionality.',
    github: '#',
  },
  {
    title: 'College Event Management Portal',
    category: 'Macro',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    desc: 'Full-featured event management system with registration, QR-based check-in, and real-time event updates.',
    github: '#',
  },
  {
    title: 'Personal Finance Tracker',
    category: 'Macro',
    tech: ['React Native', 'Firebase', 'Chart.js'],
    desc: 'Mobile application for tracking personal expenses, setting budgets, and visualizing spending patterns.',
    github: '#',
  },
  {
    title: 'Weather Dashboard',
    category: 'Micro',
    tech: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
    desc: 'Clean weather dashboard displaying real-time weather data, forecasts, and location-based information.',
    github: '#',
  },
  {
    title: 'Todo CLI Application',
    category: 'Micro',
    tech: ['Python', 'Click', 'SQLite'],
    desc: 'Command-line task manager with priorities, due dates, categories, and export capabilities.',
    github: '#',
  },
  {
    title: 'Portfolio Generator',
    category: 'Micro',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    desc: 'Template-based portfolio website generator where students can input their data and generate a hosted portfolio.',
    github: '#',
  },
  {
    title: 'VS Code Extension — Snippet Manager',
    category: 'Open Source',
    tech: ['TypeScript', 'VS Code API'],
    desc: 'Open-source VS Code extension for managing, sharing, and syncing code snippets across devices.',
    github: '#',
  },
  {
    title: 'Documentation Site Builder',
    category: 'Open Source',
    tech: ['MDX', 'Next.js', 'Tailwind CSS'],
    desc: 'Contributed to an open-source documentation framework with custom themes and search functionality.',
    github: '#',
  },
  {
    title: 'GitHub Profile Analyzer',
    category: 'Open Source',
    tech: ['Python', 'GitHub API', 'Streamlit'],
    desc: 'Open-source tool that analyzes GitHub profiles and generates contribution reports and skill assessments.',
    github: '#',
  },
];

export default function Projects() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 bg-bg relative overflow-hidden border-b-3 border-primary">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[-50px] w-64 h-64 bg-highlight-purple rounded-full border-3 border-primary shadow-neo opacity-50 blur-sm"></div>
        <div className="absolute bottom-10 left-[-50px] w-40 h-40 bg-highlight-teal border-3 border-primary transform rotate-12 shadow-neo"></div>

        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform -rotate-1 mb-6">
            <span className="font-bold uppercase tracking-widest text-sm">
              Our Work
            </span>
          </div>
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-black text-primary mb-6 uppercase leading-none">
            Projects <span className="bg-highlight-yellow px-2 border-3 border-primary transform -skew-x-6 inline-block">Portfolio</span>
          </h1>
          <p className="text-primary font-medium text-xl max-w-2xl mx-auto border-l-4 border-primary pl-4 bg-white/50 backdrop-blur-sm p-4 rounded-r-xl border-y-2 border-r-2 shadow-neo-sm">
            Explore the diverse range of projects built by CID-Cell members — from beginner micro projects to industry-grade capstone solutions.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-white">
        <div className="container-max mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <div className="bg-white border-3 border-primary p-2 rounded-full shadow-neo flex flex-wrap gap-2">
              <span className="flex items-center px-4 font-bold uppercase text-primary text-sm">
                 <Filter size={18} className="mr-2" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold uppercase border-2 transition-all ${
                    active === cat
                      ? 'bg-primary text-white border-primary shadow-none transform translate-y-[1px]'
                      : 'bg-white text-primary border-transparent hover:border-primary hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <div
                key={project.title}
                className="neo-card flex flex-col overflow-hidden group hover:rotate-1"
              >
                {/* Color bar */}
                <div
                  className={`h-4 border-b-3 border-primary ${
                    project.category === 'Capstone'
                      ? 'bg-highlight-purple'
                      : project.category === 'Macro'
                      ? 'bg-highlight-orange'
                      : project.category === 'Micro'
                      ? 'bg-highlight-teal'
                      : 'bg-highlight-green'
                  }`}
                />
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 border-2 border-primary shadow-neo-sm ${
                        project.category === 'Capstone'
                          ? 'bg-highlight-purple'
                          : project.category === 'Macro'
                          ? 'bg-highlight-orange'
                          : project.category === 'Micro'
                          ? 'bg-highlight-teal'
                          : 'bg-highlight-green'
                      }`}
                    >
                      {project.category}
                    </span>
                    <a href={project.github} className="w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center hover:bg-highlight-yellow hover:shadow-neo-sm transition-all">
                      <Github size={20} />
                    </a>
                  </div>

                  <h3 className="font-heading text-2xl font-black text-primary mb-3 leading-tight group-hover:underline decoration-3 underline-offset-4">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 text-base font-medium leading-relaxed flex-1 mb-6 border-l-4 border-gray-200 pl-4">{project.desc}</p>

                  <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-gray-100">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 bg-gray-100 border border-primary text-primary text-xs font-bold uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No projects in this category yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* Git/GitHub CTA */}
      <section className="section-padding bg-highlight-teal border-t-3 border-primary">
        <div className="container-max mx-auto text-center">
          <div className="w-24 h-24 bg-white border-3 border-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-neo transform rotate-3 hover:rotate-0 transition-all">
            <Github size={48} className="text-primary" />
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-black text-primary mb-6 uppercase">
            Contribute on GitHub
          </h2>
          <p className="text-primary font-medium text-xl max-w-2xl mx-auto mb-10 bg-white border-2 border-primary p-6 shadow-neo-sm transform -rotate-1">
            CID-Cell actively encourages open-source contributions. Join our GitHub organization and start contributing to real-world projects.
          </p>
          <a
            href="#"
            className="btn-neo bg-black text-white hover:bg-gray-800 text-lg px-10 py-4"
          >
            Visit GitHub <ExternalLink size={20} className="ml-2" />
          </a>
        </div>
      </section>
    </>
  );
}
