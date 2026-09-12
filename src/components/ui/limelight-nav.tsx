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
  activeIndex?: number | undefined;
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
    if (item.id === 'about' && (currentPath === '/' || currentPath === '/about')) return true;
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
      const beamWidth = limelight.offsetWidth || 44;
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - beamWidth / 2;
      limelight.style.left = `${newLeft}px`;
    }
  };

  useLayoutEffect(() => {
    updatePosition();
    if (!isReady) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activeIndex, isReady, items]);

  useEffect(() => {
    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    document.fonts?.ready?.then?.(() => updatePosition());
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
    <nav className={`limelight-nav-bar ${className}`.trim()}>
      {items.map(({ id, icon, label, href, onClick }, index) => {
        const isActive = activeIndex === index;
        const iconProps = icon && React.isValidElement(icon) ? (icon.props as { className?: string }) : null;
        const innerContent = (
          <>
            {icon &&
              React.isValidElement(icon) &&
              cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: `limelight-icon transition-opacity duration-100 ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-40'
                } ${iconProps?.className || ''} ${iconClassName}`.trim(),
              })}
            {label && (
              <span className={`limelight-label ${isActive ? 'active' : ''}`}>
                {label}
              </span>
            )}
          </>
        );

        const commonProps = {
          ref: (el: HTMLAnchorElement | null) => {
            navItemRefs.current[index] = el;
          },
          className: `limelight-item ${isActive ? 'active' : ''} ${iconContainerClassName}`.trim(),
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
        className={`limelight-beam-wrapper ${isReady ? 'ready' : 'init'} ${limelightClassName}`.trim()}
        style={{ left: '-999px' }}
      >
        <div className="limelight-spotlight" />
      </div>
    </nav>
  );
};
