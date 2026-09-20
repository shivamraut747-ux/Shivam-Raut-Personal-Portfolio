import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome, skillsList } from "@/components/portfolio-home";

export const Route = createFileRoute("/skills")({ component: SkillsPage });

export { skillsList };

export function SkillsPage() {
  return <PortfolioHome targetSection="skills" />;
}
