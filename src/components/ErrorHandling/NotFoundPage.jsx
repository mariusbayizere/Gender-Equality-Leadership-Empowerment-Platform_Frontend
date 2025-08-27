import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPages = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist. It may have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Simple Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-16 h-16 text-blue-500" />
          </div>
        </div>

        {/* Primary Action */}
        <div className="mb-6">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Homepage
          </button>
        </div>

        {/* Secondary Suggestions */}
        <div className="text-sm text-gray-500">
          <p>You can also try:</p>
          <div className="mt-2 space-x-4">
            <button 
              onClick={handleGoBack}
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              Going back to the previous page
            </button>
            <span>•</span>
            <a 
              href="/search" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              Using our search feature
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};