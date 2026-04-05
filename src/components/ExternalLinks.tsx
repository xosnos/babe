import { ExternalLink } from '../types'

const SHARED_CALENDAR_URL = import.meta.env.VITE_GOOGLE_CALENDAR_URL || 'https://calendar.google.com'
const NOTION_DASHBOARD_URL = import.meta.env.VITE_NOTION_DASHBOARD_URL || 'https://www.notion.so'
const VISION_BOARD_URL = import.meta.env.VITE_CANVA_VISION_BOARD_URL || 'https://www.canva.com'

const SHARED_CALENDAR_LINK: ExternalLink = {
  label: 'Shared Calendar',
  url: SHARED_CALENDAR_URL,
  icon: '📅',
}

const NOTION_DASHBOARD_LINK: ExternalLink = {
  label: 'Notion Dashboard',
  url: NOTION_DASHBOARD_URL,
  icon: '📝',
}

const VISION_BOARD_LINK: ExternalLink = {
  label: 'Vision Board',
  url: VISION_BOARD_URL,
  icon: '🎯',
}

function openExternalLink(url: string): void {
  if (window.electronAPI) {
    window.electronAPI.openExternal(url).then((result: { success: boolean; error?: string }) => {
      if (!result.success) {
        console.error('Failed to open link:', result.error);
      }
    }).catch((error) => {
      console.error('IPC error opening link:', error);
    })
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export function ExternalLinks() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
        <ExternalLinkCard link={SHARED_CALENDAR_LINK} />
        <ExternalLinkCard link={NOTION_DASHBOARD_LINK} />
        <ExternalLinkCard link={VISION_BOARD_LINK} />
      </div>
    </div>
  )
}

function ExternalLinkCard({ link }: { link: ExternalLink }) {
  return (
    <button
      onClick={() => openExternalLink(link.url)}
      className="min-w-0 group relative overflow-hidden card h-full min-h-[150px] hover:shadow-glow hover:-translate-y-1 active:translate-y-0 focus-visible:ring-4 focus-visible:ring-valentine-300 focus-visible:outline-none transition-all duration-300 ease-out cursor-pointer"
      aria-label={`Open ${link.label}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-valentine-100/40 via-blush/30 to-valentine-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-4">
        <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={`${link.label} icon`}>
          {link.icon}
        </div>

        <div className="text-center">
          <h3 className="font-cute font-bold text-valentine-700 mb-1">
            {link.label}
          </h3>
          <div className="flex items-center justify-center gap-1 text-valentine-500 text-xs">
            <span className="font-cute">Open</span>
            <svg
              className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 text-xs opacity-30 group-hover:opacity-60 transition-opacity duration-300" role="img" aria-label="Decorative heart">
        💝
      </div>
    </button>
  )
}
