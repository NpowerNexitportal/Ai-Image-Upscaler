import React, { useState, useCallback, useEffect } from 'react';
import type { UpscaleFactor } from './types';
import { UPSCALE_OPTIONS } from './constants';
import { upscaleImage as upscaleImageService } from './services/geminiService';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import UpscaleOptions from './components/UpscaleOptions';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import ApiKeySelector from './components/ApiKeySelector';

// FIX: Removed the `declare global` block for `window.aistudio` to resolve a TypeScript error
// indicating a duplicate or conflicting global type declaration. It is assumed that the type for
// `window.aistudio` is already provided by the project's environment.

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<UpscaleFactor>(UPSCALE_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsKeySelected(hasKey);
        } else {
          // Fallback for environments where aistudio is not present.
          // We assume the key is set via other means (like a .env file in local dev).
          setIsKeySelected(true);
        }
      } catch (e) {
        console.error("Error checking for API key:", e);
        // If the check fails, proceed assuming no key is selected.
        setIsKeySelected(false);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkApiKey();
  }, []);
  
  const handleSelectApiKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume selection was successful to avoid race conditions.
      setIsKeySelected(true);
    }
  };

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

    } catch (err: any) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during upscaling.";
      // Handle the specific error for an invalid/revoked API key.
      if (errorMessage.includes("Requested entity was not found")) {
        setError("API Key is invalid. Please select a valid key.");
        setIsKeySelected(false); // Reset key state to show the selector again.
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, selectedFactor]);

  const canUpscale = originalImage && !isLoading;

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-base-300 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isKeySelected) {
    return (
      <div className="min-h-screen bg-base-100 text-text-primary flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <ApiKeySelector onSelectApiKey={handleSelectApiKey} />
        </main>
        <footer className="text-center py-4 text-text-secondary">
          <p>Powered by ObaTECHPRO</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-text-primary flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-base-200 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
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

          <div className="lg:w-2/3 bg-base-100 rounded-lg p-6 min-h-[400px] flex items-center justify-center relative">
            {isLoading && <Loader />}
            {!isLoading && <ResultDisplay originalImage={originalImage} upscaledImage={upscaledImage} />}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-text-secondary">
        <p>Powered by ObaTECHPRO</p>
      </footer>
    </div>
  );
};

export default App;
