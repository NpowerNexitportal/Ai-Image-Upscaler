
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-base-100/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
      <div className="w-16 h-16 border-4 border-base-300 border-t-brand-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-text-primary">Enhancing your image...</p>
      <p className="text-text-secondary">This may take a moment.</p>
    </div>
  );
};

export default Loader;
