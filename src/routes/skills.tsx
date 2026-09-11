import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

const skills = ["MySQL", "MongoDB", "HTML", "CSS", "JavaScript", "Python", "SQL", "Git", "GitHub", "Tableau"];

export const Route = createFileRoute("/skills")({ component: SkillsPage });

function SkillsPage() {
  return <div className="skills-page"><SiteHeader activeItem="skills" /><main><section className="skills-hero"><h1>skills.</h1><p>Here are some of the technologies and tools I use to build useful things.</p></section><section className="skills-catalog" aria-label="Skills catalog"><div className="skill-cards">{skills.map((skill) => <div className="skill-card" key={skill}><span>{skill}</span></div>)}</div></section></main><footer>© {new Date().getFullYear()} Shivam Raut <a href="/#about">Back to top ↑</a></footer></div>;
}
