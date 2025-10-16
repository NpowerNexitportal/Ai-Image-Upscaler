
import React, { useState, useCallback } from 'react';
import type { UpscaleFactor } from './types';
import { UPSCALE_OPTIONS } from './constants';
import { upscaleImage as upscaleImageService } from './services/geminiService';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import UpscaleOptions from './components/UpscaleOptions';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<UpscaleFactor>(UPSCALE_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setOriginalFile(file);
      setUpscaledImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUpscale = useCallback(async () => {
    if (!originalFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUpscaledImage(null);

    try {
      const selectedOption = UPSCALE_OPTIONS.find(opt => opt.id === selectedFactor);
      if (!selectedOption) {
        throw new Error("Invalid upscale factor selected.");
      }
      
      const upscaledBase64 = await upscaleImageService(originalFile, selectedOption.promptDetail);
      setUpscaledImage(`data:${originalFile.type};base64,${upscaledBase64}`);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during upscaling.");
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, selectedFactor]);

  const canUpscale = originalImage && !isLoading;

  return (
    <div className="min-h-screen bg-base-100 text-text-primary flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-base-200 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Controls */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-text-primary">1. Upload Image</h2>
            <ImageInput onImageUpload={handleImageUpload} />

            <h2 className="text-2xl font-bold text-text-primary mt-4">2. Select Resolution</h2>
            <UpscaleOptions
              options={UPSCALE_OPTIONS}
              selected={selectedFactor}
              onChange={setSelectedFactor}
              disabled={!originalImage}
            />

            <button
              onClick={handleUpscale}
              disabled={!canUpscale}
              className={`w-full mt-4 py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2
                ${canUpscale
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 transform'
                  : 'bg-base-300 text-text-secondary cursor-not-allowed'
                }`}
            >
              {isLoading ? 'Upscaling...' : '✨ Upscale Image'}
            </button>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>

          {/* Right Panel: Display */}
          <div className="lg:w-2/3 bg-base-100 rounded-lg p-6 min-h-[400px] flex items-center justify-center relative">
            {isLoading && <Loader />}
            {!isLoading && <ResultDisplay originalImage={originalImage} upscaledImage={upscaledImage} />}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-text-secondary">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
