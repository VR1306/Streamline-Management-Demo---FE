'use client';


import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { CommonPagination } from '../pagination';
import { Images } from '@/src/images';

type TTableHeader<T> = {
  label: string | React.ReactNode;
  key: keyof T | string;
  isSort?: boolean;
  width?: string;
};


 type TCommonTableProps<T> = {
  headers: TTableHeader<T>[];
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  tableCustomStyle: {
    tableContainer: string;
    tableStyle: string;
    tableHeaderStyle: string;
    tableHeaderRowStyle: string;
    tableHeadStyle: string;
    tableHeadDiv: string;
  };

  emptyMessage?: string;
  totalCount?: number;
  pageSize?: number;
  containerClassName?: string;
};


const SKELETON_ROW_KEYS = Array.from(
  { length: 20 },
  (_, i) => `table-skeleton-row-${i}`
);
const SKELETON_COL_KEYS = Array.from(
  { length: 20 },
  (_, i) => `table-skeleton-col-${i}`
);

const TableSkeletonRow = ({ columns }: { columns: number }) => {
  return (
    <tr className="bg-white">
      {SKELETON_COL_KEYS.slice(0, columns).map((key) => (
        <td key={key} className="px-4 py-4">
          <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse" />
        </td>
      ))}
    </tr>
  );
};

const CommonTable = <T extends object>({
  headers,
  data = [],
  renderRow,
  page,
  pageCount,
  onPageChange,
  isLoading,
  tableCustomStyle,
  totalCount,
  pageSize,
  containerClassName,
}: TCommonTableProps<T>) => {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language;

  const start =
    totalCount !== undefined && pageSize !== undefined
      ? (page - 1) * pageSize + 1
      : 0;

  const end =
    totalCount !== undefined && pageSize !== undefined
      ? Math.min(page * pageSize, totalCount)
      : 0;

  return (
    <div className={containerClassName ?? 'w-full min-w-0'}>
      <div
        className={
          tableCustomStyle?.tableContainer ?? 'relative w-full overflow-x-auto'
        }
      >
        <table
          className={
            tableCustomStyle?.tableStyle ??
            'w-full min-w-275 border-separate border-spacing-y-2'
          }
        >
          <thead className={tableCustomStyle?.tableHeaderStyle}>
            <tr className={tableCustomStyle?.tableHeaderRowStyle}>
              {headers.map((col) => (
                <th
                  key={String(col.key)}
                  className={tableCustomStyle?.tableHeadStyle}
                  style={col.width ? { width: col.width } : {}}
                >
                  <div className={tableCustomStyle?.tableHeadDiv}>
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* Skeleton */}
            {isLoading &&
              SKELETON_ROW_KEYS.slice(0, headers.length).map((key) => (
                <TableSkeletonRow key={key} columns={headers.length} />
              ))}

            {/* Empty */}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={headers.length}>
                  <div className="py-8 flex items-center justify-center">
                    <Image
                      src={
                        currentLanguage === 'fr'
                          ? Images.noDataFr
                          : Images.noData
                      }
                      alt={i18n.t('common:noData')}
                      width={currentLanguage === 'en' ? 200 : 260}
                      height={260}
                    />
                  </div>
                </td>
              </tr>
            )}

            {/* Data */}
            {!isLoading &&
              data.length > 0 &&
              data.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>

      {data.length > 0 &&
        (pageCount > 1 ||
          (totalCount !== undefined && pageSize !== undefined)) && (
          <div className="py-6 flex flex-col sm:flex-row items-center sm:justify-between w-full gap-4 sm:gap-0">
            {totalCount !== undefined && pageSize !== undefined && (
              <div className="flex flex-row sm:flex-col items-center sm:items-start text-sm font-medium gap-1 sm:gap-0">
                <span className="text-[#8F9091] whitespace-nowrap">
                  {t('common.pagination.showingResults')}
                </span>
                <span className="text-[#333333] whitespace-nowrap font-normal">
                  <span className="font-bold">
                    {start}-{end}
                  </span>
                  <span className="text-[#8F9091] ml-1">
                    {t('common.pagination.of')} {totalCount}
                  </span>
                </span>
              </div>
            )}

            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              {pageCount > 1 && (
                <CommonPagination
                  page={page}
                  pageCount={pageCount}
                  onChange={onPageChange}
                  justify="end"
                  disabled={isLoading}
                  className="!justify-center sm:!justify-end"
                />
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default CommonTable;
