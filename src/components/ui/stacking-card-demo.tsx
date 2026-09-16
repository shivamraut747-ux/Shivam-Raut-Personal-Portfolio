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
    title: 'Blood Cell Classifier',
    description:
      'An end-to-end Deep Learning system for automated white blood cell classification from peripheral blood smears using fine-tuned EfficientNetB3 with 97.5% accuracy.',
    link: '/blood-cell-classifier.png',
    color: '#3b1d28',
    tags: ['Python', 'TensorFlow', 'Keras', 'EfficientNetB3', 'Streamlit'],
    githubUrl: 'https://github.com/shivamraut747-ux/Blood-Cell-Classifier',
    liveUrl: 'https://github.com/shivamraut747-ux/Blood-Cell-Classifier',
  },
  {
    title: 'Spam Email Detection',
    description:
      'A machine learning system for classifying emails as Spam or Ham, built with a modular NLP pipeline architecture, multi-algorithm evaluation, and Streamlit UI.',
    link: '/spam-email-detection.png',
    color: '#1e1b4b',
    tags: ['Python', 'Scikit-Learn', 'NLP', 'Machine Learning', 'Streamlit'],
    githubUrl: 'https://github.com/shivamraut747-ux/Spam-Email-Detection',
    liveUrl: 'https://github.com/shivamraut747-ux/Spam-Email-Detection',
  },
];

export default function ComponentDemo() {
  return <Component projects={demoProjects} />;
}

export { ComponentDemo as DemoOne };
