import { Github, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import shivamLogo from "@/assets/wmremove-transformed.png";

const navItems = [
  { label: "about", href: "/about" },
  { label: "skills", href: "/skills" },
  { label: "contact", href: "/contact" },
];

function XLogo() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.901 1.153h3.68L14.543 10.34 24 22.846h-7.406l-5.8-7.584-6.64 7.584H.472l8.598-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153zm-1.29 19.52h2.039L6.486 3.21H4.298L17.61 20.673z" /></svg>;
}

export function SiteHeader({ activeItem }: { activeItem?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="header"><div className="header-content">
    <Link to="/" className="brand-mark" aria-label="Shivam Raut home"><img className="brand-logo" src={shivamLogo} alt="" /></Link>
    <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map((item) => <Link key={item.label} to={item.href} className={activeItem === item.label ? "active" : ""}>{item.label}</Link>)}</nav>
    <div className="social-nav">
      <a href="https://www.linkedin.com/in/shivam-raut-9a9986376/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile" data-tooltip="LinkedIn"><Linkedin /></a>
      <a href="https://github.com/shivamraut747-ux" target="_blank" rel="noreferrer" aria-label="GitHub profile" data-tooltip="GitHub"><Github /></a>
      <a href="https://www.instagram.com/ishivamr?stkn=aDBqZm84MGkxODl6" target="_blank" rel="noreferrer" aria-label="Instagram profile" data-tooltip="Instagram"><Instagram /></a>
      <a href="https://x.com/shivamraut92" target="_blank" rel="noreferrer" aria-label="X profile" data-tooltip="X"><XLogo /></a>
    </div>
    <button className="menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
  </div>{menuOpen && <nav className="mobile-nav">{navItems.map((item) => <Link to={item.href} onClick={() => setMenuOpen(false)} className={activeItem === item.label ? "active" : ""} key={item.label}>{item.label}</Link>)}</nav>}</header>;
}
