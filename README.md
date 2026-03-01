# OCR Document Processor

A professional, user-friendly UI layer for OCR (Optical Character Recognition) document processing with intelligent data extraction and CSV export capabilities.

## Features

### 📄 Document Upload
- Drag-and-drop file upload interface
- Support for multiple file formats: PDF, PNG, JPEG, JPG, DOC, DOCX
- 10MB file size limit with validation
- Real-time error messaging

### 📋 OCR Extraction
- Multi-page document support
- Text extraction from each page
- Responsive grid layout displaying pages side-by-side (not stacked)
- Expandable/collapsible page content with character count
- Clean, monospace font for code-like text visibility

### 🔄 Document Processing
- Two-step workflow: Extract → Process
- Dynamic step-based loading states with progress indicators
- Real-time processing time display
- 5-step progress tracking with visual indicators
- Disabled interactions during processing
- Success/error states with retry capability
- Modal-based user feedback during processing

### 📊 Data Export & Analysis
- Intelligent CSV generation from processing results
- Automatic column detection from API response
- Proper escaping of special characters
- Timestamped CSV files (format: `ocr-results-YYYY-MM-DD.csv`)
- One-click download
- **Extraction Summary**: Total, unique, and duplicate references count
- **Page Analytics**: Page numbers where references appear
- **Pagination**: 15 rows per page with sticky headers
- **Compact Display**: Reduced row height and scrolling for better UX
- **Empty State**: Clear messaging when no references detected

### 🎨 User Experience
- Professional, clean design
- Responsive layout (mobile-first approach)
- Real-time toast notifications
- Loading states and animations
- Error handling with descriptive messages
- Empty states with helpful guidance

## Project Structure

```
├── app/
│   ├── page.tsx                 # Main application component
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styles
├── components/
│   ├── FileUploadSection.tsx     # File upload UI with drag-and-drop
│   ├── OCRResultsDisplay.tsx     # Multi-page results grid display
│   ├── ProcessingModal.tsx       # Step-based loading modal with progress
│   ├── ExtractionSummary.tsx     # Statistics and summary display
│   ├── PaginatedResultsTable.tsx # Table with pagination and sticky header
│   ├── CSVExportButton.tsx       # CSV export functionality
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api-utils.ts             # API integration utilities
│   ├── csv-utils.ts             # CSV generation and download
│   └── utils.ts                 # General utilities
└── package.json
```

## API Integration

### First API: OCR Extraction
**Endpoint:** `POST http://localhost:3000/extract-document`
**Content-Type:** `multipart/form-data`

**Request:**
- Form data with file field

**Response:**
```json
{
  "pages": [
    {
      "page": 1,
      "text": "Extracted text content..."
    },
    {
      "page": 2,
      "text": "More extracted text..."
    }
  ]
}
```

### Second API: Document Processing
**Endpoint:** `POST http://localhost:3000/process-document`
**Content-Type:** `application/json`

**Request:** Same structure as OCR extraction response

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "identificationType": "U.S. Provisional Application No.",
      "patentNumber": "63/299,458",
      "pageNo": 1
    },
    {
      "identificationType": "Patent Title",
      "patentNumber": "Example Patent",
      "pageNo": 1
    }
  ]
}
```

## Getting Started

### Installation
```bash
npm install
# or
pnpm install
```

### Running the Application
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup
Ensure your OCR backend is running on `http://localhost:3000` with the two endpoints:
- `POST /extract-document` - For OCR extraction
- `POST /process-document` - For document processing

## Component Details

### FileUploadSection
Handles file selection and validation with:
- Drag-and-drop support
- File type validation (PDF, images, Word docs)
- File size validation (10MB max)
- Clear error messages
- Loading state management

### OCRResultsDisplay
Displays extraction results in a responsive grid:
- Cards arranged side-by-side on desktop (2-3 columns)
- Single column on mobile
- Expandable content for long text
- Page number badges and character counts
- Process button to initiate document processing

### ProcessingModal
Shows real-time feedback during processing:
- **5-Step Progress Tracking**: Uploading → Reading → Scanning → Validating → Finalizing
- Animated progress bar with visual indicators
- Real-time elapsed time counter
- File name display during processing
- Success state with completion time
- Error state with retry button
- Non-dismissible during processing
- Clean, focused UI

### ExtractionSummary
Displays statistics above the data grid:
- Total US references found
- Unique references count
- Duplicate references count
- Page numbers where references appear
- Processing time in seconds
- Color-coded stat cards for quick visual scanning

### PaginatedResultsTable
Enhanced data grid with improved UX:
- Pagination with 15 rows per page
- Sticky table headers for easy scrolling
- Compact row height (py-2 vs py-3)
- Previous/Next/Page number navigation
- Empty state message if no references found
- Shows current range (e.g., "Showing 1 to 15 of 42 results")

### CSVExportButton
Generates and downloads CSV files:
- Automatic column detection
- Proper CSV formatting with quoted values
- Special character escaping
- Timestamped filenames
- Disabled state when no data available

## Styling

The application uses:
- **Tailwind CSS** for responsive design
- **shadcn/ui** components for consistent UI
- **Lucide React** icons for visual consistency
- **Design Tokens** for themeable colors

### Theme Variables
- Primary/Secondary colors
- Muted backgrounds
- Accent colors
- Border and ring colors

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- File size violations
- Network errors during API calls
- Invalid API responses
- Missing required fields

All errors are presented to users through:
- Toast notifications for quick feedback
- Modal dialogs for critical errors
- Inline error messages near relevant controls
- Retry buttons for transient failures

## Performance Considerations

- Lazy-loaded components
- Efficient state management with React hooks
- Minimal re-renders through proper dependency management
- Client-side CSV generation (no server overhead)
- Responsive images and optimized assets

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Recent Enhancements

- ✨ **Dynamic Loading States**: Step-based processing messages with visual progress indicators
- ✨ **Extraction Summary**: Statistics panel showing total/unique/duplicate references and page numbers
- ✨ **Paginated Results**: 15 rows per page with sticky headers and compact display
- ✨ **Elapsed Time Tracking**: Real-time processing time display in both modal and summary
- ✨ **Disabled Interactions**: Grid disabled during processing to prevent user confusion
- ✨ **Empty State**: Clear messaging when no US references are detected

## Future Enhancements

- PDF viewer with reference highlighting
- Click-to-navigate: Select row to highlight text in original document
- Batch file processing
- Advanced text filtering and search
- Custom column mapping for CSV export
- Document preview thumbnails
- Processing history and logs
- Rate limiting and quota management

## License

MIT
