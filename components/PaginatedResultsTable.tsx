'use client';

import { useState, useMemo } from 'react';
import { ProcessingResult } from '@/lib/api-utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatedResultsTableProps {
  results: ProcessingResult[];
  pageSize?: number;
}

export function PaginatedResultsTable({
  results,
  pageSize = 10,
}: PaginatedResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(results.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentResults = results.slice(startIndex, endIndex);

    return { totalPages, currentResults, startIndex, endIndex };
  }, [results, currentPage, pageSize]);

  const { totalPages, currentResults, startIndex, endIndex } = paginationData;
  const columns = results.length > 0 ? Object.keys(results[0]) : [];

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No US references detected in this document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-semibold text-foreground whitespace-nowrap"
                  >
                    {col
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result, index) => (
                <tr
                  key={`${startIndex}-${index}`}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${startIndex}-${index}-${col}`}
                      className="px-4 py-2 text-sm text-foreground whitespace-nowrap text-ellipsis overflow-hidden max-w-xs"
                      title={String(result[col] ?? '')}
                    >
                      {String(result[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, results.length)} of{' '}
          {results.length} results
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-10 h-9 px-2"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
