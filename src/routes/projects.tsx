import { createFileRoute, Link } from "@tanstack/react-router";
import Component, { ProjectData } from "@/components/ui/stacking-card";

export const Route = createFileRoute("/projects")({ component: ProjectsPage });

const projects: ProjectData[] = [
  {
    title: "Face Detection System",
    description: `A real-time facial recognition attendance system built with Python, Streamlit, and OpenCV.

Key features:
- Live face recognition via webcam (face_recognition + OpenCV)
- Auto-logs timestamped attendance with duplicate detection
- Admin dashboard for students, subjects, and teachers`,
    link: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    color: "#1e293b",
    tags: [
      "Python",
      "OpenCV",
      "Computer Vision",
      "Machine Learning",
      "CNN",
    ],
    githubUrl: "https://github.com/shivamraut747-ux/Face-Detection-System",
  },
  {
    title: "Blood Cell Classifier",
    description: `An end-to-end Deep Learning and Computer Vision system for automated white blood cell classification from peripheral blood smears.

Key features:
- Fine-tuned EfficientNetB3 CNN trained on 17,000+ smear images
- 97.5% holdout test accuracy across 6 leukocyte cell lineages
- Clinical Streamlit app with multi-view isolation & Plotly charts`,
    link: "/blood-cell-classifier.png",
    color: "#3b1d28",
    tags: [
      "Python",
      "TensorFlow",
      "Keras",
      "EfficientNetB3",
      "Deep Learning",
      "Streamlit",
    ],
    githubUrl: "https://github.com/shivamraut747-ux/Blood-Cell-Classifier",
  },
  {
    title: "Spam Email Detection",
    description: `A machine learning system for classifying emails as Spam or Ham, built with a modular NLP pipeline architecture.

Key features:
- Multi-model evaluation across SVM, Random Forest, and Logistic Regression
- Interactive Streamlit app with single-email analysis and batch .mbox processing
- Explainable trigger token highlight and confidence scoring metrics`,
    link: "/spam-email-detection.png",
    color: "#1e1b4b",
    tags: [
      "Python",
      "Scikit-Learn",
      "NLP",
      "Machine Learning",
      "Streamlit",
      "Pandas",
    ],
    githubUrl: "https://github.com/shivamraut747-ux/Spam-Email-Detection",
  },
  {
    title: "SuperStore Sales Forecast",
    description: `An end-to-end Power BI dashboard analyzing retail sales performance with a 15-day predictive forecast.

Key features:
- Interactive KPI dashboard tracking revenue, delivery time, and sales by region, category, and shipping mode
- 15-day sales forecast using Power BI's built-in forecasting engine
- Regional and state-level sales analysis with interactive map and slicers`,
    link: "/superstore-sales-forecast.png",
    color: "#0f2b48",
    tags: [
      "Power BI",
      "DAX",
      "SQL",
      "Power Query",
      "Data Analytics",
      "Forecasting",
    ],
    githubUrl: "https://github.com/shivamraut747-ux/superstore-sales-forecast",
  },
];

export function ProjectsPage() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-wrapper projects-page">
      <main className="content projects">
        <section className="projects-main">
          <div className="projects-container">
            <div className="projects-header-block">
              <h1 className="projects-title">projects.</h1>
              <p className="projects-intro">
                AI/ML systems and data analytics projects I've built.
              </p>
            </div>

            <Component projects={projects} />
          </div>
        </section>
      </main>

      <footer className="dannaway-footer">
        <div className="footer-container">
          <div className="footer-left">
            <Link to="/">© {new Date().getFullYear()} Shivam Raut</Link>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <ul>
              <li>
                <Link to="/about">about</Link>
              </li>
              <li>
                <Link to="/projects">projects</Link>
              </li>
              <li>
                <Link to="/skills">skills</Link>
              </li>
              <li>
                <Link to="/contact">contact</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-back-to-top">
          <a href="#top" onClick={scrollToTop} className="top-link">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
