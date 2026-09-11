import React, { useState, useRef, useLayoutEffect, useEffect, cloneElement } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';

export type NavItem = {
  id: string | number;
  icon?: React.ReactElement;
  label: string;
  href?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a limelight effect that highlights the active item.
 */
export const LimelightNav = ({
  items,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className = '',
  limelightClassName = '',
  iconContainerClassName = '',
  iconClassName = '',
}: LimelightNavProps) => {
  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname ?? '';

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
  const [limelightStyle, setLimelightStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  // Synchronize active index when route changes
  useEffect(() => {
    if (computedActiveIndex >= 0) {
      setActiveIndex(computedActiveIndex);
    }
  }, [computedActiveIndex]);

  // Position immediately on mount with useLayoutEffect without sliding from -999px
  useLayoutEffect(() => {
    if (items.length === 0) return;

    const calculatePosition = (animate = hasAnimated) => {
      const activeItem = navItemRefs.current[activeIndex];
      const limelight = limelightRef.current;

      if (activeItem && limelight) {
        const left = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
        setLimelightStyle({
          left: String(left) + "px",
          opacity: 1,
          transition: animate
            ? "left 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease"
            : "none",
        });
        if (!hasAnimated) {
          // Enable smooth animation only for subsequent tab clicks or route switches
          requestAnimationFrame(() => {
            setHasAnimated(true);
          });
        }
      }
    };

    calculatePosition();

    const timer = setTimeout(() => calculatePosition(hasAnimated), 40);
    const handleResize = () => calculatePosition(false);

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setHasAnimated(true);
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={'limelight-nav-bar ' + className}>
      {items.map(({ id, icon, label, href, onClick }, index) => {
        const isActive = activeIndex === index;
        const content = (
          <>
            {icon &&
              cloneElement(icon, {
                className:
                  'limelight-icon ' +
                  (isActive ? 'opacity-100 ' : 'opacity-40 ') +
                  (icon.props.className || '') +
                  ' ' +
                  iconClassName,
              })}
            <span className={'limelight-label ' + (isActive ? 'active' : '')}>{label}</span>
          </>
        );

        if (href) {
          return (
            <Link
              key={id}
              to={href}
              ref={(el) => {
                navItemRefs.current[index] = el;
              }}
              className={'limelight-item ' + (isActive ? 'active ' : '') + iconContainerClassName}
              onClick={() => handleItemClick(index, onClick)}
              aria-label={label}
            >
              {content}
            </Link>
          );
        }

        return (
          <a
            key={id}
            ref={(el) => {
              navItemRefs.current[index] = el;
            }}
            className={'limelight-item ' + (isActive ? 'active ' : '') + iconContainerClassName}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {content}
          </a>
        );
      })}

      <div
        ref={limelightRef}
        className={'limelight-beam-wrapper ' + limelightClassName}
        style={limelightStyle}
      >
        <div className='limelight-spotlight' />
      </div>
    </nav>
  );
};
