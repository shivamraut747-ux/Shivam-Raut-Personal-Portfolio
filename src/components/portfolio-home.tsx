import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ReactLenis } from "lenis/react";
import shivamPhoto from "@/assets/shivam-raut-photo.jpg";
import Component, { ProjectData } from "@/components/ui/stacking-card";
import { GlowCard } from "@/components/ui/glow-card";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { SKILLS_CAROUSEL_SLIDES } from "@/components/ui/demo";

/* =========================================================================
   PROJECTS DATA (4 Projects)
   ========================================================================= */
export const projectsData: ProjectData[] = [
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

/* =========================================================================
   SKILLS DATA & ICONS
   ========================================================================= */
function MySqlLogo() {
  return (
    <svg viewBox="0 0 128 128" width="56" height="56" aria-hidden="true">
      <path
        fill="#00618A"
        d="M0 91.313h4.242V74.566l6.566 14.598c.773 1.77 1.832 2.391 3.914 2.391s3.098-.621 3.871-2.391l6.566-14.598v16.746h4.242V74.594c0-1.633-.652-2.422-2-2.828-3.223-1.004-5.383-.137-6.363 2.039l-6.441 14.41-6.238-14.41c-.937-2.176-3.14-3.043-6.359-2.039-1.348.406-2 1.195-2 2.828zM32.93 77.68h4.238v9.227c-.039.5.16 1.676 2.484 1.715h9.223V77.633h4.25c.02 0-.008 14.984-.008 15.047.023 3.695-4.582 4.496-6.707 4.559H33.02v-2.852l13.414-.004c2.73-.285 2.406-1.645 2.406-2.098v-1.113h-9.012c-4.195-.039-6.863-1.871-6.898-3.977-.004-.191.09-9.422 0-9.516zm0 0"
      />
      <path
        fill="#E48E00"
        d="M56.391 91.313h12.195c1.426 0 2.813-.301 3.914-.816 1.836-.84 2.73-1.984 2.73-3.48v-3.098c0-1.223-1.016-2.367-3.016-3.125-1.059-.41-2.367-.625-3.629-.625h-5.141c-1.711 0-2.527-.516-2.73-1.656-.039-.137-.039-.246-.039-.383V76.2c0-.109 0-.219.039-.355.203-.867.652-1.113 2.16-1.25l.41-.027h12.109v-2.824H63.488c-1.711 0-2.609.109-3.426.352-2.527.789-3.629 2.039-3.629 4.215v2.473c0 1.902 2.16 3.535 5.789 3.914l1.223.055h4.406c.164 0 .324 0 .449.027 1.344.109 1.914.355 2.324.844.211.195.332.473.324.758v2.477c0 .297-.203.68-.609 1.004-.367.328-.98.543-1.793.598l-.449.027H56.391zm45.297-4.922c0 2.91 2.164 4.539 6.523 4.867l1.227.055h11.051v-2.828h-11.133c-2.488 0-3.426-.625-3.426-2.121V71.738h-4.238V86.39zm-23.75.148V76.457c0-2.559 1.801-4.113 5.355-4.602a7.976 7.976 0 0 1 1.145-.082h8.047c.41 0 .777.027 1.188.082 3.555.488 5.352 2.043 5.352 4.602v10.082c0 2.078-.762 3.188-2.523 3.914l4.18 3.77h-4.926l-3.379-3.051-3.402.215H84.44a9.23 9.23 0 0 1-2.492-.352c-2.699-.734-4.008-2.152-4.008-4.496zm4.578-.246c0 .137.039.273.082.438.246 1.172 1.348 1.824 3.023 1.824h3.852l-3.539-3.195h4.926l3.086 2.789c.57-.305.941-.766 1.074-1.363.039-.137.039-.273.039-.41v-9.668c0-.109 0-.246-.039-.383-.246-1.09-1.348-1.715-2.984-1.715h-6.414c-1.879 0-3.105.816-3.105 2.098zm0 0"
      />
      <path
        fill="#00618A"
        d="M124.219 67.047c-2.605-.07-4.598.172-6.301.891-.484.203-1.258.207-1.336.813.266.281.309.699.52 1.039.406.66 1.094 1.539 1.707 2l2.074 1.484c1.273.777 2.699 1.223 3.93 2 .723.461 1.441 1.039 2.148 1.559.348.254.582.656 1.039.816v-.074c-.238-.305-.301-.723-.52-1.039l-.965-.965c-.941-1.25-2.137-2.348-3.41-3.262-1.016-.727-3.281-1.711-3.707-2.891l-.074-.074c.719-.078 1.563-.34 2.223-.516 1.117-.301 2.113-.223 3.262-.52l1.559-.449v-.293c-.582-.598-.996-1.387-1.633-1.93-1.656-1.41-3.469-2.824-5.336-4.004-1.035-.652-2.312-1.074-3.41-1.629-.367-.187-1.016-.281-1.262-.594-.574-.734-.887-1.664-1.332-2.52l-2.668-5.633c-.562-1.285-.93-2.555-1.633-3.707-3.363-5.535-6.988-8.875-12.602-12.156-1.191-.699-2.633-.973-4.148-1.332l-2.449-.148c-.496-.211-1.012-.82-1.48-1.113-1.859-1.176-6.629-3.73-8.008-.371-.867 2.121 1.301 4.191 2.078 5.266.543.754 1.242 1.598 1.629 2.445.258.555.301 1.113.52 1.703.539 1.453 1.008 3.031 1.707 4.375.352.68.738 1.395 1.184 2 .273.371.742.539.816 1.113-.457.641-.484 1.633-.742 2.445-1.16 3.652-.723 8.191.965 10.898.516.828 1.734 2.609 3.41 1.926 1.465-.598 1.137-2.445 1.555-4.078.098-.367.039-.641.223-.887v.074l1.336 2.668c.988 1.59 2.738 3.25 4.223 4.371.773.582 1.379 1.59 2.375 1.93V68.6h-.074c-.195-.297-.496-.422-.742-.664-.582-.57-1.227-1.277-1.703-1.93-1.352-1.832-2.547-3.84-3.633-5.93-.52-.996-.973-2.098-1.41-3.113-.168-.391-.164-.984-.516-1.184-.48.742-1.187 1.344-1.559 2.223-.594 1.402-.668 3.117-.891 4.891l-.148.074c-1.031-.25-1.395-1.312-1.777-2.223-.973-2.305-1.152-6.02-.297-8.672.219-.687 1.219-2.852.813-3.484-.191-.633-.828-1-1.184-1.484a11.7 11.7 0 0 1-1.187-2.074c-.793-1.801-1.164-3.816-2-5.633-.398-.871-1.074-1.75-1.629-2.523-.617-.855-1.305-1.484-1.781-2.52-.168-.367-.398-.957-.148-1.336.078-.254.195-.359.445-.441.43-.332 1.629.109 2.074.293 1.191.496 2.184.965 3.191 1.633.48.32.969.941 1.555 1.113h.668c1.043.238 2.211.07 3.188.367 1.723.523 3.27 1.34 4.668 2.227 4.273 2.695 7.766 6.535 10.156 11.117.387.738.551 1.441.891 2.223.684 1.578 1.543 3.203 2.223 4.746s1.34 3.094 2.297 4.375c.504.672 2.453 1.031 3.336 1.406.621.262 1.637.535 2.223.891 1.125.676 2.211 1.48 3.266 2.223.523.375 2.141 1.188 2.223 1.855zM91.082 38.805a5.26 5.26 0 0 0-1.332.148v.074h.074c.258.535.715.879 1.035 1.336l.742 1.555.074-.07c.461-.324.668-.844.668-1.633-.187-.195-.211-.437-.371-.668-.211-.309-.621-.48-.891-.742zm0 0"
      />
    </svg>
  );
}

function MongoDbLogo() {
  return (
    <svg viewBox="0 0 64 128" width="30" height="56" aria-hidden="true">
      <path fill="#13AA52" d="M32 0C30.3 3 10 37.8 10 68c0 23.3 14 43.6 22 55.4 0-41.2.3-80.4 0-123.4z" />
      <path fill="#116149" d="M32 0v123.4c8-11.8 22-32.1 22-55.4C54 37.8 33.7 3 32 0z" />
      <path fill="#FFFFFF" d="M32 123.4c-.6.6-1.4 2.3-1.6 3.1-.3 1.1-.3 1.5.8 1.5 1.4 0 1.9-.9 2.1-1.6.4-1.2 0-2.3-1.3-3z" />
    </svg>
  );
}

function HtmlLogo() {
  return (
    <svg viewBox="0 0 128 128" width="52" height="52" aria-hidden="true">
      <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z" />
      <path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z" />
      <path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z" />
      <path fill="#FFFFFF" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z" />
    </svg>
  );
}

function CssLogo() {
  return (
    <svg viewBox="0 0 128 128" width="52" height="52" aria-hidden="true">
      <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z" />
      <path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z" />
      <path fill="#FFFFFF" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z" />
      <path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z" />
      <path fill="#FFFFFF" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z" />
      <path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z" />
    </svg>
  );
}

function JavaScriptLogo() {
  return (
    <svg viewBox="0 0 100 100" width="54" height="54" aria-hidden="true">
      <rect width="100" height="100" rx="14" fill="#F7DF1E" />
      <path
        fill="#000000"
        d="M27 75c3.2 2 6.5 3.3 10.3 3.3 5.8 0 9.5-2.8 9.5-11.4V24h-12v42.5c0 4.2-1.7 5.7-4.6 5.7-1.5 0-2.6-.4-3.2-.8L27 75zm36.5 3.3c10.3 0 16.5-5.5 16.5-14.8 0-8.8-5.3-12.7-13.6-16.3-5.5-2.4-7.8-4.2-7.8-7.7 0-3.3 2.6-5.6 6.8-5.6 4.3 0 7.4 1.7 9.8 3.5l4.8-7.4c-3.7-2.7-8.7-4.4-14.6-4.4-10.3 0-16.2 5.8-16.2 14.7 0 8.5 5.3 12.5 13.8 16.2 5.5 2.4 7.6 4.4 7.6 7.8 0 3.8-3.1 6.2-7.8 6.2-5.4 0-9.2-2.3-12.1-4.7L48 74.2c3.7 2.7 9.5 4.1 15.5 4.1z"
      />
    </svg>
  );
}

function PythonLogo() {
  return (
    <svg viewBox="0 0 128 128" width="56" height="56" aria-hidden="true">
      <path
        fill="#3776AB"
        d="M63.7 6.3c-28.5 0-26.7 12.3-26.7 12.3l.1 12.8h27.3v3.8H26.8S6.3 33 6.3 61.6c0 28.7 17.9 27.6 17.9 27.6h10.7V74.2s-.6-17.9 17.6-17.9h30.2s17-.2 17-17V23.7s1.8-17.4-36-17.4zm-14.6 9.3c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5z"
      />
      <path
        fill="#FFD438"
        d="M64.3 121.7c28.5 0 26.7-12.3 26.7-12.3l-.1-12.8H63.6v-3.8h37.6s20.5 2.2 20.5-26.4c0-28.7-17.9-27.6-17.9-27.6h-10.7v15s.6 17.9-17.6 17.9H45.3s-17 .2-17 17v15.6s-1.8 17.4 36 17.4zm14.6-9.3c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z"
      />
    </svg>
  );
}

function SqlLogo() {
  return (
    <svg viewBox="0 0 100 100" width="54" height="54" aria-hidden="true">
      <ellipse cx="50" cy="24" rx="36" ry="14" fill="#336791" />
      <path d="M14 24v24c0 7.7 16.1 14 36 14s36-6.3 36-14V24c0 7.7-16.1 14-36 14S14 31.7 14 24z" fill="#295475" />
      <path d="M14 48v24c0 7.7 16.1 14 36 14s36-6.3 36-14V48c0 7.7-16.1 14-36 14S14 55.7 14 48z" fill="#1d3d57" />
      <text x="50" y="68" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">SQL</text>
    </svg>
  );
}

function GitLogo() {
  return (
    <svg viewBox="0 0 128 128" width="50" height="50" aria-hidden="true">
      <path
        fill="#F34F29"
        d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 98 96" width="56" height="56" fill="#24292f" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

function TableauLogo() {
  return (
    <svg viewBox="0 0 100 100" width="56" height="56" aria-hidden="true">
      <rect x="44.5" y="24" width="11" height="52" rx="2" fill="#E8762D" />
      <rect x="24" y="44.5" width="52" height="11" rx="2" fill="#E8762D" />
      <rect x="46.5" y="2" width="7" height="18" rx="1.5" fill="#59A14F" />
      <rect x="41" y="7.5" width="18" height="7" rx="1.5" fill="#59A14F" />
      <rect x="46.5" y="80" width="7" height="18" rx="1.5" fill="#4E79A7" />
      <rect x="41" y="85.5" width="18" height="7" rx="1.5" fill="#4E79A7" />
      <rect x="2" y="46.5" width="18" height="7" rx="1.5" fill="#E15759" />
      <rect x="7.5" y="41" width="7" height="18" rx="1.5" fill="#E15759" />
      <rect x="80" y="46.5" width="18" height="7" rx="1.5" fill="#76B7B2" />
      <rect x="85.5" y="41" width="7" height="18" rx="1.5" fill="#76B7B2" />
      <rect x="23" y="19" width="5" height="13" rx="1" fill="#EDC948" />
      <rect x="19" y="23" width="13" height="5" rx="1" fill="#EDC948" />
      <rect x="72" y="19" width="5" height="13" rx="1" fill="#B07AA1" />
      <rect x="68" y="23" width="13" height="5" rx="1" fill="#B07AA1" />
      <rect x="23" y="68" width="5" height="13" rx="1" fill="#BAB0AC" />
      <rect x="19" y="72" width="13" height="5" rx="1" fill="#BAB0AC" />
      <rect x="72" y="68" width="5" height="13" rx="1" fill="#9C755F" />
      <rect x="68" y="72" width="13" height="5" rx="1" fill="#9C755F" />
    </svg>
  );
}

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
}

export const skillsList: SkillItem[] = [
  { name: "MySQL", icon: <MySqlLogo />, glowColor: "blue" },
  { name: "MongoDB", icon: <MongoDbLogo />, glowColor: "green" },
  { name: "HTML", icon: <HtmlLogo />, glowColor: "orange" },
  { name: "CSS", icon: <CssLogo />, glowColor: "blue" },
  { name: "JavaScript", icon: <JavaScriptLogo />, glowColor: "orange" },
  { name: "Python", icon: <PythonLogo />, glowColor: "blue" },
  { name: "SQL", icon: <SqlLogo />, glowColor: "blue" },
  { name: "Git", icon: <GitLogo />, glowColor: "red" },
  { name: "GitHub", icon: <GitHubLogo />, glowColor: "purple" },
  { name: "Tableau", icon: <TableauLogo />, glowColor: "orange" },
];

/* =========================================================================
   CONTACT ICONS
   ========================================================================= */
function ContactLinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
    </svg>
  );
}

function ContactGitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function ContactInstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function ContactXLogo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68L14.543 10.34 24 22.846h-7.406l-5.8-7.584-6.64 7.584H.472l8.598-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153zm-1.29 19.52h2.039L6.486 3.21H4.298L17.61 20.673z" />
    </svg>
  );
}

/* =========================================================================
   MAIN CONTINUOUS PORTFOLIO COMPONENT
   ========================================================================= */
interface PortfolioHomeProps {
  targetSection?: string;
}

export function PortfolioHome({ targetSection }: PortfolioHomeProps) {
  useEffect(() => {
    const sectionToScroll = targetSection || (window.location.hash ? window.location.hash.replace("#", "") : null);
    if (sectionToScroll) {
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionToScroll);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [targetSection]);

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    const mailtoUrl = `mailto:shivamraut747@gmail.com?subject=${encodeURIComponent(
      name ? `Portfolio inquiry from ${name}` : "Portfolio inquiry"
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.history.pushState(null, "", "/#about");
  };

  const scrollToSectionFromFooter = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `/#${id}`);
    }
  };

  return (
    <ReactLenis root>
      <div className="site-wrapper portfolio-single-page">
        {/* =================================================================
            1. ABOUT SECTION
            ================================================================= */}
        <section id="about" className="page-section about-section">
          <main className="content about">
            <div className="about-main">
              <div className="about-container">
                <div className="about-split-layout">
                  {/* Left Column: Title, Intro, and Story */}
                  <div className="about-left-col">
                    <h1 className="about-title">about.</h1>
                    <p className="about-intro">
                      I'm{" "}
                      <span
                        style={{
                          fontWeight: 700,
                          background: "linear-gradient(90deg, #FACC15, #F59E0B)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "transparent",
                        }}
                      >
                        Shivam Raut
                      </span>
                      , a Full-Stack Web Developer based in Maharashtra, India.
                    </p>

                    <div className="about-body">
                      <p>
                        I enjoy using technology to solve problems and build useful web applications.
                        When I'm not coding or exploring new tools, you'll find me watching web
                        series, playing CODM, or exploring nature.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Photo */}
                  <div className="about-right-col">
                    <div className="about-photo-card">
                      <img src={shivamPhoto} alt="Shivam Raut" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </section>

        {/* =================================================================
            2. PROJECTS SECTION
            ================================================================= */}
        <section id="projects" className="page-section projects-section">
          <main className="content projects">
            <div className="projects-main">
              <div className="projects-container">
                <div className="projects-header-block">
                  <h1 className="projects-title">projects.</h1>
                  <p className="projects-intro">
                    AI/ML systems and data analytics projects I've built.
                  </p>
                </div>

                <Component projects={projectsData} />
              </div>
            </div>
          </main>
        </section>

        {/* =================================================================
            3. SKILLS SECTION
            ================================================================= */}
        <section id="skills" className="page-section skills-section">
          <main className="content skills">
            <div className="skills-main">
              <div className="skills-container">
                <div className="skills-header-block">
                  <h1 className="skills-title">skills.</h1>
                  <p className="skills-intro">
                    Here are some of the technologies and tools I use to build useful things.
                  </p>
                </div>

                <div className="skills-showcase-card" aria-label="Skills coverflow carousel">
                  <CoverflowCarousel
                    slides={SKILLS_CAROUSEL_SLIDES}
                    showCaption
                    autoPlay
                    autoPlaySpeed={0.4}
                    cardWidth="clamp(165px, 22vw, 240px)"
                    cardClassName="skills-carousel-card"
                  />
                </div>
              </div>
            </div>
          </main>
        </section>

        {/* =================================================================
            4. CONTACT SECTION
            ================================================================= */}
        <section id="contact" className="page-section contact-block">
          <main className="content contact">
            <div className="contact-main">
              <div className="contact-container">
                <div className="contact-split-layout">
                  {/* Left Column: Title, Intro, and Socials */}
                  <div className="contact-left-col">
                    <h1 className="contact-title">contact.</h1>
                    <p className="contact-intro">
                      Get in touch with me via social media
                      <br />
                      or send me an email.
                    </p>

                    <ul className="social-disc-grid" aria-label="Official social links">
                      <li>
                        <a
                          href="https://www.linkedin.com/in/shivam-raut-9a9986376/"
                          target="_blank"
                          rel="noreferrer"
                          className="social-disc-link linkedin"
                        >
                          <span className="disc-icon">
                            <ContactLinkedInLogo />
                          </span>
                          <span className="disc-label">LinkedIn</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://github.com/shivamraut747-ux"
                          target="_blank"
                          rel="noreferrer"
                          className="social-disc-link github"
                        >
                          <span className="disc-icon">
                            <ContactGitHubLogo />
                          </span>
                          <span className="disc-label">GitHub</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/ishivamr?stkn=aDBqZm84MGkxODl6"
                          target="_blank"
                          rel="noreferrer"
                          className="social-disc-link instagram"
                        >
                          <span className="disc-icon">
                            <ContactInstagramLogo />
                          </span>
                          <span className="disc-label">Instagram</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/shivamraut92"
                          target="_blank"
                          rel="noreferrer"
                          className="social-disc-link x-brand"
                        >
                          <span className="disc-icon">
                            <ContactXLogo />
                          </span>
                          <span className="disc-label">X</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column: Send Email Form */}
                  <div className="contact-right-col">
                    <div className="form-card">
                      <h2 className="form-section-title">Send me an email</h2>

                      <form className="contact-form" onSubmit={handleContactSubmit}>
                        <div className="form-row-2col">
                          <div className="form-field">
                            <label htmlFor="contact-name">Name</label>
                            <input
                              id="contact-name"
                              name="name"
                              type="text"
                              required
                              placeholder="Your name"
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="contact-email">Email</label>
                            <input
                              id="contact-email"
                              name="email"
                              type="email"
                              required
                              placeholder="Your email address"
                            />
                          </div>
                        </div>

                        <div className="form-field">
                          <label htmlFor="contact-message">Message</label>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows={5}
                            required
                            placeholder="Your message..."
                          />
                        </div>

                        <div className="form-submit-row">
                          <button type="submit" className="contact-submit-btn">
                            Send email
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* =================================================================
              5. UNIFIED FOOTER
              ================================================================= */}
          <footer className="dannaway-footer">
            <div className="footer-container">
              <div className="footer-left">
                <Link to="/">© {new Date().getFullYear()} Shivam Raut</Link>
              </div>
              <nav className="footer-nav" aria-label="Footer navigation">
                <ul>
                  <li>
                    <a href="#about" onClick={(e) => scrollToSectionFromFooter("about", e)}>
                      about
                    </a>
                  </li>
                  <li>
                    <a href="#projects" onClick={(e) => scrollToSectionFromFooter("projects", e)}>
                      projects
                    </a>
                  </li>
                  <li>
                    <a href="#skills" onClick={(e) => scrollToSectionFromFooter("skills", e)}>
                      skills
                    </a>
                  </li>
                  <li>
                    <a href="#contact" onClick={(e) => scrollToSectionFromFooter("contact", e)}>
                      contact
                    </a>
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
        </section>
      </div>
    </ReactLenis>
  );
}

export default PortfolioHome;
