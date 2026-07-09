import { useMemo } from 'react'
import { useReveal } from '../hooks/useReveal'
import { ExternalIcon } from './Icons'
import { TECH_ICONS } from '../data/techIcons'

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Logo({ exp }) {
  return (
    <div className="exp-logo">
      {exp.logo ? (
        <img
          src={exp.logo}
          alt={exp.company}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="exp-logo-fallback" title={exp.company}>
          <i className="fa-solid fa-building" />
          <span className="exp-logo-initials">{initials(exp.company)}</span>
        </span>
      )}
    </div>
  )
}

function CompanyLink({ exp }) {
  if (exp.companyUrl) {
    return (
      <a
        className="exp-company"
        href={exp.companyUrl}
        target="_blank"
        rel="noreferrer"
      >
        {exp.company} <ExternalIcon />
      </a>
    )
  }
  return <span className="exp-company">{exp.company}</span>
}

function Tech({ items, getTech, className }) {
  if (!items || !items.length) return null
  return (
    <div className={className}>
      {items.map((t) => {
        const info = getTech(t)
        return (
          <span key={t}>
            <i
              className={info.icon}
              style={info.color ? { color: info.color } : undefined}
              aria-hidden="true"
            />{' '}
            {t}
          </span>
        )
      })}
    </div>
  )
}

// One node on the centered tree. `compact` (home) hides the location and
// bullet points; the full details page shows everything.
function ExperienceItem({ exp, side, getTech, compact }) {
  const ref = useReveal()
  const points = exp.points || []
  return (
    <div className={`timeline-item ${side}`} ref={ref}>
      <span className="timeline-dot" />
      <div className="exp-card">
        <div className="exp-top">
          <Logo exp={exp} />
          <span className="exp-period">{exp.period}</span>
        </div>
        <h3 className="exp-role">{exp.role}</h3>
        <CompanyLink exp={exp} />
        {!compact && exp.location ? (
          <p className="exp-location">{exp.location}</p>
        ) : null}
        {!compact && points.length ? (
          <ul className="exp-points">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : null}
        <Tech items={exp.technologies} getTech={getTech} className="exp-tech" />
      </div>
    </div>
  )
}

function Timeline({ experience, getTech, compact }) {
  return (
    <div className="timeline">
      {experience.map((exp, i) => (
        <ExperienceItem
          key={(exp.company || '') + i}
          exp={exp}
          side={i % 2 === 0 ? 'left' : 'right'}
          getTech={getTech}
          compact={compact}
        />
      ))}
    </div>
  )
}

export default function Experience({
  experience = [],
  technologies = [],
  skills = [],
  variant,
}) {
  // name -> { icon, color } lookup from technologies + skills.
  const getTech = useMemo(() => {
    const map = { ...TECH_ICONS }
    technologies.forEach((t) => {
      if (t && t.icon)
        map[String(t.name).toLowerCase()] = { icon: t.icon, color: t.color }
    })
    skills.forEach((g) =>
      (g.items || []).forEach((it) => {
        if (it && typeof it === 'object' && it.icon)
          map[String(it.name).toLowerCase()] = { icon: it.icon, color: it.color }
      })
    )
    return (name) =>
      map[String(name).toLowerCase().trim()] || {
        icon: 'fa-solid fa-code',
        color: '#8791a6',
      }
  }, [technologies, skills])

  if (variant === 'compact') {
    return (
      <section className="section" id="experience">
        <div className="container">
          <p className="section-tag">Experience</p>
          <h2 className="section-title">
            Where I&apos;ve <span className="gradient-text">worked</span>
          </h2>

          <Timeline experience={experience} getTech={getTech} compact />
        </div>
      </section>
    )
  }

  return (
    <section className="section" id="experience">
      <div className="container">
        <p className="section-tag">Experience</p>
        <h2 className="section-title">
          Where I&apos;ve <span className="gradient-text">worked</span>
        </h2>

        <Timeline experience={experience} getTech={getTech} />
      </div>
    </section>
  )
}
