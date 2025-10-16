
import React from 'react';

interface ResultDisplayProps {
  originalImage: string | null;
  upscaledImage: string | null;
}

const ImagePlaceholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-text-secondary h-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <h3 className="mt-4 text-xl font-semibold">Your upscaled image will appear here</h3>
        <p className="mt-1 text-base">Upload an image and select a resolution to start.</p>
    </div>
);

const ImageCard: React.FC<{ src: string; label: string; isUpscaled?: boolean }> = ({ src, label, isUpscaled = false }) => (
    <div className="flex-1 flex flex-col gap-2 items-center min-w-0">
      <div className="w-full aspect-square bg-base-200 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={src} alt={label} className="w-full h-full object-contain" />
      </div>
      <div className="flex items-center gap-4 w-full justify-between px-1">
        <span className="font-semibold text-text-secondary">{label}</span>
        {isUpscaled && (
             <a
             href={src}
             download="upscaled-image.png"
             className="flex items-center gap-1 text-brand-primary hover:text-brand-secondary transition-colors"
           >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download
            </a>
        )}
      </div>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, upscaledImage }) => {
  if (!originalImage) {
    return <ImagePlaceholder />;
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-6 p-4">
      <ImageCard src={originalImage} label="Original" />
      {upscaledImage ? (
        <>
            <div className="hidden md:block text-brand-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <ImageCard src={upscaledImage} label="Upscaled" isUpscaled />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center w-full aspect-square bg-base-200 rounded-lg">
             <div className="text-text-secondary text-center">
                <p>Ready to upscale!</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
