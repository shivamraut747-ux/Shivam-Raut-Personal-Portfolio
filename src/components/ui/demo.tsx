"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const DEVICON = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

export const SKILLS_CAROUSEL_SLIDES = [
  {
    src: DEVICON("mysql/mysql-original.svg"),
    alt: "MySQL logo",
    title: "MySQL",
    subtitle: "Database",
  },
  {
    src: DEVICON("mongodb/mongodb-original.svg"),
    alt: "MongoDB logo",
    title: "MongoDB",
    subtitle: "Database",
  },
  {
    src: DEVICON("html5/html5-original.svg"),
    alt: "HTML5 logo",
    title: "HTML",
    subtitle: "Markup",
  },
  {
    src: DEVICON("css3/css3-original.svg"),
    alt: "CSS3 logo",
    title: "CSS",
    subtitle: "Styling",
  },
  {
    src: DEVICON("javascript/javascript-original.svg"),
    alt: "JavaScript logo",
    title: "JavaScript",
    subtitle: "Language",
  },
  {
    src: DEVICON("python/python-original.svg"),
    alt: "Python logo",
    title: "Python",
    subtitle: "Language",
  },
  {
    src: "/sql-logo.svg",
    alt: "SQL logo",
    title: "SQL",
    subtitle: "Query Language",
  },
  {
    src: DEVICON("git/git-original.svg"),
    alt: "Git logo",
    title: "Git",
    subtitle: "Version Control",
  },
  {
    src: DEVICON("github/github-original.svg"),
    alt: "GitHub logo",
    title: "GitHub",
    subtitle: "Hosting",
  },
  {
    src: "/tableau-logo.svg",
    alt: "Tableau logo",
    title: "Tableau",
    subtitle: "Data Viz",
  },
];

export default function DemoOne() {
  return (
    <div className="w-full overflow-hidden bg-background py-6">
      <CoverflowCarousel
        slides={SKILLS_CAROUSEL_SLIDES}
        showCaption
        autoPlay
        autoPlaySpeed={0.4}
        cardClassName="bg-white p-8"
      />
    </div>
  );
}

export { DemoOne };
