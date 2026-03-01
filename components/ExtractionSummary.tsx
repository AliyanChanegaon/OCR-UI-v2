'use client';

import { Card } from '@/components/ui/card';
import { ProcessingResult } from '@/lib/api-utils';

interface ExtractionSummaryProps {
  results: ProcessingResult[];
  processingTime: number;
}

export function ExtractionSummary({
  results,
  processingTime,
}: ExtractionSummaryProps) {
  // Calculate statistics
  const totalReferences = results.length;
  const uniqueReferences = new Set(
    results.map((r) => r.identificationType + r.patentNumber)
  ).size;
  const duplicates = totalReferences - uniqueReferences;
  const pageNumbers = new Set(results.map((r) => r.pageNo));
  const pageRangeText = Array.from(pageNumbers)
    .sort((a, b) => a - b)
    .join(', ');

  const stats = [
    {
      label: 'Total References Found',
      value: totalReferences,
      color: 'bg-blue-500/10 text-blue-700',
    },
    {
      label: 'Unique References',
      value: uniqueReferences,
      color: 'bg-green-500/10 text-green-700',
    },
    {
      label: 'Duplicate References',
      value: duplicates,
      color: `${duplicates > 0 ? 'bg-orange-500/10 text-orange-700' : 'bg-gray-500/10 text-gray-700'}`,
    },
    {
      label: 'Pages with References',
      value: pageNumbers.size,
      color: 'bg-purple-500/10 text-purple-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-4 bg-card border border-border"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-card border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Page Numbers
            </p>
            <p className="text-sm text-foreground font-mono">{pageRangeText}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Processing Time
            </p>
            <p className="text-sm text-foreground">{processingTime}s</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
