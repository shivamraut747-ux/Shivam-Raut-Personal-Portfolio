import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return <div><SiteHeader /><main><section className="portfolio-section"><p className="section-kicker">Welcome</p><h1>Shivam Raut</h1><p className="portfolio-copy">A Full Stack Web Devoloper based in Maharashtra, India.</p></section></main><footer>© {new Date().getFullYear()} Shivam Raut <a href="/about">About me</a></footer></div>;
}
