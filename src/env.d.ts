/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BEHANCE_PROXY_URL?: string
  readonly VITE_PUBLISHING_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
