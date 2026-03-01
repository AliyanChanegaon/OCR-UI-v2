'use client';

import { useState } from 'react';
import { FileUploadSection } from '@/components/FileUploadSection';
import { PageViewer } from '@/components/PageViewer';
import { ProcessingModal } from '@/components/ProcessingModal';
import { CSVExportButton } from '@/components/CSVExportButton';
import { ExtractionSummary } from '@/components/ExtractionSummary';
import { PaginatedResultsTable } from '@/components/PaginatedResultsTable';
import {
  uploadFileForOCR,
  processDocument,
  OCRResponse,
  ProcessingResult,
} from '@/lib/api-utils';
import { useToast } from '@/hooks/use-toast';
import { ocr, pages } from '@/dummy';

export default function Home() {
  const { toast } = useToast();
  const [ocrData, setOcrData] = useState<OCRResponse | null>(null);
  const [processingResults, setProcessingResults] = useState<ProcessingResult[]>([]);
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [processingStartTime, setProcessingStartTime] = useState<number>(0);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [highlightedTexts, setHighlightedTexts] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'loading' | 'success' | 'error';
    message: string;
  }>({
    isOpen: false,
    status: 'loading',
    message: '',
  });
  const handleFileSelect = async (file: File) => {
    setIsOCRLoading(true);
    setOcrData(null);
    setProcessingResults([]);
    setUploadFileName(file.name);

    try {
      await new Promise((resolve) => setTimeout(resolve, 40000));
      const response = pages;
      setOcrData(response);
      toast({
        title: 'Success',
        description: `Document extracted successfully. ${response.pages.length} page(s) found.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to extract document';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsOCRLoading(false);
    }
  };

  const handleProcessDocument = async () => {
    if (!ocrData) return;

    setProcessingStartTime(Date.now());
    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Processing your document...',
    });
    setIsProcessingLoading(true);

    try {
       await new Promise((resolve) => setTimeout(resolve, 40000));
      const response = ocr;

      const elapsedSeconds = Math.floor((Date.now() - processingStartTime) / 1000);
      setProcessingTime(elapsedSeconds);

      if (response.success && response.results) {
        setProcessingResults(response.results);

        // Extract unique identification types/patent numbers for highlighting
        const textsToHighlight = Array.from(
          new Set(
            response.results
              .map((r:any) => r.patentNumber || r.identificationType)
              .filter(Boolean)
          )
        ) as string[];
        setHighlightedTexts(textsToHighlight);

        setModalState({
          isOpen: true,
          status: 'success',
          message: `Successfully processed ${response.results.length} records`,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to process document';
      setModalState({
        isOpen: true,
        status: 'error',
        message: message,
      });
    } finally {
      setIsProcessingLoading(false);
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const retryProcessing = () => {
    handleProcessDocument();
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            OCR Document Processor
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload documents to extract text and process information automatically
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <FileUploadSection
            onFileSelect={handleFileSelect}
            isLoading={isOCRLoading}
          />
        </div>

        {/* Results Section */}
        {ocrData && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Document Preview</h2>
                  <p className="text-muted-foreground mt-1">
                    {ocrData.pages.length} page{ocrData.pages.length !== 1 ? 's' : ''} extracted
                  </p>
                </div>
                <button
                  onClick={handleProcessDocument}
                  disabled={isProcessingLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isProcessingLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isProcessingLoading ? 'Processing...' : 'Process Document'}
                </button>
              </div>
              <PageViewer
                data={ocrData}
                highlightedTexts={highlightedTexts}
              />
            </div>

            {/* Processing Results */}
            {processingResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Processing Results
                    </h2>
                  </div>
                  <CSVExportButton results={processingResults} />
                </div>

                {/* Extraction Summary */}
                <ExtractionSummary
                  results={processingResults}
                  processingTime={processingTime}
                />

                {/* Paginated Results Table */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Extracted References
                    </h3>
                  </div>
                  <PaginatedResultsTable results={processingResults} pageSize={15} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!ocrData && !isOCRLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Upload a document to get started
            </p>
          </div>
        )}
      </div>

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        message={modalState.message}
        fileName={uploadFileName}
        onClose={closeModal}
        onRetry={retryProcessing}
      />
    </main>
  );
}
