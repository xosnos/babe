import { ExternalLink } from '../types'

const LINKS: ExternalLink[] = [
  {
    label: 'Vision Board',
    url: 'https://www.canva.com',
    icon: '🎯',
  },
  {
    label: 'Shared Calendar',
    url: 'https://calendar.google.com',
    icon: '📅',
  },
]

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
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="pixel-text text-lg text-valentine-600 mb-1">Quick Links</h2>
        <p className="text-sm text-valentine-500 font-cute">Our shared spaces</p>
      </div>

      {/* Links Grid - stack on small screens, side-by-side from sm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LINKS.map((link) => (
          <button
            key={link.label}
            onClick={() => openExternalLink(link.url)}
            className="min-w-0 group relative overflow-hidden card hover:shadow-glow hover:-translate-y-1 active:translate-y-0 focus-visible:ring-4 focus-visible:ring-valentine-300 focus-visible:outline-none transition-all duration-300 ease-out cursor-pointer"
            aria-label={`Open ${link.label}`}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-valentine-100/40 via-blush/30 to-valentine-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-3 p-4">
              {/* Icon */}
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={`${link.label} icon`}>
                {link.icon}
              </div>

              {/* Label */}
              <div className="text-center">
                <h3 className="font-cute font-bold text-valentine-700 mb-1">
                  {link.label}
                </h3>
                <div className="flex items-center gap-1 text-valentine-500 text-xs">
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

            {/* Decorative corner hearts */}
            <div className="absolute top-2 right-2 text-xs opacity-30 group-hover:opacity-60 transition-opacity duration-300" role="img" aria-label="Decorative heart">
              💝
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
