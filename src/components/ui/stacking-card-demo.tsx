import Component, { ProjectData } from '@/components/ui/stacking-card';

const demoProjects: ProjectData[] = [
  {
    title: 'Face Detection System',
    description:
      'A real-time facial recognition attendance management system built with Python, Streamlit, OpenCV, and face_recognition. Features live webcam streaming with face embeddings, automatic timestamped attendance logging with duplicate detection, an admin dashboard, and CSV report export.',
    link: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    color: '#1e293b',
    tags: ['Python', 'OpenCV', 'Streamlit', 'face_recognition', 'SQLite3'],
    githubUrl: 'https://github.com/shivamraut747-ux/Face-Detection-System',
    liveUrl: 'https://github.com/shivamraut747-ux/Face-Detection-System',
  },
  {
    title: 'Tourist Website',
    description:
      'An interactive travel and tourism web application built with HTML5, CSS3, JavaScript, and MySQL. Features curated holiday destination guides, dynamic exploration previews, custom trip itineraries, and structured relational database storage.',
    link: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    color: '#0f766e',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'MySQL'],
    githubUrl: 'https://github.com/shivamraut747-ux',
    liveUrl: 'https://github.com/shivamraut747-ux',
  },
];

export default function ComponentDemo() {
  return <Component projects={demoProjects} />;
}

export { ComponentDemo as DemoOne };
