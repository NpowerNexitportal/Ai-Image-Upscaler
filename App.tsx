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

const API_KEY_SESSION_STORAGE = 'gemini-api-key';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<UpscaleFactor>(UPSCALE_OPTIONS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedKey = sessionStorage.getItem(API_KEY_SESSION_STORAGE);
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {
      console.error("Could not read API key from session storage:", e);
    } finally {
      setIsCheckingKey(false);
    }
  }, []);
  
  const handleApiKeySubmit = (key: string) => {
    try {
      sessionStorage.setItem(API_KEY_SESSION_STORAGE, key);
      setApiKey(key);
      setError(null);
    } catch (e) {
      console.error("Could not save API key to session storage:", e);
      setError("Could not save API key. Please ensure session storage is enabled in your browser.");
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
    if (!originalFile || !apiKey) {
      setError("Please upload an image and ensure your API key is set.");
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
      
      const upscaledBase64 = await upscaleImageService(originalFile, selectedOption.promptDetail, apiKey);
      setUpscaledImage(`data:${originalFile.type};base64,${upscaledBase64}`);

    } catch (err: any) {
      console.error(err);
      let errorMessage = err instanceof Error ? err.message : "An unknown error occurred during upscaling.";
      
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API key is missing")) {
        errorMessage = "The provided API Key is invalid. Please enter a valid key.";
        try {
          sessionStorage.removeItem(API_KEY_SESSION_STORAGE);
          setApiKey(null);
        } catch (e) {
          console.error("Could not remove API key from session storage:", e);
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, selectedFactor, apiKey]);

  const canUpscale = originalImage && !isLoading;

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-base-300 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-base-100 text-text-primary flex flex-col font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <ApiKeySelector onApiKeySubmit={handleApiKeySubmit} />
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
