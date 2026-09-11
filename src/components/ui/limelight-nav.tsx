import React, { useState, useRef, useLayoutEffect, useEffect, cloneElement } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon?: React.ReactElement;
  label?: string;
  onClick?: () => void;
  href?: string;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

function useSafeRouterPath() {
  try {
    const routerState = useRouterState();
    return routerState?.location?.pathname ?? '';
  } catch {
    return '';
  }
}

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className = '',
  limelightClassName = '',
  iconContainerClassName = '',
  iconClassName = '',
}: LimelightNavProps) => {
  const currentPath = useSafeRouterPath();

  const routeActiveIndex = items.findIndex((item) => {
    if (!item.href) return false;
    if (item.href === '/') return currentPath === '/';
    return currentPath.startsWith(item.href);
  });

  const computedActiveIndex =
    controlledActiveIndex !== undefined && controlledActiveIndex >= 0
      ? controlledActiveIndex
      : routeActiveIndex >= 0
      ? routeActiveIndex
      : defaultActiveIndex;

  const [activeIndex, setActiveIndex] = useState(computedActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (computedActiveIndex >= 0) {
      setActiveIndex(computedActiveIndex);
    }
  }, [computedActiveIndex]);

  const updatePosition = () => {
    if (items.length === 0) return;
    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
    }
  };

  useLayoutEffect(() => {
    updatePosition();
    if (!isReady) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, isReady, items]);

  useEffect(() => {
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={`limelight-nav-bar relative inline-flex items-center h-16 rounded-lg bg-card text-foreground border px-2 ${className}`}>
      {items.map(({ id, icon, label, href, onClick }, index) => {
        const isActive = activeIndex === index;
        const innerContent = (
          <>
            {icon &&
              cloneElement(icon, {
                className: `w-6 h-6 transition-opacity duration-100 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-40'
                } ${icon.props.className || ''} ${iconClassName}`,
              })}
            {label && (
              <span className={`limelight-label ${isActive ? 'active opacity-100' : 'opacity-65'}`}>
                {label}
              </span>
            )}
          </>
        );

        const commonProps = {
          ref: (el: HTMLAnchorElement | null) => {
            navItemRefs.current[index] = el;
          },
          className: `limelight-item relative z-20 flex h-full cursor-pointer items-center justify-center p-5 ${
            isActive ? 'active ' : ''
          }${iconContainerClassName}`,
          onClick: () => handleItemClick(index, onClick),
          'aria-label': label,
        };

        if (href) {
          return (
            <Link key={id} to={href} {...commonProps}>
              {innerContent}
            </Link>
          );
        }

        return (
          <a key={id} {...commonProps}>
            {innerContent}
          </a>
        );
      })}

      <div
        ref={limelightRef}
        className={`limelight-beam-wrapper absolute top-0 z-10 w-11 h-[5px] rounded-full bg-primary shadow-[0_50px_15px_var(--primary)] ${
          isReady ? 'ready transition-[left] duration-400 ease-in-out' : 'init'
        } ${limelightClassName}`}
        style={{ left: '-999px' }}
      >
        <div className="limelight-spotlight absolute left-[-30%] top-[5px] w-[160%] h-14 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};
