// src/components/PDFUploadComponent/PDFUploadComponent.tsx
import { Eye, FileText, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { Job } from '../types/Job';
import PDFViewer from './PDFViewer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PDFUploadComponentProps {
  title: string;
  type: 'generated' | 'uploaded';
  jobId?: string;
  jobs?: Job[];
}

const PDFUploadComponent: React.FC<PDFUploadComponentProps> = ({ title, type, jobId, jobs }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  const selectedJob = jobs?.find(job => job.id === jobId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPdfUrl(URL.createObjectURL(file));
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPdfUrl(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold">
          <span className="text-black">{title}</span>
        </CardTitle>
        {selectedJob && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-semibold">{selectedJob.title}</p>
            <p>{selectedJob.company}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center w-full">
          {!selectedFile ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsViewing(true)}
                >
                  <Eye className="mr-2 h-4 w-4" /> View
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRemoveFile}
                >
                  <X className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* PDF Viewer Modal */}
        {isViewing && pdfUrl && (
          <PDFViewer 
            pdfUrl={pdfUrl} 
            onClose={() => setIsViewing(false)} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploadComponent;