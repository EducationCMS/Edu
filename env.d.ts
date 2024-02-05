/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string,
  readonly VITE_WEBSOCKET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
// To ensure it is treated as a module, add at least one `export` statement
