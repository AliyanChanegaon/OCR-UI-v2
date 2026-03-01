

// OCR API call
export async function uploadFileForOCR(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:800/ocr', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`OCR extraction failed: ${response.statusText}`);
  }
   return response.json();

}

// Process document API call
export async function processDocument(ocrResponse: OCRResponse) {
  const response = await fetch('http://localhost:300/api/patents/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ocrResponse),
  });

  if (!response.ok) {
    throw new Error(`Document processing failed: ${response.statusText}`);
  }
  return response.json();
}

// Type definitions
export interface OCRPage {
  page: number;
  text: string;
}

export interface OCRResponse {
  pages: OCRPage[];
}

export interface ProcessingResult {
  identificationType: string;
  patentNumber: string;
  pageNo: number;
  [key: string]: string | number;
}

export interface ProcessingResponse {
  success: boolean;
  results: ProcessingResult[];
}
