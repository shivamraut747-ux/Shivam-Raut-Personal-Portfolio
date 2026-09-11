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
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  // Sync state if active index changes from route
  useEffect(() => {
    if (computedActiveIndex >= 0) {
      setActiveIndex(computedActiveIndex);
    }
  }, [computedActiveIndex]);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = String(newLeft) + 'px';

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
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
                  'limelight-icon transition-opacity duration-100 ease-in-out ' +
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
        className={
          'limelight-beam-wrapper ' +
          (isReady ? 'ready ' : 'init ') +
          limelightClassName
        }
        style={{ left: '-999px' }}
      >
        <div className='limelight-spotlight' />
      </div>
    </nav>
  );
};
