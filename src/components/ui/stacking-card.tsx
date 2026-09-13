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

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.7, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);
  const targetLink = liveUrl || githubUrl || '#';

  return (
    <div
      ref={container}
      className='min-h-[85vh] md:min-h-screen flex items-center justify-center sticky top-0 py-8 md:py-16'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-2vh + ${i * 30}px)`,
        }}
        className='flex flex-col relative -top-[10%] md:-top-[15%] h-auto md:h-[480px] w-[92%] max-w-[980px] rounded-2xl p-6 md:p-10 origin-top shadow-2xl border border-white/15 text-white overflow-hidden backdrop-blur-md'
      >
        <h2 className='text-2xl md:text-3xl text-left md:text-center font-bold tracking-tight text-white mb-2 md:mb-4'>
          {title}
        </h2>
        <div className='flex flex-col-reverse md:flex-row h-full mt-2 md:mt-4 gap-6 md:gap-10 items-stretch md:items-center'>
          <div className='w-full md:w-[45%] flex flex-col justify-center space-y-4 text-white/90'>
            <p className='text-sm md:text-base leading-relaxed text-white/90'>{description}</p>
            {tags && tags.length > 0 && (
              <div className='flex flex-wrap gap-2 pt-1'>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2.5 py-1 text-xs font-medium rounded-md bg-white/15 text-white border border-white/20'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className='flex items-center gap-3 pt-2'>
              <a
                href={targetLink}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold text-sm transition-all duration-200 hover:bg-white/90 shadow-md cursor-pointer'
              >
                <span>Live Demo</span>
                <svg
                  width='16'
                  height='12'
                  viewBox='0 0 22 12'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z'
                    fill='currentColor'
                  />
                </svg>
              </a>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black/35 hover:bg-black/50 text-white font-medium text-sm transition-all duration-200 border border-white/20'
                >
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>

          <div className='relative w-full md:w-[55%] h-[200px] md:h-[280px] rounded-xl overflow-hidden shadow-inner bg-black/30 border border-white/10'>
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

  return (
    <ReactLenis root>
      <div className={cn('w-full', className)} ref={container}>
        <div className='w-full'>
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
                range={[i * (1 / projects.length), 1]}
                targetScale={targetScale}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
                tags={project.tags}
              />
            );
          })}
        </div>
      </div>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;
