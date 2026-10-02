import React, { useEffect } from 'react';
import { useNeptuneStore } from './store/useNeptuneStore.js';
import { Header } from './components/layout/Header.js';
import { Navigation } from './components/layout/Navigation.js';
import { OmnibarModal } from './components/layout/OmnibarModal.js';
import { SettingsModal } from './components/settings/SettingsModal.js';
import { VoiceIntakeBox } from './components/intake/VoiceIntakeBox.js';
import { DossierDetail } from './components/dossiers/DossierDetail.js';
import { AuthoritySearch } from './components/cadastre/AuthoritySearch.js';
import { MerkleVisualizer } from './components/vault/MerkleVisualizer.js';
import { KioskTouchGrid } from './components/kiosk/KioskTouchGrid.js';
import { CitizenHeroBanner } from './components/layout/CitizenHeroBanner.js';
import { HelpGuideModal } from './components/layout/HelpGuideModal.js';
import { offlineSyncEngine } from './services/indexedDbSync.js';
import { WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const { currentView, isSettingsOpen, setSettingsOpen } = useNeptuneStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  useEffect(() => {
    offlineSyncEngine.init();

    const handleOnline = () => {
      setIsOnline(true);
      offlineSyncEngine.flushQueue();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'intake':
        return <VoiceIntakeBox />;
      case 'dossiers':
        return <DossierDetail />;
      case 'cadastre':
        return <AuthoritySearch />;
      case 'vault':
        return <MerkleVisualizer />;
      case 'kiosk':
        return <KioskTouchGrid />;
      default:
        return <VoiceIntakeBox />;
    }
  };

  return (
    <div className="app-container">
      {/* Offline Brownout Banner */}
      {!isOnline && (
        <div style={{
          background: 'var(--neptune-amber)',
          color: '#000',
          padding: '0.4rem 1rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <WifiOff size={14} />
          <span>OFFLINE BROWNOUT MODE ACTIVE • All inputs, audio waveforms, and dossiers are safely cached in local storage.</span>
        </div>
      )}

      {/* Sovereign Header */}
      <Header />

      {/* Surface Navigation */}
      <Navigation />

      {/* Main Content Workspace with Multi-Device Frame Emulation if selected */}
      <main className="main-content">
        {/* Welcoming Citizen Hero Onboarding Banner */}
        <CitizenHeroBanner />

        {renderCurrentView()}
      </main>

      {/* Global Cmd+K Command Dispatcher */}
      <OmnibarModal />

      {/* Privacy, Whistleblower Shield & Security Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Citizen Help & RTI Guide Modal */}
      <HelpGuideModal />
    </div>
  );
};
