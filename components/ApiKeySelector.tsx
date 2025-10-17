import React, { useState } from 'react';

interface ApiKeySelectorProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full max-w-md bg-base-200 p-8 rounded-2xl shadow-2xl text-center">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Enter Your API Key</h2>
      <p className="text-text-secondary mb-6">
        To use the AI Image Upscaler, please provide your Google AI Studio API key.
        It will be stored in your browser's session and not on our servers.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API Key"
          className="w-full px-4 py-3 rounded-lg bg-base-300 text-text-primary border-2 border-transparent focus:border-brand-primary focus:outline-none transition-colors"
          aria-label="Gemini API Key"
        />
        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Save &amp; Continue
        </button>
      </form>
      <p className="text-xs text-text-secondary mt-4">
        Get your free API key from{' '}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary hover:underline"
        >
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};

export default ApiKeySelector;
