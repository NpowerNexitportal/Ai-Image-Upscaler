
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm border-b border-base-300 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="m12 3-1.41 1.41L16.17 10H4v2h12.17l-5.58 5.59L12 19l8-8-8-8z"/><path d="M4 3h2v2H4z"/><path d="M4 7h2v2H4z"/><path d="M4 11h2v2H4z"/><path d="M4 15h2v2H4z"/><path d="M4 19h2v2H4z"/></svg>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">AI Image Upscaler</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
