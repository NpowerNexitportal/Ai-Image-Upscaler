import React from 'react';

interface ApiKeySelectorProps {
  onSelectApiKey: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectApiKey }) => {
  return (
    <div className="w-full max-w-md bg-base-200 p-8 rounded-2xl shadow-2xl text-center">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Select Your API Key</h2>
      <p className="text-text-secondary mb-6">
        To use the AI Image Upscaler, please select a Google AI Studio API key.
        This key will be used to process your requests.
      </p>
      <button
        onClick={onSelectApiKey}
        className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 transform"
      >
        Select API Key
      </button>
      <p className="text-xs text-text-secondary mt-4">
        For more information on billing, please visit the{' '}
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary hover:underline"
        >
          official documentation
        </a>.
      </p>
    </div>
  );
};

export default ApiKeySelector;
