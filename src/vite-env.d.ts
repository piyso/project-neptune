/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_MODE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_STORAGE_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
