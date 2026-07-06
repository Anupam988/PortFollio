// Minimal inline SVG icon set (no extra dependencies).

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function GithubIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

export function WhatsappIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.2-5.6A8.4 8.4 0 1 1 21 11.5z" />
      <path d="M8.5 8.8c0-.4.2-.6.5-.6h.9c.3 0 .5.2.6.5l.5 1.4c.1.3 0 .5-.2.7l-.5.5c.6 1.1 1.4 1.9 2.5 2.5l.5-.5c.2-.2.4-.3.7-.2l1.4.5c.3.1.5.3.5.6v.9c0 .3-.2.5-.6.5A6.6 6.6 0 0 1 8.5 8.8z" />
    </svg>
  )
}

export function ExternalIcon(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

export function CodeIcon(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} width={26} height={26} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} width={26} height={26} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function ArrowIcon(props) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
