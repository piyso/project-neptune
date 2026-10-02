import { useState, useEffect } from 'react';
import { ICitizenRTIDossier, IPublicAuthorityNode, IQueryBlock, SubmissionChannel } from '../types/dossier.js';
import { INITIAL_DOSSIERS, INITIAL_PUBLIC_AUTHORITIES } from '../services/mockData.js';
import { NeptuneApiClient } from '../services/api.js';

export type SurfaceMode = 'DESKTOP_LITIGATION' | 'MOBILE_PWA' | 'CSC_KIOSK' | 'EXTENSION_SIDEPANEL';
export type AppView = 'intake' | 'dossiers' | 'cadastre' | 'vault' | 'kiosk';
export type IndicLanguage = 'HINDI' | 'ENGLISH' | 'BHOJPURI' | 'TAMIL' | 'BENGALI' | 'MARATHI';
export type UserMode = 'CITIZEN' | 'ADVOCATE';

export interface NeptuneState {
  currentView: AppView;
  surfaceMode: SurfaceMode;
  userMode: UserMode;
  theme: 'dark' | 'sunlight';
  language: IndicLanguage;
  dossiers: ICitizenRTIDossier[];
  selectedDossierId: string | null;
  authorities: IPublicAuthorityNode[];
  isOmnibarOpen: boolean;
  isSettingsOpen: boolean;
  isHelpOpen: boolean;
  isKanbanView: boolean;
  isNoticeScannerOpen: boolean;
  isLogisticsOpen: boolean;
  isCicAppealOpen: boolean;
  backendStatus: 'STANDALONE_LOCAL' | 'LIVE_CONNECTED';
}

const STORAGE_KEY = 'neptune_prod_state_v2';

// Initial state
const defaultState: NeptuneState = {
  currentView: 'intake',
  surfaceMode: 'DESKTOP_LITIGATION',
  userMode: 'CITIZEN',
  theme: 'dark',
  language: 'HINDI',
  dossiers: INITIAL_DOSSIERS,
  selectedDossierId: INITIAL_DOSSIERS[0].dossierId,
  authorities: INITIAL_PUBLIC_AUTHORITIES,
  isOmnibarOpen: false,
  isSettingsOpen: false,
  isHelpOpen: false,
  isKanbanView: false,
  isNoticeScannerOpen: false,
  isLogisticsOpen: false,
  isCicAppealOpen: false,
  backendStatus: 'STANDALONE_LOCAL',
};

// Simple singleton pub-sub store
let globalState: NeptuneState = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed, isOmnibarOpen: false, isHelpOpen: false };
    }
  } catch (e) {
    console.warn('[NeptuneStore] Failed to load local storage state:', e);
  }
  return defaultState;
})();

const listeners = new Set<(state: NeptuneState) => void>();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentView: globalState.currentView,
      surfaceMode: globalState.surfaceMode,
      userMode: globalState.userMode,
      isKanbanView: globalState.isKanbanView,
      theme: globalState.theme,
      language: globalState.language,
      dossiers: globalState.dossiers,
      selectedDossierId: globalState.selectedDossierId,
    }));
  } catch (e) {
    console.warn('[NeptuneStore] Failed to persist state:', e);
  }
  listeners.forEach(fn => fn(globalState));
}

export function useNeptuneStore() {
  const [state, setState] = useState<NeptuneState>(globalState);

  useEffect(() => {
    const listener = (newState: NeptuneState) => setState({ ...newState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Check backend health on mount
  useEffect(() => {
    NeptuneApiClient.checkBackendHealth().then((isLive) => {
      globalState = {
        ...globalState,
        backendStatus: isLive ? 'LIVE_CONNECTED' : 'STANDALONE_LOCAL',
      };
      notify();
    });
  }, []);

  // Keep html[data-theme] in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const setView = (view: AppView) => {
    globalState = { ...globalState, currentView: view };
    notify();
  };

  const setSurfaceMode = (mode: SurfaceMode) => {
    globalState = { ...globalState, surfaceMode: mode };
    notify();
  };

  const toggleTheme = () => {
    const nextTheme = globalState.theme === 'dark' ? 'sunlight' : 'dark';
    globalState = { ...globalState, theme: nextTheme };
    notify();
  };

  const setLanguage = (lang: IndicLanguage) => {
    globalState = { ...globalState, language: lang };
    notify();
  };

  const selectDossier = (dossierId: string | null) => {
    globalState = { ...globalState, selectedDossierId: dossierId, currentView: 'dossiers' };
    notify();
  };

  const setSettingsOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isSettingsOpen: isOpen };
    notify();
  };

  const setKanbanView = (isKanban: boolean) => {
    globalState = { ...globalState, isKanbanView: isKanban };
    notify();
  };

  const setNoticeScannerOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isNoticeScannerOpen: isOpen };
    notify();
  };

  const setLogisticsOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isLogisticsOpen: isOpen };
    notify();
  };

  const setCicAppealOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isCicAppealOpen: isOpen };
    notify();
  };

  const setOmnibarOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isOmnibarOpen: isOpen };
    notify();
  };

  const addDossier = (dossier: ICitizenRTIDossier) => {
    globalState = {
      ...globalState,
      dossiers: [dossier, ...globalState.dossiers],
      selectedDossierId: dossier.dossierId,
      currentView: 'dossiers',
    };
    notify();
  };

  const updateDossier = (dossierId: string, updates: Partial<ICitizenRTIDossier>) => {
    const updated = globalState.dossiers.map(d => (d.dossierId === dossierId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    globalState = { ...globalState, dossiers: updated };
    notify();
  };

  const setUserMode = (mode: UserMode) => {
    globalState = { ...globalState, userMode: mode };
    notify();
  };

  const setHelpOpen = (isOpen: boolean) => {
    globalState = { ...globalState, isHelpOpen: isOpen };
    notify();
  };

  return {
    ...state,
    setView,
    setSurfaceMode,
    setUserMode,
    toggleTheme,
    setLanguage,
    selectDossier,
    setOmnibarOpen,
    setSettingsOpen,
    setHelpOpen,
    setKanbanView,
    setNoticeScannerOpen,
    setLogisticsOpen,
    setCicAppealOpen,
    addDossier,
    updateDossier,
  };
}

