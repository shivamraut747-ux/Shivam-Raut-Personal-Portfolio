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
    title: 'Tourist Website',
    description:
      'Modern full-stack travel and tourism discovery portal designed for exploring world destinations and booking custom holiday itineraries.',
    link: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    color: '#0f766e',
  },
];

function ComponentDemo() {
  return <Component projects={projects} />;
}

export { ComponentDemo as DemoOne };
