// ============================================================
//  Edit this file to make the portfolio your own.
//  Replace placeholder text and the PLACEHOLDER_URL links.
// ============================================================

export const profile = {
  name: 'Your Name',
  // Words that type out one after another in the hero.
  roles: [
    'Full-Stack Developer',
    'React Engineer',
    'Problem Solver',
    'Open-Source Contributor',
  ],
  tagline:
    'I build fast, accessible, and delightful web experiences — from pixel-perfect front-ends to resilient back-end APIs.',
  location: 'Earth, Remote-friendly',
  email: 'you@example.com',
}

// Replace these with your real profiles.
export const socials = {
  github: 'https://github.com/PLACEHOLDER_URL',
  linkedin: 'https://www.linkedin.com/in/PLACEHOLDER_URL',
  email: 'mailto:you@example.com',
  whatsapp: 'https://wa.me/10000000000', // country code + number, no + or spaces
}

export const about = {
  lead: "I'm a developer who loves turning complex problems into simple, elegant interfaces.",
  paragraphs: [
    'With a background spanning front-end and back-end development, I focus on writing clean, maintainable code and shipping products people actually enjoy using.',
    "When I'm not coding, you'll find me exploring new frameworks, contributing to open source, or over-engineering my personal setup.",
  ],
  stats: [
    { num: '5+', label: 'Years experience' },
    { num: '40+', label: 'Projects shipped' },
    { num: '20+', label: 'Happy clients' },
    { num: '∞', label: 'Cups of coffee' },
  ],
  // Replace with your own photo: drop a file in /public and update this path.
  image: '/about.svg',
  imageAlt: 'Portrait',
}

export const skills = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Vite', 'Tailwind', 'Three.js'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST', 'GraphQL'],
  },
  {
    title: 'Tools & DevOps',
    items: ['Git', 'Docker', 'CI/CD', 'AWS', 'Vercel', 'Linux'],
  },
  {
    title: 'Practices',
    items: ['Testing', 'Accessibility', 'Agile', 'Performance', 'Design Systems'],
  },
]

export const projects = [
  {
    glyph: '{ }',
    title: 'Project Alpha',
    description:
      'A real-time collaboration platform with live cursors, presence, and offline sync. Replace with your own project.',
    stack: ['React', 'Node', 'WebSocket', 'MongoDB'],
    demo: 'https://PLACEHOLDER_URL',
    repo: 'https://github.com/PLACEHOLDER_URL',
  },
  {
    glyph: '</>',
    title: 'Project Beta',
    description:
      'An analytics dashboard turning raw event streams into clear, actionable charts. Replace with your own project.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    demo: 'https://PLACEHOLDER_URL',
    repo: 'https://github.com/PLACEHOLDER_URL',
  },
  {
    glyph: '#!',
    title: 'Project Gamma',
    description:
      'A CLI toolkit that automates repetitive dev workflows and scaffolds projects in seconds. Replace with your own project.',
    stack: ['Node', 'TypeScript', 'Vite'],
    demo: 'https://PLACEHOLDER_URL',
    repo: 'https://github.com/PLACEHOLDER_URL',
  },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]
