'use client';

import { ProcessingResult } from '@/lib/api-utils';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateCSV, downloadCSV } from '@/lib/csv-utils';

interface CSVExportButtonProps {
  results: ProcessingResult[];
  disabled?: boolean;
}

export function CSVExportButton({ results, disabled = false }: CSVExportButtonProps) {
  const handleExport = () => {
    const csvContent = generateCSV(results);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `ocr-results-${timestamp}.csv`);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || results.length === 0}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Export to CSV
    </Button>
  );
}
