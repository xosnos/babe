/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CALENDAR_URL?: string
  readonly VITE_NOTION_DASHBOARD_URL?: string
  readonly VITE_CANVA_VISION_BOARD_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
