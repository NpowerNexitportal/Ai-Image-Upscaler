
import React, { useState, useCallback } from 'react';

interface ImageInputProps {
  onImageUpload: (file: File) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-base-300 hover:border-brand-secondary'}`}
    >
      <div className="flex flex-col items-center justify-center space-y-2 text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <p className="font-semibold">Drag & drop an image here</p>
        <p>or <span className="text-brand-primary font-medium">click to browse</span></p>
        <p className="text-xs">PNG, JPG, WEBP supported</p>
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
  );
};

export default ImageInput;
