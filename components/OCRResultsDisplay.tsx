'use client';

import { OCRResponse } from '@/lib/api-utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

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

    const sortedTexts = [...highlightedTexts].sort(
      (a, b) => b.length - a.length
    );

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

interface OCRResultsDisplayProps {
  data: OCRResponse;
  onProcessClick: () => void;
  isProcessing: boolean;
  highlightedTexts?: string[];
}

export function OCRResultsDisplay({
  data,
  onProcessClick,
  isProcessing,
  highlightedTexts = [],
}: OCRResultsDisplayProps) {
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

  const togglePage = (index: number) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedPages(newExpanded);
  };

  if (!data.pages || data.pages.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Extraction Results</h2>
          <p className="text-muted-foreground mt-1">
            {data.pages.length} page{data.pages.length !== 1 ? 's' : ''} extracted
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.pages.map((page, index) => {
          const isExpanded = expandedPages.has(index);
          const previewLength = 200;
          const preview = page.text.substring(0, previewLength);
          const isLongText = page.text.length > previewLength;

          return (
            <Card
              key={page.page}
              className="flex flex-col h-full bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm font-medium">
                    Page {page.page}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {page.text.length} characters
                  </span>
                </div>

                <div className="flex-1">
                  <div
                    className={`text-sm text-foreground font-mono whitespace-pre-wrap break-words ${
                      !isExpanded ? 'line-clamp-6' : ''
                    }`}
                  >
                    {highlightedTexts.length > 0 ? (
                      <PageTextWithHighlights
                        text={isExpanded ? page.text : preview}
                        highlightedTexts={highlightedTexts}
                      />
                    ) : (
                      <>
                        {isExpanded ? page.text : preview}
                        {isLongText && !isExpanded && '...'}
                      </>
                    )}
                  </div>
                </div>

                {isLongText && (
                  <button
                    onClick={() => togglePage(index)}
                    className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show more
                      </>
                    )}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={onProcessClick}
          disabled={isProcessing}
          size="lg"
          className="min-w-48"
        >
          {isProcessing ? 'Processing Document...' : 'Process Document'}
        </Button>
      </div>
    </div>
  );
}
