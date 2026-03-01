'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, Loader2,X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FileUploadSectionProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UPLOAD_STEPS = [
  'Uploading file…',
  'Validating PDF…',
  'Extracting data…',
  'Processing document…',
  'Finalizing results…',
];

export function FileUploadSection({
  onFileSelect,
  isLoading,
}: FileUploadSectionProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setElapsedTime(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < UPLOAD_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(stepInterval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedTime(0);
      return;
    }

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isLoading]);

  const progressPercentage = ((currentStep + 1) / UPLOAD_STEPS.length) * 80;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF, image, or Word document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setError(null);
    setSelectedFile(file);
  }
};

const handleUploadClick = () => {
  if (!selectedFile) {
    setError('Please select a file first.');
    return;
  }

  validateAndProcessFile(selectedFile);

  // ✅ allow re-upload of same file
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }

  setSelectedFile(null);
};

const handleRemoveFile = () => {
  setSelectedFile(null);
  setError(null);

  // VERY IMPORTANT → allows re-selecting same file
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  return (
    <Card className="w-full p-8 border-2 border-dashed border-border">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-6 py-12 transition-all ${
          isDragActive ? 'bg-muted/50 rounded-lg' : ''
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col items-center gap-2" onClick={() => fileInputRef.current?.click()}
    style={{border:'2px solid red'}}>
          <Upload className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Drop your document here
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (PDF, images, or Word documents)
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          disabled={isLoading}
          className="hidden"
        />

{selectedFile && (
  <div className="mt-4 flex items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30">
    <div className="flex flex-col text-sm overflow-hidden">
      <span className="font-medium truncate">
        {selectedFile.name}
      </span>
      <span className="text-xs text-muted-foreground">
        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
      </span>
    </div>

    <Button
      size="icon"
      variant="ghost"
      onClick={handleRemoveFile}
      disabled={isLoading}
      className="shrink-0"
    >
      <X className="w-4 h-4" />
    </Button>
  </div>
)}
  <Button
    onClick={handleUploadClick}
    disabled={isLoading || !selectedFile}
  >
    {isLoading ? 'Uploading...' : 'Upload'}
  </Button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-6 text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: PDF, PNG, JPEG, DOC, DOCX</p>
        <p>• Maximum file size: 10MB</p>
      </div>

      {/* Upload Progress Modal */}
      <Dialog open={isLoading}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Uploading Document</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />

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
                  {UPLOAD_STEPS[currentStep]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Processing… {elapsedTime}s
                </p>
              </div>
            

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
