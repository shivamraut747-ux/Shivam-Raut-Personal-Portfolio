import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome, projectsData } from "@/components/portfolio-home";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

export { projectsData as projects };

export function ProjectsPage() {
  return <PortfolioHome targetSection="projects" />;
}
