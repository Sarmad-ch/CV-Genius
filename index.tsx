
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <Suspense fallback={
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-400 font-sans">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-medium">Initializing CV-Genius...</p>
    </div>
  }>
    <App />
  </Suspense>
);
