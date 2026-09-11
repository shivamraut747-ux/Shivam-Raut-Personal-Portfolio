import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68L14.543 10.34 24 22.846h-7.406l-5.8-7.584-6.64 7.584H.472l8.598-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153zm-1.29 19.52h2.039L6.486 3.21H4.298L17.61 20.673z" />
    </svg>
  );
}

function ContactPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    const mailtoUrl = `mailto:shivamraut747@gmail.com?subject=${encodeURIComponent(
      name ? `Portfolio inquiry from ${name}` : "Portfolio inquiry"
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-wrapper contact-page">
      <SiteHeader activeItem="contact" />

      <main className="content contact">
        <section className="contact-main">
          <div className="contact-container">
            <div className="contact-split-layout">
              {/* Left Column: Title, Intro, and 2x2 Official App Logos */}
              <div className="contact-left-col">
                <h1 className="contact-title">contact.</h1>
                <p className="contact-intro">
                  Get in touch with me via social media
                  <br />
                  or send me an email.
                </p>

                <ul className="social-disc-grid" aria-label="Official social links">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/shivam-raut-9a9986376/"
                      target="_blank"
                      rel="noreferrer"
                      className="social-disc-link linkedin"
                    >
                      <span className="disc-icon">
                        <LinkedInLogo />
                      </span>
                      <span className="disc-label">LinkedIn</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/shivamraut747-ux"
                      target="_blank"
                      rel="noreferrer"
                      className="social-disc-link github"
                    >
                      <span className="disc-icon">
                        <GitHubLogo />
                      </span>
                      <span className="disc-label">GitHub</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/ishivamr?stkn=aDBqZm84MGkxODl6"
                      target="_blank"
                      rel="noreferrer"
                      className="social-disc-link instagram"
                    >
                      <span className="disc-icon">
                        <InstagramLogo />
                      </span>
                      <span className="disc-label">Instagram</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/shivamraut92"
                      target="_blank"
                      rel="noreferrer"
                      className="social-disc-link x-brand"
                    >
                      <span className="disc-icon">
                        <XLogo />
                      </span>
                      <span className="disc-label">X</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right Column: Send me an email (Replacing the photo area) */}
              <div className="contact-right-col">
                <div className="form-card">
                  <h2 className="form-section-title">Send me an email</h2>

                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row-2col">
                      <div className="form-field">
                        <label htmlFor="contact-name">Name</label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="contact-email">Email</label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder="Your email address"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Your message..."
                      />
                    </div>

                    <div className="form-submit-row">
                      <button type="submit" className="contact-submit-btn">
                        Send email
                      </button>
                    </div>
                  </form>
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



