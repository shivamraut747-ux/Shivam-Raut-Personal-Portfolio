import Component, { ProjectData } from '@/components/ui/stacking-card';

const demoProjects: ProjectData[] = [
  {
    title: 'Face Detection System',
    description:
      'High-performance real-time facial recognition and detection system powered by computer vision algorithms, live webcam stream analysis, and neural feature extraction.',
    link: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    color: '#1e293b',
    tags: ['Python', 'OpenCV', 'TensorFlow', 'Deep Learning'],
    githubUrl: 'https://github.com/shivamraut747-ux',
    liveUrl: 'https://github.com/shivamraut747-ux',
  },
  {
    title: 'Tourist Website',
    description:
      'Interactive destination exploration platform showcasing global travel hotspots, curated itinerary planners, responsive booking guides, and interactive location previews.',
    link: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    color: '#0f766e',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    githubUrl: 'https://github.com/shivamraut747-ux',
    liveUrl: 'https://github.com/shivamraut747-ux',
  },
];

export default function ComponentDemo() {
  return <Component projects={demoProjects} />;
}

export { ComponentDemo as DemoOne };
