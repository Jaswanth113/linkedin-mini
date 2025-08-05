import React from 'react';

export function Test() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">App is Working!</h1>
        <p className="text-gray-700 mb-4">
          If you can see this page, the basic app structure is working correctly.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ React is working</p>
          <p>✅ Tailwind CSS is working</p>
          <p>✅ Routing is working</p>
        </div>
      </div>
    </div>
  );
} 