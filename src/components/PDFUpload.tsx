// src/components/PDFUploadComponent/PDFUploadComponent.tsx
import { Eye, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { Job } from './Job';
import PDFViewer from './PDFViewer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PDFUploadComponentProps {
  title: string;
  type: 'generated' | 'uploaded';
  jobId?: string;
  jobs?: Job[];
}

const PDFUploadComponent = ({ title, type, jobId, jobs }: PDFUploadComponentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isViewing, setIsViewing] = useState(false);

  const selectedJob = jobs?.find(job => job.CompanyName === jobId);

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
            <p className="font-semibold">{selectedJob.Title || selectedJob.CompanyName}</p>
            <p>{selectedJob.CompanyName}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!pdfUrl ? (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <FileText size={48} className="text-gray-400 mb-4" />
            <p className="mb-4 text-center text-gray-500">
              {type === 'uploaded' ? 'Upload a PDF file of your paycheck' : 'Generate a PDF of your paycheck'}
            </p>
            {type === 'uploaded' ? (
              <label className="cursor-pointer">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload Paycheck
                </Button>
                <input 
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <Button variant="outline" className="flex items-center gap-2">
                <FileText size={16} />
                Generate Paycheck
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText size={24} className="text-gray-700 mr-2" />
                <span className="font-medium truncate max-w-[200px]">
                  {selectedFile?.name || 'Generated Paycheck.pdf'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsViewing(true)}
                  className="flex items-center gap-1"
                >
                  <Eye size={16} />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                  Remove
                </Button>
              </div>
            </div>
            
            {/* PDF Preview thumbnail */}
            <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden relative">
              {pdfUrl && !isViewing && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsViewing(true)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <Eye size={36} className="text-white z-10" />
                </div>
              )}
              {pdfUrl && (
                <iframe 
                  src={pdfUrl} 
                  className="w-full h-full pointer-events-none"
                  title="PDF Preview"
                ></iframe>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* PDF Viewer Modal */}
      {isViewing && pdfUrl && (
        <PDFViewer 
          pdfUrl={pdfUrl}
          onClose={() => setIsViewing(false)}
        />
      )}
    </Card>
  );
};

export default PDFUploadComponent;