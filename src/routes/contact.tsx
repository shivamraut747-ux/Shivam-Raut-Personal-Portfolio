import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/portfolio-home";

export const Route = createFileRoute("/contact")({ component: ContactPage });

export function ContactPage() {
  return <PortfolioHome targetSection="contact" />;
}
