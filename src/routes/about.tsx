import { createFileRoute } from "@tanstack/react-router";
import shivamPhoto from "@/assets/shivam-raut-photo.jpg";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return <div><SiteHeader activeItem="about" /><main><section className="hero"><div className="hero-copy"><h1>about.</h1><p className="lead">I'm Shivam Raut, a Full-Stack Web Developer based in Maharashtra, India.</p><p>I enjoy using technology to solve problems and build useful applications. When I'm not building projects, you'll find me watching web series, playing CODM, or exploring nature.</p></div><div className="hero-photo"><img src={shivamPhoto} alt="Shivam Raut" /></div></section></main><footer>© {new Date().getFullYear()} Shivam Raut <a href="/#about">Back to top ↑</a></footer></div>;
}
