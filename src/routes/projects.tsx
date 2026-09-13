import { createFileRoute, Link } from "@tanstack/react-router";
import Component, { ProjectData } from "@/components/ui/stacking-card";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

const projects: ProjectData[] = [
  {
    title: "Face Detection System",
    description:
      "An intelligent real-time face detection and biometric recognition platform engineered with deep neural networks and computer vision algorithms. It features live multi-face tracking, landmark analysis, and instant classification.",
    link: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    color: "#1e293b",
    tags: ["Python", "OpenCV", "TensorFlow", "Deep Learning"],
    githubUrl: "https://github.com/shivamraut747-ux",
    liveUrl: "https://github.com/shivamraut747-ux",
  },
  {
    title: "Tourist Website",
    description:
      "A modern full-stack travel and tourism discovery portal designed for exploring world destinations, booking curated vacation itineraries, viewing interactive location previews, and navigating responsive route guides.",
    link: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    color: "#0f766e",
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    githubUrl: "https://github.com/shivamraut747-ux",
    liveUrl: "https://github.com/shivamraut747-ux",
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
            <div className="projects-header-block text-center">
              <h1 className="projects-title">projects.</h1>
              <p className="projects-intro">
                A selection of web development, full-stack applications, and machine learning systems I've built.
              </p>
            </div>

            <Component projects={projects} />
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
