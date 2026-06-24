'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

export type TabItem<T extends string = string> = {
  id: T;
  translationKey?: string;
  label?: string; // Fallback if no translation key provided
};

type IndicatorState = {
  left: number;
  width: number;
};

type TabsProps<T extends string = string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  translationNamespace?: string;
  tabMinWidth?: string; // Calculated min width to prevent text clipping
  isFitContentMobile?: boolean; // Mobile-only: allow tabs to size to content instead of full-width stretching
  isStretchedMobile?: boolean; // Mobile-only: force tabs to occupy full width and share space equally (50/50 for 2 tabs)
};

export default function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  translationNamespace = '',
  tabMinWidth = '8.125rem', // Default to  sizing + buffer (~130px)
  isFitContentMobile = false,
  isStretchedMobile = false,
}: TabsProps<T>) {
  const { t, i18n } = useTranslation(translationNamespace);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
  });

  const [maxMobileTabWidth, setMaxMobileTabWidth] = useState<string>('0');

  const calculateMaxTabWidth = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 640; // match 'sm' breakpoint
    if (!isMobile) {
      setMaxMobileTabWidth('0');
      return;
    }

    const widths = tabRefs.current
      .filter((ref): ref is HTMLButtonElement => ref !== null)
      .map((ref) => {
        // Use scrollWidth to get the full content width even if clipped
        return ref.scrollWidth;
      });

    if (widths.length > 0) {
      const maxPx = Math.max(...widths);
      // Convert to rem (assuming 16px base)
      const maxRem = maxPx / 16;
      setMaxMobileTabWidth(`${maxRem}rem`);
    }
  }, []);

  const recalcIndicator = useCallback(() => {
    const idx = tabs.findIndex((tDef) => tDef.id === activeTab);
    const el = tabRefs.current[idx];

    if (!el || !containerRef.current) return;

    // Relative to the sliding container correctly
    setIndicator({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  }, [activeTab, tabs]);

  // Use useLayoutEffect for initial measurement to avoid flicker
  useLayoutEffect(() => {
    recalcIndicator();
    const raf = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [recalcIndicator]);

  // Sync when activeTab changes
  useEffect(() => {
    recalcIndicator();

    // Ensure the active tab is visible in the scrollable container
    const idx = tabs.findIndex((tDef) => tDef.id === activeTab);
    const el = tabRefs.current[idx];

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab, recalcIndicator, tabs]);

  // Watch for resize and font loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      recalcIndicator();
      calculateMaxTabWidth();
    });

    observer.observe(containerRef.current);
    tabRefs.current.forEach((tab) => {
      if (tab) observer.observe(tab);
    });

    window.addEventListener('resize', recalcIndicator);
    window.addEventListener('resize', calculateMaxTabWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalcIndicator);
      window.removeEventListener('resize', calculateMaxTabWidth);
    };
  }, [recalcIndicator, calculateMaxTabWidth]);

  // Handle i18n language changes specifically
  useEffect(() => {
    recalcIndicator();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateMaxTabWidth();
  }, [i18n.language, recalcIndicator, calculateMaxTabWidth]);

  // Sync on initial load
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateMaxTabWidth();
  }, [calculateMaxTabWidth, tabs]);

  let mobileContainerWidthClass = 'w-max max-w-full sm:w-auto';
  if (isStretchedMobile) {
    mobileContainerWidthClass = 'w-full sm:w-auto';
  } else if (isFitContentMobile) {
    mobileContainerWidthClass = 'w-auto max-w-full';
  }

  let tabWidthClass = 'w-[var(--mobile-tab-width)] sm:w-auto';
  if (isStretchedMobile || isFitContentMobile) {
    tabWidthClass = 'w-auto';
  }

  return (
    <nav
      className="mb-4 max-w-full"
      aria-label={`${translationNamespace} sections`}
      style={
        {
          '--tab-min-width': tabMinWidth,
          '--mobile-tab-width':
            maxMobileTabWidth !== '0' ? maxMobileTabWidth : 'auto',
        } as React.CSSProperties
      }
    >
      <div
        className={`relative inline-flex flex-row items-center ${mobileContainerWidthClass} bg-white border border-[#E8EAEE] rounded-[0.25rem] overflow-x-auto sm:overflow-hidden no-scrollbar`}
      >
        {/* Tabs Container */}
        <div
          ref={containerRef}
          className={`relative flex flex-nowrap flex-row ${isStretchedMobile ? 'w-full sm:w-auto' : 'w-max sm:w-auto'} z-20 min-h-[2.1875rem]`}
          role="tablist"
        >
          {/* Shared Sliding Background (Placed behind text, but over button backgrounds) */}
          <div
            className={`
              absolute
              top-0
              bottom-0
              bg-[#1D2B50]
              ${isReady ? 'transition-all duration-300 ease-in-out' : ''}
              z-[1]
            `}
            style={{
              left: indicator.left,
              width: indicator.width,
            }}
            aria-hidden="true"
          />

          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            const labelText = tab.translationKey
              ? t(tab.translationKey)
              : tab.label || tab.id;

            return (
              <button
                key={tab.id}
                ref={(el: HTMLButtonElement | null) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                title={labelText}
                // Apply strict minWidth exclusively on large displays, let Flex:1 compress on mobile
                // `static` positioning ensures button border doesn't overlap the absolute z-[1] indicator
                className={[
                  'static h-[2.1875rem] whitespace-nowrap overflow-hidden border-r border-[#E8EAEE] last:border-r-0 cursor-pointer outline-none bg-transparent transition-colors duration-200 ease-in-out',
                  isStretchedMobile ? 'flex-1' : 'flex-none',
                  isFitContentMobile && !isStretchedMobile
                    ? 'px-[1.25rem]'
                    : 'px-[0.75rem] sm:px-[1rem]',
                  tabWidthClass,
                  'sm:flex-auto min-w-0 sm:min-w-[length:var(--tab-min-width)]',
                  isActive ? '' : 'hover:bg-slate-50/50',
                ].join(' ')}
              >
                {/* z-[2] keeps the text visibly over the sliding indicator */}
                <span
                  className={`relative z-[2] flex flex-row items-center justify-center w-full h-full text-[0.75rem] sm:text-[0.875rem] pointer-events-none overflow-hidden transition-colors duration-200 ease-in-out ${
                    isActive
                      ? 'text-white font-normal'
                      : 'text-[#1D2B50] font-normal'
                  }`}
                >
                  <span className="w-full block text-center">{labelText}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
