import React, { useState } from 'react';
import { ViewType } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InicioView from './components/InicioView';
import ImcView from './components/ImcView';
import CambioView from './components/CambioView';
import MedidasView from './components/MedidasView';
import JurosView from './components/JurosView';
import SorteadorView from './components/SorteadorView';
import ValidadorView from './components/ValidadorView';

export default function App() {
  const [currentView, setView] = useState<ViewType>('inicio');

  const renderView = () => {
    switch (currentView) {
      case 'inicio':
        return <InicioView />;
      case 'imc':
        return <ImcView />;
      case 'cambio':
        return <CambioView />;
      case 'medidas':
        return <MedidasView />;
      case 'juros':
        return <JurosView />;
      case 'sorteador':
        return <SorteadorView />;
      case 'validador':
        return <ValidadorView />;
      default:
        return <InicioView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900" id="app-root-container">
      {/* Header / Navigation Bar */}
      <Navbar currentView={currentView} setView={setView} />

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="view-content-wrapper">
        <div className="transition-all duration-300">
          {renderView()}
        </div>
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
