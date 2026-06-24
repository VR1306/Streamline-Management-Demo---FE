import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import { useMediaQuery } from '@/src/helpers/hooks';
import Image from 'next/image';
import { Images } from '@/src/images';

export type CommonPaginationProps = {
  /** Current page (1-based) */
  page: number;
  /** Total page count */
  pageCount: number;
  /** Page change handler (1-based) */
  onChange: (page: number) => void;
  /** Wrapper class */
  className?: string;
  /** Alignment of pagination items */
  justify?: 'start' | 'center' | 'end';
  /** Break click handler */
  onBreakClick?: (e: {
    selected: number;
    nextSelectedPage: number;
    isPrevious: boolean;
    isNext: boolean;
  }) => void;
  /** Disable pagination interactions */
  disabled?: boolean;
} & Omit<ReactPaginateProps, 'pageCount' | 'onPageChange' | 'forcePage'>;

export function CommonPagination({
  page,
  pageCount,
  onChange,
  className = '',
  breakLabel = '…',
  justify = 'center',
  disabled = false,
  ...rest
}: CommonPaginationProps) {
  const { t } = useTranslation('common');
  const isMax1023 = useMediaQuery('(max-width: 1023px)');
  const isDesktop = !isMax1023;

  if (pageCount <= 1) return null;

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }[justify];

  const Paginate = ReactPaginate as React.ComponentType<
    ReactPaginateProps & {
      onBreakClick?: (props: {
        selected: number;
        nextSelectedPage: number;
        isPrevious: boolean;
        isNext: boolean;
      }) => void;
    }
  >;

  // Dynamic Logic based on screen size specification
  let dynamicPageRange: number;
  let dynamicMarginPages: number;
  let dynamicBreakLabel: React.ReactNode;

  if (pageCount <= 10) {
    //  Small Set Logic (No ellipses needed)
    dynamicPageRange = 10;
    dynamicMarginPages = 0;
    dynamicBreakLabel = null;
  } else {
    //  Mobile, Desktop & Tablet
    // Always display First, Last, Current. Range 3 = Current + 1 before/after.
    dynamicPageRange = 3;
    dynamicMarginPages = 1;
    dynamicBreakLabel = breakLabel;
  }

  return (
    <nav
      className={`flex flex-wrap w-full gap-2 ${justifyClass} py-2 md:py-[1rem] ${className}`}
      aria-label={t('common.pagination.paginationLabel')}
    >
      <Paginate
        {...rest}
        forcePage={page - 1}
        pageCount={pageCount}
        onPageChange={({ selected }: { selected: number }) => {
          if (!disabled) {
            onChange(selected + 1);
          }
        }}
        onClick={(props) => {
          if (disabled || !props.isBreak) return;

          // Logic for Ellipsis (Logical Jumps)
          const jumpAmount = pageCount > 50 ? 15 : 10;

          if (props.isNext) {
            // Forward jump: logically move 15 pages ahead
            const targetPage = Math.min(pageCount, page + jumpAmount);
            return targetPage - 1; // 0-indexed
          } else if (props.isPrevious) {
            // Backward jump: logically move 15 pages back
            const targetPage = Math.max(1, page - jumpAmount);
            return targetPage - 1; // 0-indexed
          }
        }}
        pageRangeDisplayed={dynamicPageRange}
        marginPagesDisplayed={dynamicMarginPages}
        breakLabel={dynamicBreakLabel}
        /* ---------- Labels ---------- */
        previousLabel={
          <span className="flex items-center justify-center">
            <Image
              src={Images.shape}
              alt={'Previous'}
              className="rotate-90"
              width={14}
              height={14}
            />
          </span>
        }
        nextLabel={
          <span className="flex items-center justify-center">
            <Image
              src={Images.shape}
              alt={'Next'}
              className="-rotate-90"
              width={14}
              height={14}
            />
          </span>
        }
        /* ---------- Container ---------- */
        containerClassName={`flex items-center flex-wrap gap-[0.25rem] md:gap-[0.5rem] text-[0.7rem] md:text-[0.875rem] select-none ${
          !isDesktop ? 'w-auto' : 'w-full'
        } ${justifyClass} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        /* ---------- Page ---------- */
        pageClassName=""
        pageLinkClassName={`
          flex h-[1.85rem] min-w-[1.85rem] md:h-[2.25rem] md:min-w-[2.25rem] items-center justify-center rounded-md px-[0.35rem] md:px-[0.75rem] cursor-pointer
          text-slate-700 bg-[#F9FBFF]
          transition-all duration-200 ease-in-out
          hover:bg-slate-100 hover:text-black hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-slate-300
        `}
        activeLinkClassName="
          !bg-primary !text-white
          hover:!bg-primary/90 hover:!text-white hover:scale-100
        "
        /* ---------- Previous / Next ---------- */
        previousClassName=""
        nextClassName=""
        previousLinkClassName="
          flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-md cursor-pointer
          text-slate-600
          transition-all duration-200
          hover:bg-slate-100 hover:text-slate-900
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        nextLinkClassName="
          flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-md cursor-pointer
          text-slate-600
          transition-all duration-200
          hover:bg-slate-100 hover:text-slate-900
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        /* ---------- Break ---------- */
        breakClassName=""
        breakLinkClassName="px-0.5 md:px-2 text-slate-400 cursor-pointer hover:text-primary transition-colors duration-200"
        /* ---------- Disabled ---------- */
        disabledClassName="opacity-40 cursor-not-allowed"
      />
    </nav>
  );
}
