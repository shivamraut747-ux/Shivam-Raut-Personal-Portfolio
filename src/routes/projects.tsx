import { createFileRoute, Link } from "@tanstack/react-router";
import Component, { ProjectData } from "@/components/ui/stacking-card";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

const projects: ProjectData[] = [
  {
    title: "Face Detection System",
    description: `Built a real-time facial recognition attendance management system using Python, Streamlit, and OpenCV — designed to automate manual attendance tracking and eliminate proxy attendance.

Key features:
- Live face recognition via webcam using the face_recognition library (dlib-based deep learning embeddings) + OpenCV
- Automatic timestamped attendance logging per subject/course, with duplicate-entry detection
- Admin dashboard for managing student registrations, subjects, and teachers
- Attendance reports with date/subject filtering and CSV export for logs and absentee lists
- SQLite database for lightweight, persistent local storage
- Streamlit-WebRTC integration for smooth real-time video streaming in-browser

This project deepened my understanding of end-to-end computer vision pipelines — from face detection and embedding generation to building a usable admin interface around it — while solving real challenges like duplicate detection and reliable webcam handling across environments.`,
    link: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    color: "#1e293b",
    tags: [
      "Python",
      "OpenCV",
      "Streamlit",
      "Computer Vision",
      "Machine Learning",
      "CNN",
    ],
    githubUrl: "https://github.com/shivamraut747-ux/Face-Detection-System",
  },
  {
    title: "Tourist Website",
    description:
      "An interactive travel and tourism web application built with HTML5, CSS3, JavaScript, and MySQL. Features curated holiday destination guides, dynamic exploration previews, custom trip itineraries, and structured relational database storage for booking and destination records.",
    link: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    color: "#0f766e",
    tags: ["HTML5", "CSS3", "JavaScript", "MySQL", "Web Development"],
    githubUrl: "https://github.com/shivamraut747-ux",
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
