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

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function CopyIcon(props) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base} width={15} height={15} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function EyeIcon(props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function SunIcon(props) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  )
}
