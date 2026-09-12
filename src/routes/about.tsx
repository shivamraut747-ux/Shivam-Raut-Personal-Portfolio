import { createFileRoute, Link } from "@tanstack/react-router";
import shivamPhoto from "@/assets/shivam-raut-photo.jpg";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({ component: AboutPage });

export function AboutPage() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-wrapper about-page">
      <SiteHeader activeItem="about" />

      <main className="content about">
        <section className="about-main">
          <div className="about-container">
            <div className="about-split-layout">
              {/* Left Column: Title, Intro, and Story */}
              <div className="about-left-col">
                <h1 className="about-title">about.</h1>
                <p className="about-intro">
                  I'm Shivam Raut, a Full-Stack Web Developer based in Maharashtra, India.
                </p>

                <div className="about-body">
                  <p>
                    I enjoy using technology to solve problems and build useful web applications.
                    When I'm not coding or exploring new tools, you'll find me watching web
                    series, playing CODM, or exploring nature.
                  </p>
                </div>
              </div>

              {/* Right Column: Photo */}
              <div className="about-right-col">
                <div className="about-photo-card">
                  <img src={shivamPhoto} alt="Shivam Raut" />
                </div>
              </div>
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

