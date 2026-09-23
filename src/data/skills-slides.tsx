import React from "react";
import type { CoverflowSlide } from "@/components/ui/coverflow-carousel";

interface SkillDef {
  name: string;
  logo: string;
}

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-full w-full select-none text-white"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const SKILLS_CONFIG: SkillDef[] = [
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "SQL",
    logo: "/sql-logo.svg",
  },
  {
    name: "MySQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Tableau",
    logo: "/tableau-logo.svg",
  },
  {
    name: "Excel",
    logo: "/excel-logo.svg",
  },
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "HTML5",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "Git",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
];

export const SKILLS_CAROUSEL_SLIDES: CoverflowSlide[] = SKILLS_CONFIG.map((skill) => ({
  alt: `${skill.name} skill card`,
  title: skill.name,
  content: (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between rounded-2xl border border-white/10 p-4 shadow-xl select-none"
      style={{ backgroundColor: "#111111" }}
    >
      {/* Center Logo - 55-65% width, centered, no wrapping box */}
      <div className="flex flex-1 w-full items-center justify-center pt-2">
        {skill.name === "GitHub" ? (
          <div className="flex h-[60%] w-[60%] items-center justify-center">
            <GitHubIcon />
          </div>
        ) : (
          <img
            src={skill.logo}
            alt={skill.name}
            className="h-[60%] w-[60%] select-none object-contain transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
        )}
      </div>

      {/* Bottom: Skill Name */}
      <div className="w-full text-center pb-2">
        <div className="text-[15px] sm:text-[17px] font-bold tracking-tight text-white leading-tight">
          {skill.name}
        </div>
      </div>
    </div>
  ),
}));
