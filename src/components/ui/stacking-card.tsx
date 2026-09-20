'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
  liveUrl?: string | undefined;
  githubUrl?: string | undefined;
  tags?: string[] | undefined;
}

export interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  liveUrl?: string | undefined;
  githubUrl?: string | undefined;
  tags?: string[] | undefined;
}

export interface ComponentRootProps {
  projects: ProjectData[];
  className?: string | undefined;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
  liveUrl,
  githubUrl,
  tags,
}: CardProps) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);
  const targetLink = liveUrl || githubUrl || '#';

  return (
    <div
      ref={container}
      className='w-full flex items-start justify-center sticky top-6 md:top-8 pt-0'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `${i * 28}px`,
        }}
        className='flex flex-col relative h-auto w-full max-w-[1100px] rounded-2xl p-6 md:p-8 origin-top shadow-2xl border border-white/15 text-white overflow-hidden backdrop-blur-md'
      >
        <h2 className='text-2xl md:text-3xl lg:text-4xl text-left md:text-center font-bold tracking-tight text-white mb-3 md:mb-4'>
          {title}
        </h2>
        <div className='flex flex-col-reverse md:flex-row mt-1 md:mt-2 gap-6 md:gap-8 items-center justify-between'>
          <div className='w-full md:w-[54%] flex flex-col justify-between space-y-3 text-white'>
            <div className='space-y-2.5'>
              {description.split('\n\n').map((paragraph, idx) => {
                if (/^key\s*features?:?/i.test(paragraph.trim())) {
                  const lines = paragraph.split('\n');
                  return (
                    <div key={idx} className='space-y-1 pt-0.5'>
                      <p className='font-bold text-white text-sm md:text-[15px]'>{lines[0]}</p>
                      <ul className='list-disc list-inside space-y-0.5 text-xs md:text-sm text-white/90 pl-1'>
                        {lines.slice(1).map((feature, fIdx) => (
                          <li key={fIdx} className='leading-snug'>{feature.replace(/^[-•]\s*/, '')}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return <p key={idx} className='text-sm md:text-[15px] leading-relaxed text-white/95'>{paragraph}</p>;
              })}
            </div>
            {tags && tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2.5 py-1 text-xs md:text-sm font-medium rounded-lg bg-white/15 text-white border border-white/20'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {targetLink && (
              <div className='flex items-center gap-3 pt-1.5'>
                <a
                  href={targetLink}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm md:text-base transition-all duration-200 shadow-md shadow-green-950/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-green-500/30'
                >
                  <svg
                    viewBox='0 0 24 24'
                    width='18'
                    height='18'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                    />
                  </svg>
                  <span>GitHub Link</span>
                </a>
              </div>
            )}
          </div>

          <div className='relative w-full md:w-[44%] h-[200px] md:h-[310px] rounded-xl overflow-hidden shadow-inner bg-black/30 border border-white/10 flex-shrink-0'>
            <motion.div className='w-full h-full' style={{ scale: imageScale }}>
              <img
                src={url}
                alt={title}
                className='absolute inset-0 w-full h-full object-cover'
                loading='lazy'
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const Component = forwardRef<HTMLElement, ComponentRootProps>(({ projects, className }, ref) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const step = projects.length > 1 ? 1 / (projects.length - 1) : 1;

  return (
    <div className={cn('w-full', className)} ref={container}>
      <div className='w-full pb-[24vh] md:pb-[32vh]'>
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;
          return (
            <Card
              key={`p_${i}`}
              i={i}
              url={project.link}
              title={project.title}
              color={project.color}
              description={project.description}
              progress={scrollYProgress}
              range={[i * step, 1]}
              targetScale={targetScale}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
              tags={project.tags}
            />
          );
        })}
      </div>
    </div>
  );
});

Component.displayName = 'Component';

export default Component;
