import { Github, Instagram, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import shivamLogo from "@/assets/wmremove-transformed.png";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import TactileButton from "@/components/ui/tactile-button";
import Switch from "@/components/ui/sky-toggle";
import { useTheme } from "@/hooks/use-theme";

const navItems: NavItem[] = [
  { id: "about", label: "about", href: "/about" },
  { id: "projects", label: "projects", href: "/projects" },
  { id: "skills", label: "skills", href: "/skills" },
  { id: "contact", label: "contact", href: "/contact" },
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
  const activeIndex = navItems.findIndex((item) => item.label === activeItem);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="brand-mark" aria-label="Shivam Raut home">
          <img className="brand-logo" src={shivamLogo} alt="" />
        </Link>
        <div className="header-resume-cta">
          <TactileButton
            label="Resume"
            className="resume-tactile-btn"
            onClick={() => window.open("/resume.pdf", "_blank")}
          />
        </div>
        <div className="desktop-nav-wrap">
          <LimelightNav
            items={navItems}
            {...(activeIndex >= 0 ? { activeIndex } : {})}
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
            <Switch checked={isDark} onCheckedChange={toggleTheme} size={10} />
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
          {navItems.map((item) => (
            <Link
              to={item.href!}
              onClick={() => setMenuOpen(false)}
              className={activeItem === item.label ? "active" : ""}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
