'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ProcessingModalProps {
  isOpen: boolean;
  status: 'loading' | 'success' | 'error';
  message: string;
  fileName?: string;
  onClose: () => void;
  onRetry?: () => void;
}

const PROCESSING_STEPS = [
  'Uploading file…',
  'Reading document text…',
  'Scanning for US references…',
  'Validating extracted references…',
  'Finalizing results…',
];

export function ProcessingModal({
  isOpen,
  status,
  message,
  fileName,
  onClose,
  onRetry,
}: ProcessingModalProps) {
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(stepInterval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      setCurrentStep(0);
      return;
    }

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isLoading]);

  const progressPercentage = ((currentStep + 1) / PROCESSING_STEPS.length) * 95;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isLoading && 'Processing Document'}
            {isSuccess && 'Success!'}
            {isError && 'Processing Failed'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {isLoading && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              
              {fileName && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {fileName}
                  </p>
                </div>
              )}

              <div className="w-full space-y-3">
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Step Messages */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {PROCESSING_STEPS[currentStep]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Processing… {elapsedTime}s
                  </p>
                </div>


              </div>
            </>
          )}

          {isSuccess && (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <div className="text-center space-y-1">
                <p className="text-foreground font-medium">{message}</p>
                <p className="text-xs text-muted-foreground">
                  Completed in {elapsedTime}s
                </p>
              </div>
            </>
          )}

          {isError && (
            <>
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium">Something went wrong</p>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
            </>
          )}

          <div className="w-full flex gap-3 mt-4">
            {isError && onRetry && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={onRetry} className="flex-1">
                  Try Again
                </Button>
              </>
            )}
            {isSuccess && (
              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
