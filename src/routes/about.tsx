import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/portfolio-home";

export const Route = createFileRoute("/about")({ component: AboutPage });

export function AboutPage() {
  return <PortfolioHome targetSection="about" />;
}
