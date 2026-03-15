import { useMemo, useState } from 'react';
import {
  ExternalLink,
  Search,
  Sparkles,
  BriefcaseBusiness,
  Wrench,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

const roleBasedRoadmaps = [
  { label: 'Frontend', url: 'https://roadmap.sh/frontend' },
  { label: 'Backend', url: 'https://roadmap.sh/backend' },
  { label: 'Full Stack', url: 'https://roadmap.sh/full-stack' },
  { label: 'DevOps', url: 'https://roadmap.sh/devops' },
  { label: 'DevSecOps', url: 'https://roadmap.sh/devsecops' },
  { label: 'Data Analyst', url: 'https://roadmap.sh/data-analyst' },
  { label: 'AI Engineer', url: 'https://roadmap.sh/ai-engineer' },
  { label: 'AI and Data Scientist', url: 'https://roadmap.sh/ai-data-scientist' },
  { label: 'Data Engineer', url: 'https://roadmap.sh/data-engineer' },
  { label: 'Android', url: 'https://roadmap.sh/android' },
  { label: 'Machine Learning', url: 'https://roadmap.sh/machine-learning' },
  { label: 'PostgreSQL', url: 'https://roadmap.sh/postgresql-dba' },
  { label: 'iOS', url: 'https://roadmap.sh/ios' },
  { label: 'Blockchain', url: 'https://roadmap.sh/blockchain' },
  { label: 'QA', url: 'https://roadmap.sh/qa' },
  { label: 'Software Architect', url: 'https://roadmap.sh/software-architect' },
  { label: 'Cyber Security', url: 'https://roadmap.sh/cyber-security' },
  { label: 'UX Design', url: 'https://roadmap.sh/ux-design' },
  { label: 'Technical Writer', url: 'https://roadmap.sh/technical-writer' },
  { label: 'Game Developer', url: 'https://roadmap.sh/game-developer' },
  { label: 'Server Side Game Developer', url: 'https://roadmap.sh/server-side-game-developer' },
  { label: 'MLOps', url: 'https://roadmap.sh/mlops' },
  { label: 'Product Manager', url: 'https://roadmap.sh/product-manager' },
  { label: 'Engineering Manager', url: 'https://roadmap.sh/engineering-manager' },
  { label: 'Developer Relations', url: 'https://roadmap.sh/devrel' },
  { label: 'BI Analyst', url: 'https://roadmap.sh/bi-analyst' },
];

const skillBasedRoadmaps = [
  { label: 'SQL', url: 'https://roadmap.sh/sql' },
  { label: 'Computer Science', url: 'https://roadmap.sh/computer-science' },
  { label: 'React', url: 'https://roadmap.sh/react' },
  { label: 'Vue', url: 'https://roadmap.sh/vue' },
  { label: 'Angular', url: 'https://roadmap.sh/angular' },
  { label: 'JavaScript', url: 'https://roadmap.sh/javascript' },
  { label: 'TypeScript', url: 'https://roadmap.sh/typescript' },
  { label: 'Node.js', url: 'https://roadmap.sh/nodejs' },
  { label: 'Python', url: 'https://roadmap.sh/python' },
  { label: 'System Design', url: 'https://roadmap.sh/system-design' },
  { label: 'Java', url: 'https://roadmap.sh/java' },
  { label: 'ASP.NET Core', url: 'https://roadmap.sh/aspnet-core' },
  { label: 'API Design', url: 'https://roadmap.sh/api-design' },
  { label: 'Spring Boot', url: 'https://roadmap.sh/spring-boot' },
  { label: 'Flutter', url: 'https://roadmap.sh/flutter' },
  { label: 'C++', url: 'https://roadmap.sh/cpp' },
  { label: 'Rust', url: 'https://roadmap.sh/rust' },
  { label: 'Go Roadmap', url: 'https://roadmap.sh/golang' },
  { label: 'Design and Architecture', url: 'https://roadmap.sh/software-design-architecture' },
  { label: 'GraphQL', url: 'https://roadmap.sh/graphql' },
  { label: 'React Native', url: 'https://roadmap.sh/react-native' },
  { label: 'Design System', url: 'https://roadmap.sh/design-system' },
  { label: 'Prompt Engineering', url: 'https://roadmap.sh/prompt-engineering' },
  { label: 'MongoDB', url: 'https://roadmap.sh/mongodb' },
  { label: 'Linux', url: 'https://roadmap.sh/linux' },
  { label: 'Kubernetes', url: 'https://roadmap.sh/kubernetes' },
  { label: 'Docker', url: 'https://roadmap.sh/docker' },
  { label: 'AWS', url: 'https://roadmap.sh/aws' },
  { label: 'Terraform', url: 'https://roadmap.sh/terraform' },
  { label: 'Data Structures and Algorithms', url: 'https://roadmap.sh/datastructures-and-algorithms' },
  { label: 'Redis', url: 'https://roadmap.sh/redis' },
  { label: 'Git and GitHub', url: 'https://roadmap.sh/git-github' },
  { label: 'PHP', url: 'https://roadmap.sh/php' },
  { label: 'Cloudflare', url: 'https://roadmap.sh/cloudflare' },
  { label: 'AI Red Teaming', url: 'https://roadmap.sh/ai-red-teaming' },
  { label: 'AI Agents', url: 'https://roadmap.sh/ai-agents' },
  { label: 'Next.js', url: 'https://roadmap.sh/nextjs' },
  { label: 'Code Review', url: 'https://roadmap.sh/code-review' },
  { label: 'Kotlin', url: 'https://roadmap.sh/kotlin' },
  { label: 'HTML', url: 'https://roadmap.sh/html' },
  { label: 'CSS', url: 'https://roadmap.sh/css' },
  { label: 'Swift and Swift UI', url: 'https://roadmap.sh/swift' },
  { label: 'Shell / Bash', url: 'https://roadmap.sh/linux' },
  { label: 'Laravel', url: 'https://roadmap.sh/laravel' },
  { label: 'Elasticsearch', url: 'https://roadmap.sh/elasticsearch' },
  { label: 'WordPress', url: 'https://roadmap.sh/wordpress' },
  { label: 'Django', url: 'https://roadmap.sh/django' },
  { label: 'Ruby', url: 'https://roadmap.sh/ruby' },
  { label: 'Ruby on Rails', url: 'https://roadmap.sh/ruby-on-rails' },
  { label: 'Claude Code', url: 'https://roadmap.sh/claude-code', isNew: true },
  { label: 'Vibe Coding', url: 'https://roadmap.sh/vibe-coding', isNew: true },
];

const projectIdeas = [
  { label: 'Frontend', url: 'https://roadmap.sh/projects/frontend' },
  { label: 'Backend', url: 'https://roadmap.sh/projects/backend' },
  { label: 'DevOps', url: 'https://roadmap.sh/projects/devops' },
];

const bestPractices = [
  { label: 'AWS', url: 'https://roadmap.sh/best-practices/aws' },
  { label: 'API Security', url: 'https://roadmap.sh/best-practices/api-security' },
  { label: 'Backend Performance', url: 'https://roadmap.sh/best-practices/backend-performance' },
  { label: 'Frontend Performance', url: 'https://roadmap.sh/best-practices/frontend-performance' },
  { label: 'Code Review', url: 'https://roadmap.sh/best-practices/code-review' },
];

const sections = [
  {
    title: 'Role-based Roadmaps',
    items: roleBasedRoadmaps,
    icon: BriefcaseBusiness,
    cardClass: 'bg-highlight-yellow/20',
    iconClass: 'bg-highlight-yellow',
    hoverClass: 'hover:bg-highlight-yellow/50',
  },
  {
    title: 'Skill-based Roadmaps',
    items: skillBasedRoadmaps,
    icon: Wrench,
    cardClass: 'bg-highlight-blue/25',
    iconClass: 'bg-highlight-blue',
    hoverClass: 'hover:bg-highlight-blue/70',
  },
  {
    title: 'Project Ideas',
    items: projectIdeas,
    icon: Lightbulb,
    cardClass: 'bg-highlight-pink/20',
    iconClass: 'bg-highlight-pink',
    hoverClass: 'hover:bg-highlight-pink/45',
  },
  {
    title: 'Best Practices',
    items: bestPractices,
    icon: ShieldCheck,
    cardClass: 'bg-highlight-teal/20',
    iconClass: 'bg-highlight-teal',
    hoverClass: 'hover:bg-highlight-teal/45',
  },
];

function RoadmapButton({ item, hoverClass }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between gap-3 border-2 p-3 md:p-4 font-bold uppercase text-xs md:text-sm transition-all shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
        item.isCustom
          ? 'border-dashed border-primary bg-highlight-yellow'
          : `border-primary bg-white ${hoverClass}`
      }`}
    >
      <span className="text-primary text-left leading-tight">{item.label}</span>
      <div className="flex items-center gap-2 shrink-0">
        {item.isNew && (
          <span className="border border-primary bg-highlight-pink px-2 py-0.5 text-[10px] leading-none">New</span>
        )}
        <ExternalLink size={14} className="text-primary" />
      </div>
    </a>
  );
}

export default function Roadmap() {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((section) => section.items.length > 0);
  }, [normalizedQuery]);

  return (
    <div className="bg-bg min-h-screen pt-32 pb-16 border-b-3 border-primary relative overflow-hidden">
      <div className="pointer-events-none absolute top-16 -right-16 w-48 h-48 bg-highlight-purple/30 border-3 border-primary rounded-full blur-sm"></div>
      <div className="pointer-events-none absolute bottom-20 -left-12 w-40 h-40 bg-highlight-teal/40 border-3 border-primary rotate-12"></div>
      <section className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform -rotate-1 mb-6 font-bold uppercase tracking-widest text-xs sm:text-sm text-primary">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={14} />
              Developer Growth Hub
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-none mb-5 text-primary">
            Learning <span className="bg-highlight-yellow px-2 border-3 border-primary transform -skew-x-6 inline-block">Roadmaps</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-lg font-medium text-primary border-l-4 border-primary pl-4 text-left bg-white/60 p-4 shadow-neo-sm">
            Pick a role, skill, project track, or best-practice path and jump directly to roadmap.sh resources.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <label htmlFor="roadmap-search" className="sr-only">Search roadmap buttons</label>
          <div className="flex items-center gap-3 bg-gradient-to-r from-white to-highlight-yellow/30 border-3 border-primary px-4 py-3 shadow-neo">
            <Search size={18} className="text-primary shrink-0" />
            <input
              id="roadmap-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roadmaps, skills, and tracks..."
              className="w-full bg-transparent outline-none text-sm md:text-base font-semibold text-primary placeholder:text-primary/60"
            />
          </div>
        </div>

        {filteredSections.length === 0 ? (
          <div className="bg-white border-3 border-primary shadow-neo p-8 text-center font-bold uppercase text-primary tracking-wide">
            No roadmap matches your search.
          </div>
        ) : (
          <div className="space-y-10">
            {filteredSections.map((section) => (
              <section key={section.title} className={`${section.cardClass} border-3 border-primary shadow-neo p-4 md:p-6`}>
                <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-primary mb-4 flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 border-2 border-primary ${section.iconClass} shadow-neo-sm`}>
                    <section.icon size={18} />
                  </span>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {section.items.map((item) => (
                    <RoadmapButton key={`${section.title}-${item.label}`} item={item} hoverClass={section.hoverClass} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
