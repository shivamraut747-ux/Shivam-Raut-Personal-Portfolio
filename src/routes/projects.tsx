import { createFileRoute, Link } from "@tanstack/react-router";
import { GlowCard } from "@/components/ui/glow-card";
import { ExternalLink, Github, Sparkles, Layout, Database, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  icon: React.ReactNode;
}

const projects: Project[] = [
  {
    id: "portfolio",
    title: "Personal Portfolio & Showcase",
    category: "Full-Stack Web App",
    description:
      "Modern high-contrast portfolio inspired by Adham Dannaway with interactive spotlight navigation, day/night theme toggle, and responsive typography.",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "TanStack Start"],
    githubUrl: "https://github.com/shivamraut747-ux/Shivam-Raut-Personal-Portfolio",
    liveUrl: "https://shivamraut-portfolio.lovable.app",
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    id: "taskflow",
    title: "TaskFlow - Agile Workflow Platform",
    category: "Productivity & Team Management",
    description:
      "Interactive kanban workflow management tool featuring real-time task drag-and-drop, team project boards, and sprint analytics.",
    tags: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
    githubUrl: "https://github.com/shivamraut747-ux",
    liveUrl: "https://github.com/shivamraut747-ux",
    icon: <Layout className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "ecommerce",
    title: "NextStore - Modern E-Commerce Hub",
    category: "Full-Stack E-Commerce",
    description:
      "Complete storefront application with dynamic inventory filtering, cart persistence, responsive product galleries, and checkout flow.",
    tags: ["React", "Redux Toolkit", "Express", "REST API", "Tailwind"],
    githubUrl: "https://github.com/shivamraut747-ux",
    liveUrl: "https://github.com/shivamraut747-ux",
    icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "devpulse",
    title: "DevPulse - Engineer Community Portal",
    category: "Developer Network & Blogging",
    description:
      "Platform for developers to share technical solutions, code snippets, write engineering blogs, and discuss open-source projects.",
    tags: ["TypeScript", "React", "PostgreSQL", "Prisma", "Tailwind"],
    githubUrl: "https://github.com/shivamraut747-ux",
    liveUrl: "https://github.com/shivamraut747-ux",
    icon: <Database className="w-5 h-5 text-purple-500" />,
  },
];

export function ProjectsPage() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-wrapper projects-page">
      <main className="content projects">
        <section className="projects-main">
          <div className="projects-container">
            <div className="projects-header-block">
              <h1 className="projects-title">projects.</h1>
              <p className="projects-intro">
                A selection of web development, full-stack applications, and design systems I've built.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project) => (
                <GlowCard
                  key={project.id}
                  glowColor="blue"
                  className="project-card"
                >
                  <div className="project-card-header">
                    <div className="project-icon-wrapper">{project.icon}</div>
                    <span className="project-category-badge">{project.category}</span>
                  </div>

                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-description">{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="project-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-action-link github"
                      aria-label={`${project.title} source code on GitHub`}
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action-link live"
                        aria-label={`${project.title} live demo`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="dannaway-footer">
        <div className="footer-container">
          <div className="footer-left">
            <Link to="/">© {new Date().getFullYear()} Shivam Raut</Link>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <ul>
              <li>
                <Link to="/about">about</Link>
              </li>
              <li>
                <Link to="/projects">projects</Link>
              </li>
              <li>
                <Link to="/skills">skills</Link>
              </li>
              <li>
                <Link to="/contact">contact</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-back-to-top">
          <a href="#top" onClick={scrollToTop} className="top-link">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
