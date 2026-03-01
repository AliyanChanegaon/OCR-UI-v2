'use client';

import { useState, useMemo } from 'react';
import { OCRResponse } from '@/lib/api-utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageViewerProps {
  data: OCRResponse;
  highlightedTexts?: string[];
}

interface PageTextWithHighlightsProps {
  text: string;
  highlightedTexts: string[];
}

function PageTextWithHighlights({
  text,
  highlightedTexts,
}: PageTextWithHighlightsProps) {
  const parts = useMemo(() => {
    if (highlightedTexts.length === 0) return [{ text, isHighlighted: false }];

    let remaining = text;
    const result: Array<{ text: string; isHighlighted: boolean }> = [];

    const sortedTexts = highlightedTexts;

    while (remaining.length > 0) {
      let found = false;

      for (const highlightText of sortedTexts) {
        const index = remaining.toLowerCase().indexOf(highlightText.toLowerCase());
        if (index !== -1) {
          if (index > 0) {
            result.push({ text: remaining.substring(0, index), isHighlighted: false });
          }
          result.push({
            text: remaining.substring(index, index + highlightText.length),
            isHighlighted: true,
          });
          remaining = remaining.substring(index + highlightText.length);
          found = true;
          break;
        }
      }

      if (!found) {
        result.push({ text: remaining, isHighlighted: false });
        break;
      }
    }

    return result;
  }, [text, highlightedTexts]);

  return (
    <>
      {parts.map((part, idx) =>
        part.isHighlighted ? (
          <span key={idx} className="bg-yellow-200 text-yellow-900">
            {part.text}
          </span>
        ) : (
          <span key={idx}>{part.text}</span>
        )
      )}
    </>
  );
}

export function PageViewer({ data, highlightedTexts = [] }: PageViewerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = data.pages[currentPageIndex];

  const handlePrevious = () => {
    setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPageIndex((prev) =>
      prev < data.pages.length - 1 ? prev + 1 : prev
    );
  };

  const handlePageSelect = (index: number) => {
    setCurrentPageIndex(index);
  };

  const scrollPercentage = ((currentPageIndex + 1) / data.pages.length) * 100;
  const characterCount = currentPage.text.length;

  return (
    <Card className="p-6 space-y-4">
      {/* Page Navigation */}
      <div className="space-y-3">
        {/* Page Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPageIndex === 0}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex gap-2 overflow-x-auto flex-1">
            {data.pages.map((page, index) => (
              <Button
                key={index}
                variant={currentPageIndex === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageSelect(index)}
                className="whitespace-nowrap flex-shrink-0"
              >
                Page {page.page}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentPageIndex === data.pages.length - 1}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>


      </div>

      {/* Page Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            PAGE {currentPage.page} CONTENT
          </h3>
          <span className="text-xs text-muted-foreground">
            {characterCount} characters
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto rounded border border-border p-4 bg-background/50">
          <div className="text-sm text-foreground font-mono whitespace-pre-wrap break-words leading-relaxed">
            {highlightedTexts.length > 0 ? (
              <PageTextWithHighlights
                text={currentPage.text}
                highlightedTexts={highlightedTexts}
              />
            ) : (
              currentPage.text
            )}
          </div>
        </div>
      </div>

      {/* Page Counter */}
      <div className="text-center text-xs text-muted-foreground">
        Page {currentPageIndex + 1} of {data.pages.length}
      </div>
    </Card>
  );
}
