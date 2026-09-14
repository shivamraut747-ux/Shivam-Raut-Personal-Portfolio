import React from 'react';
import Component from '@/components/ui/stacking-card';

const projects = [
  {
    title: 'Face Detection System',
    description:
      'A real-time facial detection and biometric recognition platform engineered with deep neural networks and computer vision algorithms.',
    link: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    color: '#1e293b',
  },
  {
    title: 'Blood Cell Classifier',
    description:
      'Deep learning and computer vision system for automated leukocyte classification from blood smears with 97.5% accuracy.',
    link: '/blood-cell-classifier.png',
    color: '#3b1d28',
  },
];

function ComponentDemo() {
  return <Component projects={projects} />;
}

export { ComponentDemo as DemoOne };
