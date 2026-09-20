import { Github, Instagram, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import shivamLogo from "@/assets/wmremove-transformed.png";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import TactileButton from "@/components/ui/tactile-button";
import Switch from "@/components/ui/sky-toggle";
import { useTheme } from "@/hooks/use-theme";

const baseNavItems = [
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
];

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.901 1.153h3.68L14.543 10.34 24 22.846h-7.406l-5.8-7.584-6.64 7.584H.472l8.598-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153zm-1.29 19.52h2.039L6.486 3.21H4.298L17.61 20.673z" />
    </svg>
  );
}

function LinkedInHeaderLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
  );
}

export function SiteHeader({ activeItem }: { activeItem?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("about");

  let currentPath = "";
  try {
    const routerState = useRouterState();
    currentPath = routerState?.location?.pathname ?? "";
  } catch {
    currentPath = "";
  }

  // Scroll spy to detect active section in view
  useEffect(() => {
    const sectionIds = ["about", "projects", "skills", "contact"];
    const handleScroll = () => {
      const headerHeight = window.innerWidth <= 900 ? 74 : 92;
      const scrollPosition = window.scrollY + headerHeight + 100;

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }

      // If near page bottom, activate contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        current = "contact";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = window.innerWidth <= 900 ? 74 : 92;
      const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });
      window.history.pushState(null, "", `/#${id}`);
      setActiveSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const currentActive =
    activeItem ||
    activeSection ||
    (currentPath === "/" || currentPath.startsWith("/about")
      ? "about"
      : currentPath.startsWith("/projects")
      ? "projects"
      : currentPath.startsWith("/skills")
      ? "skills"
      : currentPath.startsWith("/contact")
      ? "contact"
      : "about");

  const activeIndex = baseNavItems.findIndex((item) => item.id === currentActive);

  const dynamicNavItems: NavItem[] = baseNavItems.map((item) => ({
    id: item.id,
    label: item.label,
    href: `#${item.id}`,
    onClick: (e) => scrollToSection(item.id, e),
  }));

  return (
    <header className="header">
      <div className="header-content">
        <a
          href="#about"
          onClick={(e) => scrollToSection("about", e)}
          className="brand-mark"
          aria-label="Shivam Raut home"
        >
          <img className="brand-logo" src={shivamLogo} alt="" />
        </a>
        <div className="header-resume-cta">
          <TactileButton
            label="Resume"
            className="resume-tactile-btn"
            href="/Shivam_Vilas_Raut_Resume.pdf"
            onClick={() => window.open("/Shivam_Vilas_Raut_Resume.pdf", "_blank")}
          />
        </div>
        <div className="desktop-nav-wrap">
          <LimelightNav
            items={dynamicNavItems}
            activeIndex={activeIndex >= 0 ? activeIndex : 0}
            defaultActiveIndex={activeIndex >= 0 ? activeIndex : 0}
          />
        </div>
        <div className="social-nav">
          <a
            href="https://www.linkedin.com/in/shivam-raut-9a9986376/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            data-tooltip="LinkedIn"
          >
            <LinkedInHeaderLogo />
          </a>
          <a
            href="https://github.com/shivamraut747-ux"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            data-tooltip="GitHub"
          >
            <Github />
          </a>
          <a
            href="https://www.instagram.com/ishivamr?stkn=aDBqZm84MGkxODl6"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram profile"
            data-tooltip="Instagram"
          >
            <Instagram />
          </a>
          <a
            href="https://x.com/shivamraut92"
            target="_blank"
            rel="noreferrer"
            aria-label="X profile"
            data-tooltip="X"
          >
            <XLogo />
          </a>
          <div
            className="theme-toggle-header"
            title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            <Switch checked={isDark} onCheckedChange={toggleTheme} size={11.5} />
          </div>
        </div>
        <div className="mobile-header-right">
          <div className="mobile-theme-toggle" title={isDark ? "Switch to Day Mode" : "Switch to Night Mode"}>
            <Switch checked={isDark} onCheckedChange={toggleTheme} size={9} />
          </div>
          <button
            className="menu-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav">
          <div className="mobile-nav-links">
            {baseNavItems.map((item) => (
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  setMenuOpen(false);
                  scrollToSection(item.id, e);
                }}
                className={currentActive === item.id ? "active" : ""}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mobile-nav-actions">
            <div className="mobile-resume-tactile-wrap">
              <TactileButton
                label="Resume"
                className="resume-tactile-btn"
                href="/Shivam_Vilas_Raut_Resume.pdf"
                onClick={() => {
                  window.open("/Shivam_Vilas_Raut_Resume.pdf", "_blank");
                  setTimeout(() => setMenuOpen(false), 500);
                }}
              />
            </div>
            <div className="mobile-nav-socials">
              <a
                href="https://www.linkedin.com/in/shivam-raut-9a9986376/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <LinkedInHeaderLogo />
              </a>
              <a
                href="https://github.com/shivamraut747-ux"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
              >
                <Github />
              </a>
              <a
                href="https://www.instagram.com/ishivamr?stkn=aDBqZm84MGkxODl6"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram profile"
              >
                <Instagram />
              </a>
              <a
                href="https://x.com/shivamraut92"
                target="_blank"
                rel="noreferrer"
                aria-label="X profile"
              >
                <XLogo />
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
