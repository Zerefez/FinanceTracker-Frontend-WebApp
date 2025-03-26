// src/components/PDFUploadComponent/PDFViewer.tsx
import { X } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full h-[90vh] overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-60" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <iframe 
          src={pdfUrl} 
          className="w-full h-full"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PDFViewer;