import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/portfolio-home";

export const Route = createFileRoute("/")({ component: IndexPage });

function IndexPage() {
  return <PortfolioHome />;
}
