import { ProcessingResult } from './api-utils';

export function generateCSV(results: ProcessingResult[]): string {
  if (results.length === 0) return '';

  // Get all unique keys from all results
  const allKeys = new Set<string>();
  results.forEach((result) => {
    Object.keys(result).forEach((key) => allKeys.add(key));
  });

  const headers = Array.from(allKeys);
  const csvContent: string[] = [];

  // Add header row
  csvContent.push(headers.map((header) => `"${header}"`).join(','));

  // Add data rows
  results.forEach((result) => {
    const row = headers.map((header) => {
      const value = result[header] ?? '';
      const stringValue = String(value);
      // Escape quotes in the value
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvContent.push(row.join(','));
  });

  return csvContent.join('\n');
}

export function downloadCSV(csvContent: string, filename: string = 'ocr-results.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
