import React from "react";
import type { CoverflowSlide } from "@/components/ui/coverflow-carousel";

interface SkillDef {
  name: string;
  subtitle: string;
  badge: string;
  logo: string;
  bgGradient: string;
  accentColor: string;
  badgeBg: string;
  badgeColor: string;
  isInvertLogo?: boolean;
}

const SKILLS_CONFIG: SkillDef[] = [
  {
    name: "Python",
    subtitle: "AI/ML & Data Science",
    badge: "Language",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #172d42 0%, #0d1a27 55%, #081019 100%)",
    accentColor: "#3776ab",
    badgeBg: "rgba(55, 118, 171, 0.28)",
    badgeColor: "#7dd3fc",
  },
  {
    name: "SQL",
    subtitle: "Data Extraction & Queries",
    badge: "Database",
    logo: "/sql-logo.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #163248 0%, #0d2030 55%, #07131d 100%)",
    accentColor: "#0284c7",
    badgeBg: "rgba(2, 132, 199, 0.28)",
    badgeColor: "#38bdf8",
  },
  {
    name: "MySQL",
    subtitle: "Relational Database",
    badge: "Database",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #122d3b 0%, #0b1e28 55%, #06121a 100%)",
    accentColor: "#00758f",
    badgeBg: "rgba(0, 117, 143, 0.28)",
    badgeColor: "#22d3ee",
  },
  {
    name: "MongoDB",
    subtitle: "NoSQL Document Store",
    badge: "Database",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #14351f 0%, #0c2314 55%, #06150c 100%)",
    accentColor: "#47a248",
    badgeBg: "rgba(71, 162, 72, 0.28)",
    badgeColor: "#4ade80",
  },
  {
    name: "Tableau",
    subtitle: "Visual Dashboards & BI",
    badge: "Data Viz",
    logo: "/tableau-logo.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #2e1c3a 0%, #1d1126 55%, #110917 100%)",
    accentColor: "#e8762d",
    badgeBg: "rgba(232, 118, 45, 0.28)",
    badgeColor: "#fb923c",
  },
  {
    name: "JavaScript",
    subtitle: "Modern Web & ES6+",
    badge: "Language",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #302a0e 0%, #201c08 55%, #131104 100%)",
    accentColor: "#f7df1e",
    badgeBg: "rgba(247, 223, 30, 0.26)",
    badgeColor: "#fde047",
  },
  {
    name: "HTML5",
    subtitle: "Semantic Structure",
    badge: "Markup",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #351b12 0%, #23110a 55%, #150905 100%)",
    accentColor: "#e34f26",
    badgeBg: "rgba(227, 79, 38, 0.28)",
    badgeColor: "#fb923c",
  },
  {
    name: "CSS3",
    subtitle: "Responsive UI & Layouts",
    badge: "Styling",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #13273e 0%, #0c1a2b 55%, #07101c 100%)",
    accentColor: "#1572b6",
    badgeBg: "rgba(21, 114, 182, 0.28)",
    badgeColor: "#60a5fa",
  },
  {
    name: "Git",
    subtitle: "Distributed VCS",
    badge: "DevTools",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #351914 0%, #220f0c 55%, #140806 100%)",
    accentColor: "#f05032",
    badgeBg: "rgba(240, 80, 50, 0.28)",
    badgeColor: "#f87171",
  },
  {
    name: "GitHub",
    subtitle: "Repos & Collaboration",
    badge: "Platform",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    bgGradient: "radial-gradient(circle at 50% 20%, #292c3a 0%, #1a1c27 55%, #101119 100%)",
    accentColor: "#c084fc",
    badgeBg: "rgba(192, 132, 252, 0.25)",
    badgeColor: "#e9d5ff",
    isInvertLogo: true,
  },
];

export const SKILLS_CAROUSEL_SLIDES: CoverflowSlide[] = SKILLS_CONFIG.map((skill) => ({
  alt: `${skill.name} skill card`,
  title: skill.name,
  subtitle: skill.subtitle,
  content: (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-5 select-none text-left"
      style={{
        background: skill.bgGradient,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Decorative ambient color glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl opacity-40"
        style={{ background: skill.accentColor }}
      />

      {/* Top Header: Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] sm:text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm"
          style={{
            backgroundColor: skill.badgeBg,
            color: skill.badgeColor,
            border: `1px solid ${skill.badgeColor}33`,
          }}
        >
          {skill.badge}
        </span>
      </div>

      {/* Center: Brand Logo */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-2 sm:py-3">
        <div
          className="relative flex items-center justify-center rounded-2xl p-2.5 sm:p-3 transition-transform duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: `0 12px 28px -6px ${skill.accentColor}44`,
          }}
        >
          <img
            src={skill.logo}
            alt={skill.name}
            className={`h-12 w-12 sm:h-14 sm:w-14 select-none object-contain drop-shadow ${
              skill.isInvertLogo ? "filter invert brightness-125" : ""
            }`}
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Footer: Title & Subtitle */}
      <div className="relative z-10 text-center">
        <div className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white leading-tight">
          {skill.name}
        </div>
        <div className="mt-0.5 text-[11px] sm:text-[12px] font-medium text-white/70 truncate">
          {skill.subtitle}
        </div>
      </div>
    </div>
  ),
}));
