import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ExternalLink, ArrowLeft, FileText, Mail } from "lucide-react";

export const Route = createFileRoute("/resume")({ component: ResumePage });

export function ResumePage() {
  const resumeUrl = "/Shivam_Vilas_Raut_Resume.pdf";
  const googleDocsViewerUrl =
    "https://docs.google.com/viewer?url=" +
    encodeURIComponent("https://shivamraut.me/Shivam_Vilas_Raut_Resume.pdf") +
    "&embedded=true";

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-wrapper resume-page">
      <main className="content resume">
        <section className="resume-main">
          <div className="resume-container">
            {/* Header / Intro */}
            <div className="resume-header-block">
              <div className="resume-back-link">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={16} />
                  <span>Back to Home</span>
                </Link>
              </div>

              <div className="resume-title-row">
                <div>
                  <h1 className="resume-title">resume.</h1>
                  <p className="resume-intro">
                    Curriculum Vitae • Shivam Vilas Raut
                  </p>
                </div>

                <div className="resume-actions-row">
                  <a
                    href={resumeUrl}
                    download="Shivam_Vilas_Raut_Resume.pdf"
                    className="resume-action-btn primary"
                  >
                    <Download size={16} />
                    <span>Download PDF</span>
                  </a>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-action-btn secondary"
                  >
                    <ExternalLink size={16} />
                    <span>Open Raw File</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="resume-viewer-container">
              <object
                data={resumeUrl}
                type="application/pdf"
                className="resume-pdf-frame"
              >
                <iframe
                  src={googleDocsViewerUrl}
                  title="Shivam Vilas Raut Resume"
                  className="resume-pdf-frame"
                />
              </object>
            </div>

            {/* Mobile Fallback Card */}
            <div className="resume-mobile-help">
              <FileText size={20} className="text-primary" />
              <div className="text-left flex-1">
                <p className="font-semibold text-sm">Having trouble viewing on your phone?</p>
                <p className="text-xs text-muted-foreground">
                  Tap below to save the PDF directly to your device or open in Google Drive.
                </p>
              </div>
              <a
                href={resumeUrl}
                download="Shivam_Vilas_Raut_Resume.pdf"
                className="resume-mobile-dl-btn"
              >
                <Download size={14} />
                <span>Download</span>
              </a>
            </div>

            {/* Quick Contact CTA */}
            <div className="resume-contact-cta">
              <div>
                <h3 className="text-lg font-bold">Interested in working together?</h3>
                <p className="text-sm text-muted-foreground">
                  Feel free to reach out for full-time opportunities, collaborations, or freelance projects.
                </p>
              </div>
              <Link to="/contact" className="resume-contact-btn">
                <Mail size={16} />
                <span>Contact Shivam</span>
              </Link>
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
