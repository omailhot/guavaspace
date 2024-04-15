/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_S3_PATH: string;
  readonly VITE_API_PATH: string;
  readonly VITE_PUCLIC_GOOGLE_MAP_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
