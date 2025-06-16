import React, { useState, useCallback } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { FileParser, ParsedData, FileParseResult } from '../lib/fileParser';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileProcessed: (data: ParsedData) => void;
  onError: (error: string) => void;
  className?: string;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  result?: ParsedData;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileProcessed, 
  onError, 
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result: FileParseResult = await FileParser.parseFile(file);
        
        setUploadedFiles(prev => prev.map(f => 
          f.file === file 
            ? { 
                ...f, 
                status: result.success ? 'success' : 'error',
                result: result.data,
                error: result.error
              }
            : f
        ));

        if (result.success && result.data) {
          onFileProcessed(result.data);
        } else {
          onError(result.error || 'Failed to process file');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        setUploadedFiles(prev => prev.map(f => 
          f.file === file 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        ));
        
        onError(errorMessage);
      }
    }

    setIsProcessing(false);
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const supportedFormats = ['CSV', 'JSON', 'TXT', 'TSV'];

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".csv,.json,.txt,.tsv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Drop your data files here, or click to browse
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Supported formats: {supportedFormats.join(', ')}
            </p>
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadedFiles.map((uploadedFile, index) => (
              <motion.div
                key={`${uploadedFile.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(uploadedFile.file.size / 1024).toFixed(1)} KB
                    </p>
                    
                    {uploadedFile.result && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {uploadedFile.result.data.length} rows, {uploadedFile.result.columns.length} columns
                      </p>
                    )}
                    
                    {uploadedFile.error && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {uploadedFile.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  
                  <button
                    onClick={() => removeFile(uploadedFile.file)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}
      {uploadedFiles.some(f => f.status === 'success' && f.result) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Data Preview
          </h4>
          
          {uploadedFiles
            .filter(f => f.status === 'success' && f.result)
            .map((uploadedFile, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {uploadedFile.file.name}
                </p>
                
                {uploadedFile.result && (
                  <div className="bg-white dark:bg-gray-900 rounded border p-3 text-xs font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {FileParser.generateDataSummary(uploadedFile.result)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
};