
import React from 'react';
import SueroSelector from './components/SueroSelector';

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500 relative overflow-hidden">
      {/* Efecto de partículas/ondas para más modernidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      
      {/* Círculos decorativos para efecto moderno */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <main className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 py-4 w-full max-w-lg mx-auto relative z-10">
        <SueroSelector />
      </main>
    </div>
  );
}

export default App;